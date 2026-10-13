import { useLanguage } from '../i18n/context.ts'

export default function SkipLink() {
  const { t } = useLanguage()
  return (
    <a className="skip-link" href="#main">
      {t.a11y.skip}
    </a>
  )
}
