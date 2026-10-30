import { expect } from 'earl'
import {
  computeRangeTotal,
  computeWeeklyAverageChange,
  type HomeSeriesPoint,
  toWeeklyAverages,
} from './homeSeries'

const DAY = 86_400

function days(values: (number | null)[]): HomeSeriesPoint[] {
  return values.map((value, index) => [index * DAY, value])
}

describe(toWeeklyAverages.name, () => {
  it('counts weeks back from the latest day and drops the days left over', () => {
    // 16 days: two full weeks end on the last day; the first two days are
    // too few for a week.
    const data = days([1000, 1000, ...Array(7).fill(10), ...Array(7).fill(20)])
    expect(toWeeklyAverages(data)).toEqual([
      [2 * DAY, 10],
      [9 * DAY, 20],
    ])
  })

  it('averages only the days with data, and a week without any is null', () => {
    const data = days([
      ...Array(7).fill(null),
      null,
      10,
      null,
      30,
      null,
      null,
      null,
    ])
    expect(toWeeklyAverages(data)).toEqual([
      [0, null],
      [7 * DAY, 20],
    ])
  })

  it('keeps a series shorter than a week as one point', () => {
    expect(toWeeklyAverages(days([4, 6, 8]))).toEqual([[0, 6]])
  })
})

describe(computeWeeklyAverageChange.name, () => {
  it('compares the first and the last week, not two single days', () => {
    // A one-day spike on the first day would make a day-to-day change
    // read -90%; averaged, the weeks are 25 and 20.
    const firstWeek = [100, 10, 10, 10, 10, 20, 15]
    const lastWeek = [20, 20, 20, 20, 20, 20, 20]
    expect(
      computeWeeklyAverageChange(days([...firstWeek, ...lastWeek])),
    ).toEqual(20 / 25 - 1)
  })

  it('skips days without data', () => {
    const values = [null, ...Array(7).fill(10), null, ...Array(7).fill(15)]
    expect(computeWeeklyAverageChange(days(values))).toEqual(0.5)
  })

  it('compares the weeks the sparkline draws', () => {
    // The sparkline drops the leftover day at the start, and its last week
    // holds the unsynced day.
    const values = [100, ...Array(7).fill(10), ...Array(6).fill(20), null]
    expect(computeWeeklyAverageChange(days(values))).toEqual(1)
  })

  it('has no change for a series shorter than two weeks', () => {
    expect(computeWeeklyAverageChange(days(Array(13).fill(10)))).toEqual(
      undefined,
    )
  })

  it('has no change from a first week of zeros', () => {
    const values = [...Array(7).fill(0), ...Array(7).fill(5)]
    expect(computeWeeklyAverageChange(days(values))).toEqual(undefined)
  })
})

describe(computeRangeTotal.name, () => {
  it('compares the total with the range before it', () => {
    const points: [number, number][] = [
      [0, 10],
      [1, 10],
      [2, 15],
      [3, 15],
    ]
    expect(computeRangeTotal(points, 2, 0)).toEqual({ total: 30, change: 0.5 })
  })

  it('has no change when the data starts inside the range before', () => {
    // Half a previous range would read as growth.
    const points: [number, number][] = [
      [1, 10],
      [2, 15],
      [3, 15],
    ]
    expect(computeRangeTotal(points, 2, 0)).toEqual({
      total: 30,
      change: undefined,
    })
  })
})
