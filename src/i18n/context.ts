import { createContext, useContext } from 'react'
import type { Dictionary, Lang } from './translations.ts'

export interface LanguageContextValue {
  lang: Lang
  t: Dictionary
  setLang: (lang: Lang) => void
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return context
}
