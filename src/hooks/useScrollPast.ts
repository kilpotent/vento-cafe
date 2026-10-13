import { useEffect, useState } from 'react'

/** True once the page has scrolled past `threshold` (px, or a fraction of the viewport height with unit "vh"). */
export function useScrollPast(threshold: number, unit: 'px' | 'vh' = 'px'): boolean {
  const [past, setPast] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const limit = unit === 'vh' ? window.innerHeight * threshold : threshold
      setPast(window.scrollY > limit)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [threshold, unit])

  return past
}
