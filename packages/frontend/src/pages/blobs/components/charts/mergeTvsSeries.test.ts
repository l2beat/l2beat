import { expect } from 'earl'
import { mergeTvsSeries } from './mergeTvsSeries'

// Methodology: two raw TVS series, full data and settlement only, as the API
// returns them ([timestamp, native, canonical, external, ethPrice]), are merged
// and the points checked one by one.
describe(mergeTvsSeries.name, () => {
  it('sums native, canonical and external into one value per series', () => {
    const result = mergeTvsSeries(
      [[100, 1, 2, 3, 2000]],
      [[100, 10, 20, 30, 2000]],
    )

    expect(result).toEqual([
      { timestamp: 100, fullData: 6, settlementOnly: 60 },
    ])
  })

  it('keeps a series missing where it has no point', () => {
    const result = mergeTvsSeries(
      [
        [100, 1, 0, 0, 2000],
        [200, 2, 0, 0, 2000],
      ],
      [[200, 5, 0, 0, 2000]],
    )

    expect(result).toEqual([
      { timestamp: 100, fullData: 1, settlementOnly: null },
      { timestamp: 200, fullData: 2, settlementOnly: 5 },
    ])
  })

  it('keeps a point without data missing rather than zero', () => {
    const result = mergeTvsSeries([[100, null, null, null, null]], [])

    expect(result).toEqual([
      { timestamp: 100, fullData: null, settlementOnly: null },
    ])
  })

  it('orders the points by time', () => {
    const result = mergeTvsSeries(
      [[300, 3, 0, 0, 2000]],
      [
        [100, 1, 0, 0, 2000],
        [200, 2, 0, 0, 2000],
      ],
    )

    expect(result.map((p) => p.timestamp)).toEqual([100, 200, 300])
  })
})
