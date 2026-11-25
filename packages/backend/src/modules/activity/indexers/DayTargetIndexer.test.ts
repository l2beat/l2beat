import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { Clock } from '../../../tools/Clock'
import { DayTargetIndexer } from './DayTargetIndexer'

const LAST_HOUR = UnixTime.now() - 1 * UnixTime.HOUR

describe(DayTargetIndexer.name, () => {
  describe(DayTargetIndexer.prototype.start.name, () => {
    it('calls clock.onNewHour', async () => {
      const clock = mockObject<Clock>({
        onNewHour: () => () => {},
        getLastHour: () => LAST_HOUR,
      })

      const indexer = new DayTargetIndexer(Logger.SILENT, clock)

      await indexer.start()

      expect(clock.onNewHour).toHaveBeenCalled()
    })
  })

  describe(DayTargetIndexer.prototype.tick.name, () => {
    it('returns the day of the clock, which is the last full day', async () => {
      const clock = mockObject<Clock>({
        getLastHour: () => UnixTime.fromDate(new Date('2026-10-28T13:00:00Z')),
      })
      const onTick = mockFn().resolvesTo(undefined)

      const indexer = new DayTargetIndexer(Logger.SILENT, clock, { onTick })

      expect(await indexer.tick()).toEqual(20_754)
      expect(onTick).toHaveBeenOnlyCalledWith(
        UnixTime.fromDate(new Date('2026-10-28T00:00:00Z')),
      )
    })
  })
})
