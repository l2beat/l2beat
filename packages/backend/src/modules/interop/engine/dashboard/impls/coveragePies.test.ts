import { expect } from 'earl'
import {
  buildInteropCoveragePieCharts,
  COVERAGE_PIE_COLLAPSE_THRESHOLD_PCT,
} from './coveragePies'

describe(buildInteropCoveragePieCharts.name, () => {
  it('splits each alias-resolved chain by support flag and collapses small slices', () => {
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
    expect(chart?.supportedCount).toEqual(82)
    expect(chart?.unsupportedCount).toEqual(11)
    expect(chart?.slices.map((slice) => slice.label)).toEqual([
      'monad',
      'ethereum',
      'monad (unsupported)',
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
        count: 50,
        isSupported: true,
        rawChains: ['Unknown_30390'],
      },
      {
        count: 30,
        isSupported: true,
        rawChains: ['ethereum'],
      },
      {
        count: 10,
        isSupported: false,
        rawChains: ['monad'],
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

  it('merges raw and aliased chain ids that share the same support flag', () => {
    const [chart] = buildInteropCoveragePieCharts([
      {
        id: 'solana-chart',
        title: 'Solana chart',
        centerLabel: 'Solana events',
        rows: [
          { chain: 'Unknown_792703809', isSupported: true, count: 90 },
          { chain: 'solana', isSupported: true, count: 5 },
          { chain: 'solana', isSupported: false, count: 5 },
        ],
      },
    ])

    expect(chart?.totalCount).toEqual(100)
    expect(chart?.supportedCount).toEqual(95)
    expect(chart?.unsupportedCount).toEqual(5)
    expect(
      chart?.slices.map((slice) => ({
        label: slice.label,
        count: slice.count,
        isSupported: slice.isSupported,
        rawChains: slice.rawChains,
      })),
    ).toEqual([
      {
        label: 'solana',
        count: 95,
        isSupported: true,
        rawChains: ['Unknown_792703809', 'solana'],
      },
      {
        label: 'solana (unsupported)',
        count: 5,
        isSupported: false,
        rawChains: ['solana'],
      },
    ])
  })
})
