import { expect } from 'earl'
import { evaluateQualitySignals } from './InteropAggregationQualityGate'

describe(evaluateQualitySignals.name, () => {
  it('returns no reasons for stable candidate', () => {
    const result = evaluateQualitySignals({
      candidate: {
        transferCount: 1_050,
        identifiedCount: 1_000,
        volumeUsd: 11_000_000,
      },
      baseline: {
        transferCount: 1_000,
        identifiedCount: 960,
        volumeUsd: 10_000_000,
      },
      history: [
        { transferCount: 980, volumeUsd: 9_900_000 },
        { transferCount: 1_010, volumeUsd: 10_200_000 },
        { transferCount: 1_020, volumeUsd: 10_150_000 },
      ],
    })

    expect(result).toEqual([])
  })

  it('flags hard-cap volume spikes', () => {
    const result = evaluateQualitySignals({
      candidate: {
        transferCount: 2_000,
        identifiedCount: 2_000,
        volumeUsd: 1_500_000_000_000,
      },
      baseline: {
        transferCount: 1_000,
        identifiedCount: 900,
        volumeUsd: 10_000_000,
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
        volumeUsd: 12_000_000,
      },
      baseline: {
        transferCount: 1_000,
        identifiedCount: 900,
        volumeUsd: 10_000_000,
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
        volumeUsd: 120_000_000,
      },
      baseline: {
        transferCount: 1_000,
        identifiedCount: 900,
        volumeUsd: 10_000_000,
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
        volumeUsd: 100_000_000,
      },
      baseline: {
        transferCount: 1_000,
        identifiedCount: 990,
        volumeUsd: 1_000_000,
      },
      history: [
        { transferCount: 950, volumeUsd: 950_000 },
        { transferCount: 980, volumeUsd: 980_000 },
        { transferCount: 1_000, volumeUsd: 1_000_000 },
        { transferCount: 1_010, volumeUsd: 1_010_000 },
        { transferCount: 990, volumeUsd: 990_000 },
        { transferCount: 1_020, volumeUsd: 1_020_000 },
      ],
    })

    expect(
      result.some(
        (x) => x.includes('robust z-score') || x.includes('ratio spike'),
      ),
    ).toEqual(true)
  })
})
