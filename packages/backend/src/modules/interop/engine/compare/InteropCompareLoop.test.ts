import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { Hash256 } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
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
        getExternalItems: mockFn()
          // returns unknown in first run, which will get skipped
          // in next run will be reported as missing
          .resolvesToOnce([known[0], unknown[0]])
          // this unknown will be only skipped because we run two times
          .resolvesToOnce([unknown[1]]),
      }

      const interopMessage = mockObject<Database['interopMessage']>({
        getExistingItems: mockFn().resolvesTo([known[0]]),
      })

      const interopTransfer = mockObject<Database['interopTransfer']>({
        getExistingItems: mockFn().resolvesTo([known[1]]),
      })

      const db = mockObject<Database>({
        interopMessage,
        interopTransfer,
      })

      const logger = mockObject<Logger>({
        info: mockFn().returns({}),
        warn: mockFn().returns({}),
        error: mockFn().returns({}),
      })
      //@ts-ignore
      logger.for = () => logger
      //@ts-ignore
      logger.tag = () => logger

      const comparator = new InteropCompareLoop(db, plugin, logger)

      await comparator.run()
      await comparator.run()

      expect(plugin.getExternalItems).toHaveBeenCalledTimes(2)
      expect(interopMessage.getExistingItems).toHaveBeenCalledTimes(2)
      expect(interopTransfer.getExistingItems).toHaveBeenCalledTimes(2)

      expect(logger.warn).toHaveBeenNthCalledWith(1, 'Missing item skipped', {
        plugin: 'plugin',
        item: {
          ...unknown[0],
          isLatest: true,
        },
      })
      expect(logger.warn).toHaveBeenNthCalledWith(2, 'Missing item detected', {
        plugin: 'plugin',
        item: {
          ...unknown[0],
          isLatest: false,
        },
      })
      expect(logger.warn).toHaveBeenNthCalledWith(3, 'Missing item skipped', {
        plugin: 'plugin',
        item: {
          ...unknown[1],
          isLatest: true,
        },
      })
    })
  })
})
