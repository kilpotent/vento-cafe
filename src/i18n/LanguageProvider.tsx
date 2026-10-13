import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LanguageContext } from './context.ts'
import { dictionaries, isLang, type Lang } from './translations.ts'

const STORAGE_KEY = 'vento-lang'
const DEFAULT_LANG: Lang = 'el'

/** ?lang=en in the URL wins, then the visitor's last choice, then Greek. */
function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (isLang(fromUrl)) return fromUrl
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isLang(stored)) return stored
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); fall back to the default.
  }
  return DEFAULT_LANG
}

function setMeta(selector: string, content: string) {
  document.querySelector(selector)?.setAttribute('content', content)
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    const { meta } = dictionaries[lang]
    document.documentElement.lang = lang
    document.title = meta.title
    setMeta('meta[name="description"]', meta.description)
    setMeta('meta[property="og:title"]', meta.title)
    setMeta('meta[property="og:description"]', meta.description)
    setMeta('meta[property="og:locale"]', lang === 'el' ? 'el_GR' : 'en_US')
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Not persisting the choice is fine.
    }
  }, [])

  const value = useMemo(() => ({ lang, t: dictionaries[lang], setLang }), [lang, setLang])

  return <LanguageContext value={value}>{children}</LanguageContext>
}
