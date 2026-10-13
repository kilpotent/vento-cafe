import { useLanguage } from '../i18n/context.ts'
import { FanIcon } from './Icons.tsx'
import './Marquee.css'

/** Turquoise band after the bar's geometric pattern. Decorative: the same words appear elsewhere. */
export default function Marquee() {
  const { t } = useLanguage()
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="marquee__group plain-list">
            {t.marquee.map((item) => (
              <li key={item}>
                {item}
                <FanIcon className="marquee__fan" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
