import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { detect, explore, funcs } from './stats'

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
  })
  describe('ZClassic', () => {
    it('returns the correct value', () => {
      expect(funcs.zClassic([1, 2, 3, 4, 5])).toEqual(2.23606797749979)
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

    it('detects a sudden rise against the median', () => {
      expect(detect.ratioSpike([10, 10, 20])).toEqual(true)
    })

    it('does not trigger when rise is not severe', () => {
      expect(detect.ratioSpike([10, 10, 9])).toEqual(false)
    })
  })

  describe(explore.name, () => {
    const start = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))
    const row = (offsetDays: number, transferCount: number, id = 'id-1') => ({
      day: start + offsetDays * UnixTime.DAY,
      id,
      transferCount,
    })
    const series = (values: number[], id = 'id-1') =>
      values.map((value, index) => row(index, value, id))

    it('flags flat lines in the series', () => {
      // 3d example
      // 5 5 5
      // ---
      const results = explore([row(0, 5), row(1, 5), row(2, 5)])

      expect(results).toHaveLength(1)
      expect(results[0]?.isFlatLine).toEqual(true)
      expect(results[0]?.isRatioDrop).toEqual(false)
      expect(results[0]?.prevDayCount).toEqual(5)
      expect(results[0]?.prev7dCount).toEqual(null)
    })

    it('flags sudden ratio drops in the series', () => {
      // 4d example
      // 100 120 80 0
      //  ---\__
      const results = explore([row(0, 100), row(1, 120), row(2, 80), row(3, 0)])

      expect(results).toHaveLength(1)
      expect(results[0]?.isFlatLine).toEqual(false)
      expect(results[0]?.isRatioDrop).toEqual(true)
      expect(results[0]?.prevDayCount).toEqual(80)
      expect(results[0]?.prev7dCount).toEqual(null)
    })

    it('flags flat lines in a 14d window', () => {
      // 14d example
      // 5 5 5 5 5 5 5 5 5 5 5 5 5 5
      // ------------------------------
      const results = explore(series(new Array(14).fill(5)))

      expect(results).toHaveLength(1)
      expect(results[0]?.isFlatLine).toEqual(true)
      expect(results[0]?.isRatioDrop).toEqual(false)
      expect(results[0]?.isRatioSpike).toEqual(false)
      expect(results[0]?.prevDayCount).toEqual(5)
      expect(results[0]?.prev7dCount).toEqual(5)
    })

    it('flags a ratio drop in a 14d window', () => {
      // 14d example
      // 100 110 90 105 95 100 98 102 101 99 100 97 103 0
      //  ...........'''''''''''''''''\_
      const results = explore(
        series([100, 110, 90, 105, 95, 100, 98, 102, 101, 99, 100, 97, 103, 0]),
      )

      expect(results).toHaveLength(1)
      expect(results[0]?.isFlatLine).toEqual(false)
      expect(results[0]?.isRatioDrop).toEqual(true)
      expect(results[0]?.isRatioSpike).toEqual(false)
      expect(results[0]?.prevDayCount).toEqual(103)
      expect(results[0]?.prev7dCount).toEqual(98)
    })

    it('flags a ratio spike in a 14d window', () => {
      // 14d example
      // 10 9 11 10 10 9 10 10 9 11 10 10 9 30
      //  .............'''''''''''''''''/^^
      const results = explore(
        series([10, 9, 11, 10, 10, 9, 10, 10, 9, 11, 10, 10, 9, 30]),
      )

      expect(results).toHaveLength(1)
      expect(results[0]?.isFlatLine).toEqual(false)
      expect(results[0]?.isRatioDrop).toEqual(false)
      expect(results[0]?.isRatioSpike).toEqual(true)
      expect(results[0]?.prevDayCount).toEqual(9)
      expect(results[0]?.prev7dCount).toEqual(10)
    })
  })
})
