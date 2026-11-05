import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { calculateExposure } from './calculateExposure'

const YEAR = 365 * UnixTime.DAY

describe(calculateExposure.name, () => {
  it('interpolates the value at the start between neighbouring samples', () => {
    const series = [
      { timestamp: 0, value: 0 },
      { timestamp: 2 * YEAR, value: 200 },
    ]

    // 100 at the start and 200 at the end: (100 + 200) / 2 over one year
    expect(calculateExposure(series, YEAR, 2 * YEAR)).toEqual({
      value: 150,
      since: YEAR,
      years: 1,
    })
  })

  it('counts the time before the first sample as zero', () => {
    const series = [
      { timestamp: YEAR, value: 100 },
      { timestamp: 2 * YEAR, value: 100 },
    ]

    // Nothing in the first year, then 100 for one year, so the data and the
    // average start at the first sample
    expect(calculateExposure(series, 0, 2 * YEAR)).toEqual({
      value: 100,
      since: YEAR,
      years: 1,
    })
  })

  it('holds the last sample flat when every sample predates the start', () => {
    const series = [
      { timestamp: 0, value: 0 },
      { timestamp: YEAR, value: 100 },
    ]

    expect(calculateExposure(series, 2 * YEAR, 3 * YEAR)?.value).toEqual(100)
  })

  it('returns null for an empty series', () => {
    expect(calculateExposure([], 0, YEAR)).toEqual(null)
  })

  it('returns zero for an empty or reversed interval', () => {
    const series = [{ timestamp: 0, value: 100 }]

    expect(calculateExposure(series, YEAR, YEAR)).toEqual({
      value: 0,
      since: YEAR,
      years: 0,
    })
    expect(calculateExposure(series, 2 * YEAR, YEAR)?.years).toEqual(0)
  })
})
