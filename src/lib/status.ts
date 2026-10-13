import type { Dictionary } from '../i18n/translations.ts'
import { formatTime, isMidnight, type NextOpening, type Status } from './hours.ts'

const CLOSING_SOON_MINUTES = 60

const when = (t: Dictionary, next: NextOpening) => t.when(next.daysAhead, next.day, formatTime(next.at))

export function describeCafe(t: Dictionary, status: Status) {
  if (status.open) {
    const detail =
      status.minutesLeft < CLOSING_SOON_MINUTES
        ? t.status.closesIn(status.minutesLeft)
        : isMidnight(status.closesAt)
          ? t.status.closesMidnight
          : t.status.closesAt(formatTime(status.closesAt))
    return { open: true, label: t.status.open, detail }
  }
  return { open: false, label: t.status.closed, detail: status.next ? t.status.opens(when(t, status.next)) : '' }
}

export function describeDelivery(t: Dictionary, status: Status) {
  if (status.open) return { open: true, text: t.delivery.openNow(formatTime(status.closesAt)) }
  return { open: false, text: status.next ? t.delivery.next(when(t, status.next)) : t.delivery.unavailable }
}
