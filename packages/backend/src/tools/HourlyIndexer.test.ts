import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'

import type { Clock } from './Clock'
import { HourlyIndexer } from './HourlyIndexer'

const LAST_HOUR = UnixTime.now() - 1 * UnixTime.HOUR

describe(HourlyIndexer.name, () => {
  describe(HourlyIndexer.prototype.start.name, () => {
    it('calls clock.onNewHour', async () => {
      const clock = {
        onNewHour: vi.fn(() => () => {}),
        getLastHour: vi.fn(() => LAST_HOUR),
      } as unknown as Clock

      const indexer = new HourlyIndexer(Logger.SILENT, clock)

      await indexer.start()

      expect(clock.onNewHour).toHaveBeenCalled()
    })
  })

  describe(HourlyIndexer.prototype.tick.name, () => {
    it('returns the last hour', async () => {
      const clock = {
        getLastHour: vi.fn(() => LAST_HOUR),
      } as unknown as Clock

      const indexer = new HourlyIndexer(Logger.SILENT, clock)

      const result = await indexer.tick()

      expect(result).toEqual(LAST_HOUR)
    })
  })
})
