import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import type { Clock } from '../../../tools/Clock'
import { SyncOptimizer } from './SyncOptimizer'

describe(SyncOptimizer.name, () => {
  const LAST_HOUR = UnixTime.fromDate(new Date('2023-05-01T00:00:00Z'))
  const CLOCK = mockObject<Clock>({
    getLastHour: () => LAST_HOUR,
  })

  describe(SyncOptimizer.prototype.shouldTimestampBeSynced.name, () => {
    const syncOptimizer = new SyncOptimizer(CLOCK)

    it('returns true when timestamp is already the aligned sync target', () => {
      const ts = syncOptimizer.getTimestampToSync(LAST_HOUR - 1 * UnixTime.HOUR)
      expect(syncOptimizer.shouldTimestampBeSynced(ts)).toEqual(true)
    })

    it('returns false when timestamp is not the aligned sync target', () => {
      const ts = LAST_HOUR - 1 * UnixTime.HOUR + 123
      expect(syncOptimizer.shouldTimestampBeSynced(ts)).toEqual(false)
    })
  })

  describe(SyncOptimizer.prototype.getTimestampToSync.name, () => {
    const clock = mockObject<Clock>({
      getLastHour: () => LAST_HOUR + 1 * UnixTime.MINUTE,
    })

    it('aligns timestamps to hourly, six-hourly, or daily grid from cutoff boundaries', () => {
      const syncOptimizer = new SyncOptimizer(clock)

      expect(
        syncOptimizer.getTimestampToSync(LAST_HOUR - 200 * UnixTime.DAY),
      ).toEqual(UnixTime(1665619200))
      expect(
        syncOptimizer.getTimestampToSync(LAST_HOUR - 100 * UnixTime.DAY),
      ).toEqual(UnixTime(1674259200))
      expect(
        syncOptimizer.getTimestampToSync(LAST_HOUR - 40 * UnixTime.DAY),
      ).toEqual(UnixTime(1679443200))
      expect(
        syncOptimizer.getTimestampToSync(LAST_HOUR - 1 * UnixTime.HOUR),
      ).toEqual(UnixTime(1682895600))
    })
  })

  describe(SyncOptimizer.prototype.getTimestampsToSync.name, () => {
    it('respects maxTimestamps', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK)

      const start = LAST_HOUR - 7 * UnixTime.HOUR
      expect(
        syncOptimizer.getTimestampsToSync(
          start,
          start + 100_000 * UnixTime.DAY,
          7,
        ),
      ).toEqual([
        UnixTime(1682874000),
        UnixTime(1682877600),
        UnixTime(1682881200),
        UnixTime(1682884800),
        UnixTime(1682888400),
        UnixTime(1682892000),
        UnixTime(1682895600),
      ])
    })

    it('respects to', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK)

      const start = LAST_HOUR - 7 * UnixTime.HOUR
      expect(
        syncOptimizer.getTimestampsToSync(
          start,
          start + 6 * UnixTime.HOUR,
          100_000,
        ),
      ).toEqual([
        UnixTime(1682874000),
        UnixTime(1682877600),
        UnixTime(1682881200),
        UnixTime(1682884800),
        UnixTime(1682888400),
        UnixTime(1682892000),
        UnixTime(1682895600),
      ])
    })

    it('steps through daily and six-hourly regions before hourly', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK)

      const start = LAST_HOUR - 95 * UnixTime.DAY
      expect(
        syncOptimizer.getTimestampsToSync(
          start,
          start + 100_000 * UnixTime.DAY,
          7,
        ),
      ).toEqual([
        UnixTime(1674691200),
        UnixTime(1674712800),
        UnixTime(1674734400),
        UnixTime(1674756000),
        UnixTime(1674777600),
        UnixTime(1674799200),
        UnixTime(1674820800),
      ])
    })
  })
})
