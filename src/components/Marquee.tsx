import { emblem } from '../assets/images/optimized/manifest.ts'
import { useLanguage } from '../i18n/context.ts'
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
                <img
                  className="marquee__fan"
                  src={emblem.src}
                  width={emblem.width}
                  height={emblem.height}
                  alt=""
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
