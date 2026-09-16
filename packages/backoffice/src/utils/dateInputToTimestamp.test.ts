import { describe, expect, it } from 'vitest'
import { dateInputToTimestamp } from './dateInputToTimestamp'

const TIMEZONES = ['UTC', 'America/New_York', 'Asia/Tokyo', 'Pacific/Auckland']

function withTimezone(tz: string, fn: () => void) {
  const original = process.env.TZ
  process.env.TZ = tz
  try {
    fn()
  } finally {
    process.env.TZ = original
  }
}

describe(dateInputToTimestamp.name, () => {
  it('returns unix seconds for midnight UTC of the given day', () => {
    expect(dateInputToTimestamp('2020-01-01')).toStrictEqual(1_577_836_800)
    expect(dateInputToTimestamp('2026-05-28')).toStrictEqual(1_779_926_400)
  })

  for (const tz of TIMEZONES) {
    it(`is timezone-independent (TZ=${tz})`, () => {
      withTimezone(tz, () => {
        expect(dateInputToTimestamp('2020-01-01')).toStrictEqual(1_577_836_800)
        expect(dateInputToTimestamp('2026-05-28')).toStrictEqual(1_779_926_400)
      })
    })
  }
})
