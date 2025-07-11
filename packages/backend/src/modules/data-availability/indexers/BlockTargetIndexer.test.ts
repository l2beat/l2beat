import { Logger } from '@l2beat/backend-tools'
import type { BlockTimestampProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { Clock } from '../../../tools/Clock'
import { BlockTargetIndexer } from './BlockTargetIndexer'

const LAST_HOUR = UnixTime.now() - 1 * UnixTime.HOUR

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
        'mock',
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
        'mock',
      )

      const result = await indexer.tick()

      expect(result).toEqual(BLOCK_NUMBER)
      expect(clock.getLastHour).toHaveBeenCalledTimes(1)
      expect(
        blockTimestampProvider.getBlockNumberAtOrBefore,
      ).toHaveBeenNthCalledWith(1, LAST_HOUR, 'mock')
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
        'mock',
      )

      await indexer.tick()
      await expect(async () => await indexer.tick()).toBeRejectedWith(
        'Block number cannot be smaller',
      )
    })
  })
})
