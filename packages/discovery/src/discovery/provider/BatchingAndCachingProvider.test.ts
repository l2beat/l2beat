import { Logger } from '@l2beat/backend-tools'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { BatchingAndCachingProvider } from './BatchingAndCachingProvider'
import type { LowLevelProvider } from './LowLevelProvider'
import type { MulticallClient } from './multicall/MulticallClient'
import type { ReorgAwareCache } from './ReorgAwareCache'

describe(BatchingAndCachingProvider.name, () => {
  const logger = Logger.SILENT

  describe(BatchingAndCachingProvider.prototype.getLogs.name, () => {
    it('divides on two calls', async () => {
      const cache = mockObject<ReorgAwareCache>({
        entry: mockFn().returns({
          read: () => undefined,
        }),
        write: mockFn().returns(undefined),
      })
      const provider = mockObject<LowLevelProvider>({
        getLogs: mockFn()
          .throwsOnce(new Error('Log response size exceeded'))
          .returnsOnce([])
          .returnsOnce([]),
      })
      const multicallClient = mockObject<MulticallClient>()

      const batchingProvider = new BatchingAndCachingProvider(
        cache,
        provider,
        multicallClient,
        logger,
      )

      const address = EthereumAddress.random()
      const topic = 'aaaa'
      await batchingProvider.getLogs(address, [topic], 0, 2000)

      expect(provider.getLogs).toHaveBeenNthCalledWith(
        1,
        address,
        [[topic]],
        0,
        2000,
      )
      expect(provider.getLogs).toHaveBeenNthCalledWith(
        2,
        address,
        [[topic]],
        0,
        1000,
      )
      expect(provider.getLogs).toHaveBeenNthCalledWith(
        3,
        address,
        [[topic]],
        1001,
        2000,
      )
    })

    it('correctly divides range of two', async () => {
      const cache = mockObject<ReorgAwareCache>({
        entry: mockFn().returns({
          read: () => undefined,
        }),
        write: mockFn().returns(undefined),
      })
      const provider = mockObject<LowLevelProvider>({
        getLogs: mockFn()
          .throwsOnce(new Error('Log response size exceeded'))
          .returnsOnce([])
          .returnsOnce([]),
      })
      const multicallClient = mockObject<MulticallClient>()

      const batchingProvider = new BatchingAndCachingProvider(
        cache,
        provider,
        multicallClient,
        logger,
      )

      const address = EthereumAddress.random()
      const topic = 'aaaa'
      await batchingProvider.getLogs(address, [topic], 0, 1)

      expect(provider.getLogs).toHaveBeenNthCalledWith(
        1,
        address,
        [[topic]],
        0,
        1,
      )
      expect(provider.getLogs).toHaveBeenNthCalledWith(
        2,
        address,
        [[topic]],
        0,
        0,
      )
      expect(provider.getLogs).toHaveBeenNthCalledWith(
        3,
        address,
        [[topic]],
        1,
        1,
      )
    })

    it('fromBlock === toBlock', async () => {
      const cache = mockObject<ReorgAwareCache>({
        entry: mockFn().returns({
          read: () => undefined,
        }),
        write: mockFn().returns(undefined),
      })
      const provider = mockObject<LowLevelProvider>({
        getLogs: mockFn()
          .throwsOnce(new Error('Log response size exceeded'))
          .returnsOnce([])
          .returnsOnce([]),
      })
      const multicallClient = mockObject<MulticallClient>()

      const batchingProvider = new BatchingAndCachingProvider(
        cache,
        provider,
        multicallClient,
        logger,
      )

      const address = EthereumAddress.random()
      const topic = 'aaaa'

      await expect(
        batchingProvider.getLogs(address, [topic], 1, 1),
      ).toBeRejected()

      expect(provider.getLogs).toHaveBeenNthCalledWith(
        1,
        address,
        [topic],
        1,
        1,
      )
    })
  })
})
