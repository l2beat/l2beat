import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import type { Clock } from '../../../tools/Clock'
import { DayTargetIndexer } from './DayTargetIndexer'

const LAST_HOUR = UnixTime.now() - 1 * UnixTime.HOUR

describe(DayTargetIndexer.name, () => {
  describe(DayTargetIndexer.prototype.start.name, () => {
    it('calls clock.onNewHour', async () => {
      const clock = {
        onNewHour: vi.fn(() => () => {}),
        getLastHour: vi.fn(() => LAST_HOUR),
      } as unknown as Clock

      const indexer = new DayTargetIndexer(Logger.SILENT, clock)

      await indexer.start()

      expect(clock.onNewHour).toHaveBeenCalled()
    })
  })

  describe(DayTargetIndexer.prototype.tick.name, () => {
    it('returns the number of day', async () => {
      const clock = {
        getLastHour: vi.fn(() => LAST_HOUR),
      } as unknown as Clock

      const indexer = new DayTargetIndexer(Logger.SILENT, clock)

      const result = await indexer.tick()

      expect(result).toEqual(
        UnixTime.toDays(UnixTime.toStartOf(LAST_HOUR, 'day')),
      )
    })
  })
})
