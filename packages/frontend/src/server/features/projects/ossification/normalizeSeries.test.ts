import { expect } from 'earl'
import { normalizeSeries } from './normalizeSeries'

describe(normalizeSeries.name, () => {
  it('keeps finite samples up to `to`, one per timestamp, ascending', () => {
    const series = [
      { timestamp: 3, value: 30 },
      { timestamp: 1, value: 10 },
      { timestamp: 2, value: Number.NaN },
      { timestamp: 1, value: 10 },
      { timestamp: 4, value: Number.POSITIVE_INFINITY },
      { timestamp: 6, value: 60 },
    ]

    expect(normalizeSeries(series, 5)).toEqual([
      { timestamp: 1, value: 10 },
      { timestamp: 3, value: 30 },
    ])
  })
})
