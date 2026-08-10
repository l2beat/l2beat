import { expect } from 'earl'
import {
  describeSideMismatch,
  describeSignal,
  formatInteropChartReasons,
} from './formatter'

describe(describeSignal.name, () => {
  it('describes a severe count spike with delta and direction', () => {
    expect(
      describeSignal({
        metric: 'count',
        kind: 'ratioSpike',
        severity: 'severe',
        baseline: 100,
        current: 300,
        changePercent: 200,
      }),
    ).toEqual('Transfer count spiked (+200%, 100 → 300)')
  })

  it('describes a severe volume drop using compact dollars', () => {
    expect(
      describeSignal({
        metric: 'srcVolume',
        kind: 'ratioDrop',
        severity: 'severe',
        baseline: 1_000_000,
        current: 100_000,
        changePercent: -90,
      }),
    ).toEqual('Source volume dropped (-90%, $1M → $100K)')
  })

  it('labels the action by the sign of the change, not the signal kind', () => {
    // Robust-Z spike can fire on a sharp drop when prior history is tight.
    // The action word must follow the actual direction.
    expect(
      describeSignal({
        metric: 'srcVolume',
        kind: 'zScoreSpike',
        severity: 'severe',
        baseline: 143_000,
        current: 7_600,
        changePercent: -95,
      }),
    ).toEqual('Source volume dropped (-95%, $143K → $7.6K)')
  })

  it('describes a flat line', () => {
    expect(
      describeSignal({
        metric: 'count',
        kind: 'flatLine',
        severity: 'severe',
        baseline: 100,
        current: 100,
        changePercent: 0,
      }),
    ).toEqual('Transfer count was flat (100)')
  })
})

describe(describeSideMismatch.name, () => {
  it('renders mismatch percent with both sides', () => {
    expect(
      describeSideMismatch({
        diffPercent: 50,
        srcValueUsd: 2_000_000,
        dstValueUsd: 1_000_000,
        largerSideUsd: 2_000_000,
      }),
    ).toEqual('Src/Dst volume mismatch (50%, $2M src vs $1M dst)')
  })
})

describe(formatInteropChartReasons.name, () => {
  it('returns one entry per signal plus side mismatch', () => {
    const reasons = formatInteropChartReasons({
      signals: [
        {
          metric: 'count',
          kind: 'ratioSpike',
          severity: 'severe',
          baseline: 100,
          current: 300,
          changePercent: 200,
        },
        {
          metric: 'srcVolume',
          kind: 'ratioSpike',
          severity: 'severe',
          baseline: 100_000,
          current: 5_000_000,
          changePercent: 4_900,
        },
      ],
      sideMismatch: {
        diffPercent: 40,
        srcValueUsd: 2_000_000,
        dstValueUsd: 1_200_000,
        largerSideUsd: 2_000_000,
      },
    })

    expect(reasons).toHaveLength(3)
    expect(reasons[0]).toEqual('Transfer count spiked (+200%, 100 → 300)')
    expect(reasons[1]).toEqual('Source volume spiked (+4900%, $100K → $5M)')
    expect(reasons[2]).toEqual(
      'Src/Dst volume mismatch (40%, $2M src vs $1.2M dst)',
    )
  })

  it('collapses paired src+dst signals of the same kind into a single Volume row', () => {
    const reasons = formatInteropChartReasons({
      signals: [
        {
          metric: 'srcVolume',
          kind: 'ratioSpike',
          severity: 'severe',
          baseline: 100_000,
          current: 5_000_000,
          changePercent: 4_900,
        },
        {
          metric: 'dstVolume',
          kind: 'ratioSpike',
          severity: 'severe',
          baseline: 100_000,
          current: 5_000_000,
          changePercent: 4_900,
        },
      ],
      sideMismatch: null,
    })

    expect(reasons).toEqual(['Volume spiked (+4900%, $100K → $5M)'])
  })

  it('uses the larger collapsed side when merging paired drops', () => {
    const reasons = formatInteropChartReasons({
      signals: [
        {
          metric: 'srcVolume',
          kind: 'ratioDrop',
          severity: 'severe',
          baseline: 10_000_000,
          current: 0,
          changePercent: -100,
        },
        {
          metric: 'dstVolume',
          kind: 'ratioDrop',
          severity: 'severe',
          baseline: 100_000,
          current: 1,
          changePercent: -99.999,
        },
      ],
      sideMismatch: null,
    })

    expect(reasons).toEqual(['Volume dropped (-100%, $10M → $0)'])
  })

  it('keeps separate rows when src and dst have different signal kinds', () => {
    const reasons = formatInteropChartReasons({
      signals: [
        {
          metric: 'srcVolume',
          kind: 'ratioSpike',
          severity: 'severe',
          baseline: 100_000,
          current: 5_000_000,
          changePercent: 4_900,
        },
        {
          metric: 'dstVolume',
          kind: 'ratioDrop',
          severity: 'severe',
          baseline: 100_000,
          current: 500,
          changePercent: -99.5,
        },
      ],
      sideMismatch: null,
    })

    expect(reasons).toHaveLength(2)
    expect(reasons[0]).toEqual('Source volume spiked (+4900%, $100K → $5M)')
    expect(reasons[1]).toEqual(
      'Destination volume dropped (-100%, $100K → $500)',
    )
  })

  it('returns empty when there are no signals or mismatch', () => {
    expect(
      formatInteropChartReasons({ signals: [], sideMismatch: null }),
    ).toEqual([])
  })
})
