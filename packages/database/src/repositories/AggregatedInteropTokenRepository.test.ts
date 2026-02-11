import { type InteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type AggregatedInteropTokenRecord,
  AggregatedInteropTokenRepository,
} from './AggregatedInteropTokenRepository'

describeDatabase(AggregatedInteropTokenRepository.name, (db) => {
  const repository = db.aggregatedInteropToken

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(AggregatedInteropTokenRepository.prototype.getAll.name, () => {
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
          abstractTokenId: 'token1',
          transferCount: 5,
          totalDurationSum: 1000,
          volume: 5000,
        }),
        record({
          id: 'id2',
          timestamp: UnixTime(200),
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          abstractTokenId: 'token2',
          transferCount: 3,
          totalDurationSum: 2000,
          volume: 6000,
        }),
        record({
          id: 'id3',
          timestamp: UnixTime(300),
          srcChain: 'polygon',
          dstChain: 'ethereum',
          abstractTokenId: 'token3',
          transferCount: 7,
          totalDurationSum: 3000,
          volume: 7000,
        }),
      ]

      await repository.insertMany(records)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(records)
    })
  })

  describe(
    AggregatedInteropTokenRepository.prototype.deleteAllButEarliestPerDayBefore
      .name,
    () => {
      it('keeps earliest record per day and deletes others before timestamp', async () => {
        // Day 1: timestamps at 100, 200, 300 - should keep 100
        // Day 2: timestamps at 100 + DAY, 200 + DAY - should keep 100 + DAY
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
          abstractTokenId: 'token1',
          transferCount: 5,
          totalDurationSum: 1000,
          volume: 5000,
        })
        const record2 = record({
          id: 'id2',
          timestamp: day1Mid,
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          abstractTokenId: 'token2',
          transferCount: 3,
          totalDurationSum: 2000,
          volume: 6000,
        })
        const record3 = record({
          id: 'id3',
          timestamp: day1Late,
          srcChain: 'polygon',
          dstChain: 'ethereum',
          abstractTokenId: 'token3',
          transferCount: 7,
          totalDurationSum: 3000,
          volume: 7000,
        })
        const record4 = record({
          id: 'id4',
          timestamp: day2Early,
          srcChain: 'ethereum',
          dstChain: 'polygon',
          abstractTokenId: 'token4',
          transferCount: 2,
          totalDurationSum: 4000,
          volume: 8000,
        })
        const record5 = record({
          id: 'id5',
          timestamp: day2Mid,
          srcChain: 'arbitrum',
          dstChain: 'polygon',
          abstractTokenId: 'token5',
          transferCount: 4,
          totalDurationSum: 5000,
          volume: 9000,
        })
        const records = [record1, record2, record3, record4, record5]

        await repository.insertMany(records)

        const deleted = await repository.deleteAllButEarliestPerDayBefore(
          UnixTime(500 + UnixTime.DAY),
        )
        expect(deleted).toEqual(3) // Should delete record2, record3, record5

        const remaining = await repository.getAll()
        expect(remaining).toEqualUnsorted([record1, record4])
      })

      it('does not delete records at or after the timestamp', async () => {
        const day1Early = UnixTime(100)
        const day1Mid = UnixTime(200)
        const day2Early = UnixTime(100 + UnixTime.DAY)
        const day2Mid = UnixTime(200 + UnixTime.DAY)
        const day3Early = UnixTime(100 + 2 * UnixTime.DAY)

        const record1 = record({
          id: 'id1',
          timestamp: day1Early,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'token1',
          transferCount: 5,
          totalDurationSum: 1000,
          volume: 5000,
        })
        const record2 = record({
          id: 'id2',
          timestamp: day1Mid,
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          abstractTokenId: 'token2',
          transferCount: 3,
          totalDurationSum: 2000,
          volume: 6000,
        })
        const record3 = record({
          id: 'id3',
          timestamp: day2Early,
          srcChain: 'polygon',
          dstChain: 'ethereum',
          abstractTokenId: 'token3',
          transferCount: 7,
          totalDurationSum: 3000,
          volume: 7000,
        })
        const record4 = record({
          id: 'id4',
          timestamp: day2Mid,
          srcChain: 'ethereum',
          dstChain: 'polygon',
          abstractTokenId: 'token4',
          transferCount: 2,
          totalDurationSum: 4000,
          volume: 8000,
        })
        const record5 = record({
          id: 'id5',
          timestamp: day3Early,
          srcChain: 'arbitrum',
          dstChain: 'polygon',
          abstractTokenId: 'token5',
          transferCount: 4,
          totalDurationSum: 5000,
          volume: 9000,
        })
        const records = [record1, record2, record3, record4, record5]

        await repository.insertMany(records)

        // Delete before day2Mid (which is 200 + DAY)
        const deleted =
          await repository.deleteAllButEarliestPerDayBefore(day2Mid)
        // Should delete record2 (day1Mid), but keep record1 (earliest of day1)
        // Should keep record3 (earliest of day2) and record4 (at timestamp boundary)
        // Should keep record5 (after timestamp)
        expect(deleted).toEqual(1)

        const remaining = await repository.getAll()
        expect(remaining).toEqualUnsorted([record1, record3, record4, record5])
      })

      it('returns 0 when no records exist', async () => {
        const deleted = await repository.deleteAllButEarliestPerDayBefore(
          UnixTime(100),
        )
        expect(deleted).toEqual(0)
      })

      it('returns 0 when all records are after timestamp', async () => {
        const day1Early = UnixTime(100 + UnixTime.DAY)
        const day2Early = UnixTime(100 + 2 * UnixTime.DAY)

        await repository.insertMany([
          record({
            id: 'id1',
            timestamp: day1Early,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            abstractTokenId: 'token1',
            transferCount: 5,
            totalDurationSum: 1000,
            volume: 5000,
          }),
          record({
            id: 'id2',
            timestamp: day2Early,
            srcChain: 'arbitrum',
            dstChain: 'ethereum',
            abstractTokenId: 'token2',
            transferCount: 3,
            totalDurationSum: 2000,
            volume: 6000,
          }),
        ])

        const deleted = await repository.deleteAllButEarliestPerDayBefore(
          UnixTime(50),
        )
        expect(deleted).toEqual(0)

        const remaining = await repository.getAll()
        expect(remaining).toHaveLength(2)
      })

      it('keeps earliest record when only one record per day exists', async () => {
        const day1Early = UnixTime(100)
        const day2Early = UnixTime(100 + UnixTime.DAY)
        const day3Early = UnixTime(100 + 2 * UnixTime.DAY)

        const record1 = record({
          id: 'id1',
          timestamp: day1Early,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'token1',
          transferCount: 5,
          totalDurationSum: 1000,
          volume: 5000,
        })
        const record2 = record({
          id: 'id2',
          timestamp: day2Early,
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          abstractTokenId: 'token2',
          transferCount: 3,
          totalDurationSum: 2000,
          volume: 6000,
        })
        const record3 = record({
          id: 'id3',
          timestamp: day3Early,
          srcChain: 'polygon',
          dstChain: 'ethereum',
          abstractTokenId: 'token3',
          transferCount: 7,
          totalDurationSum: 3000,
          volume: 7000,
        })
        const records = [record1, record2, record3]

        await repository.insertMany(records)

        const deleted = await repository.deleteAllButEarliestPerDayBefore(
          UnixTime(500 + 2 * UnixTime.DAY),
        )
        // All records are earliest of their day, so nothing to delete
        expect(deleted).toEqual(0)

        const remaining = await repository.getAll()
        expect(remaining).toEqualUnsorted(records)
      })

      it('handles multiple records on same day correctly', async () => {
        // All records on the same day
        const day1Early = UnixTime(100)
        const day1Mid = UnixTime(200)
        const day1Late = UnixTime(300)

        const record1 = record({
          id: 'id1',
          timestamp: day1Early,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'token1',
          transferCount: 5,
          totalDurationSum: 1000,
          volume: 5000,
        })
        const record2 = record({
          id: 'id2',
          timestamp: day1Mid,
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          abstractTokenId: 'token2',
          transferCount: 3,
          totalDurationSum: 2000,
          volume: 6000,
        })
        const record3 = record({
          id: 'id3',
          timestamp: day1Late,
          srcChain: 'polygon',
          dstChain: 'ethereum',
          abstractTokenId: 'token3',
          transferCount: 7,
          totalDurationSum: 3000,
          volume: 7000,
        })
        const records = [record1, record2, record3]

        await repository.insertMany(records)

        const deleted = await repository.deleteAllButEarliestPerDayBefore(
          UnixTime(500),
        )
        // Should keep earliest (record1), delete others
        expect(deleted).toEqual(2)

        const remaining = await repository.getAll()
        expect(remaining).toEqualUnsorted([record1])
      })
    },
  )

  describe(
    AggregatedInteropTokenRepository.prototype.deleteByTimestamp.name,
    () => {
      it('deletes records with matching timestamp and returns count', async () => {
        const record1 = record({
          id: 'id1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'token1',
          transferCount: 5,
          totalDurationSum: 1000,
          volume: 5000,
        })
        const record2 = record({
          id: 'id2',
          timestamp: UnixTime(200),
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          abstractTokenId: 'token2',
          transferCount: 3,
          totalDurationSum: 2000,
          volume: 6000,
        })
        const record3 = record({
          id: 'id3',
          timestamp: UnixTime(200),
          srcChain: 'polygon',
          dstChain: 'ethereum',
          abstractTokenId: 'token3',
          transferCount: 7,
          totalDurationSum: 3000,
          volume: 7000,
        })
        const record4 = record({
          id: 'id4',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'polygon',
          abstractTokenId: 'token4',
          transferCount: 2,
          totalDurationSum: 4000,
          volume: 8000,
        })
        const records = [record1, record2, record3, record4]

        await repository.insertMany(records)

        const deleted = await repository.deleteByTimestamp(UnixTime(200))
        expect(deleted).toEqual(2)

        const remaining = await repository.getAll()
        expect(remaining).toEqualUnsorted([record1, record4])
      })

      it('returns 0 when no records match timestamp', async () => {
        await repository.insertMany([
          record({
            id: 'id1',
            timestamp: UnixTime(100),
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            abstractTokenId: 'token1',
            transferCount: 5,
            totalDurationSum: 1000,
            volume: 5000,
          }),
          record({
            id: 'id2',
            timestamp: UnixTime(200),
            srcChain: 'arbitrum',
            dstChain: 'ethereum',
            abstractTokenId: 'token2',
            transferCount: 3,
            totalDurationSum: 2000,
            volume: 6000,
          }),
        ])

        const deleted = await repository.deleteByTimestamp(UnixTime(300))
        expect(deleted).toEqual(0)

        const remaining = await repository.getAll()
        expect(remaining).toHaveLength(2)
      })

      it('returns 0 when no records exist', async () => {
        const deleted = await repository.deleteByTimestamp(UnixTime(100))
        expect(deleted).toEqual(0)
      })
    },
  )

  describe(
    AggregatedInteropTokenRepository.prototype.getByChainsAndTimestamp.name,
    () => {
      it('returns records matching timestamp, srcChains, dstChains, and bridgeType', async () => {
        const record1 = record({
          id: 'protocol1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'token1',
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
          abstractTokenId: 'token2',
          transferCount: 3,
          totalDurationSum: 2000,
          volume: 6000,
          bridgeType: 'burnAndMint',
        })
        const record3 = record({
          id: 'protocol1',
          timestamp: UnixTime(200),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'token3',
          transferCount: 7,
          totalDurationSum: 3000,
          volume: 7000,
          bridgeType: 'unknown',
        })
        const record4 = record({
          id: 'protocol3',
          timestamp: UnixTime(100),
          srcChain: 'polygon',
          dstChain: 'ethereum',
          abstractTokenId: 'token4',
          transferCount: 2,
          totalDurationSum: 4000,
          volume: 8000,
          bridgeType: 'unknown',
        })
        const records = [record1, record2, record3, record4]

        await repository.insertMany(records)

        const result = await repository.getByChainsAndTimestamp(
          UnixTime(100),
          ['ethereum'],
          ['arbitrum'],
          'lockAndMint',
        )

        expect(result).toEqualUnsorted([record1])
      })

      it('returns records matching multiple srcChains and dstChains', async () => {
        const record1 = record({
          id: 'protocol1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'token1',
          transferCount: 5,
          totalDurationSum: 1000,
          volume: 5000,
        })
        const record2 = record({
          id: 'protocol2',
          timestamp: UnixTime(100),
          srcChain: 'polygon',
          dstChain: 'optimism',
          abstractTokenId: 'token2',
          transferCount: 3,
          totalDurationSum: 2000,
          volume: 6000,
        })
        const record3 = record({
          id: 'protocol1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'token3',
          transferCount: 7,
          totalDurationSum: 3000,
          volume: 7000,
        })
        const record4 = record({
          id: 'protocol2',
          timestamp: UnixTime(100),
          srcChain: 'polygon',
          dstChain: 'optimism',
          abstractTokenId: 'token4',
          transferCount: 2,
          totalDurationSum: 4000,
          volume: 8000,
        })
        const records = [record1, record2, record3, record4]

        await repository.insertMany(records)

        const result = await repository.getByChainsAndTimestamp(
          UnixTime(100),
          ['ethereum', 'polygon'],
          ['arbitrum', 'optimism'],
        )

        expect(result).toEqualUnsorted([record1, record2, record3, record4])
      })

      it('returns empty array when no records exist', async () => {
        const result = await repository.getByChainsAndTimestamp(
          UnixTime(100),
          ['ethereum'],
          ['arbitrum'],
        )

        expect(result).toEqual([])
      })

      it('filters by bridgeType when provided', async () => {
        const record1 = record({
          id: 'protocol1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'token1',
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
          abstractTokenId: 'token2',
          transferCount: 3,
          totalDurationSum: 2000,
          volume: 6000,
          bridgeType: 'burnAndMint',
        })
        const record3 = record({
          id: 'protocol3',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'token3',
          transferCount: 7,
          totalDurationSum: 3000,
          volume: 7000,
          bridgeType: 'lockAndMint',
        })
        const records = [record1, record2, record3]

        await repository.insertMany(records)

        const result = await repository.getByChainsAndTimestamp(
          UnixTime(100),
          ['ethereum'],
          ['arbitrum'],
          'lockAndMint',
        )

        expect(result).toEqualUnsorted([record1, record3])
      })

      it('returns all matching records when bridgeType is undefined', async () => {
        const record1 = record({
          id: 'protocol1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'token1',
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
          abstractTokenId: 'token2',
          transferCount: 3,
          totalDurationSum: 2000,
          volume: 6000,
          bridgeType: 'burnAndMint',
        })
        const records = [record1, record2]

        await repository.insertMany(records)

        const result = await repository.getByChainsAndTimestamp(
          UnixTime(100),
          ['ethereum'],
          ['arbitrum'],
        )

        expect(result).toEqualUnsorted([record1, record2])
      })
    },
  )

  describe(
    AggregatedInteropTokenRepository.prototype.getByChainsIdAndTimestamp.name,
    () => {
      it('returns records matching timestamp, id, srcChains, dstChains, and bridgeType', async () => {
        const record1 = record({
          id: 'protocol1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'token1',
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
          abstractTokenId: 'token2',
          transferCount: 3,
          totalDurationSum: 2000,
          volume: 6000,
          bridgeType: 'lockAndMint',
        })
        const record3 = record({
          id: 'protocol1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'token3',
          transferCount: 7,
          totalDurationSum: 3000,
          volume: 7000,
          bridgeType: 'omnichain',
        })
        const records = [record1, record2, record3]

        await repository.insertMany(records)

        const result = await repository.getByChainsIdAndTimestamp(
          UnixTime(100),
          'protocol1',
          ['ethereum'],
          ['arbitrum'],
          'lockAndMint',
        )

        expect(result).toEqualUnsorted([record1])
      })

      it('returns empty array when empty srcChains or dstChains', async () => {
        await repository.insertMany([
          record({
            id: 'protocol1',
            timestamp: UnixTime(100),
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            abstractTokenId: 'token1',
            transferCount: 5,
            totalDurationSum: 1000,
            volume: 5000,
          }),
        ])

        expect(
          await repository.getByChainsIdAndTimestamp(
            UnixTime(100),
            'protocol1',
            [],
            ['arbitrum'],
          ),
        ).toEqual([])
        expect(
          await repository.getByChainsIdAndTimestamp(
            UnixTime(100),
            'protocol1',
            ['ethereum'],
            [],
          ),
        ).toEqual([])
      })
    },
  )
})

function record({
  id,
  timestamp,
  srcChain,
  dstChain,
  abstractTokenId,
  transferCount = 1,
  totalDurationSum = 0,
  bridgeType = 'unknown',
  volume = 1000,
  mintedValueUsd,
  burnedValueUsd,
}: {
  id: string
  timestamp: UnixTime
  srcChain: string
  dstChain: string
  abstractTokenId: string
  transferCount?: number
  totalDurationSum?: number
  bridgeType?: InteropBridgeType
  volume?: number
  mintedValueUsd?: number
  burnedValueUsd?: number
}): AggregatedInteropTokenRecord {
  return {
    timestamp,
    id,
    bridgeType,
    srcChain,
    dstChain,
    abstractTokenId,
    transferCount,
    totalDurationSum,
    volume,
    mintedValueUsd,
    burnedValueUsd,
  }
}
