import { MAPS, SITE } from '../data/site.ts'
import { useScrollPast } from '../hooks/useScrollPast.ts'
import { useLanguage } from '../i18n/context.ts'
import { NavigationIcon, PhoneIcon } from './Icons.tsx'
import './MobileBar.css'

/** Call / directions shortcuts that slide up on phones once the hero is out of view. */
export default function MobileBar() {
  const { t } = useLanguage()
  const visible = useScrollPast(0.7, 'vh')
  const landline = SITE.phones[0]

  return (
    <nav className={`mobile-bar${visible ? ' is-visible' : ''}`} aria-label={t.a11y.quickActions} inert={!visible}>
      <a className="mobile-bar__btn mobile-bar__btn--call" href={`tel:${landline.tel}`}>
        <PhoneIcon />
        {t.nav.call}
      </a>
      <a className="mobile-bar__btn" href={MAPS.directions} target="_blank" rel="noopener noreferrer">
        <NavigationIcon />
        {t.nav.directions}
        <span className="sr-only">{t.a11y.newTab}</span>
      </a>
    </nav>
  )
}
