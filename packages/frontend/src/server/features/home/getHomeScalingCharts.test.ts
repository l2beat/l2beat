import { expect } from 'earl'
import { mergeSeriesByTimestamp } from './getHomeScalingCharts'

describe(mergeSeriesByTimestamp.name, () => {
  it('zips values from both series by timestamp', () => {
    expect(
      mergeSeriesByTimestamp(
        [
          { timestamp: 1, value: 10 },
          { timestamp: 2, value: 20 },
        ],
        [
          { timestamp: 1, value: 100 },
          { timestamp: 2, value: 200 },
        ],
      ),
    ).toEqual([
      [1, 10, 100],
      [2, 20, 200],
    ])
  })

  it('fills null for timestamps missing from one series', () => {
    expect(
      mergeSeriesByTimestamp(
        [{ timestamp: 1, value: 10 }],
        [{ timestamp: 2, value: 200 }],
      ),
    ).toEqual([
      [1, 10, null],
      [2, null, 200],
    ])
  })

  it('sorts rows by timestamp', () => {
    expect(
      mergeSeriesByTimestamp(
        [
          { timestamp: 3, value: 30 },
          { timestamp: 1, value: 10 },
        ],
        [{ timestamp: 2, value: 200 }],
      ),
    ).toEqual([
      [1, 10, null],
      [2, null, 200],
      [3, 30, null],
    ])
  })

  it('preserves null values present in the input series', () => {
    expect(
      mergeSeriesByTimestamp(
        [{ timestamp: 1, value: null }],
        [{ timestamp: 1, value: 100 }],
      ),
    ).toEqual([[1, null, 100]])
  })

  it('returns an empty chart for empty inputs', () => {
    expect(mergeSeriesByTimestamp([], [])).toEqual([])
  })
})
