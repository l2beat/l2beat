import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { buildHistoryPoints, getWindowMedian } from './buildHistoryPoints'

const DAY = UnixTime.DAY
const HOUR = UnixTime.HOUR

describe(buildHistoryPoints.name, () => {
  it('takes each day its earliest snapshot and keeps days without one', () => {
    const points = buildHistoryPoints(
      [
        UnixTime(DAY),
        UnixTime(DAY + 5 * HOUR),
        UnixTime(3 * DAY + 13 * HOUR),
        UnixTime(3 * DAY + 20 * HOUR),
      ],
      'daily',
    )

    expect(points).toEqual([
      { timestamp: UnixTime(DAY), snapshot: UnixTime(DAY) },
      { timestamp: UnixTime(2 * DAY), snapshot: undefined },
      { timestamp: UnixTime(3 * DAY), snapshot: UnixTime(3 * DAY + 13 * HOUR) },
    ])
  })

  it('makes hourly points for the 14 days up to the last snapshot', () => {
    const last = UnixTime(30 * DAY)
    const points = buildHistoryPoints(
      [UnixTime(last - 15 * DAY), UnixTime(last - HOUR), last],
      'hourly',
    )

    expect(points.length).toEqual(14 * 24)
    expect(points.at(-1)).toEqual({ timestamp: last, snapshot: last })
    expect(points.at(-2)).toEqual({
      timestamp: UnixTime(last - HOUR),
      snapshot: UnixTime(last - HOUR),
    })
    expect(points.filter((p) => p.snapshot !== undefined).length).toEqual(2)
  })
})

describe(getWindowMedian.name, () => {
  it('takes the median of the neighbours in the window, without the point', () => {
    const timestamps = [0, 1, 2, 3, 4, 10]
    const values = [1, 2, 1000, 3, undefined, 50]

    expect(getWindowMedian(timestamps, values, 2, 2)).toEqual(2)
  })

  it('is 0 without neighbours', () => {
    expect(getWindowMedian([0, 10], [5, 7], 0, 1)).toEqual(0)
  })
})
