import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import type { Clock } from './Clock'
import { HourlyIndexer } from './HourlyIndexer'

const LAST_HOUR = UnixTime.now().add(-1, 'hours')

describe(HourlyIndexer.name, () => {
  describe(HourlyIndexer.prototype.start.name, () => {
    it('calls clock.onNewHour', async () => {
      const clock = mockObject<Clock>({
        onNewHour: () => () => {},
        getLastHour: () => LAST_HOUR,
      })

      const indexer = new HourlyIndexer(Logger.SILENT, clock)

      await indexer.start()

      expect(clock.onNewHour).toHaveBeenCalled()
    })
  })

  describe(HourlyIndexer.prototype.tick.name, () => {
    it('returns the last hour', async () => {
      const clock = mockObject<Clock>({
        getLastHour: () => LAST_HOUR,
      })

      const indexer = new HourlyIndexer(Logger.SILENT, clock)

      const result = await indexer.tick()

      expect(result).toEqual(LAST_HOUR.toNumber())
    })
  })
})
