import { expect } from 'earl'
import { timestampToDateInput } from './timestampToDateInput'

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

describe(timestampToDateInput.name, () => {
  it('formats midnight UTC timestamps as YYYY-MM-DD', () => {
    expect(timestampToDateInput(1_577_836_800)).toEqual('2020-01-01')
    expect(timestampToDateInput(1_779_926_400)).toEqual('2026-05-28')
  })

  for (const tz of TIMEZONES) {
    it(`returns the UTC calendar day regardless of process timezone (TZ=${tz})`, () => {
      withTimezone(tz, () => {
        expect(timestampToDateInput(1_577_836_800)).toEqual('2020-01-01')
        // 23:30 UTC — would shift to next day in Asia/Tokyo if local-time was used
        expect(
          timestampToDateInput(1_577_836_800 + 23 * 3600 + 30 * 60),
        ).toEqual('2020-01-01')
        // 00:30 UTC — would shift to previous day in America/New_York if local-time was used
        expect(timestampToDateInput(1_577_836_800 + 30 * 60)).toEqual(
          '2020-01-01',
        )
      })
    })
  }
})
