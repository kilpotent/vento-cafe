import { HOURS, SITE, type Interval, type WeekSchedule } from '../data/site.ts'
import { useLiveStatus } from '../hooks/useLiveStatus.ts'
import { useLanguage } from '../i18n/context.ts'
import {
  closedDays,
  DAY_INDEXES,
  DAY_MINUTES,
  formatDays,
  formatInterval,
  formatOpenUntil,
  formatTime,
  groupDays,
  type DayIndex,
  type Status,
} from '../lib/hours.ts'
import { describeDelivery } from '../lib/status.ts'
import { BikeIcon, PhoneIcon } from './Icons.tsx'
import StatusPill from './StatusPill.tsx'
import './Hours.css'

export default function Hours() {
  const { t } = useLanguage()
  const { time, delivery } = useLiveStatus()

  return (
    <section id="hours" className="section section--night hours" aria-labelledby="hours-title" tabIndex={-1}>
      <div className="container">
        <header className="hours__head">
          <div className="hours__intro">
            <p className="eyebrow" data-reveal>
              {t.hours.eyebrow}
            </p>
            <h2 id="hours-title" className="display" data-reveal>
              {t.hours.title}
            </h2>
            <p className="section-head__intro" data-reveal>
              {t.hours.intro}
            </p>
          </div>
          <div data-reveal>
            <StatusPill />
          </div>
        </header>

        <div className="hours__grid">
          <figure className="hours__dial" data-reveal>
            <Dial day={time.day} minutes={time.minutes} />
            <figcaption>
              <ul className="hours__legend plain-list">
                <li className="hours__legend-cafe">{t.hours.legend.cafe}</li>
                <li className="hours__legend-delivery">{t.hours.legend.delivery}</li>
                <li className="hours__legend-now">{t.hours.legend.now}</li>
              </ul>
            </figcaption>
          </figure>

          <div className="hours__table-wrap" data-reveal>
            <table className="hours-table">
              <caption className="sr-only">{t.hours.tableCaption}</caption>
              <thead>
                <tr>
                  <th scope="col">{t.hours.day}</th>
                  <th scope="col">{t.hours.cafe}</th>
                  <th scope="col">{t.hours.delivery}</th>
                </tr>
              </thead>
              <tbody>
                {DAY_INDEXES.map((day) => {
                  const cafe = HOURS.cafe[day]
                  const slot = HOURS.delivery[day]
                  const isToday = day === time.day
                  return (
                    <tr key={day} className={isToday ? 'is-today' : undefined} aria-current={isToday ? 'date' : undefined}>
                      <th scope="row">
                        {t.days[day]}
                        {isToday && <span className="hours-table__today">{t.hours.today}</span>}
                      </th>
                      <td className="hours-table__cafe">
                        {cafe ? (
                          // Two unbreakable halves: on narrow layouts "late" drops to its own line.
                          <>
                            <span>{formatTime(cafe.open)} –</span> <span>{t.hours.late}</span>
                          </>
                        ) : (
                          t.hours.closed
                        )}
                      </td>
                      <td className={slot ? undefined : 'hours-table__muted'}>
                        {slot ? formatInterval(slot) : t.hours.takeawayOnly}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p className="hours__note">{t.hours.timezone}</p>
          </div>

          <DeliveryCard status={delivery} />
        </div>
      </div>
    </section>
  )
}

/* ---------- 24-hour dial ---------- */

const C = 180
const R_CAFE = 128
const R_DELIVERY = 103
/** The café closes "late", not at a set hour, so the last stretch of its arc fades out. */
const LATE_FADE_MINUTES = 120

function coords(radius: number, minutes: number) {
  const angle = (minutes / DAY_MINUTES) * Math.PI * 2
  return { x: C + radius * Math.sin(angle), y: C - radius * Math.cos(angle) }
}

function point(radius: number, minutes: number) {
  const { x, y } = coords(radius, minutes)
  return `${x.toFixed(2)} ${y.toFixed(2)}`
}

function arcPath(radius: number, { open, close }: Interval) {
  const span = close - open
  if (span <= 0) return ''
  if (span >= DAY_MINUTES) {
    return `M${point(radius, 0)}A${radius} ${radius} 0 1 1 ${point(radius, DAY_MINUTES / 2)}A${radius} ${radius} 0 1 1 ${point(radius, 0)}`
  }
  return `M${point(radius, open)}A${radius} ${radius} 0 ${span > DAY_MINUTES / 2 ? 1 : 0} 1 ${point(radius, close)}`
}

/** `closing`: the segment ends at closing time, rather than being cut off at midnight. */
type Segment = Interval & { closing: boolean }

/** The parts of a day covered by the schedule, including yesterday's hours that run past midnight. */
function segments(schedule: WeekSchedule, day: DayIndex): Segment[] {
  const result: Segment[] = []
  const yesterday = schedule[(day + 6) % 7]
  if (yesterday && yesterday.close > DAY_MINUTES) {
    result.push({ open: 0, close: yesterday.close - DAY_MINUTES, closing: true })
  }
  const today = schedule[day]
  if (today) {
    result.push({ open: today.open, close: Math.min(today.close, DAY_MINUTES), closing: today.close <= DAY_MINUTES })
  }
  return result
}

/** A café segment whose closing end fades to transparent along a gradient. */
function CafeArc({ open, close, closing }: Segment) {
  const fadeFrom = closing ? Math.max(open, close - LATE_FADE_MINUTES) : close
  const id = `dial-fade-${open}`
  const from = coords(R_CAFE, fadeFrom)
  const to = coords(R_CAFE, close)
  return (
    <>
      {fadeFrom > open && <path className="dial__arc dial__arc--cafe" d={arcPath(R_CAFE, { open, close: fadeFrom })} />}
      {fadeFrom < close && (
        <>
          <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={from.x} y1={from.y} x2={to.x} y2={to.y}>
            <stop offset="0" className="dial__fade-stop" />
            <stop offset="1" className="dial__fade-stop" stopOpacity="0" />
          </linearGradient>
          <path
            className="dial__arc dial__arc--cafe"
            style={{ stroke: `url(#${id})` }}
            d={arcPath(R_CAFE, { open: fadeFrom, close })}
          />
        </>
      )}
    </>
  )
}

function Dial({ day, minutes }: { day: DayIndex; minutes: number }) {
  const { t } = useLanguage()
  const cafe = HOURS.cafe[day]
  const delivery = HOURS.delivery[day]
  const label = t.hours.dialLabel(
    t.days[day],
    cafe ? formatOpenUntil(cafe, t.hours.late) : null,
    delivery ? formatInterval(delivery) : null,
    formatTime(minutes),
  )
  const handAngle = (minutes / DAY_MINUTES) * 360

  return (
    <svg className="dial" viewBox="0 0 360 360" role="img" aria-label={label}>
      <circle className="dial__track" cx={C} cy={C} r={R_CAFE} />
      <circle className="dial__track dial__track--inner" cx={C} cy={C} r={R_DELIVERY} />

      {Array.from({ length: 24 }, (_, hour) => {
        const major = hour % 6 === 0
        return (
          <line
            key={hour}
            className={major ? 'dial__tick dial__tick--major' : 'dial__tick'}
            x1={C}
            y1={C - R_CAFE - 17}
            x2={C}
            y2={C - R_CAFE - (major ? 28 : 22)}
            transform={`rotate(${hour * 15} ${C} ${C})`}
          />
        )
      })}
      {[0, 6, 12, 18].map((hour) => {
        const angle = (hour / 24) * Math.PI * 2
        return (
          <text
            key={hour}
            className="dial__hour"
            x={(C + 162 * Math.sin(angle)).toFixed(1)}
            y={(C - 162 * Math.cos(angle)).toFixed(1)}
          >
            {String(hour).padStart(2, '0')}
          </text>
        )
      })}

      {segments(HOURS.cafe, day).map((segment) => (
        <CafeArc key={`c${segment.open}`} {...segment} />
      ))}
      {segments(HOURS.delivery, day).map((segment) => (
        <path key={`d${segment.open}`} className="dial__arc dial__arc--delivery" d={arcPath(R_DELIVERY, segment)} />
      ))}

      <g className="dial__hand" transform={`rotate(${handAngle.toFixed(2)} ${C} ${C})`}>
        <line x1={C} y1={C - 78} x2={C} y2={C - R_CAFE - 12} />
        <circle cx={C} cy={C - R_CAFE} r="7" />
      </g>

      <text className="dial__day" x={C} y={C - 34}>
        {t.days[day]}
      </text>
      <text className="dial__time" x={C} y={C + 12}>
        {formatTime(minutes)}
      </text>
      <text className="dial__caption" x={C} y={C + 44}>
        {t.hours.localTime}
      </text>
    </svg>
  )
}

/* ---------- Delivery ---------- */

function DeliveryCard({ status }: { status: Status }) {
  const { t } = useLanguage()
  const live = describeDelivery(t, status)
  const slots = groupDays(HOURS.delivery).filter((group) => group.interval)
  const takeawayDays = closedDays(HOURS.delivery)

  return (
    <aside className="delivery-card" aria-labelledby="delivery-title" data-reveal>
      <BikeIcon className="delivery-card__icon" />
      <p className="delivery-card__eyebrow">{t.delivery.eyebrow}</p>
      <h3 id="delivery-title" className="delivery-card__title">
        {t.delivery.title}
      </h3>
      <ul className="delivery-card__slots plain-list">
        {slots.map((group) => (
          <li key={group.days[0]}>
            <span>{formatDays(group.days, t.days, ' – ')}</span>
            <strong>{formatInterval(group.interval!)}</strong>
          </li>
        ))}
      </ul>
      <p className="delivery-card__text">{t.delivery.text}</p>
      <p className={`delivery-card__status ${live.open ? 'is-open' : 'is-closed'}`}>
        <span className="dot" aria-hidden="true" />
        {live.text}
      </p>
      <div className="delivery-card__phones">
        {SITE.phones.map((phone) => (
          <a key={phone.tel} className="btn btn--night" href={`tel:${phone.tel}`}>
            <PhoneIcon />
            {phone.display}
            <span className="sr-only">({t.phoneKinds[phone.kind]})</span>
          </a>
        ))}
      </div>
      {takeawayDays.length > 0 && <p className="delivery-card__note">{t.delivery.takeawayOnly(takeawayDays)}</p>}
    </aside>
  )
}
