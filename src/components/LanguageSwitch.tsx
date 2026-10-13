import { useLanguage } from '../i18n/context.ts'
import { LANGS, type Lang } from '../i18n/translations.ts'
import './LanguageSwitch.css'

const LABELS: Record<Lang, { short: string; full: string }> = {
  el: { short: 'ΕΛ', full: 'Ελληνικά' },
  en: { short: 'EN', full: 'English' },
}

export default function LanguageSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useLanguage()
  return (
    <div className={`lang-switch ${className}`} role="group" aria-label={t.a11y.language}>
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-label={LABELS[code].full}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
        >
          {LABELS[code].short}
        </button>
      ))}
    </div>
  )
}
