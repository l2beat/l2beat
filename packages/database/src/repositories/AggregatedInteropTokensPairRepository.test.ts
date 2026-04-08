import { type InteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type AggregatedInteropTokensPairRecord,
  AggregatedInteropTokensPairRepository,
} from './AggregatedInteropTokensPairRepository'

describeDatabase(AggregatedInteropTokensPairRepository.name, (db) => {
  const repository = db.aggregatedInteropTokensPair

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(AggregatedInteropTokensPairRepository.prototype.getAll.name, () => {
    it('returns empty array when no records exist', async () => {
      const result = await repository.getAll()
      expect(result).toEqual([])
    })

    it('returns all records', async () => {
      const records = [
        record({
          id: 'id1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          tokenA: 'eth___',
          tokenB: 'usdc__',
          transferTypeStats: {
            taxi: { transferCount: 2, totalDurationSum: 90 },
          },
          transferCount: 5,
          totalDurationSum: 1000,
          volume: 5000,
        }),
        record({
          id: 'id2',
          timestamp: UnixTime(200),
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          tokenA: 'btc___',
          tokenB: 'eth___',
          transferCount: 3,
          totalDurationSum: 2000,
          volume: 6000,
        }),
        record({
          id: 'id3',
          timestamp: UnixTime(300),
          srcChain: 'polygon',
          dstChain: 'ethereum',
          tokenA: 'eth___',
          tokenB: 'eth___',
          transferCount: 7,
          totalDurationSum: 3000,
          volume: 7000,
        }),
        record({
          id: 'id4',
          timestamp: UnixTime(400),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          tokenA: 'unknown',
          tokenB: 'unknown',
          transferCount: 2,
          totalDurationSum: 500,
          volume: 1000,
        }),
      ]

      await repository.insertMany(records)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(records)
    })
  })

  describe(
    AggregatedInteropTokensPairRepository.prototype
      .deleteAllButEarliestPerDayBefore.name,
    () => {
      it('keeps earliest record per day and deletes others before timestamp', async () => {
        const day1Early = UnixTime(100)
        const day1Mid = UnixTime(200)
        const day1Late = UnixTime(300)
        const day2Early = UnixTime(100 + UnixTime.DAY)
        const day2Mid = UnixTime(200 + UnixTime.DAY)

        const record1 = record({
          id: 'id1',
          timestamp: day1Early,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          tokenA: 'eth___',
          tokenB: 'usdc__',
          transferCount: 5,
          totalDurationSum: 1000,
          volume: 5000,
        })
        const record2 = record({
          id: 'id2',
          timestamp: day1Mid,
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          tokenA: 'btc___',
          tokenB: 'eth___',
          transferCount: 3,
          totalDurationSum: 2000,
          volume: 6000,
        })
        const record3 = record({
          id: 'id3',
          timestamp: day1Late,
          srcChain: 'polygon',
          dstChain: 'ethereum',
          tokenA: 'eth___',
          tokenB: 'eth___',
          transferCount: 7,
          totalDurationSum: 3000,
          volume: 7000,
        })
        const record4 = record({
          id: 'id4',
          timestamp: day2Early,
          srcChain: 'ethereum',
          dstChain: 'polygon',
          tokenA: 'eth___',
          tokenB: 'usdc__',
          transferCount: 2,
          totalDurationSum: 4000,
          volume: 8000,
        })
        const record5 = record({
          id: 'id5',
          timestamp: day2Mid,
          srcChain: 'arbitrum',
          dstChain: 'polygon',
          tokenA: 'btc___',
          tokenB: 'usdc__',
          transferCount: 4,
          totalDurationSum: 5000,
          volume: 9000,
        })
        const records = [record1, record2, record3, record4, record5]

        await repository.insertMany(records)

        const deleted = await repository.deleteAllButEarliestPerDayBefore(
          UnixTime(500 + UnixTime.DAY),
        )
        expect(deleted).toEqual(3)

        const remaining = await repository.getAll()
        expect(remaining).toEqualUnsorted([record1, record4])
      })

      it('returns 0 when no records exist', async () => {
        const deleted = await repository.deleteAllButEarliestPerDayBefore(
          UnixTime(100),
        )
        expect(deleted).toEqual(0)
      })
    },
  )

  describe(
    AggregatedInteropTokensPairRepository.prototype.deleteByTimestamp.name,
    () => {
      it('deletes records with matching timestamp and returns count', async () => {
        const record1 = record({
          id: 'id1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          tokenA: 'eth___',
          tokenB: 'usdc__',
          transferCount: 5,
          totalDurationSum: 1000,
          volume: 5000,
        })
        const record2 = record({
          id: 'id2',
          timestamp: UnixTime(200),
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          tokenA: 'btc___',
          tokenB: 'eth___',
          transferCount: 3,
          totalDurationSum: 2000,
          volume: 6000,
        })
        const record3 = record({
          id: 'id3',
          timestamp: UnixTime(200),
          srcChain: 'polygon',
          dstChain: 'ethereum',
          tokenA: 'eth___',
          tokenB: 'eth___',
          transferCount: 7,
          totalDurationSum: 3000,
          volume: 7000,
        })
        const records = [record1, record2, record3]

        await repository.insertMany(records)

        const deleted = await repository.deleteByTimestamp(UnixTime(200))
        expect(deleted).toEqual(2)

        const remaining = await repository.getAll()
        expect(remaining).toEqualUnsorted([record1])
      })

      it('returns 0 when no records match timestamp', async () => {
        await repository.insertMany([
          record({
            id: 'id1',
            timestamp: UnixTime(100),
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            tokenA: 'eth___',
            tokenB: 'usdc__',
            transferCount: 5,
            totalDurationSum: 1000,
            volume: 5000,
          }),
        ])

        const deleted = await repository.deleteByTimestamp(UnixTime(300))
        expect(deleted).toEqual(0)
      })

      it('returns 0 when no records exist', async () => {
        const deleted = await repository.deleteByTimestamp(UnixTime(100))
        expect(deleted).toEqual(0)
      })
    },
  )

  describe(
    AggregatedInteropTokensPairRepository.prototype.getByChainsIdAndTimestamp
      .name,
    () => {
      it('returns records matching timestamp, id, srcChains, dstChains, and bridgeType', async () => {
        const record1 = record({
          id: 'protocol1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          tokenA: 'eth___',
          tokenB: 'usdc__',
          transferCount: 5,
          totalDurationSum: 1000,
          volume: 5000,
          bridgeType: 'lockAndMint',
        })
        const record2 = record({
          id: 'protocol2',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          tokenA: 'btc___',
          tokenB: 'eth___',
          transferCount: 3,
          totalDurationSum: 2000,
          volume: 6000,
          bridgeType: 'lockAndMint',
        })
        await repository.insertMany([record1, record2])

        const result = await repository.getByChainsIdAndTimestamp(
          UnixTime(100),
          ['ethereum', 'arbitrum'],
          ['ethereum', 'arbitrum'],
          'protocol1',
          'lockAndMint',
        )

        expect(result).toEqualUnsorted([record1])
      })

      it('returns records across all protocols when id is omitted', async () => {
        const record1 = record({
          id: 'protocol1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          tokenA: 'eth___',
          tokenB: 'usdc__',
          transferCount: 5,
          totalDurationSum: 1000,
          volume: 5000,
          bridgeType: 'lockAndMint',
        })
        const record2 = record({
          id: 'protocol2',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          tokenA: 'btc___',
          tokenB: 'eth___',
          transferCount: 3,
          totalDurationSum: 2000,
          volume: 6000,
          bridgeType: 'lockAndMint',
        })
        await repository.insertMany([record1, record2])

        const result = await repository.getByChainsIdAndTimestamp(
          UnixTime(100),
          ['ethereum', 'arbitrum'],
          ['ethereum', 'arbitrum'],
        )

        expect(result).toEqualUnsorted([record1, record2])
      })

      it('excludes same-chain transfers by default', async () => {
        const crossChain = record({
          id: 'protocol1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          tokenA: 'eth___',
          tokenB: 'usdc__',
          transferCount: 5,
          totalDurationSum: 1000,
          volume: 5000,
          bridgeType: 'lockAndMint',
        })
        const sameChain = record({
          id: 'protocol1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'ethereum',
          tokenA: 'eth___',
          tokenB: 'eth___',
          transferCount: 3,
          totalDurationSum: 2000,
          volume: 6000,
          bridgeType: 'lockAndMint',
        })
        await repository.insertMany([crossChain, sameChain])

        const result = await repository.getByChainsIdAndTimestamp(
          UnixTime(100),
          ['ethereum', 'arbitrum'],
          ['ethereum', 'arbitrum'],
          'protocol1',
          'lockAndMint',
        )

        expect(result).toEqual([crossChain])
      })

      it('includes same-chain transfers when includeSameChainTransfers is true', async () => {
        const crossChain = record({
          id: 'protocol1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          tokenA: 'eth___',
          tokenB: 'usdc__',
          transferCount: 5,
          totalDurationSum: 1000,
          volume: 5000,
          bridgeType: 'lockAndMint',
        })
        const sameChain = record({
          id: 'protocol1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'ethereum',
          tokenA: 'eth___',
          tokenB: 'eth___',
          transferCount: 3,
          totalDurationSum: 2000,
          volume: 6000,
          bridgeType: 'lockAndMint',
        })
        await repository.insertMany([crossChain, sameChain])

        const result = await repository.getByChainsIdAndTimestamp(
          UnixTime(100),
          ['ethereum', 'arbitrum'],
          ['ethereum', 'arbitrum'],
          'protocol1',
          'lockAndMint',
          { includeSameChainTransfers: true },
        )

        expect(result).toEqualUnsorted([crossChain, sameChain])
      })

      it('returns unknown pair records alongside known pairs', async () => {
        const knownPair = record({
          id: 'protocol1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          tokenA: 'eth___',
          tokenB: 'usdc__',
          transferCount: 5,
          totalDurationSum: 1000,
          volume: 5000,
          bridgeType: 'lockAndMint',
        })
        const unknownPair = record({
          id: 'protocol1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          tokenA: 'unknown',
          tokenB: 'unknown',
          transferCount: 2,
          totalDurationSum: 500,
          volume: 1000,
          bridgeType: 'lockAndMint',
        })
        await repository.insertMany([knownPair, unknownPair])

        const result = await repository.getByChainsIdAndTimestamp(
          UnixTime(100),
          ['ethereum', 'arbitrum'],
          ['ethereum', 'arbitrum'],
          'protocol1',
          'lockAndMint',
        )

        expect(result).toEqualUnsorted([knownPair, unknownPair])
      })
    },
  )
})

function record({
  id,
  timestamp,
  srcChain,
  dstChain,
  tokenA,
  tokenB,
  transferTypeStats,
  transferCount = 1,
  transfersWithDurationCount = transferCount,
  totalDurationSum = 0,
  bridgeType = 'unknown',
  volume = 1000,
  minTransferValueUsd,
  maxTransferValueUsd,
}: {
  id: string
  timestamp: UnixTime
  srcChain: string
  dstChain: string
  tokenA: string
  tokenB: string
  transferTypeStats?: AggregatedInteropTokensPairRecord['transferTypeStats']
  transferCount?: number
  transfersWithDurationCount?: number
  totalDurationSum?: number
  bridgeType?: InteropBridgeType
  volume?: number
  minTransferValueUsd?: number
  maxTransferValueUsd?: number
}): AggregatedInteropTokensPairRecord {
  return {
    timestamp,
    id,
    bridgeType,
    srcChain,
    dstChain,
    tokenA,
    tokenB,
    transferTypeStats,
    transferCount,
    transfersWithDurationCount,
    totalDurationSum,
    volume,
    minTransferValueUsd,
    maxTransferValueUsd,
  }
}
