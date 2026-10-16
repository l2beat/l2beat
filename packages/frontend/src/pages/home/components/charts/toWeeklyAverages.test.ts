import { expect } from 'earl'
import { toWeeklyAverages } from './toWeeklyAverages'

const DAY = 86_400

function days(values: (number | null)[]) {
  return values.map((value, index) => ({ timestamp: index * DAY, value }))
}

describe(toWeeklyAverages.name, () => {
  it('counts weeks back from the latest day and drops the days left over', () => {
    // 16 days: two full weeks end on the last day; the first two days are
    // too few for a week.
    const data = days([1000, 1000, ...Array(7).fill(10), ...Array(7).fill(20)])
    expect(toWeeklyAverages(data)).toEqual([
      { timestamp: 2 * DAY, value: 10 },
      { timestamp: 9 * DAY, value: 20 },
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
      { timestamp: 0, value: null },
      { timestamp: 7 * DAY, value: 20 },
    ])
  })

  it('keeps a series shorter than a week as one point', () => {
    expect(toWeeklyAverages(days([4, 6, 8]))).toEqual([
      { timestamp: 0, value: 6 },
    ])
  })
})
