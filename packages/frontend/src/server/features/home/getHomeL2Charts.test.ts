import { expect } from 'earl'
import { mergeTvsParts } from './getHomeL2Charts'
import { toWeeklyAverages } from './homeSeries'

const DAY = 86_400

describe(mergeTvsParts.name, () => {
  it('zips both parts by timestamp, in order, with their total', () => {
    expect(
      mergeTvsParts(
        [
          { timestamp: 2, value: 20 },
          { timestamp: 1, value: 10 },
        ],
        [
          { timestamp: 1, value: 100 },
          { timestamp: 2, value: 200 },
        ],
      ),
    ).toEqual([
      [1, 110, 10, 100],
      [2, 220, 20, 200],
    ])
  })

  it('leaves a point without both parts empty, so its total is not one part', () => {
    expect(
      mergeTvsParts(
        [
          { timestamp: 1, value: 10 },
          { timestamp: 2, value: null },
        ],
        [
          { timestamp: 2, value: 200 },
          { timestamp: 3, value: 300 },
        ],
      ),
    ).toEqual([
      [1, null, null, null],
      [2, null, null, null],
      [3, null, null, null],
    ])
  })

  it('keeps the last full day when the parts end at different hours', () => {
    // Day i holds i rollups and 2i validiums & optimiums: 3 and 6 a week.
    const days = (factor: number) =>
      Array.from({ length: 7 }, (_, i) => ({
        timestamp: i * DAY,
        value: i * factor,
      }))
    const rollups = [...days(1), { timestamp: 6 * DAY + 13 * 3600, value: 1 }]
    const vAndO = [...days(2), { timestamp: 6 * DAY + 12 * 3600, value: 1 }]

    expect(toWeeklyAverages(mergeTvsParts(rollups, vAndO))).toEqual([
      [0, 9, 3, 6],
    ])
  })

  it('returns an empty chart for empty inputs', () => {
    expect(mergeTvsParts([], [])).toEqual([])
  })
})
