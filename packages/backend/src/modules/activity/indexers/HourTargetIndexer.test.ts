import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { Clock } from '../../../tools/Clock'
import { HourTargetIndexer } from './HourTargetIndexer'

describe(HourTargetIndexer.name, () => {
  describe(HourTargetIndexer.prototype.tick.name, () => {
    it('returns the hour of the clock, which is the last full hour', async () => {
      const lastHour = UnixTime.fromDate(new Date('2026-10-28T13:00:00Z'))
      const onTick = mockFn().resolvesTo(undefined)
      const indexer = new HourTargetIndexer(
        Logger.SILENT,
        mockObject<Clock>({ getLastHour: () => lastHour }),
        { onTick },
      )

      expect(await indexer.tick()).toEqual(lastHour / UnixTime.HOUR)
      expect(onTick).toHaveBeenOnlyCalledWith(lastHour)
    })
  })
})
