import { expect, mockFn, mockObject } from 'earl'
import { providers } from 'ethers'

import { EtherscanLikeClient } from '../../utils/EtherscanLikeClient'
import { Hash256 } from '../../utils/Hash256'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { DiscoveryCache, ProviderWithCache } from './ProviderWithCache'

function setupProviderWithMockCache(values: {
  curBlockNumber: number
  reorgSafeDepth: number | undefined
}) {
  const mockCache = mockObject<DiscoveryCache>({
    set: mockFn().resolvesTo(undefined),
    get: mockFn()
      .given('mockCachedKey')
      .resolvesToOnce('mockCachedValue')
      .given('mockNotCachedKey')
      .resolvesToOnce(undefined),
  })
  const mockProvider = mockObject<providers.JsonRpcProvider>({
    getBlockNumber: mockFn().resolvesTo(values.curBlockNumber),
  })
  const providerWithCache = new ProviderWithCache(
    mockProvider,
    mockObject<EtherscanLikeClient>({}),
    DiscoveryLogger.SILENT,
    'ethereum',
    mockCache,
    undefined,
    values.reorgSafeDepth,
  )
  return { providerWithCache, mockCache, mockProvider }
}

describe(ProviderWithCache.name, () => {
  describe(ProviderWithCache.prototype.cacheOrFetch.name, () => {
    it('works when reorgSafeDepth is undefined, value cached', async () => {
      const { providerWithCache, mockCache } = setupProviderWithMockCache({
        curBlockNumber: 1000,
        reorgSafeDepth: undefined,
      })

      const blockNumber = 1000
      const result = await providerWithCache.cacheOrFetch(
        'mockCachedKey',
        blockNumber,
        async () => 'mockNotCachedValue',
        (value) => value,
        (value) => value,
      )

      expect(result).toEqual('mockCachedValue')
      expect(mockCache.get).toHaveBeenCalledWith('mockCachedKey')
      expect(mockCache.set).toHaveBeenCalledTimes(0)
    })

    it('works when reorgSafeDepth is undefined, value not cached', async () => {
      const { providerWithCache, mockCache } = setupProviderWithMockCache({
        curBlockNumber: 1000,
        reorgSafeDepth: undefined,
      })

      const blockNumber = 1000
      const result = await providerWithCache.cacheOrFetch(
        'mockNotCachedKey',
        blockNumber,
        async () => 'mockNotCachedValue',
        (value) => value,
        (value) => value,
      )

      expect(result).toEqual('mockNotCachedValue')
      expect(mockCache.set).toHaveBeenCalledWith(
        'mockNotCachedKey',
        'mockNotCachedValue',
        'ethereum',
        blockNumber,
      )
    })

    it('sets cache when reorgSafeDepth not crossed', async () => {
      const { providerWithCache, mockCache } = setupProviderWithMockCache({
        curBlockNumber: 1000,
        reorgSafeDepth: 100,
      })

      const blockNumber = 900
      const result = await providerWithCache.cacheOrFetch(
        'mockNotCachedKey',
        blockNumber,
        async () => 'mockNotCachedValue',
        (value) => value,
        (value) => value,
      )

      expect(result).toEqual('mockNotCachedValue')
      expect(mockCache.get).toHaveBeenCalledWith('mockNotCachedKey')
      expect(mockCache.set).toHaveBeenCalledWith(
        'mockNotCachedKey',
        'mockNotCachedValue',
        'ethereum',
        blockNumber,
      )
    })

    it("doesn't cache when reorgSafeDepth is crossed", async () => {
      const { providerWithCache, mockCache } = setupProviderWithMockCache({
        curBlockNumber: 1000,
        reorgSafeDepth: 100,
      })

      const blockNumber = 901
      const result = await providerWithCache.cacheOrFetch(
        'mockNotCachedKey',
        blockNumber,
        async () => 'mockNotCachedValue',
        (value) => value,
        (value) => value,
      )

      expect(result).toEqual('mockNotCachedValue')
      expect(mockCache.get).toHaveBeenCalledWith('mockNotCachedKey')
      expect(mockCache.set).toHaveBeenCalledTimes(0)
    })
  })

  describe(ProviderWithCache.prototype.isBlockNumberReorgSafe.name, () => {
    it('returns true when reorgSafeDepth and blockNumber is undefined', async () => {
      const { providerWithCache, mockProvider } = setupProviderWithMockCache({
        curBlockNumber: 1000,
        reorgSafeDepth: undefined,
      })

      const blockNumber = undefined
      const result = await providerWithCache.isBlockNumberReorgSafe(blockNumber)

      expect(result).toEqual(true)
      expect(mockProvider.getBlockNumber).toHaveBeenCalledTimes(0)
    })

    it('returns true when reorgSafeDepth is undefined', async () => {
      const { providerWithCache, mockProvider } = setupProviderWithMockCache({
        curBlockNumber: 1000,
        reorgSafeDepth: undefined,
      })

      const blockNumber = 1000
      const result = await providerWithCache.isBlockNumberReorgSafe(blockNumber)

      expect(result).toEqual(true)
      expect(mockProvider.getBlockNumber).toHaveBeenCalledTimes(0)
    })

    it('returns true when reorgSafeDepth not crossed', async () => {
      const { providerWithCache, mockProvider } = setupProviderWithMockCache({
        curBlockNumber: 1000,
        reorgSafeDepth: 100,
      })

      const blockNumber = 900
      const result = await providerWithCache.isBlockNumberReorgSafe(blockNumber)

      expect(result).toEqual(true)
      expect(mockProvider.getBlockNumber).toHaveBeenCalledTimes(1)
    })

    it('returns false when reorgSafeDepth is crossed', async () => {
      const { providerWithCache, mockProvider } = setupProviderWithMockCache({
        curBlockNumber: 1000,
        reorgSafeDepth: 100,
      })

      const blockNumber = 901
      const result = await providerWithCache.isBlockNumberReorgSafe(blockNumber)

      expect(result).toEqual(false)
      expect(mockProvider.getBlockNumber).toHaveBeenCalledTimes(1)
    })

    it('refreshes curBlockNumber every 60 seconds', async () => {
      const { providerWithCache, mockProvider } = setupProviderWithMockCache({
        curBlockNumber: 1000,
        reorgSafeDepth: 100,
      })

      const blockNumber = 901
      const curTimeMs = 100_000_000

      await providerWithCache.isBlockNumberReorgSafe(blockNumber, curTimeMs)
      expect(mockProvider.getBlockNumber).toHaveBeenCalledTimes(1)

      await providerWithCache.isBlockNumberReorgSafe(
        blockNumber,
        curTimeMs + 30_000,
      )
      expect(mockProvider.getBlockNumber).toHaveBeenCalledTimes(1)

      await providerWithCache.isBlockNumberReorgSafe(
        blockNumber,
        curTimeMs + 40_000,
      )
      expect(mockProvider.getBlockNumber).toHaveBeenCalledTimes(1)

      await providerWithCache.isBlockNumberReorgSafe(
        blockNumber,
        curTimeMs + 60_000,
      )
      expect(mockProvider.getBlockNumber).toHaveBeenCalledTimes(2)

      await providerWithCache.isBlockNumberReorgSafe(
        blockNumber,
        curTimeMs + 90_000,
      )
      expect(mockProvider.getBlockNumber).toHaveBeenCalledTimes(2)

      await providerWithCache.isBlockNumberReorgSafe(
        blockNumber,
        curTimeMs + 120_000,
      )
      expect(mockProvider.getBlockNumber).toHaveBeenCalledTimes(3)
    })
  })

  describe(ProviderWithCache.prototype.getTransaction.name, () => {
    it('throws and does not cache non-mined transactions', async () => {
      const txHash = Hash256.random()

      const nonMinedTransactions = {
        transactionHash: txHash,
        blockNumber: undefined,
        blockHash: undefined,
        timestamp: undefined,
      }

      const { providerWithCache, mockCache, mockProvider } =
        setupProviderWithMockCache({
          curBlockNumber: 1000, // Doesn't matter
          reorgSafeDepth: 1000, // Doesn't matter
        })

      // Force cache-miss to trigger getTransaction
      mockCache.get = mockFn().resolvesToOnce(undefined)
      mockProvider.getTransaction = mockFn().resolvesTo(nonMinedTransactions)

      await expect(() =>
        providerWithCache.getTransaction(txHash),
      ).toBeRejectedWith('Transaction not mined')

      expect(mockCache.get).toHaveBeenCalledTimes(1)
      expect(mockCache.set).not.toHaveBeenCalled()
    })
  })
})
