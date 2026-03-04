import { expect } from 'earl'
import { evaluateQualitySignals } from './InteropAggregationQualityGate'

describe(evaluateQualitySignals.name, () => {
  describe('single-signal cases', () => {
    it('flags src hard cap breach', () => {
      const result = evaluateQualitySignals({
        candidate: point({ srcVolumeUsd: 150_000_000_000 }),
        history: [],
      })

      expect(hasReason(result, 'Hard cap exceeded (src)')).toEqual(true)
    })

    it('flags dst hard cap breach', () => {
      const result = evaluateQualitySignals({
        candidate: point({ dstVolumeUsd: 120_000_000_000 }),
        history: [],
      })

      expect(hasReason(result, 'Hard cap exceeded (dst)')).toEqual(true)
    })

    it('flags count spike vs previous point', () => {
      const result = evaluateQualitySignals({
        candidate: point({ transferCount: 9_000 }),
        history: [point({ transferCount: 1_000 })],
      })

      expect(hasReason(result, 'Count spike vs previous')).toEqual(true)
    })

    it('flags count drop vs previous point', () => {
      const result = evaluateQualitySignals({
        candidate: point({ transferCount: 100 }),
        history: [point({ transferCount: 1_000 })],
      })

      expect(hasReason(result, 'Count drop vs previous')).toEqual(true)
    })

    it('flags src volume spike vs previous point', () => {
      const result = evaluateQualitySignals({
        candidate: point({ srcVolumeUsd: 20_000_000 }),
        history: [point({ srcVolumeUsd: 2_000_000 })],
      })

      expect(hasReason(result, 'Src volume spike vs previous')).toEqual(true)
    })

    it('flags src volume drop vs previous point', () => {
      const result = evaluateQualitySignals({
        candidate: point({ srcVolumeUsd: 200_000 }),
        history: [point({ srcVolumeUsd: 2_000_000 })],
      })

      expect(hasReason(result, 'Src volume drop vs previous')).toEqual(true)
    })

    it('flags dst volume spike vs previous point', () => {
      const result = evaluateQualitySignals({
        candidate: point({ dstVolumeUsd: 20_000_000 }),
        history: [point({ dstVolumeUsd: 2_000_000 })],
      })

      expect(hasReason(result, 'Dst volume spike vs previous')).toEqual(true)
    })

    it('flags dst volume drop vs previous point', () => {
      const result = evaluateQualitySignals({
        candidate: point({ dstVolumeUsd: 200_000 }),
        history: [point({ dstVolumeUsd: 2_000_000 })],
      })

      expect(hasReason(result, 'Dst volume drop vs previous')).toEqual(true)
    })

    it('flags count robust z-score anomaly', () => {
      const result = evaluateQualitySignals({
        candidate: point({ transferCount: 20_000 }),
        history: [
          point({ transferCount: 900 }),
          point({ transferCount: 980 }),
          point({ transferCount: 1_040 }),
          point({ transferCount: 1_000 }),
          point({ transferCount: 1_100 }),
          point({ transferCount: 950 }),
        ],
      })

      expect(hasReason(result, 'Count robust z-score=')).toEqual(true)
    })

    it('flags src volume robust z-score anomaly', () => {
      const result = evaluateQualitySignals({
        candidate: point({ srcVolumeUsd: 70_000_000 }),
        history: [
          point({ srcVolumeUsd: 1_900_000 }),
          point({ srcVolumeUsd: 2_050_000 }),
          point({ srcVolumeUsd: 2_150_000 }),
          point({ srcVolumeUsd: 2_000_000 }),
          point({ srcVolumeUsd: 2_120_000 }),
          point({ srcVolumeUsd: 1_970_000 }),
        ],
      })

      expect(hasReason(result, 'Src volume robust z-score=')).toEqual(true)
    })

    it('flags dst volume robust z-score anomaly', () => {
      const result = evaluateQualitySignals({
        candidate: point({ dstVolumeUsd: 65_000_000 }),
        history: [
          point({ dstVolumeUsd: 1_940_000 }),
          point({ dstVolumeUsd: 2_020_000 }),
          point({ dstVolumeUsd: 2_110_000 }),
          point({ dstVolumeUsd: 2_030_000 }),
          point({ dstVolumeUsd: 2_140_000 }),
          point({ dstVolumeUsd: 1_980_000 }),
        ],
      })

      expect(hasReason(result, 'Dst volume robust z-score=')).toEqual(true)
    })

    it('flags high src/dst drift', () => {
      const result = evaluateQualitySignals({
        candidate: point({
          srcVolumeUsd: 4_000_000,
          dstVolumeUsd: 1_000_000,
        }),
        history: [point({ srcVolumeUsd: 2_000_000, dstVolumeUsd: 2_000_000 })],
      })

      expect(hasReason(result, 'Src/Dst volume drift is high')).toEqual(true)
    })
  })

  describe('mixed-signal cases', () => {
    it('combines hard cap, count spike, volume spikes and drift', () => {
      const result = evaluateQualitySignals({
        candidate: point({
          transferCount: 10_000,
          identifiedCount: 9_500,
          srcVolumeUsd: 200_000_000_000,
          dstVolumeUsd: 80_000_000_000,
        }),
        history: [
          point({
            transferCount: 1_000,
            srcVolumeUsd: 2_000_000,
            dstVolumeUsd: 2_000_000,
          }),
        ],
      })

      expect(hasReason(result, 'Hard cap exceeded (src)')).toEqual(true)
      expect(hasReason(result, 'Count spike vs previous')).toEqual(true)
      expect(hasReason(result, 'Src volume spike vs previous')).toEqual(true)
      expect(hasReason(result, 'Dst volume spike vs previous')).toEqual(true)
      expect(hasReason(result, 'Src/Dst volume drift is high')).toEqual(true)
    })

    it('combines count drop, src drop, dst spike and drift', () => {
      const result = evaluateQualitySignals({
        candidate: point({
          transferCount: 100,
          srcVolumeUsd: 200_000,
          dstVolumeUsd: 20_000_000,
        }),
        history: [
          point({
            transferCount: 1_000,
            srcVolumeUsd: 2_000_000,
            dstVolumeUsd: 2_000_000,
          }),
        ],
      })

      expect(hasReason(result, 'Count drop vs previous')).toEqual(true)
      expect(hasReason(result, 'Src volume drop vs previous')).toEqual(true)
      expect(hasReason(result, 'Dst volume spike vs previous')).toEqual(true)
      expect(hasReason(result, 'Src/Dst volume drift is high')).toEqual(true)
    })

    it('combines robust z-score anomalies for count, src volume and dst volume', () => {
      const result = evaluateQualitySignals({
        candidate: point({
          transferCount: 20_000,
          identifiedCount: 19_000,
          srcVolumeUsd: 60_000_000,
          dstVolumeUsd: 55_000_000,
        }),
        history: [
          point({
            transferCount: 900,
            srcVolumeUsd: 1_900_000,
            dstVolumeUsd: 1_940_000,
          }),
          point({
            transferCount: 980,
            srcVolumeUsd: 2_050_000,
            dstVolumeUsd: 2_020_000,
          }),
          point({
            transferCount: 1_040,
            srcVolumeUsd: 2_150_000,
            dstVolumeUsd: 2_110_000,
          }),
          point({
            transferCount: 1_000,
            srcVolumeUsd: 2_000_000,
            dstVolumeUsd: 2_030_000,
          }),
          point({
            transferCount: 1_100,
            srcVolumeUsd: 2_120_000,
            dstVolumeUsd: 2_140_000,
          }),
          point({
            transferCount: 950,
            srcVolumeUsd: 1_970_000,
            dstVolumeUsd: 1_980_000,
          }),
        ],
      })

      expect(hasReason(result, 'Count robust z-score=')).toEqual(true)
      expect(hasReason(result, 'Src volume robust z-score=')).toEqual(true)
      expect(hasReason(result, 'Dst volume robust z-score=')).toEqual(true)
    })
  })

  describe('guard cases', () => {
    it('returns no reasons for stable candidate', () => {
      const result = evaluateQualitySignals({
        candidate: point({
          transferCount: 1_040,
          identifiedCount: 990,
          srcVolumeUsd: 2_050_000,
          dstVolumeUsd: 2_020_000,
        }),
        history: [
          point({
            transferCount: 980,
            identifiedCount: 940,
            srcVolumeUsd: 1_950_000,
            dstVolumeUsd: 1_930_000,
          }),
          point({
            transferCount: 1_000,
            identifiedCount: 950,
            srcVolumeUsd: 2_000_000,
            dstVolumeUsd: 1_980_000,
          }),
          point({
            transferCount: 1_020,
            identifiedCount: 970,
            srcVolumeUsd: 2_040_000,
            dstVolumeUsd: 2_010_000,
          }),
        ],
      })

      expect(result).toEqual([])
    })

    it('skips volume analyzers when candidate identification quality is low', () => {
      const result = evaluateQualitySignals({
        candidate: point({
          transferCount: 1_000,
          identifiedCount: 100,
          srcVolumeUsd: 40_000_000,
          dstVolumeUsd: 10_000_000,
        }),
        history: [
          point({
            transferCount: 1_000,
            identifiedCount: 950,
            srcVolumeUsd: 2_000_000,
            dstVolumeUsd: 2_000_000,
          }),
        ],
      })

      expect(hasReason(result, 'Src volume spike vs previous')).toEqual(false)
      expect(hasReason(result, 'Dst volume spike vs previous')).toEqual(false)
      expect(hasReason(result, 'Src/Dst volume drift is high')).toEqual(false)
    })

    it('does not report infinite robust z-score values', () => {
      const result = evaluateQualitySignals({
        candidate: point({ transferCount: 151 }),
        history: [
          point({ transferCount: 150 }),
          point({ transferCount: 150 }),
          point({ transferCount: 150 }),
          point({ transferCount: 150 }),
          point({ transferCount: 150 }),
          point({ transferCount: 150 }),
        ],
      })

      expect(hasReason(result, 'z-score=Infinity')).toEqual(false)
    })
  })
})

function hasReason(reasons: string[], phrase: string): boolean {
  return reasons.some((reason) => reason.includes(phrase))
}

function point(
  overrides: Partial<{
    transferCount: number
    identifiedCount: number
    srcVolumeUsd: number
    dstVolumeUsd: number
  }> = {},
) {
  return {
    transferCount: 1_000,
    identifiedCount: 950,
    srcVolumeUsd: 2_000_000,
    dstVolumeUsd: 2_000_000,
    ...overrides,
  }
}
