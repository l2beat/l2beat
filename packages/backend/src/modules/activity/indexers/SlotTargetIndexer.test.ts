import { Logger } from '@l2beat/backend-tools'
import type { SlotTimestampProvider } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import type { ActivityConfigProject } from '../../../config/Config'
import type { Clock } from '../../../tools/Clock'
import { SlotTargetIndexer } from './SlotTargetIndexer'

const LAST_HOUR = UnixTime.now() - 1 * UnixTime.HOUR

describe(SlotTargetIndexer.name, () => {
  describe(SlotTargetIndexer.prototype.start.name, () => {
    it('calls clock.onNewHour', async () => {
      const clock = {
        onNewHour: vi.fn(() => () => {}),
        getLastHour: vi.fn(() => LAST_HOUR),
      } as unknown as Clock

      const slotTimestampProvider = {
        getSlotNumberAtOrBefore: vi.fn().mockResolvedValue(0),
      } as unknown as SlotTimestampProvider

      const indexer = new SlotTargetIndexer(
        Logger.SILENT,
        clock,
        slotTimestampProvider,
        {
          id: ProjectId('mock'),
          chainName: 'chain',
          activityConfig: {
            type: 'slot',
            startSlot: 1,
          },
        } as unknown as ActivityConfigProject,
      )

      await indexer.start()

      expect(clock.onNewHour).toHaveBeenCalled()
    })
  })

  describe(SlotTargetIndexer.prototype.tick.name, () => {
    it('returns block number', async () => {
      const clock = {
        getLastHour: vi.fn(() => LAST_HOUR),
      } as unknown as Clock

      const SLOT_NUMBER = 123
      const START_SLOT = 1

      const slotTimestampProvider = {
        getSlotNumberAtOrBefore: vi.fn().mockResolvedValue(SLOT_NUMBER),
      } as unknown as SlotTimestampProvider

      const indexer = new SlotTargetIndexer(
        Logger.SILENT,
        clock,
        slotTimestampProvider,
        {
          id: ProjectId('mock'),
          chainName: 'chain',
          activityConfig: {
            type: 'slot',
            startSlot: START_SLOT,
          },
        } as unknown as ActivityConfigProject,
      )

      const result = await indexer.tick()

      expect(result).toStrictEqual(SLOT_NUMBER)
      expect(clock.getLastHour).toHaveBeenCalledTimes(1)
      expect(
        slotTimestampProvider.getSlotNumberAtOrBefore,
      ).toHaveBeenNthCalledWith(1, LAST_HOUR, 'chain', START_SLOT)
    })
  })
})
