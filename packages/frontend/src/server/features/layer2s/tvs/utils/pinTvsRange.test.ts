import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { pinTvsRange } from './pinTvsRange'

// Methodology: pass the pin explicitly, so the test doesn't depend on env.
describe(pinTvsRange.name, () => {
  const pin = UnixTime.fromDate(new Date('2026-11-17T00:00:00Z'))
  const DAY = UnixTime.DAY

  it('keeps ranges when nothing is pinned', () => {
    const range: [number, number] = [pin, pin + 3 * DAY]
    expect(pinTvsRange(range, undefined)).toEqual(range)
  })

  it('keeps ranges that already end before the pin', () => {
    const range: [number, number] = [pin - 7 * DAY, pin - DAY]
    expect(pinTvsRange(range, pin)).toEqual(range)
  })

  it('shifts a later range to end at the pin, keeping its length in days', () => {
    const end = pin + DAY + 5 * UnixTime.HOUR
    const start = UnixTime.toStartOf(end, 'day') - 7 * DAY
    expect(pinTvsRange([start, end], pin)).toEqual([pin - 8 * DAY, pin])
  })

  it('keeps an open start for the max range', () => {
    expect(pinTvsRange([null, pin + 3 * DAY], pin)).toEqual([null, pin])
  })
})
