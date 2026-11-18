import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { pinTvsRange } from './pinTvsRange'

// Methodology: pass the pin explicitly, so the tests don't depend on env.
// Each later range must come back ending at the pin with its length intact.
describe(pinTvsRange.name, () => {
  const pin = UnixTime.fromDate(new Date('2026-11-17T00:00:00Z'))
  const DAY = UnixTime.DAY
  const HOUR = UnixTime.HOUR

  it('keeps ranges that already end before the pin', () => {
    const range: [number, number] = [pin - 7 * DAY, pin - DAY]
    expect(pinTvsRange(range, pin)).toEqual(range)
  })

  const laterRanges: [string, number, number][] = [
    [
      'a 7D preset requested in the morning',
      pin - 6 * DAY,
      pin + DAY + 5 * HOUR,
    ],
    [
      'a 7D preset requested late in the day',
      pin - 6 * DAY,
      pin + DAY + 18 * HOUR,
    ],
    ['a single picked day', pin + DAY, pin + 2 * DAY - 1],
    ['a few hours within one day', pin + DAY + 6 * HOUR, pin + DAY + 12 * HOUR],
  ]
  for (const [name, start, end] of laterRanges) {
    it(`moves ${name} to end at the pin, keeping its length`, () => {
      expect(pinTvsRange([start, end], pin)).toEqual([pin - (end - start), pin])
    })
  }

  it('keeps an open start for the max range', () => {
    expect(pinTvsRange([null, pin + 3 * DAY], pin)).toEqual([null, pin])
  })
})
