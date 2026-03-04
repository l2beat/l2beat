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
          identifiedCount: 960,
          srcVolumeUsd: 9_900_000,
          dstVolumeUsd: 9_900_000,
        },
        {
          transferCount: 1_010,
          identifiedCount: 990,
          srcVolumeUsd: 10_200_000,
          dstVolumeUsd: 10_200_000,
        },
        {
          transferCount: 1_020,
          identifiedCount: 1_000,
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
        {
          transferCount: 950,
          identifiedCount: 940,
          srcVolumeUsd: 950_000,
          dstVolumeUsd: 950_000,
        },
        {
          transferCount: 980,
          identifiedCount: 970,
          srcVolumeUsd: 980_000,
          dstVolumeUsd: 980_000,
        },
        {
          transferCount: 1_000,
          identifiedCount: 990,
          srcVolumeUsd: 1_000_000,
          dstVolumeUsd: 1_000_000,
        },
        {
          transferCount: 1_010,
          identifiedCount: 1_000,
          srcVolumeUsd: 1_010_000,
          dstVolumeUsd: 1_010_000,
        },
        {
          transferCount: 990,
          identifiedCount: 980,
          srcVolumeUsd: 990_000,
          dstVolumeUsd: 990_000,
        },
        {
          transferCount: 1_020,
          identifiedCount: 1_010,
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
          identifiedCount: 1_390,
          srcVolumeUsd: 9_800_000,
          dstVolumeUsd: 9_700_000,
        },
        {
          transferCount: 1_420,
          identifiedCount: 1_410,
          srcVolumeUsd: 10_200_000,
          dstVolumeUsd: 10_100_000,
        },
        {
          transferCount: 1_430,
          identifiedCount: 1_420,
          srcVolumeUsd: 10_300_000,
          dstVolumeUsd: 10_200_000,
        },
      ],
    })

    expect(result.some((x) => x.includes('Src/Dst volume drift'))).toEqual(true)
  })

  it('merges src/dst volume window alerts into a single reason', () => {
    const result = evaluateQualitySignals({
      candidate: {
        transferCount: 1_000,
        identifiedCount: 950,
        srcVolumeUsd: 120_000,
        dstVolumeUsd: 120_000,
      },
      history: [
        {
          transferCount: 1_000,
          identifiedCount: 950,
          srcVolumeUsd: 2_000_000,
          dstVolumeUsd: 2_000_000,
        },
        {
          transferCount: 1_020,
          identifiedCount: 970,
          srcVolumeUsd: 2_100_000,
          dstVolumeUsd: 2_100_000,
        },
        {
          transferCount: 980,
          identifiedCount: 940,
          srcVolumeUsd: 1_950_000,
          dstVolumeUsd: 1_950_000,
        },
        {
          transferCount: 1_050,
          identifiedCount: 1_000,
          srcVolumeUsd: 2_050_000,
          dstVolumeUsd: 2_050_000,
        },
        {
          transferCount: 1_030,
          identifiedCount: 980,
          srcVolumeUsd: 2_200_000,
          dstVolumeUsd: 2_200_000,
        },
        {
          transferCount: 1_010,
          identifiedCount: 960,
          srcVolumeUsd: 2_150_000,
          dstVolumeUsd: 2_150_000,
        },
        {
          transferCount: 990,
          identifiedCount: 940,
          srcVolumeUsd: 2_000_000,
          dstVolumeUsd: 2_000_000,
        },
      ],
    })

    expect(
      result.includes('Volume ratio drop in recent window (Src+Dst)'),
    ).toEqual(true)
    expect(result.some((x) => x.endsWith('(Src)'))).toEqual(false)
    expect(result.some((x) => x.endsWith('(Dst)'))).toEqual(false)
  })

  it('does not report infinite robust z-score for near-flat count history', () => {
    const result = evaluateQualitySignals({
      candidate: {
        transferCount: 151,
        identifiedCount: 145,
        srcVolumeUsd: 2_000_000,
        dstVolumeUsd: 2_000_000,
      },
      history: [
        {
          transferCount: 150,
          identifiedCount: 145,
          srcVolumeUsd: 2_000_000,
          dstVolumeUsd: 2_000_000,
        },
        {
          transferCount: 150,
          identifiedCount: 145,
          srcVolumeUsd: 2_010_000,
          dstVolumeUsd: 2_010_000,
        },
        {
          transferCount: 150,
          identifiedCount: 145,
          srcVolumeUsd: 1_990_000,
          dstVolumeUsd: 1_990_000,
        },
        {
          transferCount: 150,
          identifiedCount: 145,
          srcVolumeUsd: 2_005_000,
          dstVolumeUsd: 2_005_000,
        },
        {
          transferCount: 150,
          identifiedCount: 145,
          srcVolumeUsd: 1_995_000,
          dstVolumeUsd: 1_995_000,
        },
        {
          transferCount: 150,
          identifiedCount: 145,
          srcVolumeUsd: 2_000_000,
          dstVolumeUsd: 2_000_000,
        },
        {
          transferCount: 150,
          identifiedCount: 145,
          srcVolumeUsd: 2_000_000,
          dstVolumeUsd: 2_000_000,
        },
      ],
    })

    expect(result.some((x) => x.includes('z-score=Infinity'))).toEqual(false)
  })

  it('does not apply count ratio window checks when history window is too short', () => {
    const result = evaluateQualitySignals({
      candidate: {
        transferCount: 10,
        identifiedCount: 10,
        srcVolumeUsd: 1_500_000,
        dstVolumeUsd: 1_500_000,
      },
      history: [
        {
          transferCount: 1_000,
          identifiedCount: 980,
          srcVolumeUsd: 1_600_000,
          dstVolumeUsd: 1_600_000,
        },
        {
          transferCount: 980,
          identifiedCount: 960,
          srcVolumeUsd: 1_550_000,
          dstVolumeUsd: 1_550_000,
        },
        {
          transferCount: 1_020,
          identifiedCount: 1_000,
          srcVolumeUsd: 1_520_000,
          dstVolumeUsd: 1_520_000,
        },
      ],
    })

    expect(
      result.some((x) => x.includes('Count ratio') || x.includes('Count robust')),
    ).toEqual(false)
  })

  it('triggers count ratio drop when history is long enough and median is high', () => {
    const result = evaluateQualitySignals({
      candidate: {
        transferCount: 10,
        identifiedCount: 10,
        srcVolumeUsd: 1_500_000,
        dstVolumeUsd: 1_500_000,
      },
      history: [
        {
          transferCount: 1_000,
          identifiedCount: 980,
          srcVolumeUsd: 1_600_000,
          dstVolumeUsd: 1_600_000,
        },
        {
          transferCount: 990,
          identifiedCount: 970,
          srcVolumeUsd: 1_550_000,
          dstVolumeUsd: 1_550_000,
        },
        {
          transferCount: 1_020,
          identifiedCount: 1_000,
          srcVolumeUsd: 1_520_000,
          dstVolumeUsd: 1_520_000,
        },
        {
          transferCount: 1_010,
          identifiedCount: 990,
          srcVolumeUsd: 1_510_000,
          dstVolumeUsd: 1_510_000,
        },
        {
          transferCount: 980,
          identifiedCount: 960,
          srcVolumeUsd: 1_580_000,
          dstVolumeUsd: 1_580_000,
        },
        {
          transferCount: 1_030,
          identifiedCount: 1_010,
          srcVolumeUsd: 1_630_000,
          dstVolumeUsd: 1_630_000,
        },
        {
          transferCount: 1_000,
          identifiedCount: 980,
          srcVolumeUsd: 1_590_000,
          dstVolumeUsd: 1_590_000,
        },
      ],
    })

    expect(result.includes('Count ratio drop in recent window')).toEqual(true)
  })

  it('ignores low-identification history points for volume window checks', () => {
    const result = evaluateQualitySignals({
      candidate: {
        transferCount: 1_000,
        identifiedCount: 980,
        srcVolumeUsd: 1_200_000,
        dstVolumeUsd: 1_200_000,
      },
      history: [
        {
          transferCount: 1_000,
          identifiedCount: 0,
          srcVolumeUsd: 5_000_000,
          dstVolumeUsd: 5_000_000,
        },
        {
          transferCount: 980,
          identifiedCount: 0,
          srcVolumeUsd: 4_500_000,
          dstVolumeUsd: 4_500_000,
        },
        {
          transferCount: 1_010,
          identifiedCount: 0,
          srcVolumeUsd: 4_800_000,
          dstVolumeUsd: 4_800_000,
        },
        {
          transferCount: 1_020,
          identifiedCount: 0,
          srcVolumeUsd: 5_200_000,
          dstVolumeUsd: 5_200_000,
        },
        {
          transferCount: 990,
          identifiedCount: 0,
          srcVolumeUsd: 4_900_000,
          dstVolumeUsd: 4_900_000,
        },
        {
          transferCount: 995,
          identifiedCount: 0,
          srcVolumeUsd: 5_100_000,
          dstVolumeUsd: 5_100_000,
        },
        {
          transferCount: 1_005,
          identifiedCount: 0,
          srcVolumeUsd: 4_700_000,
          dstVolumeUsd: 4_700_000,
        },
      ],
    })

    expect(result.some((x) => x.includes('Volume ratio'))).toEqual(false)
    expect(result.some((x) => x.includes('Volume robust z-score'))).toEqual(
      false,
    )
  })

  it('skips baseline volume comparison when baseline identification quality is low', () => {
    const result = evaluateQualitySignals({
      candidate: {
        transferCount: 1_000,
        identifiedCount: 990,
        srcVolumeUsd: 15_000_000,
        dstVolumeUsd: 15_000_000,
      },
      baseline: {
        transferCount: 1_000,
        identifiedCount: 0,
        srcVolumeUsd: 1_000_000,
        dstVolumeUsd: 1_000_000,
      },
      history: [],
    })

    expect(result.some((x) => x.includes('Volume spike vs baseline'))).toEqual(
      false,
    )
    expect(result.some((x) => x.includes('Volume drop vs baseline'))).toEqual(
      false,
    )
  })
})
