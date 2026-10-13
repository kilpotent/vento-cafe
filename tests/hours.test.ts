// Run with `npm test` (Node's built-in test runner; Node strips the TypeScript types).
import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { HOURS, type WeekSchedule } from '../src/data/site.ts'
import {
  cafeTime,
  formatDays,
  formatInterval,
  formatShortInterval,
  formatTime,
  groupDays,
  statusAt,
} from '../src/lib/hours.ts'

const MON = 0
const SAT = 5
const SUN = 6
const at = (hours: number, minutes = 0) => hours * 60 + minutes

describe('cafeTime (Europe/Athens)', () => {
  test('summer time, UTC+3', () => {
    // Sunday 4 Oct 2026, 03:30 UTC = 06:30 in Lamia
    assert.deepEqual(cafeTime(new Date('2026-10-04T03:30:00Z')), { day: SUN, minutes: at(6, 30) })
  })

  test('winter time, UTC+2', () => {
    // Monday 7 Dec 2026, 03:00 UTC = 05:00 in Lamia
    assert.deepEqual(cafeTime(new Date('2026-12-07T03:00:00Z')), { day: MON, minutes: at(5) })
  })

  test('local midnight belongs to the new day', () => {
    // Sunday 6 Dec 2026, 22:00 UTC = Monday 00:00 in Lamia
    assert.deepEqual(cafeTime(new Date('2026-12-06T22:00:00Z')), { day: MON, minutes: 0 })
  })
})

describe('café status', () => {
  test('closed just before opening, open at 05:00 sharp', () => {
    assert.deepEqual(statusAt(HOURS.cafe, { day: MON, minutes: at(4, 59) }), {
      open: false,
      next: { daysAhead: 0, day: MON, at: at(5) },
    })
    assert.deepEqual(statusAt(HOURS.cafe, { day: MON, minutes: at(5) }), {
      open: true,
      closesAt: at(24),
      minutesLeft: at(19),
    })
  })

  test('open until the last minute before midnight', () => {
    assert.deepEqual(statusAt(HOURS.cafe, { day: SAT, minutes: at(23, 59) }), {
      open: true,
      closesAt: at(24),
      minutesLeft: 1,
    })
  })

  test('Sunday opens an hour later', () => {
    assert.deepEqual(statusAt(HOURS.cafe, { day: SUN, minutes: at(5, 30) }), {
      open: false,
      next: { daysAhead: 0, day: SUN, at: at(6) },
    })
    assert.equal(statusAt(HOURS.cafe, { day: SUN, minutes: at(6) }).open, true)
  })
})

describe('delivery status', () => {
  test('open 06:00–09:00 on weekdays', () => {
    assert.equal(statusAt(HOURS.delivery, { day: MON, minutes: at(5, 59) }).open, false)
    assert.deepEqual(statusAt(HOURS.delivery, { day: MON, minutes: at(8, 59) }), {
      open: true,
      closesAt: at(9),
      minutesLeft: 1,
    })
    assert.equal(statusAt(HOURS.delivery, { day: MON, minutes: at(9) }).open, false)
  })

  test('after Saturday’s window, the next delivery is Monday', () => {
    assert.deepEqual(statusAt(HOURS.delivery, { day: SAT, minutes: at(10) }), {
      open: false,
      next: { daysAhead: 2, day: MON, at: at(6) },
    })
  })

  test('no delivery on Sunday: next is tomorrow', () => {
    assert.deepEqual(statusAt(HOURS.delivery, { day: SUN, minutes: at(7) }), {
      open: false,
      next: { daysAhead: 1, day: MON, at: at(6) },
    })
  })
})

describe('hours that run past midnight', () => {
  // Friday 20:00 – Saturday 02:00 only
  const late: WeekSchedule = [null, null, null, null, { open: at(20), close: at(26) }, null, null]

  test('spill into the next morning', () => {
    assert.deepEqual(statusAt(late, { day: SAT, minutes: at(1) }), { open: true, closesAt: at(2), minutesLeft: 60 })
  })

  test('after closing, the next opening is a week away', () => {
    assert.deepEqual(statusAt(late, { day: SAT, minutes: at(2, 10) }), {
      open: false,
      next: { daysAhead: 6, day: 4, at: at(20) },
    })
  })
})

describe('formatting', () => {
  test('times and intervals', () => {
    assert.equal(formatTime(at(5)), '05:00')
    assert.equal(formatTime(at(24)), '00:00')
    assert.equal(formatTime(at(26)), '02:00')
    assert.equal(formatInterval({ open: at(5), close: at(24) }), '05:00 – 00:00')
    assert.equal(formatShortInterval({ open: at(6), close: at(9) }), '06–09')
    assert.equal(formatShortInterval({ open: at(6, 30), close: at(9) }), '06:30 – 09:00')
  })

  test('grouping days with identical hours', () => {
    assert.deepEqual(
      groupDays(HOURS.cafe).map((group) => group.days),
      [[0, 1, 2, 3, 4, 5], [6]],
    )
    assert.deepEqual(
      groupDays(HOURS.delivery).map((group) => [group.days, group.interval === null]),
      [
        [[0, 1, 2, 3, 4, 5], false],
        [[6], true],
      ],
    )
  })

  test('day ranges', () => {
    const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    assert.equal(formatDays([0, 1, 2, 3, 4, 5], names), 'Mon–Sat')
    assert.equal(formatDays([0, 2, 3, 4], names), 'Mon, Wed–Fri')
    assert.equal(formatDays([6], names, ' – '), 'Sun')
  })
})
