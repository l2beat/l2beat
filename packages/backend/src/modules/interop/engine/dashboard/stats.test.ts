import { assert, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  detect,
  explore,
  funcs,
  interpret,
  interpretZRobust,
  Z_CLASSIC_THRESHOLD,
} from './stats'

describe('InteropStats', () => {
  describe('log1Plus', () => {
    it('returns the correct value', () => {
      expect(funcs.log1Plus(0)).toEqual(0)
      expect(funcs.log1Plus(1)).toEqual(Math.log(2))
      expect(funcs.log1Plus(10)).toEqual(Math.log(11))
    })
  })
  describe('median', () => {
    it('returns the correct value', () => {
      expect(funcs.median([1])).toEqual(1)
      expect(funcs.median([1, 2])).toEqual(1.5)
      expect(funcs.median([1, 2, 3])).toEqual(2)
      expect(funcs.median([1, 2, 3, 4])).toEqual(2.5)
      expect(() => funcs.median([])).toThrow('Values must be non-empty')
    })
  })
  describe('MAD', () => {
    it('returns the correct value', () => {
      expect(funcs.MAD([1])).toEqual(0)
      expect(funcs.MAD([1, 2])).toEqual(0.5)
      expect(funcs.MAD([1, 2, 3])).toEqual(1)
      expect(funcs.MAD([1, 2, 3, 4])).toEqual(1)
    })
  })
  describe('ZRobust', () => {
    it('returns the correct value', () => {
      const baseline = [1, 2, 3, 4, 5]
      const log1PlusBaseline = baseline.map(funcs.log1Plus)
      expect(funcs.zRobust(baseline)).toEqual(1.6862268986914881)
      expect(funcs.zRobust(log1PlusBaseline)).toEqual(1.4506003663072462)
    })

    it('returns null when MAD is zero and current differs from baseline', () => {
      expect(funcs.zRobust([0, 0, 0, 1])).toEqual(null)
    })
  })
  describe('ZClassic', () => {
    it('returns the correct value', () => {
      expect(funcs.zClassic([1, 2, 3, 4, 5])).toEqual(2.23606797749979)
    })
  })
  describe('interpretZRobust', () => {
    it('returns no label inside warn band', () => {
      expect(interpretZRobust(-4)).toEqual(undefined)
      expect(interpretZRobust(0)).toEqual(undefined)
      expect(interpretZRobust(4)).toEqual(undefined)
    })

    it('returns moderate labels outside warn band', () => {
      expect(interpretZRobust(-4.1)).toEqual('Z-robust - moderate drop')
      expect(interpretZRobust(4.1)).toEqual('Z-robust - moderate spike')
    })

    it('returns big labels outside spike/drop band', () => {
      expect(interpretZRobust(-6.1)).toEqual('Z-robust - big drop')
      expect(interpretZRobust(6.1)).toEqual('Z-robust - big spike')
    })
  })
  describe('avgVolumePerTransfer', () => {
    it('returns null when there are no transfers', () => {
      expect(funcs.avgVolumePerTransfer(100, 0)).toEqual(null)
    })

    it('returns average value per transfer', () => {
      expect(funcs.avgVolumePerTransfer(120, 3)).toEqual(40)
    })
  })
  describe('relativePercentDifference', () => {
    it('returns null when both values are zero', () => {
      expect(funcs.relativePercentDifference(0, 0)).toEqual(null)
    })

    it('returns percent difference using the bigger side as baseline', () => {
      expect(funcs.relativePercentDifference(100, 95)).toEqual(5)
      expect(funcs.relativePercentDifference(95, 100)).toEqual(5)
    })
  })
  describe('detect.flatLine', () => {
    it('returns true for identical values', () => {
      expect(detect.flatLine([1, 1, 1])).toEqual(true)
    })

    it('returns false when values differ', () => {
      expect(detect.flatLine([1, 1, 2])).toEqual(false)
    })
  })

  describe('detect.ratioDrop', () => {
    it('returns false for short series', () => {
      expect(detect.ratioDrop([10])).toEqual(false)
      expect(detect.ratioDrop([10, 1])).toEqual(false)
    })

    it('detects a sudden drop against the median', () => {
      expect(detect.ratioDrop([10, 10, 0])).toEqual(true)
    })

    it('does not trigger when drop is not severe', () => {
      expect(detect.ratioDrop([10, 10, 8])).toEqual(false)
    })
  })

  describe('detect.ratioSpike', () => {
    it('returns false for short series', () => {
      expect(detect.ratioSpike([10])).toEqual(false)
      expect(detect.ratioSpike([10, 1])).toEqual(false)
    })

    it('returns false for zero median baseline', () => {
      expect(detect.ratioSpike([0, 0, 20])).toEqual(false)
    })

    it('detects a sudden rise against the median', () => {
      expect(detect.ratioSpike([10, 10, 20])).toEqual(true)
    })

    it('does not trigger when rise is not severe', () => {
      expect(detect.ratioSpike([10, 10, 9])).toEqual(false)
    })
  })

  describe(explore.name, () => {
    const start = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))
    const row = (
      offsetDays: number,
      transferCount: number,
      id = 'id-1',
      totalSrcValueUsd = 0,
      totalDstValueUsd = 0,
    ) => ({
      day: start + offsetDays * UnixTime.DAY,
      id,
      transferCount,
      totalSrcValueUsd,
      totalDstValueUsd,
    })
    const series = (values: number[], id = 'id-1') =>
      values.map((value, index) => row(index, value, id))

    it('flags flat lines in the series', () => {
      // 3d example
      // 5 5 5
      // ---
      const results = explore([row(0, 5), row(1, 5), row(2, 5)])

      expect(results).toHaveLength(1)
      expect(results[0]?.counts.isFlatLine).toEqual(true)
      expect(results[0]?.counts.isRatioDrop).toEqual(false)
      expect(results[0]?.counts.prevDay).toEqual(5)
      expect(results[0]?.counts.prev7d).toEqual(null)
    })

    it('flags sudden ratio drops in the series', () => {
      // 4d example
      // 100 120 80 0
      //  ---\__
      const results = explore([row(0, 100), row(1, 120), row(2, 80), row(3, 0)])

      expect(results).toHaveLength(1)
      expect(results[0]?.counts.isFlatLine).toEqual(false)
      expect(results[0]?.counts.isRatioDrop).toEqual(true)
      expect(results[0]?.counts.prevDay).toEqual(80)
      expect(results[0]?.counts.prev7d).toEqual(null)
    })

    it('flags flat lines in a 14d window', () => {
      // 14d example
      // 5 5 5 5 5 5 5 5 5 5 5 5 5 5
      // ------------------------------
      const results = explore(series(new Array(14).fill(5)))

      expect(results).toHaveLength(1)
      expect(results[0]?.counts.isFlatLine).toEqual(true)
      expect(results[0]?.counts.isRatioDrop).toEqual(false)
      expect(results[0]?.counts.isRatioSpike).toEqual(false)
      expect(results[0]?.counts.prevDay).toEqual(5)
      expect(results[0]?.counts.prev7d).toEqual(5)
    })

    it('flags a ratio drop in a 14d window', () => {
      // 14d example
      // 100 110 90 105 95 100 98 102 101 99 100 97 103 0
      //  ...........'''''''''''''''''\_
      const results = explore(
        series([100, 110, 90, 105, 95, 100, 98, 102, 101, 99, 100, 97, 103, 0]),
      )

      expect(results).toHaveLength(1)
      expect(results[0]?.counts.isFlatLine).toEqual(false)
      expect(results[0]?.counts.isRatioDrop).toEqual(true)
      expect(results[0]?.counts.isRatioSpike).toEqual(false)
      expect(results[0]?.counts.prevDay).toEqual(103)
      expect(results[0]?.counts.prev7d).toEqual(98)
    })

    it('flags a ratio spike in a 14d window', () => {
      // 14d example
      // 10 9 11 10 10 9 10 10 9 11 10 10 9 30
      //  .............'''''''''''''''''/^^
      const results = explore(
        series([10, 9, 11, 10, 10, 9, 10, 10, 9, 11, 10, 10, 9, 30]),
      )

      expect(results).toHaveLength(1)
      expect(results[0]?.counts.isFlatLine).toEqual(false)
      expect(results[0]?.counts.isRatioDrop).toEqual(false)
      expect(results[0]?.counts.isRatioSpike).toEqual(true)
      expect(results[0]?.counts.prevDay).toEqual(9)
      expect(results[0]?.counts.prev7d).toEqual(10)
    })

    it('flags large src vs dst mismatch and volume spike/drop', () => {
      const results = explore([
        row(0, 10, 'id-1', 100, 100),
        row(1, 10, 'id-1', 100, 100),
        row(2, 10, 'id-1', 100, 100),
        row(3, 10, 'id-1', 100, 100),
        row(4, 10, 'id-1', 100, 100),
        row(5, 10, 'id-1', 100, 100),
        row(6, 10, 'id-1', 100, 100),
        row(7, 10, 'id-1', 100, 100),
        row(8, 10, 'id-1', 100, 100),
        row(9, 10, 'id-1', 100, 100),
        row(10, 10, 'id-1', 100, 100),
        row(11, 10, 'id-1', 100, 100),
        row(12, 10, 'id-1', 100, 100),
        row(13, 10, 'id-1', 1_000_000_000, 1_000_000),
      ])

      expect(results).toHaveLength(1)
      expect(results[0]?.srcDstDiff.isHigh).toEqual(true)
      expect(results[0]?.srcVolume.isRatioSpike).toEqual(true)
      expect(results[0]?.dstVolume.isRatioSpike).toEqual(true)
      expect(results[0]?.srcVolume.z.robust).toEqual(null)
      expect(results[0]?.srcVolume.z.classic).toEqual(null)
      expect(results[0]?.dstVolume.z.robust).toEqual(null)
      expect(results[0]?.dstVolume.z.classic).toEqual(null)
      expect(results[0]?.srcVolume.avgValuePerTransfer.last).toEqual(
        100_000_000,
      )
      expect(results[0]?.dstVolume.avgValuePerTransfer.last).toEqual(100_000)
    })

    it('keeps count normal on calm 2w count with trillion volume spike', () => {
      const [result] = explore([
        row(0, 25, 'id-1', 1_000_000, 1_000_000),
        row(1, 25, 'id-1', 1_000_000, 1_000_000),
        row(2, 25, 'id-1', 1_000_000, 1_000_000),
        row(3, 25, 'id-1', 1_000_000, 1_000_000),
        row(4, 25, 'id-1', 1_000_000, 1_000_000),
        row(5, 25, 'id-1', 1_000_000, 1_000_000),
        row(6, 25, 'id-1', 1_000_000, 1_000_000),
        row(7, 25, 'id-1', 1_000_000, 1_000_000),
        row(8, 25, 'id-1', 1_000_000, 1_000_000),
        row(9, 25, 'id-1', 1_000_000, 1_000_000),
        row(10, 25, 'id-1', 1_000_000, 1_000_000),
        row(11, 25, 'id-1', 1_000_000, 1_000_000),
        row(12, 25, 'id-1', 1_000_000, 1_000_000),
        row(13, 25, 'id-1', 1_000_000_000_000, 1_000_000_000_000),
      ])

      assert(result)

      expect(result?.counts.isRatioDrop).toEqual(false)
      expect(result?.counts.isRatioSpike).toEqual(false)
      expect(result?.counts.z.robust).toEqual(0)
      expect(
        result?.counts.z.classic !== null
          ? Math.abs(result.counts.z.classic) < Z_CLASSIC_THRESHOLD
          : false,
      ).toEqual(true)
      expect(result?.srcVolume.isRatioSpike).toEqual(true)
      expect(result?.dstVolume.isRatioSpike).toEqual(true)
      expect(
        result?.srcVolume.z.classic !== null
          ? Math.abs(result.srcVolume.z.classic) > Z_CLASSIC_THRESHOLD
          : false,
      ).toEqual(true)
      expect(
        result?.dstVolume.z.classic !== null
          ? Math.abs(result.dstVolume.z.classic) > Z_CLASSIC_THRESHOLD
          : false,
      ).toEqual(true)

      const interpretation = interpret(result)
      const labels = interpretation.split(', ')
      expect(labels.includes('Ratio spike')).toEqual(false)
      expect(labels.includes('Z-classic: spike/drop')).toEqual(false)
      expect(labels.includes('Z-robust - big spike')).toEqual(false)
      expect(labels.includes('Z-robust - big drop')).toEqual(false)
      expect(labels.includes('Src volume ratio spike')).toEqual(true)
      expect(labels.includes('Dst volume ratio spike')).toEqual(true)
      expect(labels.includes('Src volume Z-classic: spike/drop')).toEqual(true)
      expect(labels.includes('Dst volume Z-classic: spike/drop')).toEqual(true)
    })

    it('does not flag spikes for sparse mostly-zero history', () => {
      const results = explore([row(0, 0), row(1, 0), row(2, 1)])

      expect(results).toHaveLength(1)
      expect(results[0]?.counts.isRatioSpike).toEqual(false)
      expect(results[0]?.srcVolume.isRatioSpike).toEqual(false)
      expect(results[0]?.dstVolume.isRatioSpike).toEqual(false)
      expect(results[0]?.counts.z.robust).toEqual(null)
      expect(results[0]?.srcVolume.z.robust).toEqual(null)
      expect(results[0]?.srcVolume.z.classic).toEqual(null)
      expect(results[0]?.dstVolume.z.robust).toEqual(null)
      expect(results[0]?.dstVolume.z.classic).toEqual(null)
    })
  })
})
