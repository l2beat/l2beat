import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { Clock } from '../../../tools/Clock'
import { DayTargetIndexer } from './DayTargetIndexer'

const LAST_HOUR = UnixTime.now().add(-1, 'hours')

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
    it('returns the number of day', async () => {
      const clock = mockObject<Clock>({
        getLastHour: () => LAST_HOUR,
      })

      const indexer = new DayTargetIndexer(Logger.SILENT, clock)

      const result = await indexer.tick()

      expect(result).toEqual(LAST_HOUR.toStartOf('day').toDays())
    })
  })
})
