import { useMemo } from 'react'
import { HOURS } from '../data/site.ts'
import { cafeTime, statusAt } from '../lib/hours.ts'
import { useNow } from './useNow.ts'

/** Café and delivery status right now, in the café's time zone. */
export function useLiveStatus() {
  const now = useNow()
  return useMemo(() => {
    const time = cafeTime(new Date(now))
    return { time, cafe: statusAt(HOURS.cafe, time), delivery: statusAt(HOURS.delivery, time) }
  }, [now])
}
