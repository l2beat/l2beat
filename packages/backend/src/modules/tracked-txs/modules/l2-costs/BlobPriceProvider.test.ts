import { Logger } from '@l2beat/backend-tools'
import type { EVMFeeHistory, IRpcClient } from '@l2beat/shared'
import { expect, mockFn, mockObject } from 'earl'
import { BlobPriceProvider } from './BlobPriceProvider'

describe(BlobPriceProvider.name, () => {
  const mockLogger = Logger.SILENT

  function createProvider(rpcClient: IRpcClient): BlobPriceProvider {
    return new BlobPriceProvider(mockLogger, rpcClient)
  }

  function createFeeHistory(
    oldestBlock: number,
    blobBaseFees: bigint[],
  ): EVMFeeHistory {
    return {
      oldestBlock,
      baseFeePerGas: blobBaseFees.map(() => 0n),
      gasUsedRatio: blobBaseFees.map(() => 0),
      baseFeePerBlobGas: blobBaseFees,
      blobGasUsedRatio: blobBaseFees.map(() => 0),
      reward: [],
    }
  }

  describe(BlobPriceProvider.prototype.getBlobPricesByBlockRange.name, () => {
    it('throws error when oldestBlock > newestBlock', async () => {
      const mockRpcClient = mockObject<IRpcClient>({
        getFeeHistory: mockFn(),
      })
      const provider = createProvider(mockRpcClient)

      await expect(
        provider.getBlobPricesByBlockRange([100, 50]),
      ).toBeRejectedWith(
        'Invalid block range: oldestBlock (100) is greater than newestBlock (50)',
      )
      expect(mockRpcClient.getFeeHistory).not.toHaveBeenCalled()
    })

    it('returns empty map when oldestBlock equals newestBlock and no fees', async () => {
      const mockRpcClient = mockObject<IRpcClient>({
        getFeeHistory: mockFn().resolvesTo(createFeeHistory(100, [0n])),
      })
      const provider = createProvider(mockRpcClient)

      const result = await provider.getBlobPricesByBlockRange([100, 100])

      expect(result).toEqual(new Map())
      expect(mockRpcClient.getFeeHistory).toHaveBeenCalledWith(1, 100, [])
    })

    it('returns blob prices for single block range', async () => {
      const mockRpcClient = mockObject<IRpcClient>({
        getFeeHistory: mockFn().resolvesTo(createFeeHistory(100, [10n])),
      })
      const provider = createProvider(mockRpcClient)

      const result = await provider.getBlobPricesByBlockRange([100, 100])

      expect(result).toEqual(new Map([[100, 10n]]))
      expect(mockRpcClient.getFeeHistory).toHaveBeenCalledWith(1, 100, [])
    })

    it('skips zero blob fees', async () => {
      const mockRpcClient = mockObject<IRpcClient>({
        getFeeHistory: mockFn().resolvesTo(
          createFeeHistory(100, [0n, 10n, 0n, 20n]),
        ),
      })
      const provider = createProvider(mockRpcClient)

      const result = await provider.getBlobPricesByBlockRange([100, 103])

      expect(result).toEqual(
        new Map([
          [101, 10n],
          [103, 20n],
        ]),
      )
    })

    it('handles range within single request (< 1000 blocks)', async () => {
      const blobFees = Array.from({ length: 100 }, (_, i) =>
        i % 2 === 0 ? BigInt(i + 1) : 0n,
      )
      const mockRpcClient = mockObject<IRpcClient>({
        getFeeHistory: mockFn().resolvesTo(createFeeHistory(100, blobFees)),
      })
      const provider = createProvider(mockRpcClient)

      const result = await provider.getBlobPricesByBlockRange([100, 199])

      const expected = new Map<number, bigint>()
      for (let i = 0; i < 100; i++) {
        if (i % 2 === 0) {
          expected.set(100 + i, BigInt(i + 1))
        }
      }

      expect(result).toEqual(expected)
      expect(mockRpcClient.getFeeHistory).toHaveBeenCalledWith(100, 199, [])
    })

    it('handles range requiring multiple requests (> 1000 blocks)', async () => {
      const firstChunkFees = Array.from({ length: 1000 }, (_, i) =>
        BigInt(i + 1),
      )
      const secondChunkFees = Array.from({ length: 50 }, (_, i) =>
        BigInt(i + 1001),
      )

      const mockRpcClient = mockObject<IRpcClient>({
        getFeeHistory: mockFn()
          .resolvesToOnce(createFeeHistory(100, firstChunkFees))
          .resolvesToOnce(createFeeHistory(50, secondChunkFees)),
      })
      const provider = createProvider(mockRpcClient)

      const result = await provider.getBlobPricesByBlockRange([50, 1099])

      expect(result.size).toEqual(1050)
      expect(result.get(100)).toEqual(1n)
      expect(result.get(1099)).toEqual(1000n)
      expect(result.get(50)).toEqual(1001n)
      expect(result.get(549)).toEqual(450n)

      expect(mockRpcClient.getFeeHistory).toHaveBeenCalledTimes(2)
      expect(mockRpcClient.getFeeHistory).toHaveBeenNthCalledWith(
        1,
        1000,
        1099,
        [],
      )
      expect(mockRpcClient.getFeeHistory).toHaveBeenNthCalledWith(2, 50, 99, [])
    })

    it('handles exactly 1000 blocks', async () => {
      const blobFees = Array.from({ length: 1000 }, (_, i) => BigInt(i + 1))
      const mockRpcClient = mockObject<IRpcClient>({
        getFeeHistory: mockFn().resolvesTo(createFeeHistory(100, blobFees)),
      })
      const provider = createProvider(mockRpcClient)

      const result = await provider.getBlobPricesByBlockRange([100, 1099])

      expect(result.size).toEqual(1000)
      expect(result.get(100)).toEqual(1n)
      expect(result.get(1099)).toEqual(1000n)
      expect(mockRpcClient.getFeeHistory).toHaveBeenCalledWith(1000, 1099, [])
    })

    it('handles range requiring 3 requests', async () => {
      const chunk1Fees = Array.from({ length: 1000 }, () => 10n)
      const chunk2Fees = Array.from({ length: 1000 }, () => 20n)
      const chunk3Fees = Array.from({ length: 500 }, () => 30n)

      const mockRpcClient = mockObject<IRpcClient>({
        getFeeHistory: mockFn()
          .resolvesToOnce(createFeeHistory(2000, chunk1Fees))
          .resolvesToOnce(createFeeHistory(1000, chunk2Fees))
          .resolvesToOnce(createFeeHistory(500, chunk3Fees)),
      })
      const provider = createProvider(mockRpcClient)

      const result = await provider.getBlobPricesByBlockRange([500, 2999])

      expect(result.size).toEqual(2500)
      expect(result.get(2000)).toEqual(10n)
      expect(result.get(2999)).toEqual(10n)
      expect(result.get(1000)).toEqual(20n)
      expect(result.get(1999)).toEqual(20n)
      expect(result.get(500)).toEqual(30n)
      expect(result.get(999)).toEqual(30n)

      expect(mockRpcClient.getFeeHistory).toHaveBeenCalledTimes(3)
      expect(mockRpcClient.getFeeHistory).toHaveBeenNthCalledWith(
        1,
        1000,
        2999,
        [],
      )
      expect(mockRpcClient.getFeeHistory).toHaveBeenNthCalledWith(
        2,
        1000,
        1999,
        [],
      )
      expect(mockRpcClient.getFeeHistory).toHaveBeenNthCalledWith(
        3,
        500,
        999,
        [],
      )
    })

    it('only includes blocks within requested range', async () => {
      // Request range [100, 105] but feeHistory returns more blocks
      const mockRpcClient = mockObject<IRpcClient>({
        getFeeHistory: mockFn().resolvesTo(
          createFeeHistory(98, [1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n]),
        ),
      })
      const provider = createProvider(mockRpcClient)

      const result = await provider.getBlobPricesByBlockRange([100, 105])

      expect(result).toEqual(
        new Map([
          [100, 3n],
          [101, 4n],
          [102, 5n],
          [103, 6n],
          [104, 7n],
          [105, 8n],
        ]),
      )
    })

    it('handles all zero fees in range', async () => {
      const blobFees = Array.from({ length: 10 }, () => 0n)
      const mockRpcClient = mockObject<IRpcClient>({
        getFeeHistory: mockFn().resolvesTo(createFeeHistory(100, blobFees)),
      })
      const provider = createProvider(mockRpcClient)

      const result = await provider.getBlobPricesByBlockRange([100, 109])

      expect(result).toEqual(new Map())
    })

    it('propagates errors from RPC client', async () => {
      const error = new Error('RPC error')
      const mockRpcClient = mockObject<IRpcClient>({
        getFeeHistory: mockFn().rejectsWith(error),
      })
      const provider = createProvider(mockRpcClient)

      await expect(
        provider.getBlobPricesByBlockRange([100, 200]),
      ).toBeRejectedWith('RPC error')
    })

    it('throws error when block number is already set (overlapping ranges)', async () => {
      const mockRpcClient = mockObject<IRpcClient>({
        getFeeHistory: mockFn()
          .resolvesToOnce(createFeeHistory(100, [10n, 20n]))
          .resolvesToOnce(createFeeHistory(100, [30n, 40n])), // Overlaps with first response
      })
      const provider = createProvider(mockRpcClient)

      await expect(
        provider.getBlobPricesByBlockRange([99, 1500]),
      ).toBeRejectedWith(
        'Blob price for block 100 was already set. This indicates overlapping ranges or duplicate processing.',
      )
    })
  })
})
