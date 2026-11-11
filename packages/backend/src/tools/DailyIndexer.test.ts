import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import type { Clock } from './Clock'
import { DailyIndexer } from './DailyIndexer'

const LAST_DAY = UnixTime.toStartOf(UnixTime.now(), 'day')

describe(DailyIndexer.name, () => {
  describe(DailyIndexer.prototype.start.name, () => {
    it('calls clock.onNewDay', async () => {
      const clock = mockObject<Clock>({
        onNewDay: () => () => {},
        getLastDay: () => LAST_DAY,
      })

      const indexer = new DailyIndexer(Logger.SILENT, clock)

      await indexer.start()

      expect(clock.onNewDay).toHaveBeenCalled()
    })
  })

  describe(DailyIndexer.prototype.tick.name, () => {
    it('returns the last day', async () => {
      const clock = mockObject<Clock>({
        getLastDay: () => LAST_DAY,
      })

      const indexer = new DailyIndexer(Logger.SILENT, clock)

      const result = await indexer.tick()

      expect(result).toEqual(LAST_DAY)
    })
  })
})
