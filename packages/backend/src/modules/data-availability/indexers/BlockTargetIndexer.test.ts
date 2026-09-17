import { Logger } from '@l2beat/backend-tools'
import type { BlockTimestampProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import type { Clock } from '../../../tools/Clock'
import { BlockTargetIndexer } from './BlockTargetIndexer'

const LAST_HOUR = UnixTime.now() - 1 * UnixTime.HOUR

describe(BlockTargetIndexer.name, () => {
  describe(BlockTargetIndexer.prototype.start.name, () => {
    it('calls clock.onNewHour', async () => {
      const clock = {
        onNewHour: vi.fn(() => () => {}),
        getLastHour: vi.fn(() => LAST_HOUR),
      } as unknown as Clock

      const blockTimestampProvider = {
        getBlockNumberAtOrBefore: vi.fn().mockResolvedValue(0),
      } as unknown as BlockTimestampProvider
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
      const clock = {
        getLastHour: vi.fn(() => LAST_HOUR),
      } as unknown as Clock

      const BLOCK_NUMBER = 123
      const blockTimestampProvider = {
        getBlockNumberAtOrBefore: vi.fn().mockResolvedValue(BLOCK_NUMBER),
      } as unknown as BlockTimestampProvider
      const indexer = new BlockTargetIndexer(
        Logger.SILENT,
        clock,
        blockTimestampProvider,
        'mock',
      )

      const result = await indexer.tick()

      expect(result).toStrictEqual(BLOCK_NUMBER)
      expect(clock.getLastHour).toHaveBeenCalledTimes(1)
      expect(
        blockTimestampProvider.getBlockNumberAtOrBefore,
      ).toHaveBeenNthCalledWith(1, LAST_HOUR, 'mock')
    })

    it('throws when fetched block number is smaller than previously fetched', async () => {
      const clock = {
        getLastHour: vi.fn(() => LAST_HOUR),
      } as unknown as Clock

      const BLOCK_NUMBER = 123
      const blockTimestampProvider = {
        getBlockNumberAtOrBefore: vi
          .fn()
          .mockResolvedValueOnce(BLOCK_NUMBER)
          .mockResolvedValueOnce(BLOCK_NUMBER - 1),
      } as unknown as BlockTimestampProvider
      const indexer = new BlockTargetIndexer(
        Logger.SILENT,
        clock,
        blockTimestampProvider,
        'mock',
      )

      await indexer.tick()
      await expect(async () => await indexer.tick()).rejects.toThrow(
        'Block number cannot be smaller',
      )
    })
  })
})
