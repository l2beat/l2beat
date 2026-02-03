import type { InteropTransferRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getAggregatedTokens, getAggregatedTransfer } from './aggregation'

describe('aggregation', () => {
  const timestamp = UnixTime.now()

  describe(getAggregatedTransfer.name, () => {
    it('aggregates a single transfer correctly', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
        }),
      ]

      const result = getAggregatedTransfer(transfers)

      expect(result).toEqual({
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        transferCount: 1,
        totalDurationSum: 5000,
        srcValueUsd: 2000,
        dstValueUsd: 2000,
        avgValueInFlight: undefined,
        netMinted: undefined,
        countUnder100: 0,
        count100To1K: 0,
        count1KTo10K: 1,
        count10KTo100K: 0,
        countOver100K: 0,
        identifiedCount: 1,
      })
    })

    it('aggregates multiple transfers correctly', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 6000,
          srcValueUsd: 3000,
          dstValueUsd: 3000,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 4000,
          srcValueUsd: 1500.5,
          dstValueUsd: 1500.5,
        }),
      ]

      const result = getAggregatedTransfer(transfers)

      expect(result).toEqual({
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        transferCount: 3,
        totalDurationSum: 15000,
        srcValueUsd: 6500.5,
        dstValueUsd: 6500.5,
        avgValueInFlight: undefined,
        netMinted: undefined,
        countUnder100: 0,
        count100To1K: 0,
        count1KTo10K: 3,
        count10KTo100K: 0,
        countOver100K: 0,
        identifiedCount: 3,
      })
    })

    it('handles transfers with undefined USD values', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 5000,
          srcValueUsd: undefined,
          dstValueUsd: undefined,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 6000,
          srcValueUsd: 3000,
          dstValueUsd: undefined,
        }),
      ]

      const result = getAggregatedTransfer(transfers)

      expect(result).toEqual({
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        transferCount: 2,
        totalDurationSum: 11000,
        srcValueUsd: 3000,
        dstValueUsd: 3000,
        avgValueInFlight: undefined,
        netMinted: undefined,
        countUnder100: 0,
        count100To1K: 0,
        count1KTo10K: 1,
        count10KTo100K: 0,
        countOver100K: 0,
        identifiedCount: 1,
      })
    })

    it('rounds USD values to 2 decimal places', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 5000,
          srcValueUsd: 1000.123456,
          dstValueUsd: 2000.987654,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 6000,
          srcValueUsd: 2000.111111,
          dstValueUsd: 3000.222222,
        }),
      ]

      const result = getAggregatedTransfer(transfers)

      expect(result.srcValueUsd).toEqual(3000.23)
      expect(result.dstValueUsd).toEqual(5001.21)
    })

    it('correctly buckets transfers by size', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 1000,
          srcValueUsd: 50, // under 100
          dstValueUsd: 50,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 2000,
          srcValueUsd: undefined, // 100-1K
          dstValueUsd: 500,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 3000,
          srcValueUsd: 5000, // 1K-10K
          dstValueUsd: 5000,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 4000,
          srcValueUsd: 50000, // 10K-100K
          dstValueUsd: 50000,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 5000,
          srcValueUsd: 200000, // over 100K
          dstValueUsd: 200000,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 5000,
          srcValueUsd: undefined,
          dstValueUsd: undefined,
        }),
      ]

      const result = getAggregatedTransfer(transfers)

      expect(result).toEqual({
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        transferCount: 6,
        totalDurationSum: 20000,
        srcValueUsd: 255550,
        dstValueUsd: 255550,
        avgValueInFlight: undefined,
        netMinted: undefined,
        countUnder100: 1,
        count100To1K: 1,
        count1KTo10K: 1,
        count10KTo100K: 1,
        countOver100K: 1,
        identifiedCount: 5,
      })
    })

    it('calculates average value at risk correctly', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 6000,
          srcValueUsd: 3000,
          dstValueUsd: 3000,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 4000,
          srcValueUsd: 1500,
          dstValueUsd: 1500,
        }),
      ]

      const result = getAggregatedTransfer(transfers, {
        calculateValueInFlight: true,
      })

      // valueInFlight = (2000 * 5000) + (3000 * 6000) + (1500 * 4000)
      //             = 10,000,000 + 18,000,000 + 6,000,000
      //             = 34,000,000
      // avgValueInFlight = 34,000,000 / 86,400 ≈ 393.52
      expect(result.avgValueInFlight).toEqual(393.52)
    })

    it('calculates average value at risk using dstValueUsd when srcValueUsd is undefined', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 5000,
          srcValueUsd: undefined,
          dstValueUsd: 2000,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 6000,
          srcValueUsd: 3000,
          dstValueUsd: undefined,
        }),
      ]

      const result = getAggregatedTransfer(transfers, {
        calculateValueInFlight: true,
      })

      // valueInFlight = (2000 * 5000) + (3000 * 6000)
      //             = 10,000,000 + 18,000,000
      //             = 28,000,000
      // avgValueInFlight = 28,000,000 / 86,400 ≈ 324.07
      expect(result.avgValueInFlight).toEqual(324.07)
    })

    it('calculates net minted correctly with mixed minting and burning', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
          srcWasBurned: false,
          dstWasMinted: true,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 6000,
          srcValueUsd: 3000,
          dstValueUsd: 3000,
          srcWasBurned: true,
          dstWasMinted: false,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 4000,
          srcValueUsd: 1000,
          dstValueUsd: 1000,
          srcWasBurned: false,
          dstWasMinted: true,
        }),
      ]

      const result = getAggregatedTransfer(transfers, {
        calculateNetMinted: true,
      })

      // mintedValueUsd = 2000 + 1000 = 3000
      // burnedValueUsd = 3000
      // netMinted = 3000 - 3000 = 0
      expect(result.netMinted).toEqual(0)
    })

    it('ignores transfers that are not minting or burning', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
          srcWasBurned: false,
          dstWasMinted: true,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 6000,
          srcValueUsd: 3000,
          dstValueUsd: 3000,
          srcWasBurned: true,
          dstWasMinted: true, // both burned and minted - should be ignored
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 4000,
          srcValueUsd: 1000,
          dstValueUsd: 1000,
          srcWasBurned: false,
          dstWasMinted: false, // neither burned nor minted - should be ignored
        }),
      ]

      const result = getAggregatedTransfer(transfers, {
        calculateNetMinted: true,
      })

      // Only the first transfer counts (minting)
      // mintedValueUsd = 2000
      // burnedValueUsd = 0
      // netMinted = 2000 - 0 = 2000
      expect(result.netMinted).toEqual(2000)
    })

    it('correctly counts identified transfers', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 6000,
          srcValueUsd: 3000,
          dstValueUsd: 3000,
          srcAbstractTokenId: undefined,
          dstAbstractTokenId: 'usdc',
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 4000,
          srcValueUsd: 1500,
          dstValueUsd: 1500,
          srcAbstractTokenId: 'btc',
          dstAbstractTokenId: undefined,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 3000,
          srcValueUsd: 1000,
          dstValueUsd: 1000,
          srcAbstractTokenId: undefined,
          dstAbstractTokenId: undefined,
        }),
      ]

      const result = getAggregatedTransfer(transfers)

      expect(result.identifiedCount).toEqual(4)
    })

    it('throws error when group is empty', () => {
      const transfers: InteropTransferRecord[] = []

      expect(() => getAggregatedTransfer(transfers)).toThrow('Group is empty')
    })
  })

  describe(getAggregatedTokens.name, () => {
    it('aggregates single transfer with same src/dst token correctly', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
        }),
      ]

      const result = getAggregatedTokens(transfers)

      expect(result).toEqual([
        {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'eth',
          transferCount: 1,
          totalDurationSum: 5000,
          volume: 2000,
        },
      ])
    })

    it('aggregates single transfer with different src/dst tokens correctly', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'usdc',
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 1500,
        }),
      ]

      const result = getAggregatedTokens(transfers)

      expect(result).toHaveLength(2)
      expect(result).toEqual([
        {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'eth',
          transferCount: 1,
          totalDurationSum: 5000,
          volume: 2000,
        },
        {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'usdc',
          transferCount: 1,
          totalDurationSum: 5000,
          volume: 1500,
        },
      ])
    })

    it('aggregates multiple transfers correctly per token', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: 6000,
          srcValueUsd: 3000,
          dstValueUsd: 3000,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'usdc',
          dstAbstractTokenId: 'usdc',
          duration: 4000,
          srcValueUsd: 1000,
          dstValueUsd: 1000,
        }),
      ]

      const result = getAggregatedTokens(transfers)

      expect(result).toHaveLength(2)
      expect(result).toEqual([
        {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'eth',
          transferCount: 2,
          totalDurationSum: 11000,
          volume: 5000,
        },
        {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'usdc',
          transferCount: 1,
          totalDurationSum: 4000,
          volume: 1000,
        },
      ])
    })

    it('skips transfers without token IDs', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: undefined,
          dstAbstractTokenId: undefined,
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: 6000,
          srcValueUsd: 3000,
          dstValueUsd: 3000,
        }),
      ]

      const result = getAggregatedTokens(transfers)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        abstractTokenId: 'eth',
        transferCount: 1,
        totalDurationSum: 6000,
        volume: 3000,
      })
    })

    it('handles undefined USD values in volume calculation', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: 5000,
          srcValueUsd: undefined,
          dstValueUsd: undefined,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: 6000,
          srcValueUsd: 3000,
          dstValueUsd: 3000,
        }),
      ]

      const result = getAggregatedTokens(transfers)

      expect(result).toEqual([
        {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'eth',
          transferCount: 2,
          totalDurationSum: 11000,
          volume: 3000,
        },
      ])
    })

    it('throws error when group is empty', () => {
      const transfers: InteropTransferRecord[] = []

      expect(() => getAggregatedTokens(transfers)).toThrow('Group is empty')
    })
  })
})

