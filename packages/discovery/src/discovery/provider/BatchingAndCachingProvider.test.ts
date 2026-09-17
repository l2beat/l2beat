import { Logger } from '@l2beat/backend-tools'
import { EthereumAddress } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import { BatchingAndCachingProvider } from './BatchingAndCachingProvider'
import type { LowLevelProvider } from './LowLevelProvider'
import type { MulticallClient } from './multicall/MulticallClient'
import type { ReorgAwareCache } from './ReorgAwareCache'

describe(BatchingAndCachingProvider.name, () => {
  const logger = Logger.SILENT

  describe(BatchingAndCachingProvider.prototype.getLogs.name, () => {
    it('divides on two calls', async () => {
      const cache = {
        entry: vi.fn().mockReturnValue({
          read: () => undefined,
        }),
        write: vi.fn().mockReturnValue(undefined),
      } as unknown as ReorgAwareCache
      const provider = {
        getLogs: vi
          .fn()
          .mockImplementationOnce(() => {
            throw new Error('Log response size exceeded')
          })
          .mockReturnValueOnce([])
          .mockReturnValueOnce([]),
      } as unknown as LowLevelProvider
      const multicallClient = {} as unknown as MulticallClient

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
      const cache = {
        entry: vi.fn().mockReturnValue({
          read: () => undefined,
        }),
        write: vi.fn().mockReturnValue(undefined),
      } as unknown as ReorgAwareCache
      const provider = {
        getLogs: vi
          .fn()
          .mockImplementationOnce(() => {
            throw new Error('Log response size exceeded')
          })
          .mockReturnValueOnce([])
          .mockReturnValueOnce([]),
      } as unknown as LowLevelProvider
      const multicallClient = {} as unknown as MulticallClient

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
      const cache = {
        entry: vi.fn().mockReturnValue({
          read: () => undefined,
        }),
        write: vi.fn().mockReturnValue(undefined),
      } as unknown as ReorgAwareCache
      const provider = {
        getLogs: vi
          .fn()
          .mockImplementationOnce(() => {
            throw new Error('Log response size exceeded')
          })
          .mockReturnValueOnce([])
          .mockReturnValueOnce([]),
      } as unknown as LowLevelProvider
      const multicallClient = {} as unknown as MulticallClient

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
      ).rejects.toThrow()

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
