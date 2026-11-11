import type { Dictionary } from '../i18n/translations.ts'
import { formatTime, type NextOpening, type Status } from './hours.ts'

const when = (t: Dictionary, next: NextOpening) => t.when(next.daysAhead, next.day, formatTime(next.at))

export function describeCafe(t: Dictionary, status: Status) {
  // The café's closing time is deliberately vague, so an open café is always "open until late".
  if (status.open) return { open: true, label: t.status.open, detail: t.status.untilLate }
  return { open: false, label: t.status.closed, detail: status.next ? t.status.opens(when(t, status.next)) : '' }
}

export function describeDelivery(t: Dictionary, status: Status) {
  if (status.open) return { open: true, text: t.delivery.openNow(formatTime(status.closesAt)) }
  return { open: false, text: status.next ? t.delivery.next(when(t, status.next)) : t.delivery.unavailable }
}
