import { expect } from 'earl'
import {
  describeSideMismatch,
  describeSignal,
  formatAnomalyReasons,
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

  it('describes a moderate dst-volume spike with the "moderately" qualifier', () => {
    expect(
      describeSignal({
        metric: 'dstVolume',
        kind: 'zScoreSpike',
        severity: 'moderate',
        baseline: 1_000_000,
        current: 1_300_000,
        changePercent: 30,
      }),
    ).toEqual('Destination volume moderately spiked (+30%, $1M → $1.3M)')
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

describe(formatAnomalyReasons.name, () => {
  it('returns one entry per signal plus side mismatch', () => {
    const reasons = formatAnomalyReasons({
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
          kind: 'zScoreSpike',
          severity: 'moderate',
          baseline: 1_000_000,
          current: 1_300_000,
          changePercent: 30,
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
    expect(reasons[2]).toEqual(
      'Src/Dst volume mismatch (40%, $2M src vs $1.2M dst)',
    )
  })

  it('returns empty when there are no signals or mismatch', () => {
    expect(formatAnomalyReasons({ signals: [], sideMismatch: null })).toEqual(
      [],
    )
  })
})
