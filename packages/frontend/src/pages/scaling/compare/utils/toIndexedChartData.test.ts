import { expect } from 'earl'
import { toIndexedChartData } from './toIndexedChartData'

describe(toIndexedChartData.name, () => {
  it('rebases every series to 100 at the first point', () => {
    const { data, rebasedMidRange } = toIndexedChartData(
      [
        { timestamp: 1, big: 2000, small: 10 },
        { timestamp: 2, big: 3000, small: 25 },
        { timestamp: 3, big: 1000, small: 5 },
      ],
      ['big', 'small'],
    )

    expect(data).toEqual([
      { timestamp: 1, big: 100, small: 100 },
      { timestamp: 2, big: 150, small: 250 },
      { timestamp: 3, big: 50, small: 50 },
    ])
    expect(rebasedMidRange).toEqual({})
  })

  it('rebases a mid-range launch at its first data point and reports it', () => {
    const { data, rebasedMidRange } = toIndexedChartData(
      [
        { timestamp: 1, old: 200, fresh: null },
        { timestamp: 2, old: 300, fresh: 40 },
        { timestamp: 3, old: 400, fresh: 60 },
      ],
      ['old', 'fresh'],
    )

    expect(data).toEqual([
      { timestamp: 1, old: 100, fresh: null },
      { timestamp: 2, old: 150, fresh: 100 },
      { timestamp: 3, old: 200, fresh: 150 },
    ])
    expect(rebasedMidRange).toEqual({ fresh: 2 })
  })

  it('preserves gaps as nulls', () => {
    const { data } = toIndexedChartData(
      [
        { timestamp: 1, a: 50 },
        { timestamp: 2, a: null },
        { timestamp: 3, a: 75 },
      ],
      ['a'],
    )

    expect(data).toEqual([
      { timestamp: 1, a: 100 },
      { timestamp: 2, a: null },
      { timestamp: 3, a: 150 },
    ])
  })

  it('indexes leading zeros to 0 against the first positive value', () => {
    const { data, rebasedMidRange } = toIndexedChartData(
      [
        { timestamp: 1, a: 0 },
        { timestamp: 2, a: 20 },
        { timestamp: 3, a: 30 },
      ],
      ['a'],
    )

    expect(data).toEqual([
      { timestamp: 1, a: 0 },
      { timestamp: 2, a: 100 },
      { timestamp: 3, a: 150 },
    ])
    // Data was present from range start, so the base shift is not reported.
    expect(rebasedMidRange).toEqual({})
  })

  it('keeps a series without positive values null', () => {
    const { data, rebasedMidRange } = toIndexedChartData(
      [
        { timestamp: 1, a: 0 },
        { timestamp: 2, a: 0 },
      ],
      ['a'],
    )

    expect(data).toEqual([
      { timestamp: 1, a: null },
      { timestamp: 2, a: null },
    ])
    expect(rebasedMidRange).toEqual({})
  })

  it('handles empty data', () => {
    const { data, rebasedMidRange } = toIndexedChartData([], ['a'])

    expect(data).toEqual([])
    expect(rebasedMidRange).toEqual({})
  })
})
