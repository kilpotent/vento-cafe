import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { logos } from '../assets/images/optimized/manifest.ts'
import { SECTIONS, SPY_TARGETS } from '../data/nav.ts'
import { SITE } from '../data/site.ts'
import { useActiveSection } from '../hooks/useActiveSection.ts'
import { useScrollPast } from '../hooks/useScrollPast.ts'
import { useLanguage } from '../i18n/context.ts'
import { CloseIcon, MenuIcon, PhoneIcon } from './Icons.tsx'
import LanguageSwitch from './LanguageSwitch.tsx'
import StatusPill from './StatusPill.tsx'
import './Header.css'

const DESKTOP_NAV = '(min-width: 1120px)'
const compactLogo = logos.white.compact

export default function Header() {
  const { t } = useLanguage()
  const scrolled = useScrollPast(24)
  const active = useActiveSection(SPY_TARGETS)
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const landline = SITE.phones[0]

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <a className="site-header__brand" href="#top" aria-label={t.a11y.home}>
          <img src={compactLogo.src} width={compactLogo.width} height={compactLogo.height} alt="" />
        </a>

        <nav className="site-nav" aria-label={t.a11y.mainNav}>
          <ul className="plain-list">
            {SECTIONS.map((id) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={active === id ? 'true' : undefined}>
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <LanguageSwitch className="site-header__lang" />
          <a className="site-header__call" href={`tel:${landline.tel}`}>
            <PhoneIcon />
            <span>{landline.display}</span>
          </a>
          <button
            type="button"
            className="site-header__menu-btn"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
            <span className="sr-only">{t.a11y.openMenu}</span>
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={closeMenu} active={active} />
    </header>
  )
}

function MobileMenu({ open, onClose, active }: { open: boolean; onClose: () => void; active: string | null }) {
  const { t } = useLanguage()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Leaving the mobile layout (rotating a tablet, resizing) closes the menu.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_NAV)
    const onChange = () => query.matches && onClose()
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [onClose])

  const goTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    onClose()
    requestAnimationFrame(() => {
      const target = document.getElementById(id)
      if (!target) return
      target.scrollIntoView()
      target.focus({ preventScroll: true })
      history.pushState(null, '', `#${id}`)
    })
  }

  return (
    <dialog ref={dialogRef} id="mobile-menu" className="mobile-menu" aria-label={t.a11y.menu} onClose={onClose}>
      <div className="mobile-menu__top">
        <img
          className="mobile-menu__logo"
          src={compactLogo.src}
          width={compactLogo.width}
          height={compactLogo.height}
          alt=""
        />
        <button type="button" className="mobile-menu__close" onClick={onClose}>
          <CloseIcon />
          <span className="sr-only">{t.a11y.closeMenu}</span>
        </button>
      </div>

      <nav aria-label={t.a11y.mainNav}>
        <ol className="plain-list mobile-menu__links">
          {SECTIONS.map((id, index) => (
            <li key={id} style={{ '--i': index } as CSSProperties}>
              <a href={`#${id}`} onClick={(event) => goTo(event, id)} aria-current={active === id ? 'true' : undefined}>
                <span className="mobile-menu__num" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {t.nav[id]}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mobile-menu__footer">
        <StatusPill />
        <div className="mobile-menu__phones">
          {SITE.phones.map((phone) => (
            <a key={phone.tel} className="btn btn--ghost" href={`tel:${phone.tel}`}>
              <PhoneIcon />
              {phone.display}
              <span className="sr-only">({t.phoneKinds[phone.kind]})</span>
            </a>
          ))}
        </div>
        <LanguageSwitch />
      </div>
    </dialog>
  )
}
