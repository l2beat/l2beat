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

      const plugins = [
        {
          name: 'plugin1',
          type: 'message' as const,
          getExternalItems: mockFn()
            // returns unknown in first run, which will get skipped
            // in next run will be reported as missing
            .resolvesToOnce([known[0], unknown[0]])
            // this unknown will be only skipped because we run two times
            .resolvesToOnce([unknown[1]]),
        },
        {
          name: 'plugin2',
          type: 'transfer' as const,
          getExternalItems: mockFn()
            .resolvesToOnce([known[1]])
            .resolvesToOnce([]),
        },
      ]

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

      const comparator = new InteropCompareLoop(db, plugins, logger)

      await comparator.run()
      await comparator.run()

      expect(plugins[0].getExternalItems).toHaveBeenCalledTimes(2)
      expect(plugins[1].getExternalItems).toHaveBeenCalledTimes(2)
      expect(interopMessage.getExistingItems).toHaveBeenCalledTimes(2)
      expect(interopTransfer.getExistingItems).toHaveBeenCalledTimes(2)

      expect(logger.warn).toHaveBeenNthCalledWith(1, 'Missing item skipped', {
        plugin: 'plugin1',
        item: {
          ...unknown[0],
          isLatest: true,
        },
      })
      expect(logger.warn).toHaveBeenNthCalledWith(2, 'Missing item detected', {
        plugin: 'plugin1',
        item: {
          ...unknown[0],
          isLatest: false,
        },
      })
      expect(logger.warn).toHaveBeenNthCalledWith(3, 'Missing item skipped', {
        plugin: 'plugin1',
        item: {
          ...unknown[1],
          isLatest: true,
        },
      })
    })
  })
})
