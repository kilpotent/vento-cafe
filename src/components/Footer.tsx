import { SECTIONS } from '../data/nav.ts'
import { HOURS, SITE } from '../data/site.ts'
import { useYear } from '../hooks/useNow.ts'
import { useLanguage } from '../i18n/context.ts'
import { formatDays, formatInterval, groupDays } from '../lib/hours.ts'
import { ArrowUpIcon, FacebookIcon, InstagramIcon } from './Icons.tsx'
import LanguageSwitch from './LanguageSwitch.tsx'
import Logo from './Logo.tsx'
import StatusPill from './StatusPill.tsx'
import './Footer.css'

export default function Footer() {
  const { t, lang } = useLanguage()
  const year = useYear()
  const { address } = SITE

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo tone="white" alt={t.hero.logoAlt} sizes="230px" className="site-footer__logo" />
          <p>{t.footer.tagline}</p>
        </div>

        <nav className="site-footer__col" aria-labelledby="footer-explore">
          <h2 id="footer-explore" className="site-footer__title">
            {t.footer.explore}
          </h2>
          <ul className="plain-list">
            {SECTIONS.map((id) => (
              <li key={id}>
                <a href={`#${id}`}>{t.nav[id]}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__col">
          <h2 className="site-footer__title">{t.footer.hours}</h2>
          <ul className="plain-list site-footer__hours">
            {groupDays(HOURS.cafe).map((group) => (
              <li key={group.days[0]}>
                <span>{formatDays(group.days, t.daysShort)}</span>
                {group.interval ? formatInterval(group.interval) : t.hours.closed}
              </li>
            ))}
            {groupDays(HOURS.delivery)
              .filter((group) => group.interval)
              .map((group) => (
                <li key={`d${group.days[0]}`}>
                  <span>
                    {t.hours.delivery} {formatDays(group.days, t.daysShort)}
                  </span>
                  {formatInterval(group.interval!)}
                </li>
              ))}
          </ul>
          <StatusPill className="site-footer__status" />
        </div>

        <div className="site-footer__col">
          <h2 className="site-footer__title">{t.footer.visit}</h2>
          <address className="site-footer__address">
            {address.street[lang]}
            <br />
            {address.postalCode} {address.city[lang]}, {address.country[lang]}
          </address>
          <ul className="plain-list site-footer__phones">
            {SITE.phones.map((phone) => (
              <li key={phone.tel}>
                <a href={`tel:${phone.tel}`}>{phone.display}</a>
                <span> · {t.phoneKinds[phone.kind]}</span>
              </li>
            ))}
          </ul>
          <div className="site-footer__socials">
            <a className="site-footer__social" href={SITE.instagram} target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
              Instagram
              <span className="sr-only">{t.a11y.newTab}</span>
            </a>
            <a className="site-footer__social" href={SITE.facebook} target="_blank" rel="noopener noreferrer">
              <FacebookIcon />
              Facebook
              <span className="sr-only">{t.a11y.newTab}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p>{t.footer.rights(year)}</p>
        <LanguageSwitch />
        <a className="site-footer__top" href="#top">
          {t.footer.top}
          <ArrowUpIcon />
        </a>
      </div>
    </footer>
  )
}
