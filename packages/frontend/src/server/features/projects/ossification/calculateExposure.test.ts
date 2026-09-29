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

    expect(calculateExposure(series, YEAR, 2 * YEAR)).toEqual(150)
  })

  it('counts the time before the first sample as zero', () => {
    const series = [
      { timestamp: YEAR, value: 100 },
      { timestamp: 2 * YEAR, value: 100 },
    ]

    expect(calculateExposure(series, 0, 2 * YEAR)).toEqual(100)
  })

  it('holds the last sample flat when every sample predates the start', () => {
    const series = [
      { timestamp: 0, value: 0 },
      { timestamp: YEAR, value: 100 },
    ]

    expect(calculateExposure(series, 2 * YEAR, 3 * YEAR)).toEqual(100)
  })

  it('returns null for an empty series', () => {
    expect(calculateExposure([], 0, YEAR)).toEqual(null)
  })

  it('returns zero for an empty interval', () => {
    const series = [{ timestamp: 0, value: 100 }]

    expect(calculateExposure(series, YEAR, YEAR)).toEqual(0)
  })
})