function createTransfer(overrides: {
  timestamp: UnixTime
  srcChain: string
  dstChain: string
  srcAbstractTokenId?: string
  dstAbstractTokenId?: string
  duration: number
  srcValueUsd?: number
  dstValueUsd?: number
  srcWasBurned?: boolean
  dstWasMinted?: boolean
}): InteropTransferRecord {
  return {
    plugin: 'test-plugin',
    transferId: 'test-transfer-id',
    type: 'deposit',
    timestamp: overrides.timestamp,
    srcTime: overrides.timestamp,
    srcTxHash: 'random-hash',
    srcLogIndex: 0,
    srcEventId: 'random-event-id',
    srcTokenAddress: undefined,
    srcRawAmount: undefined,
    srcWasBurned: overrides.srcWasBurned ?? undefined,
    srcSymbol: undefined,
    srcAmount: undefined,
    srcPrice: undefined,
    dstTime: overrides.timestamp + overrides.duration,
    dstTxHash: 'random-hash',
    dstLogIndex: 0,
    dstEventId: 'random-event-id',
    dstTokenAddress: undefined,
    dstRawAmount: undefined,
    dstWasMinted: overrides.dstWasMinted ?? undefined,
    dstSymbol: undefined,
    dstAmount: undefined,
    dstPrice: undefined,
    isProcessed: false,
    srcChain: overrides.srcChain,
    dstChain: overrides.dstChain,
    duration: overrides.duration,
    srcAbstractTokenId: overrides.srcAbstractTokenId ?? undefined,
    dstAbstractTokenId: overrides.dstAbstractTokenId ?? undefined,
    srcValueUsd: overrides.srcValueUsd ?? undefined,
    dstValueUsd: overrides.dstValueUsd ?? undefined,
  }
}
