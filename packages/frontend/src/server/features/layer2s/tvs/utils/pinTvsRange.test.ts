import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { pinTvsRange } from './pinTvsRange'

// Methodology: pass the pin explicitly, so the tests don't depend on env.
describe(pinTvsRange.name, () => {
  const pin = UnixTime.fromDate(new Date('2026-11-17T00:00:00Z'))
  const DAY = UnixTime.DAY

  it('keeps ranges that already end before the pin', () => {
    const range: [number, number] = [pin - 7 * DAY, pin - DAY]
    expect(pinTvsRange(range, pin)).toEqual(range)
  })

  it('shifts a later range to end at the pin, keeping its length in days', () => {
    const end = pin + DAY + 5 * UnixTime.HOUR
    const start = UnixTime.toStartOf(end, 'day') - 7 * DAY
    expect(pinTvsRange([start, end], pin)).toEqual([pin - 7 * DAY, pin])
  })

  it('moves the start a whole day when the pin is later in the day than the end', () => {
    const noon = pin + 12 * UnixTime.HOUR
    const end = pin + DAY + 6 * UnixTime.HOUR
    const start = UnixTime.toStartOf(end, 'day') - 7 * DAY
    expect(pinTvsRange([start, end], noon)).toEqual([pin - 7 * DAY, noon])
  })

  it('keeps a preset seven days long when requested late in the day', () => {
    const end = pin + DAY + 18 * UnixTime.HOUR
    const start = UnixTime.toStartOf(end, 'day') - 7 * DAY
    expect(pinTvsRange([start, end], pin)).toEqual([pin - 7 * DAY, pin])
  })

  it('keeps three picked days three days long', () => {
    const range: [number, number] = [pin + DAY, pin + 4 * DAY - 1]
    expect(pinTvsRange(range, pin)).toEqual([pin - 3 * DAY, pin])
  })

  it('keeps a single picked day one day long', () => {
    const range: [number, number] = [pin + DAY, pin + 2 * DAY - 1]
    expect(pinTvsRange(range, pin)).toEqual([pin - DAY, pin])
  })

  it('keeps an open start for the max range', () => {
    expect(pinTvsRange([null, pin + 3 * DAY], pin)).toEqual([null, pin])
  })
})
