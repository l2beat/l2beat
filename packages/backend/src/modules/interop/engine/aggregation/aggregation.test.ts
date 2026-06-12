import type { InteropTransferRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getAggregatedTokens,
  getAggregatedTokensPairs,
  getAggregatedTransfer,
} from './aggregation'

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
        transferTypeStats: {
          deposit: { transferCount: 1, totalDurationSum: 5000 },
        },
        transferCount: 1,
        transfersWithDurationCount: 1,
        totalDurationSum: 5000,
        srcValueUsd: 2000,
        dstValueUsd: 2000,
        minTransferValueUsd: 2000,
        maxTransferValueUsd: 2000,
        avgValueInFlight: undefined,
        mintedValueUsd: undefined,
        burnedValueUsd: undefined,
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
        transferTypeStats: {
          deposit: { transferCount: 3, totalDurationSum: 15000 },
        },
        transferCount: 3,
        transfersWithDurationCount: 3,
        totalDurationSum: 15000,
        srcValueUsd: 6500.5,
        dstValueUsd: 6500.5,
        minTransferValueUsd: 1500.5,
        maxTransferValueUsd: 3000,
        avgValueInFlight: undefined,
        mintedValueUsd: undefined,
        burnedValueUsd: undefined,
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
        transferTypeStats: {
          deposit: { transferCount: 2, totalDurationSum: 11000 },
        },
        transferCount: 2,
        transfersWithDurationCount: 2,
        totalDurationSum: 11000,
        srcValueUsd: 3000,
        dstValueUsd: 3000,
        minTransferValueUsd: 3000,
        maxTransferValueUsd: 3000,
        avgValueInFlight: undefined,
        mintedValueUsd: undefined,
        burnedValueUsd: undefined,
        countUnder100: 0,
        count100To1K: 0,
        count1KTo10K: 1,
        count10KTo100K: 0,
        countOver100K: 0,
        identifiedCount: 1,
      })
    })

    it('excludes undefined durations from duration stats', () => {
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
          duration: undefined,
          srcValueUsd: 3000,
          dstValueUsd: 3000,
        }),
      ]

      const result = getAggregatedTransfer(transfers)

      expect(result.transferCount).toEqual(2)
      expect(result.transfersWithDurationCount).toEqual(1)
      expect(result.totalDurationSum).toEqual(5000)
      expect(result.transferTypeStats).toEqual({
        deposit: { transferCount: 1, totalDurationSum: 5000 },
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
        transferTypeStats: {
          deposit: { transferCount: 6, totalDurationSum: 20000 },
        },
        transferCount: 6,
        transfersWithDurationCount: 6,
        totalDurationSum: 20000,
        srcValueUsd: 255550,
        dstValueUsd: 255550,
        minTransferValueUsd: 50,
        maxTransferValueUsd: 200000,
        avgValueInFlight: undefined,
        mintedValueUsd: undefined,
        burnedValueUsd: undefined,
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

    it('sums net mint and burn for strict lock-and-mint flags', () => {
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
          srcValueUsd: 2000,
          dstValueUsd: 2000,
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
      // burnedValueUsd = 2000
      expect(result.mintedValueUsd).toEqual(3000)
      expect(result.burnedValueUsd).toEqual(2000)
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

      // Only the first transfer counts (minting); no burn total → field omitted
      expect(result.mintedValueUsd).toEqual(2000)
      expect(result.burnedValueUsd).toEqual(undefined)
    })

    it('two-sided transfers omit net mint or burn unless src/dst booleans are strict pairs', () => {
      const mintNeedsExplicitNotBurn = getAggregatedTransfer(
        [
          createTransfer({
            timestamp,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            duration: 1000,
            srcValueUsd: 10,
            dstValueUsd: 10,
            dstWasMinted: true,
          }),
        ],
        { calculateNetMinted: true },
      ).mintedValueUsd

      expect(mintNeedsExplicitNotBurn).toEqual(undefined)

      const burnNeedsExplicitNotMint = getAggregatedTransfer(
        [
          createTransfer({
            timestamp,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            duration: 1000,
            srcValueUsd: 10,
            dstValueUsd: 10,
            srcWasBurned: true,
          }),
        ],
        { calculateNetMinted: true },
      ).burnedValueUsd

      expect(burnNeedsExplicitNotMint).toEqual(undefined)
    })

    it('one-sided transfers use loose burn/mint booleans for net minted', () => {
      const mintOnlyDstFlag = getAggregatedTransfer(
        [
          createTransfer({
            timestamp,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            duration: 1000,
            srcValueUsd: 10,
            dstValueUsd: 10,
            srcEventId: undefined,
            dstWasMinted: true,
          }),
        ],
        { calculateNetMinted: true },
      ).mintedValueUsd

      expect(mintOnlyDstFlag).toEqual(10)

      const burnOnlySrcFlag = getAggregatedTransfer(
        [
          createTransfer({
            timestamp,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            duration: 1000,
            srcValueUsd: 10,
            dstValueUsd: 10,
            dstEventId: undefined,
            srcWasBurned: true,
          }),
        ],
        { calculateNetMinted: true },
      ).burnedValueUsd

      expect(burnOnlySrcFlag).toEqual(10)
    })

    it('omits net mint and burn when both burn/mint booleans are unset', () => {
      const twoSided = getAggregatedTransfer(
        [
          createTransfer({
            timestamp,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            duration: 1000,
            srcValueUsd: 100,
            dstValueUsd: 100,
            srcWasBurned: undefined,
            dstWasMinted: undefined,
          }),
        ],
        { calculateNetMinted: true },
      )

      expect(twoSided.mintedValueUsd).toEqual(undefined)
      expect(twoSided.burnedValueUsd).toEqual(undefined)

      const oneSided = getAggregatedTransfer(
        [
          createTransfer({
            timestamp,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            duration: 1000,
            srcValueUsd: 100,
            dstValueUsd: 100,
            srcEventId: undefined,
            srcWasBurned: undefined,
            dstWasMinted: undefined,
          }),
        ],
        { calculateNetMinted: true },
      )

      expect(oneSided.mintedValueUsd).toEqual(undefined)
      expect(oneSided.burnedValueUsd).toEqual(undefined)
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

    it('tracks duration stats separately for each transfer type', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          type: 'taxi',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 2000,
          srcValueUsd: 100,
          dstValueUsd: 100,
        }),
        createTransfer({
          timestamp,
          type: 'bus',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 8000,
          srcValueUsd: 100,
          dstValueUsd: 100,
        }),
        createTransfer({
          timestamp,
          type: 'taxi',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          duration: 3000,
          srcValueUsd: 100,
          dstValueUsd: 100,
        }),
      ]

      const result = getAggregatedTransfer(transfers)

      expect(result.transferTypeStats).toEqual({
        taxi: { transferCount: 2, totalDurationSum: 5000 },
        bus: { transferCount: 1, totalDurationSum: 8000 },
      })
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
          transferTypeStats: {
            deposit: { transferCount: 1, totalDurationSum: 5000 },
          },
          transferCount: 1,
          transfersWithDurationCount: 1,
          totalDurationSum: 5000,
          volume: 2000,
          minTransferValueUsd: 2000,
          maxTransferValueUsd: 2000,
          mintedValueUsd: undefined,
          burnedValueUsd: undefined,
        },
      ])
    })

    it('excludes undefined durations from token duration stats', () => {
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
          duration: undefined,
          srcValueUsd: 3000,
          dstValueUsd: 3000,
        }),
      ]

      const result = getAggregatedTokens(transfers)

      expect(result).toHaveLength(1)
      expect(result[0]?.transferCount).toEqual(2)
      expect(result[0]?.transfersWithDurationCount).toEqual(1)
      expect(result[0]?.totalDurationSum).toEqual(5000)
      expect(result[0]?.transferTypeStats).toEqual({
        deposit: { transferCount: 1, totalDurationSum: 5000 },
      })
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
          transferTypeStats: {
            deposit: { transferCount: 1, totalDurationSum: 5000 },
          },
          transferCount: 1,
          transfersWithDurationCount: 1,
          totalDurationSum: 5000,
          volume: 2000,
          minTransferValueUsd: 2000,
          maxTransferValueUsd: 2000,
          mintedValueUsd: undefined,
          burnedValueUsd: undefined,
        },
        {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'usdc',
          transferTypeStats: {
            deposit: { transferCount: 1, totalDurationSum: 5000 },
          },
          transferCount: 1,
          transfersWithDurationCount: 1,
          totalDurationSum: 5000,
          volume: 1500,
          minTransferValueUsd: 1500,
          maxTransferValueUsd: 1500,
          mintedValueUsd: undefined,
          burnedValueUsd: undefined,
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
          transferTypeStats: {
            deposit: { transferCount: 2, totalDurationSum: 11000 },
          },
          transferCount: 2,
          transfersWithDurationCount: 2,
          totalDurationSum: 11000,
          volume: 5000,
          minTransferValueUsd: 2000,
          maxTransferValueUsd: 3000,
          mintedValueUsd: undefined,
          burnedValueUsd: undefined,
        },
        {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'usdc',
          transferTypeStats: {
            deposit: { transferCount: 1, totalDurationSum: 4000 },
          },
          transferCount: 1,
          transfersWithDurationCount: 1,
          totalDurationSum: 4000,
          volume: 1000,
          minTransferValueUsd: 1000,
          maxTransferValueUsd: 1000,
          mintedValueUsd: undefined,
          burnedValueUsd: undefined,
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
        transferTypeStats: {
          deposit: { transferCount: 1, totalDurationSum: 6000 },
        },
        transferCount: 1,
        transfersWithDurationCount: 1,
        totalDurationSum: 6000,
        volume: 3000,
        minTransferValueUsd: 3000,
        maxTransferValueUsd: 3000,
        mintedValueUsd: undefined,
        burnedValueUsd: undefined,
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
          transferTypeStats: {
            deposit: { transferCount: 2, totalDurationSum: 11000 },
          },
          transferCount: 2,
          transfersWithDurationCount: 2,
          totalDurationSum: 11000,
          volume: 3000,
          minTransferValueUsd: 3000,
          maxTransferValueUsd: 3000,
          mintedValueUsd: undefined,
          burnedValueUsd: undefined,
        },
      ])
    })

    it('tracks duration stats per token for each transfer type', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          type: 'taxi',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: 2000,
          srcValueUsd: 100,
          dstValueUsd: 100,
        }),
        createTransfer({
          timestamp,
          type: 'bus',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: 8000,
          srcValueUsd: 100,
          dstValueUsd: 100,
        }),
      ]

      const result = getAggregatedTokens(transfers)

      expect(result[0]?.transferTypeStats).toEqual({
        taxi: { transferCount: 1, totalDurationSum: 2000 },
        bus: { transferCount: 1, totalDurationSum: 8000 },
      })
    })

    it('throws error when group is empty', () => {
      const transfers: InteropTransferRecord[] = []

      expect(() => getAggregatedTokens(transfers)).toThrow('Group is empty')
    })

    describe('burned and minted value calculations', () => {
      it('calculates burned and minted values correctly for various scenarios', () => {
        const transfers: InteropTransferRecord[] = [
          // ETH burned (srcWasBurned=true, dstWasMinted=false)
          createTransfer({
            timestamp,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            srcAbstractTokenId: 'eth',
            dstAbstractTokenId: 'usdc',
            duration: 5000,
            srcValueUsd: 2000,
            dstValueUsd: 1500,
            srcWasBurned: true,
            dstWasMinted: false,
          }),
          // ETH burned again
          createTransfer({
            timestamp,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            srcAbstractTokenId: 'eth',
            dstAbstractTokenId: 'usdc',
            duration: 6000,
            srcValueUsd: 3000,
            dstValueUsd: 2500,
            srcWasBurned: true,
            dstWasMinted: false,
          }),
          // ETH minted (same token, srcWasBurned=false, dstWasMinted=true)
          createTransfer({
            timestamp,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            srcAbstractTokenId: 'eth',
            dstAbstractTokenId: 'eth',
            duration: 4000,
            srcValueUsd: 1000,
            dstValueUsd: 1000,
            srcWasBurned: false,
            dstWasMinted: true,
          }),
          // USDC minted (different token, srcWasBurned=false, dstWasMinted=true)
          createTransfer({
            timestamp,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            srcAbstractTokenId: 'btc',
            dstAbstractTokenId: 'usdc',
            duration: 3000,
            srcValueUsd: 5000,
            dstValueUsd: 4000,
            srcWasBurned: false,
            dstWasMinted: true,
          }),
          // BTC minted (same token)
          createTransfer({
            timestamp,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            srcAbstractTokenId: 'btc',
            dstAbstractTokenId: 'btc',
            duration: 2000,
            srcValueUsd: 3000,
            dstValueUsd: 3000,
            srcWasBurned: false,
            dstWasMinted: true,
          }),
        ]

        const result = getAggregatedTokens(transfers, {
          calculateNetMinted: true,
        })

        const ethToken = result.find((t) => t.abstractTokenId === 'eth')
        const usdcToken = result.find((t) => t.abstractTokenId === 'usdc')
        const btcToken = result.find((t) => t.abstractTokenId === 'btc')

        // ETH: burned 5000, minted 1000
        expect(ethToken?.burnedValueUsd).toEqual(5000)
        expect(ethToken?.mintedValueUsd).toEqual(1000)

        // USDC: minted 4000 (from different token transfer)
        expect(usdcToken?.mintedValueUsd).toEqual(4000)
        expect(usdcToken?.burnedValueUsd).toEqual(0)

        // BTC: minted 3000 (from same token transfer)
        expect(btcToken?.mintedValueUsd).toEqual(3000)
        expect(btcToken?.burnedValueUsd).toEqual(0)
      })

      it('handles undefined USD values by using fallback values', () => {
        const transfers: InteropTransferRecord[] = [
          // Burned with undefined srcValueUsd (uses dstValueUsd)
          createTransfer({
            timestamp,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            srcAbstractTokenId: 'eth',
            dstAbstractTokenId: 'usdc',
            duration: 5000,
            srcValueUsd: undefined,
            dstValueUsd: 1500,
            srcWasBurned: true,
            dstWasMinted: false,
          }),
          // Minted with undefined dstValueUsd (uses srcValueUsd)
          createTransfer({
            timestamp,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            srcAbstractTokenId: 'eth',
            dstAbstractTokenId: 'eth',
            duration: 4000,
            srcValueUsd: 2000,
            dstValueUsd: undefined,
            srcWasBurned: false,
            dstWasMinted: true,
          }),
        ]

        const result = getAggregatedTokens(transfers, {
          calculateNetMinted: true,
        })

        const ethToken = result.find((t) => t.abstractTokenId === 'eth')
        expect(ethToken?.burnedValueUsd).toEqual(1500) // uses dstValueUsd fallback
        expect(ethToken?.mintedValueUsd).toEqual(2000) // uses srcValueUsd fallback
      })

      it('attributes net minted values to known token when opposite token is missing', () => {
        const transfers: InteropTransferRecord[] = [
          // Minted transfer with missing destination token ID.
          createTransfer({
            timestamp,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            srcAbstractTokenId: 'axs',
            dstAbstractTokenId: undefined,
            duration: 4000,
            srcValueUsd: 35.43,
            dstValueUsd: undefined,
            srcWasBurned: false,
            dstWasMinted: true,
          }),
          // Burned transfer with missing source token ID.
          createTransfer({
            timestamp,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            srcAbstractTokenId: undefined,
            dstAbstractTokenId: 'usdc',
            duration: 5000,
            srcValueUsd: undefined,
            dstValueUsd: 12.5,
            srcWasBurned: true,
            dstWasMinted: false,
          }),
        ]

        const result = getAggregatedTokens(transfers, {
          calculateNetMinted: true,
        })

        const axsToken = result.find((t) => t.abstractTokenId === 'axs')
        const usdcToken = result.find((t) => t.abstractTokenId === 'usdc')

        expect(axsToken?.mintedValueUsd).toEqual(35.43)
        expect(axsToken?.burnedValueUsd).toEqual(0)

        expect(usdcToken?.burnedValueUsd).toEqual(12.5)
        expect(usdcToken?.mintedValueUsd).toEqual(0)
      })
    })
  })

  describe(getAggregatedTokensPairs.name, () => {
    it('aggregates two transfers with same pair', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth___',
          dstAbstractTokenId: 'usdc__',
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth___',
          dstAbstractTokenId: 'usdc__',
          duration: 3000,
          srcValueUsd: 1000,
          dstValueUsd: 1000,
        }),
      ]

      const result = getAggregatedTokensPairs(transfers)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        tokenA: 'eth___',
        tokenB: 'usdc__',
        transferTypeStats: {
          deposit: { transferCount: 2, totalDurationSum: 8000 },
        },
        transferCount: 2,
        transfersWithDurationCount: 2,
        totalDurationSum: 8000,
        volume: 3000,
        minTransferValueUsd: 1000,
        maxTransferValueUsd: 2000,
      })
    })

    it('is direction agnostic - ETH->USDC and USDC->ETH are same pair', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth___',
          dstAbstractTokenId: 'usdc__',
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'usdc__',
          dstAbstractTokenId: 'eth___',
          duration: 3000,
          srcValueUsd: 1000,
          dstValueUsd: 1000,
        }),
      ]

      const result = getAggregatedTokensPairs(transfers)

      expect(result).toHaveLength(1)
      expect(result[0]?.tokenA).toEqual('eth___')
      expect(result[0]?.tokenB).toEqual('usdc__')
      expect(result[0]?.transferCount).toEqual(2)
    })

    it('handles same-token pairs (ETH->ETH)', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth___',
          dstAbstractTokenId: 'eth___',
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
        }),
      ]

      const result = getAggregatedTokensPairs(transfers)

      expect(result).toHaveLength(1)
      expect(result[0]?.tokenA).toEqual('eth___')
      expect(result[0]?.tokenB).toEqual('eth___')
      expect(result[0]?.transferCount).toEqual(1)
    })

    it('aggregates transfers with missing token IDs into unknown pair', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth___',
          dstAbstractTokenId: undefined,
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: undefined,
          dstAbstractTokenId: 'usdc__',
          duration: 3000,
          srcValueUsd: 1000,
          dstValueUsd: 1000,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: undefined,
          dstAbstractTokenId: undefined,
          duration: 4000,
          srcValueUsd: 500,
          dstValueUsd: 500,
        }),
        createTransfer({
          timestamp,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth___',
          dstAbstractTokenId: 'usdc__',
          duration: 6000,
          srcValueUsd: 3000,
          dstValueUsd: 3000,
        }),
      ]

      const result = getAggregatedTokensPairs(transfers)

      expect(result).toHaveLength(2)

      const knownPair = result.find(
        (r) => r.tokenA === 'eth___' && r.tokenB === 'usdc__',
      )
      expect(knownPair?.transferCount).toEqual(1)
      expect(knownPair?.volume).toEqual(3000)

      const unknownPair = result.find((r) => r.tokenA === 'unknown')
      expect(unknownPair?.transferCount).toEqual(3)
      expect(unknownPair?.volume).toEqual(3500)
    })

    it('tracks transfer type stats per pair', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer({
          timestamp,
          type: 'taxi',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth___',
          dstAbstractTokenId: 'usdc__',
          duration: 2000,
          srcValueUsd: 100,
          dstValueUsd: 100,
        }),
        createTransfer({
          timestamp,
          type: 'bus',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth___',
          dstAbstractTokenId: 'usdc__',
          duration: 8000,
          srcValueUsd: 100,
          dstValueUsd: 100,
        }),
      ]

      const result = getAggregatedTokensPairs(transfers)

      expect(result[0]?.transferTypeStats).toEqual({
        taxi: { transferCount: 1, totalDurationSum: 2000 },
        bus: { transferCount: 1, totalDurationSum: 8000 },
      })
    })

    it('throws error when group is empty', () => {
      const transfers: InteropTransferRecord[] = []

      expect(() => getAggregatedTokensPairs(transfers)).toThrow(
        'Group is empty',
      )
    })
  })
})

