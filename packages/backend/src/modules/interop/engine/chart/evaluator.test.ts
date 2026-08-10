import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { evaluateInteropChart, type SeriesPoint } from './evaluator'

describe(evaluateInteropChart.name, () => {
  const base = UnixTime.toStartOf(UnixTime(20 * UnixTime.DAY), 'day')

  describe('baseline floor', () => {
    it('suppresses count signal when baseline mean is below 10/day', () => {
      // baseline avg = 1/day, candidate jumps to 5 — should not fire
      const series = countSeries([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 5])
      const result = evaluateInteropChart(series)
      expect(result.signals.filter((s) => s.metric === 'count')).toEqual([])
    })

    it('suppresses count signal even on extreme jump when baseline is sparse', () => {
      const series = countSeries([3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 300])
      const result = evaluateInteropChart(series)
      expect(result.signals.filter((s) => s.metric === 'count')).toEqual([])
    })

    it('fires count signal when baseline mean clears the floor', () => {
      const series = countSeries([
        100, 110, 90, 105, 95, 100, 98, 102, 101, 99, 100, 97, 103, 5_000,
      ])
      const result = evaluateInteropChart(series)
      const count = result.signals.find((s) => s.metric === 'count')
      expect(count).not.toBeNullish()
      expect(count?.severity).toEqual('severe')
    })

    it('suppresses volume signal when baseline volume is below $10k/day', () => {
      const series = volumeSeries(
        Array.from({ length: 14 }, () => 100),
        Array.from({ length: 13 }, () => 100).concat([10_000_000]),
        100,
      )
      const result = evaluateInteropChart(series)
      expect(result.signals.filter((s) => s.metric === 'srcVolume')).toEqual([])
    })
  })

  describe('flat line', () => {
    it('flags identical last 3 days for count', () => {
      // Median (300) must clear the flat-line relevance floor of 250.
      const series = countSeries([
        300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300,
      ])
      const result = evaluateInteropChart(series)
      const count = result.signals.find((s) => s.metric === 'count')
      expect(count?.kind).toEqual('flatLine')
      expect(count?.severity).toEqual('severe')
    })

    it('does not flag flat line when the last 3 days differ', () => {
      const series = countSeries([
        300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 150,
      ])
      const result = evaluateInteropChart(series)
      const count = result.signals.find((s) => s.metric === 'count')
      expect(count?.kind).not.toEqual('flatLine')
    })
  })

  describe('ratio drops and spikes', () => {
    it('flags a near-total ratio drop in count', () => {
      // Baseline median (~300) clears the count relevance floor of 250.
      const series = countSeries([
        300, 310, 290, 305, 295, 300, 298, 302, 301, 299, 300, 297, 303, 3,
      ])
      const result = evaluateInteropChart(series)
      const count = result.signals.find((s) => s.metric === 'count')
      expect(count?.kind).toEqual('ratioDrop')
      expect(count?.severity).toEqual('severe')
    })

    it('flags a 10x+ ratio spike in count', () => {
      const series = countSeries([
        100, 110, 90, 105, 95, 100, 98, 102, 101, 99, 100, 97, 103, 5_000,
      ])
      const result = evaluateInteropChart(series)
      const count = result.signals.find((s) => s.metric === 'count')
      expect(count?.kind).toEqual('ratioSpike')
      expect(count?.severity).toEqual('severe')
    })

    it('flags a 30x+ ratio spike in src volume', () => {
      const series = volumeSeries(
        Array.from({ length: 14 }, () => 100),
        [
          100_000, 105_000, 95_000, 102_000, 98_000, 100_000, 101_000, 99_000,
          100_000, 102_000, 98_000, 99_000, 101_000, 20_000_000,
        ],
        100_000,
      )
      const result = evaluateInteropChart(series)
      const src = result.signals.find((s) => s.metric === 'srcVolume')
      expect(src?.kind).toEqual('ratioSpike')
      expect(src?.severity).toEqual('severe')
    })

    it('does not flag a 5x volume spike (under 30x threshold) as ratio spike', () => {
      const series = volumeSeries(
        Array.from({ length: 14 }, () => 100),
        [
          100_000, 105_000, 95_000, 102_000, 98_000, 100_000, 101_000, 99_000,
          100_000, 102_000, 98_000, 99_000, 101_000, 500_000,
        ],
        100_000,
      )
      const result = evaluateInteropChart(series)
      const src = result.signals.find((s) => s.metric === 'srcVolume')
      expect(src?.kind).not.toEqual('ratioSpike')
    })
  })

  describe('z-score', () => {
    it('flags severe spike when classic z-score crosses the classic threshold', () => {
      const series = countSeries([
        100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
        1_000_000,
      ])
      const result = evaluateInteropChart(series)
      const count = result.signals.find((s) => s.metric === 'count')
      expect(count?.severity).toEqual('severe')
    })

    it('does not emit anything for a moderate robust-Z anomaly', () => {
      // Tight baseline + a small jump — moderate tier is gone, so nothing
      // should fire here.
      const series = countSeries([
        95, 100, 105, 95, 100, 105, 95, 100, 105, 95, 100, 105, 95, 145,
      ])
      const result = evaluateInteropChart(series)
      const count = result.signals.find((s) => s.metric === 'count')
      expect(count).toBeNullish()
    })
  })

  describe('side mismatch', () => {
    it('flags when diff >= 50% and larger side >= $2M', () => {
      const series = volumeSeries(
        Array.from({ length: 14 }, () => 100),
        Array.from({ length: 13 }, () => 1_500_000).concat([2_000_000]),
        Array.from({ length: 13 }, () => 1_500_000).concat([1_000_000]),
      )
      const result = evaluateInteropChart(series)
      expect(result.sideMismatch?.diffPercent).toEqual(50)
      expect(result.sideMismatch?.largerSideUsd).toEqual(2_000_000)
    })

    it('does not flag when below the $2M floor', () => {
      // 60% diff would clear the percentage gate, but the larger side
      // ($1.9M) is below the $2M materiality floor.
      const series = volumeSeries(
        Array.from({ length: 14 }, () => 100),
        Array.from({ length: 14 }, () => 1_900_000),
        Array.from({ length: 14 }, () => 760_000),
      )
      const result = evaluateInteropChart(series)
      expect(result.sideMismatch).toEqual(null)
    })

    it('does not flag when one side is zero', () => {
      const series = volumeSeries(
        Array.from({ length: 14 }, () => 100),
        Array.from({ length: 14 }, () => 2_000_000),
        Array.from({ length: 14 }, () => 0),
      )
      const result = evaluateInteropChart(series)
      expect(result.sideMismatch).toEqual(null)
    })

    it('does not flag when diff is below 50%', () => {
      // Larger side ($2M) clears the materiality floor, but the 45% diff is
      // below the percentage gate.
      const series = volumeSeries(
        Array.from({ length: 14 }, () => 100),
        Array.from({ length: 14 }, () => 2_000_000),
        Array.from({ length: 14 }, () => 1_100_000),
      )
      const result = evaluateInteropChart(series)
      expect(result.sideMismatch).toEqual(null)
    })
  })

  describe('volume reliability gate', () => {
    it('suppresses all volume signals when candidate identification rate is below 50%', () => {
      const points: SeriesPoint[] = Array.from({ length: 13 }, (_, i) =>
        point(i, {
          transferCount: 100,
          identifiedCount: 95,
          srcVolumeUsd: 100_000,
          dstVolumeUsd: 100_000,
        }),
      )
      points.push(
        point(13, {
          transferCount: 100,
          identifiedCount: 10,
          srcVolumeUsd: 10_000_000,
          dstVolumeUsd: 10_000_000,
        }),
      )
      const result = evaluateInteropChart(points)
      expect(
        result.signals.filter(
          (s) => s.metric === 'srcVolume' || s.metric === 'dstVolume',
        ),
      ).toEqual([])
    })

    it('still emits the count signal even when volume is gated out', () => {
      const points: SeriesPoint[] = Array.from({ length: 13 }, (_, i) =>
        point(i, {
          transferCount: 100,
          identifiedCount: 95,
          srcVolumeUsd: 100_000,
          dstVolumeUsd: 100_000,
        }),
      )
      points.push(
        point(13, {
          transferCount: 10_000,
          identifiedCount: 100,
          srcVolumeUsd: 10_000_000,
          dstVolumeUsd: 10_000_000,
        }),
      )
      const result = evaluateInteropChart(points)
      const count = result.signals.find((s) => s.metric === 'count')
      expect(count?.severity).toEqual('severe')
      expect(
        result.signals.filter(
          (s) => s.metric === 'srcVolume' || s.metric === 'dstVolume',
        ),
      ).toEqual([])
    })
  })

  describe('relevance gate', () => {
    it('suppresses a volume spike on a lane below the absolute USD floor', () => {
      // Baseline (~$150K) clears the $100K/day mean floor, and the tight
      // baseline + jump to $900K trips classic-Z — but $900K is below the $1M
      // materiality floor and we pass no bridge total, so share-of-bridge
      // cannot rescue it.
      const baselineVolumes = [
        148_000, 152_000, 150_000, 149_000, 151_000, 150_000, 148_000, 152_000,
        149_000, 151_000, 150_000, 149_000, 151_000,
      ]
      const series = volumeSeries(
        Array.from({ length: 14 }, () => 100),
        baselineVolumes.concat([900_000]),
        baselineVolumes.concat([900_000]),
      )
      const result = evaluateInteropChart(series)
      const src = result.signals.find((s) => s.metric === 'srcVolume')
      expect(src).toBeNullish()
    })

    it('suppresses a volume drop when the baseline lane is immaterial within the bridge', () => {
      // Lane baseline is $50K — above the per-day floor but only 0.5% of
      // a $10M bridge. A 100% drop should not page.
      const series = volumeSeries(
        Array.from({ length: 14 }, () => 100),
        Array.from({ length: 13 }, () => 50_000).concat([0]),
        Array.from({ length: 13 }, () => 50_000).concat([0]),
      )
      const result = evaluateInteropChart(series, {
        transferCount: 100_000,
        volumeUsd: 10_000_000,
      })
      const src = result.signals.find((s) => s.metric === 'srcVolume')
      expect(src).toBeNullish()
    })

    it('keeps a volume signal that clears the bridge-share gate', () => {
      // Lane lands at $600K — below the $1M absolute floor — but represents
      // 12% of a $5M bridge, above the 10% share gate. Baseline (~$120K)
      // clears the $100K/day floor; tight baseline + log jump trips classic-Z.
      const baselineVolumes = [
        118_000, 122_000, 120_000, 119_000, 121_000, 120_000, 118_000, 122_000,
        119_000, 121_000, 120_000, 119_000, 121_000,
      ]
      const series = volumeSeries(
        Array.from({ length: 14 }, () => 100),
        baselineVolumes.concat([600_000]),
        baselineVolumes.concat([600_000]),
      )
      const result = evaluateInteropChart(series, {
        transferCount: 1_000,
        volumeUsd: 5_000_000,
      })
      const src = result.signals.find((s) => s.metric === 'srcVolume')
      expect(src?.kind).toEqual('zScoreSpike')
    })

    it('suppresses a flat line on a low-count lane', () => {
      // Three identical days at 50 transfers — clears the baseline floor
      // (50 > 10/day) but the median is below the flat-line relevance
      // floor of 100, so it should not alert.
      const series = countSeries([
        50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50,
      ])
      const result = evaluateInteropChart(series)
      const count = result.signals.find((s) => s.metric === 'count')
      expect(count).toBeNullish()
    })
  })

  describe('real-world scenarios', () => {
    it('fires on the legitimate volume spike for layerzero polygonpos→ethereum', () => {
      // Baseline two-sided lane volumes range from $230K to $2.4M; the
      // candidate day jumps to ~$19M, ~35x the baseline median.
      const counts = [18, 28, 10, 22, 23, 36, 35, 26, 35, 19, 30, 24, 29, 32]
      const srcVolumes = [
        453_628, 721_302, 231_492, 416_757, 539_322, 1_931_100, 2_358_880,
        246_215, 1_798_860, 398_666, 301_266, 635_919, 1_560_370, 19_084_500,
      ]
      const dstVolumes = [
        453_652, 721_376, 231_492, 416_829, 539_300, 1_931_120, 2_358_940,
        246_208, 1_798_650, 398_739, 301_336, 635_887, 1_560_280, 19_089_200,
      ]
      const series = volumeSeries(counts, srcVolumes, dstVolumes)
      const result = evaluateInteropChart(series, {
        transferCount: 4_971,
        volumeUsd: 493_321_000,
      })
      const src = result.signals.find((s) => s.metric === 'srcVolume')
      const dst = result.signals.find((s) => s.metric === 'dstVolume')
      expect(src?.kind).toEqual('ratioSpike')
      expect(dst?.kind).toEqual('ratioSpike')
      expect(result.sideMismatch).toEqual(null)
    })

    it('fires on the legitimate volume drop for circlegateway ethereum→polygonpos', () => {
      // Baseline two-sided lane volumes $1M-$7M; candidate collapses to
      // ~$22K — a 98.5% drop, well past the 98% drop threshold.
      const counts = [
        95, 104, 85, 118, 78, 46, 90, 139, 269, 275, 236, 198, 75, 15,
      ]
      const volumes = [
        3_472_660, 7_234_100, 3_638_220, 7_071_300, 4_455_340, 2_499_480,
        1_475_200, 1_303_910, 1_117_900, 1_230_350, 1_159_630, 1_373_830,
        243_377, 21_808,
      ]
      const series = volumeSeries(counts, volumes, volumes)
      const result = evaluateInteropChart(series, {
        transferCount: 1_040,
        volumeUsd: 59_513_600,
      })
      const src = result.signals.find((s) => s.metric === 'srcVolume')
      const dst = result.signals.find((s) => s.metric === 'dstVolume')
      expect(src?.kind).toEqual('ratioDrop')
      expect(dst?.kind).toEqual('ratioDrop')
    })

    it('stays silent on across base→bsc — a "moderate" noisy case from the old policy', () => {
      // Old policy flagged this lane as a "moderate" count spike at +33%
      // (313 → 416). Volumes drift around $130K-$270K. Nothing here is
      // an extremum, so the new policy should keep quiet.
      const counts = [
        310, 228, 211, 324, 307, 383, 326, 320, 311, 314, 327, 362, 349, 416,
      ]
      const srcVolumes = [
        126_459, 67_887, 214_260, 126_571, 158_633, 247_725, 267_804, 213_252,
        203_659, 144_967, 231_425, 217_051, 171_430, 275_284,
      ]
      const dstVolumes = [
        126_369, 67_835, 214_183, 126_477, 158_574, 247_614, 267_695, 213_133,
        203_561, 144_841, 231_289, 216_954, 171_337, 275_169,
      ]
      const series = volumeSeries(counts, srcVolumes, dstVolumes)
      const result = evaluateInteropChart(series, {
        transferCount: 15_076,
        volumeUsd: 57_833_300,
      })
      expect(result.signals).toEqual([])
      expect(result.sideMismatch).toEqual(null)
    })
  })

  describe('insufficient history', () => {
    it('returns no signals when fewer than 3 non-zero history days', () => {
      const series = countSeries([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 1_000,
      ])
      const result = evaluateInteropChart(series)
      expect(result.signals).toEqual([])
    })

    it('returns no signals for empty series', () => {
      expect(evaluateInteropChart([])).toEqual({
        signals: [],
        sideMismatch: null,
      })
    })
  })

  function point(
    dayOffset: number,
    overrides: Partial<SeriesPoint> = {},
  ): SeriesPoint {
    return {
      day: base + dayOffset * UnixTime.DAY,
      transferCount: 0,
      identifiedCount: 0,
      srcVolumeUsd: 0,
      dstVolumeUsd: 0,
      ...overrides,
    }
  }

  function countSeries(counts: number[]): SeriesPoint[] {
    return counts.map((count, i) =>
      point(i, {
        transferCount: count,
        identifiedCount: Math.round(count * 0.95),
      }),
    )
  }

  function volumeSeries(
    counts: number[],
    srcVolumes: number[],
    dstVolumesOrConst: number[] | number,
  ): SeriesPoint[] {
    const dstVolumes =
      typeof dstVolumesOrConst === 'number'
        ? Array.from({ length: counts.length }, () => dstVolumesOrConst)
        : dstVolumesOrConst
    return counts.map((count, i) =>
      point(i, {
        transferCount: count,
        identifiedCount: Math.round(count * 0.95),
        srcVolumeUsd: srcVolumes[i] ?? 0,
        dstVolumeUsd: dstVolumes[i] ?? 0,
      }),
    )
  }
})
