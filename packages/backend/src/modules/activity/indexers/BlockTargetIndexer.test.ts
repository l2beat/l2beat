import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import type { Database } from '@l2beat/database'
import type { Clock } from '../../../tools/Clock'
import type { BlockTimestampProvider } from '../../tvl/services/BlockTimestampProvider'
import { BlockTargetIndexer } from './BlockTargetIndexer'

const LAST_HOUR = UnixTime.now().add(-1, 'hours')

describe(BlockTargetIndexer.name, () => {
  describe(BlockTargetIndexer.prototype.start.name, () => {
    it('calls clock.onNewHour', async () => {
      const clock = mockObject<Clock>({
        onNewHour: () => () => {},
        getLastHour: () => LAST_HOUR,
      })

      const blockTimestampProvider = mockObject<BlockTimestampProvider>({
        getBlockNumberAtOrBefore: mockFn().resolvesTo(0),
      })
      const indexer = new BlockTargetIndexer(
        Logger.SILENT,
        clock,
        blockTimestampProvider,
        getMockDb(),
        ProjectId('mock'),
      )

      await indexer.start()

      expect(clock.onNewHour).toHaveBeenCalled()
    })
  })

  describe(BlockTargetIndexer.prototype.tick.name, () => {
    it('returns block number', async () => {
      const clock = mockObject<Clock>({
        getLastHour: () => LAST_HOUR,
      })

      const BLOCK_NUMBER = 123
      const blockTimestampProvider = mockObject<BlockTimestampProvider>({
        getBlockNumberAtOrBefore: mockFn().resolvesTo(BLOCK_NUMBER),
      })
      const indexer = new BlockTargetIndexer(
        Logger.SILENT,
        clock,
        blockTimestampProvider,
        getMockDb(),
        ProjectId('mock'),
      )

      const result = await indexer.tick()

      expect(result).toEqual(BLOCK_NUMBER)
      expect(clock.getLastHour).toHaveBeenCalledTimes(1)
      expect(
        blockTimestampProvider.getBlockNumberAtOrBefore,
      ).toHaveBeenNthCalledWith(1, LAST_HOUR)
    })

    it('throws when fetched block number is smaller than previously fetched', async () => {
      const clock = mockObject<Clock>({
        getLastHour: () => LAST_HOUR,
      })

      const BLOCK_NUMBER = 123
      const blockTimestampProvider = mockObject<BlockTimestampProvider>({
        getBlockNumberAtOrBefore: mockFn()
          .resolvesToOnce(BLOCK_NUMBER)
          .resolvesToOnce(BLOCK_NUMBER - 1),
      })
      const indexer = new BlockTargetIndexer(
        Logger.SILENT,
        clock,
        blockTimestampProvider,
        getMockDb(),
        ProjectId('mock'),
      )

      await indexer.tick()
      await expect(async () => await indexer.tick()).toBeRejectedWith(
        'Block number cannot be smaller',
      )
    })

    it('throws when fetched block number is smaller than previously fetched', async () => {
      const clock = mockObject<Clock>({
        getLastHour: () => LAST_HOUR,
      })

      const BLOCK_NUMBER = 123
      const blockTimestampProvider = mockObject<BlockTimestampProvider>({
        getBlockNumberAtOrBefore: mockFn()
          .resolvesToOnce(BLOCK_NUMBER)
          .resolvesToOnce(BLOCK_NUMBER - 1),
      })
      const indexer = new BlockTargetIndexer(
        Logger.SILENT,
        clock,
        blockTimestampProvider,
        getMockDb(),
        ProjectId('mock'),
      )

      await indexer.tick()
      await expect(async () => await indexer.tick()).toBeRejectedWith(
        'Block number cannot be smaller',
      )
    })

    it('throws when first fetched is smaller than last processed before process restart', async () => {
      const clock = mockObject<Clock>({
        getLastHour: () => LAST_HOUR,
        onNewHour: mockFn().returns(null),
      })

      const BLOCK_NUMBER = 123

      const db = mockObject<Database>({
        activity: mockObject<Database['activity']>({
          getLatestProcessedBlock: async () => BLOCK_NUMBER,
        }),
      })

      const blockTimestampProvider = mockObject<BlockTimestampProvider>({
        getBlockNumberAtOrBefore: mockFn().resolvesTo(BLOCK_NUMBER - 1),
      })

      const indexer = new BlockTargetIndexer(
        Logger.SILENT,
        clock,
        blockTimestampProvider,
        db,
        ProjectId('mock'),
      )

      await expect(async () => await indexer.tick()).toBeRejectedWith(
        'Block number cannot be smaller',
      )
    })
  })
})

function getMockDb() {
  return mockObject<Database>({
    activity: mockObject<Database['activity']>({
      getLatestProcessedBlock: async () => undefined,
    }),
  })
}
