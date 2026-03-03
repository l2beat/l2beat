import { expect } from 'earl'
import { evaluateQualitySignals } from './InteropAggregationQualityGate'

describe(evaluateQualitySignals.name, () => {
  it('returns no reasons for stable candidate', () => {
    const result = evaluateQualitySignals({
      candidate: {
        transferCount: 1_050,
        identifiedCount: 1_000,
        srcVolumeUsd: 11_000_000,
        dstVolumeUsd: 11_000_000,
      },
      baseline: {
        transferCount: 1_000,
        identifiedCount: 960,
        srcVolumeUsd: 10_000_000,
        dstVolumeUsd: 10_000_000,
      },
      history: [
        {
          transferCount: 980,
          srcVolumeUsd: 9_900_000,
          dstVolumeUsd: 9_900_000,
        },
        {
          transferCount: 1_010,
          srcVolumeUsd: 10_200_000,
          dstVolumeUsd: 10_200_000,
        },
        {
          transferCount: 1_020,
          srcVolumeUsd: 10_150_000,
          dstVolumeUsd: 10_150_000,
        },
      ],
    })

    expect(result).toEqual([])
  })

  it('flags hard-cap volume spikes', () => {
    const result = evaluateQualitySignals({
      candidate: {
        transferCount: 2_000,
        identifiedCount: 2_000,
        srcVolumeUsd: 1_500_000_000_000,
        dstVolumeUsd: 1_500_000_000_000,
      },
      baseline: {
        transferCount: 1_000,
        identifiedCount: 900,
        srcVolumeUsd: 10_000_000,
        dstVolumeUsd: 10_000_000,
      },
      history: [],
    })

    expect(result.some((x) => x.includes('Hard cap exceeded'))).toEqual(true)
  })

  it('flags count spikes against baseline', () => {
    const result = evaluateQualitySignals({
      candidate: {
        transferCount: 9_000,
        identifiedCount: 8_000,
        srcVolumeUsd: 12_000_000,
        dstVolumeUsd: 12_000_000,
      },
      baseline: {
        transferCount: 1_000,
        identifiedCount: 900,
        srcVolumeUsd: 10_000_000,
        dstVolumeUsd: 10_000_000,
      },
      history: [],
    })

    expect(result.some((x) => x.includes('Count spike vs baseline'))).toEqual(
      true,
    )
  })

  it('does not use volume checks when identification quality is low', () => {
    const result = evaluateQualitySignals({
      candidate: {
        transferCount: 1_100,
        identifiedCount: 100,
        srcVolumeUsd: 120_000_000,
        dstVolumeUsd: 120_000_000,
      },
      baseline: {
        transferCount: 1_000,
        identifiedCount: 900,
        srcVolumeUsd: 10_000_000,
        dstVolumeUsd: 10_000_000,
      },
      history: [],
    })

    expect(result.some((x) => x.includes('Volume spike vs baseline'))).toEqual(
      false,
    )
  })

  it('flags extreme z-score anomalies from history', () => {
    const result = evaluateQualitySignals({
      candidate: {
        transferCount: 100_000,
        identifiedCount: 100_000,
        srcVolumeUsd: 100_000_000,
        dstVolumeUsd: 100_000_000,
      },
      baseline: {
        transferCount: 1_000,
        identifiedCount: 990,
        srcVolumeUsd: 1_000_000,
        dstVolumeUsd: 1_000_000,
      },
      history: [
        { transferCount: 950, srcVolumeUsd: 950_000, dstVolumeUsd: 950_000 },
        { transferCount: 980, srcVolumeUsd: 980_000, dstVolumeUsd: 980_000 },
        {
          transferCount: 1_000,
          srcVolumeUsd: 1_000_000,
          dstVolumeUsd: 1_000_000,
        },
        {
          transferCount: 1_010,
          srcVolumeUsd: 1_010_000,
          dstVolumeUsd: 1_010_000,
        },
        { transferCount: 990, srcVolumeUsd: 990_000, dstVolumeUsd: 990_000 },
        {
          transferCount: 1_020,
          srcVolumeUsd: 1_020_000,
          dstVolumeUsd: 1_020_000,
        },
      ],
    })

    expect(
      result.some(
        (x) => x.includes('robust z-score') || x.includes('ratio spike'),
      ),
    ).toEqual(true)
  })

  it('flags significant src/dst volume drifts', () => {
    const result = evaluateQualitySignals({
      candidate: {
        transferCount: 1_500,
        identifiedCount: 1_400,
        srcVolumeUsd: 40_000_000,
        dstVolumeUsd: 10_000_000,
      },
      baseline: {
        transferCount: 1_450,
        identifiedCount: 1_400,
        srcVolumeUsd: 10_000_000,
        dstVolumeUsd: 9_800_000,
      },
      history: [
        {
          transferCount: 1_400,
          srcVolumeUsd: 9_800_000,
          dstVolumeUsd: 9_700_000,
        },
        {
          transferCount: 1_420,
          srcVolumeUsd: 10_200_000,
          dstVolumeUsd: 10_100_000,
        },
        {
          transferCount: 1_430,
          srcVolumeUsd: 10_300_000,
          dstVolumeUsd: 10_200_000,
        },
      ],
    })

    expect(result.some((x) => x.includes('Src/Dst volume drift'))).toEqual(true)
  })
})
