import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { Hash256 } from '@l2beat/shared-pure'
import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { InteropCompareLoop } from './InteropCompareLoop'

describe(InteropCompareLoop.name, () => {
  describe(InteropCompareLoop.prototype.run.name, () => {
    it('fetches data and compares', async () => {
      const known = [
        { srcTxHash: Hash256.random(), dstTxHash: Hash256.random() },
        { srcTxHash: Hash256.random(), dstTxHash: Hash256.random() },
      ]
      const unknown = [
        { srcTxHash: Hash256.random(), dstTxHash: Hash256.random() },
        { srcTxHash: Hash256.random(), dstTxHash: Hash256.random() },
      ]

      const plugin = {
        name: 'plugin',
        getExternalItems: vi
          .fn()
          // returns unknown in first run, which will get skipped
          // in next run will be reported as missing
          .mockResolvedValueOnce([known[0], unknown[0]])
          // this unknown will be only skipped because we run two times
          .mockResolvedValueOnce([unknown[1]]),
      }

      const interopMessage = mockObject<Database['interopMessage']>({
        getExistingItems: vi.fn().mockResolvedValue([known[0]]),
      })

      const interopTransfer = mockObject<Database['interopTransfer']>({
        getExistingItems: vi.fn().mockResolvedValue([known[1]]),
      })

      const db = mockObject<Database>({
        interopMessage,
        interopTransfer,
      })

      const tagLogger = mockObject<Logger>({
        debug: vi.fn().mockReturnValue(undefined),
        info: vi.fn().mockReturnValue(undefined),
        warn: vi.fn().mockReturnValue(undefined),
        error: vi.fn().mockReturnValue(undefined),
      })
      const forLogger = mockObject<Logger>({
        tag: vi.fn().mockReturnValue(tagLogger),
      })
      const logger = mockObject<Logger>({
        for: vi.fn().mockReturnValue(forLogger),
      })

      const comparator = new InteropCompareLoop(db, plugin, logger)

      await comparator.run()
      await comparator.run()

      expect(plugin.getExternalItems).toHaveBeenCalledTimes(2)
      expect(interopMessage.getExistingItems).toHaveBeenCalledTimes(2)
      expect(interopTransfer.getExistingItems).toHaveBeenCalledTimes(2)

      expect(tagLogger.warn).toHaveBeenNthCalledWith(
        1,
        'Missing item skipped',
        {
          plugin: 'plugin',
          item: {
            ...unknown[0],
            isLatest: true,
          },
        },
      )
      expect(tagLogger.warn).toHaveBeenNthCalledWith(
        2,
        'Missing item detected',
        {
          plugin: 'plugin',
          item: {
            ...unknown[0],
            isLatest: false,
          },
        },
      )
      expect(tagLogger.warn).toHaveBeenNthCalledWith(
        3,
        'Missing item skipped',
        {
          plugin: 'plugin',
          item: {
            ...unknown[1],
            isLatest: true,
          },
        },
      )
    })
  })
})
