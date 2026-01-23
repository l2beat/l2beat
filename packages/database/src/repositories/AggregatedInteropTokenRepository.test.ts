import { UnixTime } from '@l2beat/shared-pure'
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
        record(
          'id1',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          'token1',
          5,
          1000,
          5000,
        ),
        record(
          'id2',
          UnixTime(200),
          'arbitrum',
          'ethereum',
          'token2',
          3,
          2000,
          6000,
        ),
        record(
          'id3',
          UnixTime(300),
          'polygon',
          'ethereum',
          'token3',
          7,
          3000,
          7000,
        ),
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

        const record1 = record(
          'id1',
          day1Early,
          'ethereum',
          'arbitrum',
          'token1',
          5,
          1000,
          5000,
        )
        const record2 = record(
          'id2',
          day1Mid,
          'arbitrum',
          'ethereum',
          'token2',
          3,
          2000,
          6000,
        )
        const record3 = record(
          'id3',
          day1Late,
          'polygon',
          'ethereum',
          'token3',
          7,
          3000,
          7000,
        )
        const record4 = record(
          'id4',
          day2Early,
          'ethereum',
          'polygon',
          'token4',
          2,
          4000,
          8000,
        )
        const record5 = record(
          'id5',
          day2Mid,
          'arbitrum',
          'polygon',
          'token5',
          4,
          5000,
          9000,
        )
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

        const record1 = record(
          'id1',
          day1Early,
          'ethereum',
          'arbitrum',
          'token1',
          5,
          1000,
          5000,
        )
        const record2 = record(
          'id2',
          day1Mid,
          'arbitrum',
          'ethereum',
          'token2',
          3,
          2000,
          6000,
        )
        const record3 = record(
          'id3',
          day2Early,
          'polygon',
          'ethereum',
          'token3',
          7,
          3000,
          7000,
        )
        const record4 = record(
          'id4',
          day2Mid,
          'ethereum',
          'polygon',
          'token4',
          2,
          4000,
          8000,
        )
        const record5 = record(
          'id5',
          day3Early,
          'arbitrum',
          'polygon',
          'token5',
          4,
          5000,
          9000,
        )
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
          record(
            'id1',
            day1Early,
            'ethereum',
            'arbitrum',
            'token1',
            5,
            1000,
            5000,
          ),
          record(
            'id2',
            day2Early,
            'arbitrum',
            'ethereum',
            'token2',
            3,
            2000,
            6000,
          ),
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

        const record1 = record(
          'id1',
          day1Early,
          'ethereum',
          'arbitrum',
          'token1',
          5,
          1000,
          5000,
        )
        const record2 = record(
          'id2',
          day2Early,
          'arbitrum',
          'ethereum',
          'token2',
          3,
          2000,
          6000,
        )
        const record3 = record(
          'id3',
          day3Early,
          'polygon',
          'ethereum',
          'token3',
          7,
          3000,
          7000,
        )
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

        const record1 = record(
          'id1',
          day1Early,
          'ethereum',
          'arbitrum',
          'token1',
          5,
          1000,
          5000,
        )
        const record2 = record(
          'id2',
          day1Mid,
          'arbitrum',
          'ethereum',
          'token2',
          3,
          2000,
          6000,
        )
        const record3 = record(
          'id3',
          day1Late,
          'polygon',
          'ethereum',
          'token3',
          7,
          3000,
          7000,
        )
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
        const record1 = record(
          'id1',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          'token1',
          5,
          1000,
          5000,
        )
        const record2 = record(
          'id2',
          UnixTime(200),
          'arbitrum',
          'ethereum',
          'token2',
          3,
          2000,
          6000,
        )
        const record3 = record(
          'id3',
          UnixTime(200),
          'polygon',
          'ethereum',
          'token3',
          7,
          3000,
          7000,
        )
        const record4 = record(
          'id4',
          UnixTime(300),
          'ethereum',
          'polygon',
          'token4',
          2,
          4000,
          8000,
        )
        const records = [record1, record2, record3, record4]

        await repository.insertMany(records)

        const deleted = await repository.deleteByTimestamp(UnixTime(200))
        expect(deleted).toEqual(2)

        const remaining = await repository.getAll()
        expect(remaining).toEqualUnsorted([record1, record4])
      })

      it('returns 0 when no records match timestamp', async () => {
        await repository.insertMany([
          record(
            'id1',
            UnixTime(100),
            'ethereum',
            'arbitrum',
            'token1',
            5,
            1000,
            5000,
          ),
          record(
            'id2',
            UnixTime(200),
            'arbitrum',
            'ethereum',
            'token2',
            3,
            2000,
            6000,
          ),
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
    AggregatedInteropTokenRepository.prototype.getByChainsTimestampAndId.name,
    () => {
      it('returns records matching timestamp, srcChains, dstChains, and protocolIds', async () => {
        const record1 = record(
          'protocol1',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          'token1',
          5,
          1000,
          5000,
        )
        const record2 = record(
          'protocol2',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          'token2',
          3,
          2000,
          6000,
        )
        const record3 = record(
          'protocol1',
          UnixTime(200),
          'ethereum',
          'arbitrum',
          'token3',
          7,
          3000,
          7000,
        )
        const record4 = record(
          'protocol3',
          UnixTime(100),
          'polygon',
          'ethereum',
          'token4',
          2,
          4000,
          8000,
        )
        const records = [record1, record2, record3, record4]

        await repository.insertMany(records)

        const result = await repository.getByChainsTimestampAndId(
          UnixTime(100),
          ['ethereum'],
          ['arbitrum'],
          ['protocol1'],
        )

        expect(result).toEqualUnsorted([record1])
      })

      it('returns records matching multiple srcChains and dstChains', async () => {
        const record1 = record(
          'protocol1',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          'token1',
          5,
          1000,
          5000,
        )
        const record2 = record(
          'protocol2',
          UnixTime(100),
          'polygon',
          'optimism',
          'token2',
          3,
          2000,
          6000,
        )
        const record3 = record(
          'protocol1',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          'token3',
          7,
          3000,
          7000,
        )
        const record4 = record(
          'protocol2',
          UnixTime(100),
          'polygon',
          'optimism',
          'token4',
          2,
          4000,
          8000,
        )
        const records = [record1, record2, record3, record4]

        await repository.insertMany(records)

        const result = await repository.getByChainsTimestampAndId(
          UnixTime(100),
          ['ethereum', 'polygon'],
          ['arbitrum', 'optimism'],
        )

        expect(result).toEqualUnsorted([record1, record2, record3, record4])
      })

      it('returns empty array when no records exist', async () => {
        const result = await repository.getByChainsTimestampAndId(
          UnixTime(100),
          ['ethereum'],
          ['arbitrum'],
        )

        expect(result).toEqual([])
      })

      it('filters by protocolIds when provided', async () => {
        const record1 = record(
          'protocol1',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          'token1',
          5,
          1000,
          5000,
        )
        const record2 = record(
          'protocol2',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          'token2',
          3,
          2000,
          6000,
        )
        const record3 = record(
          'protocol3',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          'token3',
          7,
          3000,
          7000,
        )
        const records = [record1, record2, record3]

        await repository.insertMany(records)

        const result = await repository.getByChainsTimestampAndId(
          UnixTime(100),
          ['ethereum'],
          ['arbitrum'],
          ['protocol1', 'protocol3'],
        )

        expect(result).toEqualUnsorted([record1, record3])
      })

      it('returns all matching records when protocolIds is undefined', async () => {
        const record1 = record(
          'protocol1',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          'token1',
          5,
          1000,
          5000,
        )
        const record2 = record(
          'protocol2',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          'token2',
          3,
          2000,
          6000,
        )
        const records = [record1, record2]

        await repository.insertMany(records)

        const result = await repository.getByChainsTimestampAndId(
          UnixTime(100),
          ['ethereum'],
          ['arbitrum'],
          undefined,
        )

        expect(result).toEqualUnsorted([record1, record2])
      })

      it('returns empty array when protocolIds is empty array', async () => {
        const record1 = record(
          'protocol1',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          'token1',
          5,
          1000,
          5000,
        )
        const record2 = record(
          'protocol2',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          'token2',
          3,
          2000,
          6000,
        )
        const records = [record1, record2]

        await repository.insertMany(records)

        const result = await repository.getByChainsTimestampAndId(
          UnixTime(100),
          ['ethereum'],
          ['arbitrum'],
          [],
        )

        expect(result).toEqual([])
      })
    },
  )
})

function record(
  id: string,
  timestamp: UnixTime,
  srcChain: string,
  dstChain: string,
  abstractTokenId: string,
  transferCount = 1,
  totalDurationSum = 0,
  volume = 1000,
): AggregatedInteropTokenRecord {
  return {
    timestamp,
    id,
    srcChain,
    dstChain,
    abstractTokenId,
    transferCount,
    totalDurationSum,
    volume,
  }
}
