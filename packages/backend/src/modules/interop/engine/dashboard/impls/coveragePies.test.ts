import { expect } from 'earl'
import {
  buildInteropCoveragePieCharts,
  COVERAGE_PIE_COLLAPSE_THRESHOLD_PCT,
} from './coveragePies'

describe(buildInteropCoveragePieCharts.name, () => {
  it('merges aliases and collapses small slices by support status', () => {
    const [chart] = buildInteropCoveragePieCharts([
      {
        id: 'test-chart',
        title: 'Test chart',
        centerLabel: 'Test events',
        rows: [
          { chain: 'Unknown_30390', isSupported: true, count: 50 },
          { chain: 'monad', isSupported: false, count: 10 },
          { chain: 'ethereum', isSupported: true, count: 30 },
          { chain: 'zora', isSupported: true, count: 1 },
          { chain: 'blast', isSupported: true, count: 1 },
          { chain: 'sonic', isSupported: false, count: 1 },
        ],
      },
    ])

    expect(chart).not.toBeNullish()
    expect(chart?.totalCount).toEqual(93)
    expect(chart?.supportedCount).toEqual(32)
    expect(chart?.unsupportedCount).toEqual(61)
    expect(chart?.slices.map((slice) => slice.label)).toEqual([
      'monad',
      'ethereum',
      `Other supported (<${COVERAGE_PIE_COLLAPSE_THRESHOLD_PCT}%, 2 chains)`,
      `Other unsupported (<${COVERAGE_PIE_COLLAPSE_THRESHOLD_PCT}%, 1 chains)`,
    ])
    expect(
      chart?.slices.map((slice) => ({
        count: slice.count,
        isSupported: slice.isSupported,
        rawChains: slice.rawChains,
      })),
    ).toEqual([
      {
        count: 60,
        isSupported: false,
        rawChains: ['Unknown_30390', 'monad'],
      },
      {
        count: 30,
        isSupported: true,
        rawChains: ['ethereum'],
      },
      {
        count: 2,
        isSupported: true,
        rawChains: ['blast', 'zora'],
      },
      {
        count: 1,
        isSupported: false,
        rawChains: ['sonic'],
      },
    ])
  })
})
