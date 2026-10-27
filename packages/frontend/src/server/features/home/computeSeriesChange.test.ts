import { expect } from 'earl'
import { computeWeeklyAverageChange } from './computeSeriesChange'

describe(computeWeeklyAverageChange.name, () => {
  it('compares the first and the last week, not two single days', () => {
    // A one-day spike on the first day would make a day-to-day change
    // read -90%; averaged, the weeks are 25 and 20.
    const firstWeek = [100, 10, 10, 10, 10, 20, 15]
    const lastWeek = [20, 20, 20, 20, 20, 20, 20]
    expect(computeWeeklyAverageChange([...firstWeek, ...lastWeek])).toEqual(
      20 / 25 - 1,
    )
  })

  it('skips days without data', () => {
    const values = [null, ...Array(7).fill(10), null, ...Array(7).fill(15)]
    expect(computeWeeklyAverageChange(values)).toEqual(0.5)
  })

  it('compares the weeks the sparkline draws', () => {
    // The sparkline drops the leftover day at the start, and its last week
    // holds the unsynced day.
    const values = [100, ...Array(7).fill(10), ...Array(6).fill(20), null]
    expect(computeWeeklyAverageChange(values)).toEqual(1)
  })

  it('has no change for a series shorter than two weeks', () => {
    expect(computeWeeklyAverageChange(Array(13).fill(10))).toEqual(undefined)
  })

  it('has no change from a first week of zeros', () => {
    const values = [...Array(7).fill(0), ...Array(7).fill(5)]
    expect(computeWeeklyAverageChange(values)).toEqual(undefined)
  })
})
