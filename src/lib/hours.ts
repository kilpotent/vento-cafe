// Opening-hours logic. Pure functions with no DOM access, shared by the UI, the tests and
// the structured data generated at build time.
import { SITE, type Interval, type WeekSchedule } from '../data/site.ts'

export const DAY_MINUTES = 24 * 60

/** 0 = Monday … 6 = Sunday */
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6
export const DAY_INDEXES: readonly DayIndex[] = [0, 1, 2, 3, 4, 5, 6]

export interface CafeTime {
  day: DayIndex
  /** Minutes after local midnight */
  minutes: number
}

const WEEKDAY_KEYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const cafeClock = new Intl.DateTimeFormat('en-US', {
  timeZone: SITE.timeZone,
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

/** Weekday and time of day at the café (Europe/Athens), whatever the visitor's own time zone. */
export function cafeTime(date: Date): CafeTime {
  let day = 0
  let hour = 0
  let minute = 0
  for (const part of cafeClock.formatToParts(date)) {
    if (part.type === 'weekday') day = Math.max(0, WEEKDAY_KEYS.indexOf(part.value))
    else if (part.type === 'hour') hour = Number(part.value) % 24
    else if (part.type === 'minute') minute = Number(part.value)
  }
  return { day: day as DayIndex, minutes: hour * 60 + minute }
}

export interface NextOpening {
  /** 0 = later today, 1 = tomorrow, … */
  daysAhead: number
  day: DayIndex
  at: number
}

export type Status =
  | { open: true; closesAt: number; minutesLeft: number }
  | { open: false; next: NextOpening | null }

export function statusAt(schedule: WeekSchedule, { day, minutes }: CafeTime): Status {
  // Yesterday's hours may run past midnight into today.
  const yesterday = schedule[(day + 6) % 7]
  if (yesterday && yesterday.close > DAY_MINUTES && minutes < yesterday.close - DAY_MINUTES) {
    const closesAt = yesterday.close - DAY_MINUTES
    return { open: true, closesAt, minutesLeft: closesAt - minutes }
  }
  const today = schedule[day]
  if (today && minutes >= today.open && minutes < today.close) {
    return { open: true, closesAt: today.close, minutesLeft: today.close - minutes }
  }
  for (let daysAhead = 0; daysAhead <= 7; daysAhead++) {
    const next = ((day + daysAhead) % 7) as DayIndex
    const interval = schedule[next]
    if (interval && (daysAhead > 0 || interval.open > minutes)) {
      return { open: false, next: { daysAhead, day: next, at: interval.open } }
    }
  }
  return { open: false, next: null }
}

export function formatTime(minutes: number): string {
  const m = ((minutes % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

export const formatInterval = ({ open, close }: Interval) => `${formatTime(open)} – ${formatTime(close)}`

export const isMidnight = (minutes: number) => minutes % DAY_MINUTES === 0

export interface DayGroup {
  days: DayIndex[]
  interval: Interval | null
}

const sameInterval = (a: Interval | null, b: Interval | null) =>
  a === b || (a !== null && b !== null && a.open === b.open && a.close === b.close)

/** Collapses consecutive days with identical hours: Mon–Sat 05:00–00:00, Sun 06:00–00:00. */
export function groupDays(schedule: WeekSchedule): DayGroup[] {
  const groups: DayGroup[] = []
  for (const day of DAY_INDEXES) {
    const interval = schedule[day]
    const last = groups.at(-1)
    if (last && sameInterval(last.interval, interval)) last.days.push(day)
    else groups.push({ days: [day], interval })
  }
  return groups
}

/** Joins day names, turning consecutive runs into ranges: [0,1,2,3,4,5] → "Mon–Sat", [0,2] → "Mon, Wed". */
export function formatDays(days: readonly DayIndex[], names: readonly string[], rangeSeparator = '–'): string {
  const runs: DayIndex[][] = []
  for (const day of days) {
    const run = runs.at(-1)
    if (run && run[run.length - 1] === day - 1) run.push(day)
    else runs.push([day])
  }
  return runs
    .map((run) => (run.length === 1 ? names[run[0]] : `${names[run[0]]}${rangeSeparator}${names[run[run.length - 1]]}`))
    .join(', ')
}

export const openDays = (schedule: WeekSchedule) => DAY_INDEXES.filter((day) => schedule[day] !== null)
export const closedDays = (schedule: WeekSchedule) => DAY_INDEXES.filter((day) => schedule[day] === null)
