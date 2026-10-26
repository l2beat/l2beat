import { expect } from 'earl'
import { getTvsSeriesStats } from './getTvsSeriesStats'
import type { TvsSeriesPoint } from './mergeTvsSeries'

// Each case hands in a merged series with gaps placed where the two fetches
// can disagree (the start and the end) and checks which points the stats read.
describe(getTvsSeriesStats.name, () => {
  it('totals the selected series at the newest point', () => {
    const result = getTvsSeriesStats(
      [point(100, 10, 10), point(200, 30, 10)],
      ['fullData', 'settlementOnly'],
    )

    expect(result).toEqual({ total: 40, change: 1 })
  })

  it('reads the newest point every selected series has when one lags', () => {
    const result = getTvsSeriesStats(
      [point(100, 10, 10), point(200, 20, 20), point(300, 30, null)],
      ['fullData', 'settlementOnly'],
    )

    expect(result).toEqual({ total: 40, change: 1 })
  })

  it('reads the oldest point every selected series has when one starts later', () => {
    const result = getTvsSeriesStats(
      [point(100, 10, null), point(200, 10, 10), point(300, 20, 20)],
      ['fullData', 'settlementOnly'],
    )

    expect(result).toEqual({ total: 40, change: 1 })
  })

  it('does not wait for a series that is not selected', () => {
    const result = getTvsSeriesStats(
      [point(100, 10, 10), point(200, 20, null)],
      ['fullData'],
    )

    expect(result).toEqual({ total: 20, change: 1 })
  })

  it('does not wait for a series that has no values at all', () => {
    const result = getTvsSeriesStats(
      [point(100, 10, null), point(200, 20, null)],
      ['fullData', 'settlementOnly'],
    )

    expect(result).toEqual({ total: 20, change: 1 })
  })

  it('returns nothing without data', () => {
    expect(getTvsSeriesStats(undefined, ['fullData'])).toEqual(undefined)
    expect(getTvsSeriesStats([], ['fullData'])).toEqual(undefined)
  })
})

function point(
  timestamp: number,
  fullData: number | null,
  settlementOnly: number | null,
): TvsSeriesPoint {
  return { timestamp, fullData, settlementOnly }
}
