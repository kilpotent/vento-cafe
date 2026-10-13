import { useLayoutEffect } from 'react'

/**
 * Fades `[data-reveal]` elements in the first time they enter the viewport.
 * State lives in a `data-revealed` attribute rather than a class so React re-renders never reset it.
 * Skipped entirely for visitors who prefer reduced motion.
 */
export function useRevealOnScroll() {
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return

    const root = document.documentElement
    root.classList.add('reveal-ready')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-revealed', '')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    )
    document.querySelectorAll('[data-reveal]:not([data-revealed])').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
}