function createTransfer(overrides: {
  timestamp: UnixTime
  type?: string
  srcChain: string
  dstChain: string
  srcAbstractTokenId?: string
  dstAbstractTokenId?: string
  duration?: number
  srcValueUsd?: number
  dstValueUsd?: number
  srcWasBurned?: boolean
  dstWasMinted?: boolean
  srcEventId?: string | undefined
  dstEventId?: string | undefined
}): InteropTransferRecord {
  return {
    plugin: 'test-plugin',
    bridgeType: undefined,
    transferId: 'test-transfer-id',
    type: overrides.type ?? 'deposit',
    timestamp: overrides.timestamp,
    srcTime: overrides.timestamp,
    srcTxHash: 'random-hash',
    srcLogIndex: 0,
    srcEventId:
      'srcEventId' in overrides ? overrides.srcEventId : 'random-event-id',
    srcTokenAddress: undefined,
    srcRawAmount: undefined,
    srcWasBurned: overrides.srcWasBurned ?? undefined,
    srcSymbol: undefined,
    srcAmount: undefined,
    srcPrice: undefined,
    dstTime:
      overrides.duration !== undefined
        ? overrides.timestamp + overrides.duration
        : undefined,
    dstTxHash: 'random-hash',
    dstLogIndex: 0,
    dstEventId:
      'dstEventId' in overrides ? overrides.dstEventId : 'random-event-id',
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
