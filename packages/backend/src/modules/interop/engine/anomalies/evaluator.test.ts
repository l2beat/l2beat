import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { evaluateAnomalies, type SeriesPoint } from './evaluator'

describe(evaluateAnomalies.name, () => {
  const base = UnixTime.toStartOf(UnixTime(20 * UnixTime.DAY), 'day')

  describe('baseline floor', () => {
    it('suppresses count signal when baseline mean is below 10/day', () => {
      // baseline avg = 1/day, candidate jumps to 5 — should not fire
      const series = countSeries([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 5])
      const result = evaluateAnomalies(series)
      expect(result.signals.filter((s) => s.metric === 'count')).toEqual([])
    })

    it('suppresses count signal even on extreme jump when baseline is sparse', () => {
      const series = countSeries([3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 300])
      const result = evaluateAnomalies(series)
      expect(result.signals.filter((s) => s.metric === 'count')).toEqual([])
    })

    it('fires count signal when baseline mean clears the floor', () => {
      const series = countSeries([
        100, 110, 90, 105, 95, 100, 98, 102, 101, 99, 100, 97, 103, 5_000,
      ])
      const result = evaluateAnomalies(series)
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
      const result = evaluateAnomalies(series)
      expect(result.signals.filter((s) => s.metric === 'srcVolume')).toEqual([])
    })
  })

  describe('flat line', () => {
    it('flags identical last 3 days for count', () => {
      const series = countSeries([
        100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
      ])
      const result = evaluateAnomalies(series)
      const count = result.signals.find((s) => s.metric === 'count')
      expect(count?.kind).toEqual('flatLine')
      expect(count?.severity).toEqual('severe')
    })

    it('does not flag flat line when the last 3 days differ', () => {
      const series = countSeries([
        100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 50,
      ])
      const result = evaluateAnomalies(series)
      const count = result.signals.find((s) => s.metric === 'count')
      expect(count?.kind).not.toEqual('flatLine')
    })
  })

  describe('ratio drops and spikes', () => {
    it('flags a sudden 90% ratio drop in count', () => {
      const series = countSeries([
        100, 110, 90, 105, 95, 100, 98, 102, 101, 99, 100, 97, 103, 5,
      ])
      const result = evaluateAnomalies(series)
      const count = result.signals.find((s) => s.metric === 'count')
      expect(count?.kind).toEqual('ratioDrop')
      expect(count?.severity).toEqual('severe')
    })

    it('flags a 90%+ ratio spike in count', () => {
      const series = countSeries([
        100, 110, 90, 105, 95, 100, 98, 102, 101, 99, 100, 97, 103, 250,
      ])
      const result = evaluateAnomalies(series)
      const count = result.signals.find((s) => s.metric === 'count')
      expect(count?.kind).toEqual('ratioSpike')
      expect(count?.severity).toEqual('severe')
    })

    it('flags a 10x ratio spike in src volume', () => {
      const series = volumeSeries(
        Array.from({ length: 14 }, () => 100),
        [
          100_000, 105_000, 95_000, 102_000, 98_000, 100_000, 101_000, 99_000,
          100_000, 102_000, 98_000, 99_000, 101_000, 20_000_000,
        ],
        100_000,
      )
      const result = evaluateAnomalies(series)
      const src = result.signals.find((s) => s.metric === 'srcVolume')
      expect(src?.kind).toEqual('ratioSpike')
      expect(src?.severity).toEqual('severe')
    })

    it('does not flag a 5x volume spike (under 10x threshold) as ratio spike', () => {
      const series = volumeSeries(
        Array.from({ length: 14 }, () => 100),
        [
          100_000, 105_000, 95_000, 102_000, 98_000, 100_000, 101_000, 99_000,
          100_000, 102_000, 98_000, 99_000, 101_000, 500_000,
        ],
        100_000,
      )
      const result = evaluateAnomalies(series)
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
      const result = evaluateAnomalies(series)
      const count = result.signals.find((s) => s.metric === 'count')
      expect(count?.severity).toEqual('severe')
    })

    it('flags moderate when robust z-score is in the warn band only', () => {
      // Tight baseline + a jump that lands robust-Z in (4, 6), below the
      // 1.9x ratio threshold and well under the classic-Z cap.
      const series = countSeries([
        95, 100, 105, 95, 100, 105, 95, 100, 105, 95, 100, 105, 95, 145,
      ])
      const result = evaluateAnomalies(series)
      const count = result.signals.find((s) => s.metric === 'count')
      expect(count).not.toBeNullish()
      expect(count?.severity).toEqual('moderate')
    })
  })

  describe('side mismatch', () => {
    it('flags when diff >= 30% and larger side >= $1M', () => {
      const series = volumeSeries(
        Array.from({ length: 14 }, () => 100),
        Array.from({ length: 13 }, () => 1_500_000).concat([2_000_000]),
        Array.from({ length: 13 }, () => 1_500_000).concat([1_000_000]),
      )
      const result = evaluateAnomalies(series)
      expect(result.sideMismatch?.diffPercent).toEqual(50)
      expect(result.sideMismatch?.largerSideUsd).toEqual(2_000_000)
    })

    it('does not flag when below the $500k floor', () => {
      const series = volumeSeries(
        Array.from({ length: 14 }, () => 100),
        Array.from({ length: 14 }, () => 490_000),
        Array.from({ length: 14 }, () => 400_000),
      )
      const result = evaluateAnomalies(series)
      expect(result.sideMismatch).toEqual(null)
    })

    it('does not flag when one side is zero', () => {
      const series = volumeSeries(
        Array.from({ length: 14 }, () => 100),
        Array.from({ length: 14 }, () => 2_000_000),
        Array.from({ length: 14 }, () => 0),
      )
      const result = evaluateAnomalies(series)
      expect(result.sideMismatch).toEqual(null)
    })

    it('does not flag when diff is below 30%', () => {
      const series = volumeSeries(
        Array.from({ length: 14 }, () => 100),
        Array.from({ length: 14 }, () => 2_000_000),
        Array.from({ length: 14 }, () => 1_500_000),
      )
      const result = evaluateAnomalies(series)
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
      const result = evaluateAnomalies(points)
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
      const result = evaluateAnomalies(points)
      const count = result.signals.find((s) => s.metric === 'count')
      expect(count?.severity).toEqual('severe')
      expect(
        result.signals.filter(
          (s) => s.metric === 'srcVolume' || s.metric === 'dstVolume',
        ),
      ).toEqual([])
    })
  })

  describe('insufficient history', () => {
    it('returns no signals when fewer than 3 non-zero history days', () => {
      const series = countSeries([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 1_000,
      ])
      const result = evaluateAnomalies(series)
      expect(result.signals).toEqual([])
    })

    it('returns no signals for empty series', () => {
      expect(evaluateAnomalies([])).toEqual({
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
