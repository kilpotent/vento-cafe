import { HOURS, MAPS, SITE } from '../data/site.ts'
import { useLanguage } from '../i18n/context.ts'
import { formatDays, formatInterval, groupDays } from '../lib/hours.ts'
import { ClockIcon, ExternalIcon, FacebookIcon, NavigationIcon, PhoneIcon, PinIcon } from './Icons.tsx'
import Logo from './Logo.tsx'
import './Contact.css'

export default function Contact() {
  const { t, lang } = useLanguage()
  const { address } = SITE

  return (
    <section id="contact" className="section section--cream contact" aria-labelledby="contact-title" tabIndex={-1}>
      <div className="container contact__grid">
        <div className="contact__card" data-reveal>
          <Logo tone="black" alt="" sizes="170px" className="contact__logo" />
          <p className="eyebrow">{t.contact.eyebrow}</p>
          <h2 id="contact-title" className="display contact__title">
            {t.contact.title}
          </h2>

          <dl className="contact__list">
            <div className="contact__row">
              <dt>
                <PinIcon />
                {t.contact.address}
              </dt>
              <dd>
                <address>
                  {address.street[lang]}
                  <br />
                  {address.postalCode} {address.city[lang]}
                  <span className="contact__muted"> · {address.landmark[lang]}</span>
                </address>
              </dd>
            </div>
            <div className="contact__row">
              <dt>
                <PhoneIcon />
                {t.contact.phones}
              </dt>
              <dd>
                <ul className="plain-list">
                  {SITE.phones.map((phone) => (
                    <li key={phone.tel}>
                      <a href={`tel:${phone.tel}`}>{phone.display}</a>
                      <span className="contact__muted"> · {t.phoneKinds[phone.kind]}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="contact__row">
              <dt>
                <ClockIcon />
                {t.contact.hours}
              </dt>
              <dd>
                <ul className="plain-list">
                  {groupDays(HOURS.cafe).map((group) => (
                    <li key={group.days[0]}>
                      <span className="contact__days">{formatDays(group.days, t.daysShort)}</span>
                      {group.interval ? formatInterval(group.interval) : t.hours.closed}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          <div className="contact__actions">
            <a className="btn btn--night" href={MAPS.directions} target="_blank" rel="noopener noreferrer">
              <NavigationIcon />
              {t.contact.directions}
              <span className="sr-only">{t.a11y.newTab}</span>
            </a>
            <a className="btn btn--outline" href={MAPS.place} target="_blank" rel="noopener noreferrer">
              <ExternalIcon />
              {t.contact.openMaps}
              <span className="sr-only">{t.a11y.newTab}</span>
            </a>
          </div>
          <a className="contact__social" href={SITE.facebook} target="_blank" rel="noopener noreferrer">
            <FacebookIcon />
            {t.contact.facebook}
            <span className="sr-only">{t.a11y.newTab}</span>
          </a>
        </div>

        <div className="contact__map" data-reveal>
          <iframe
            title={t.contact.mapTitle}
            src={MAPS.embed(lang)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}
