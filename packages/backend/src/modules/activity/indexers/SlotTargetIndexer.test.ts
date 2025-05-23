import { Logger } from '@l2beat/backend-tools'
import type { SlotTimestampProvider } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { ActivityConfigProject } from '../../../config/Config'
import type { Clock } from '../../../tools/Clock'
import { SlotTargetIndexer } from './SlotTargetIndexer'

const LAST_HOUR = UnixTime.now() - 1 * UnixTime.HOUR

describe(SlotTargetIndexer.name, () => {
  describe(SlotTargetIndexer.prototype.start.name, () => {
    it('calls clock.onNewHour', async () => {
      const clock = mockObject<Clock>({
        onNewHour: () => () => {},
        getLastHour: () => LAST_HOUR,
      })

      const slotTimestampProvider = mockObject<SlotTimestampProvider>({
        getSlotNumberAtOrBefore: mockFn().resolvesTo(0),
      })

      const indexer = new SlotTargetIndexer(
        Logger.SILENT,
        clock,
        slotTimestampProvider,
        mockObject<ActivityConfigProject>({
          id: ProjectId('mock'),
          chainName: 'chain',
          activityConfig: {
            type: 'slot',
            startSlot: 1,
          },
        }),
      )

      await indexer.start()

      expect(clock.onNewHour).toHaveBeenCalled()
    })
  })

  describe(SlotTargetIndexer.prototype.tick.name, () => {
    it('returns block number', async () => {
      const clock = mockObject<Clock>({
        getLastHour: () => LAST_HOUR,
      })

      const SLOT_NUMBER = 123
      const START_SLOT = 1

      const slotTimestampProvider = mockObject<SlotTimestampProvider>({
        getSlotNumberAtOrBefore: mockFn().resolvesTo(SLOT_NUMBER),
      })

      const indexer = new SlotTargetIndexer(
        Logger.SILENT,
        clock,
        slotTimestampProvider,
        mockObject<ActivityConfigProject>({
          id: ProjectId('mock'),
          chainName: 'chain',
          activityConfig: {
            type: 'slot',
            startSlot: START_SLOT,
          },
        }),
      )

      const result = await indexer.tick()

      expect(result).toEqual(SLOT_NUMBER)
      expect(clock.getLastHour).toHaveBeenCalledTimes(1)
      expect(
        slotTimestampProvider.getSlotNumberAtOrBefore,
      ).toHaveBeenNthCalledWith(1, LAST_HOUR, 'chain', START_SLOT)
    })
  })
})
