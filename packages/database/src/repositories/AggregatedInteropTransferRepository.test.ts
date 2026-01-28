import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type AggregatedInteropTransferRecord,
  AggregatedInteropTransferRepository,
} from './AggregatedInteropTransferRepository'

describeDatabase(AggregatedInteropTransferRepository.name, (db) => {
  const repository = db.aggregatedInteropTransfer

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(
    AggregatedInteropTransferRepository.prototype.insertMany.name,
    () => {
      it('adds new rows', async () => {
        const records = [
          record('id1', UnixTime(100), 'ethereum', 'arbitrum', 5, 1000),
          record('id2', UnixTime(200), 'arbitrum', 'ethereum', 3, 2000),
        ]

        const inserted = await repository.insertMany(records)
        expect(inserted).toEqual(2)

        const result = await repository.getAll()
        expect(result).toEqualUnsorted(records)
      })

      it('handles empty array', async () => {
        const inserted = await repository.insertMany([])
        expect(inserted).toEqual(0)

        const result = await repository.getAll()
        expect(result).toEqual([])
      })

      it('performs batch insert when more than 1000 records', async () => {
        const records = []
        for (let i = 0; i < 1500; i++) {
          records.push(
            record(`id${i}`, UnixTime(i), 'ethereum', 'arbitrum', 1, 100),
          )
        }

        const inserted = await repository.insertMany(records)
        expect(inserted).toEqual(1500)

        const result = await repository.getAll()
        expect(result).toHaveLength(1500)
      })
    },
  )

  describe(AggregatedInteropTransferRepository.prototype.getAll.name, () => {
    it('returns empty array when no records exist', async () => {
      const result = await repository.getAll()
      expect(result).toEqual([])
    })

    it('returns all records', async () => {
      const records = [
        record('id1', UnixTime(100), 'ethereum', 'arbitrum', 5, 1000),
        record('id2', UnixTime(200), 'arbitrum', 'ethereum', 3, 2000),
        record('id3', UnixTime(300), 'polygon', 'ethereum', 7, 3000),
      ]

      await repository.insertMany(records)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(records)
    })
  })

  describe(
    AggregatedInteropTransferRepository.prototype
      .deleteAllButEarliestPerDayBefore.name,
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
          5,
          1000,
        )
        const record2 = record('id2', day1Mid, 'arbitrum', 'ethereum', 3, 2000)
        const record3 = record('id3', day1Late, 'polygon', 'ethereum', 7, 3000)
        const record4 = record('id4', day2Early, 'ethereum', 'polygon', 2, 4000)
        const record5 = record('id5', day2Mid, 'arbitrum', 'polygon', 4, 5000)
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
          5,
          1000,
        )
        const record2 = record('id2', day1Mid, 'arbitrum', 'ethereum', 3, 2000)
        const record3 = record('id3', day2Early, 'polygon', 'ethereum', 7, 3000)
        const record4 = record('id4', day2Mid, 'ethereum', 'polygon', 2, 4000)
        const record5 = record('id5', day3Early, 'arbitrum', 'polygon', 4, 5000)
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
          record('id1', day1Early, 'ethereum', 'arbitrum', 5, 1000),
          record('id2', day2Early, 'arbitrum', 'ethereum', 3, 2000),
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
          5,
          1000,
        )
        const record2 = record(
          'id2',
          day2Early,
          'arbitrum',
          'ethereum',
          3,
          2000,
        )
        const record3 = record('id3', day3Early, 'polygon', 'ethereum', 7, 3000)
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
          5,
          1000,
        )
        const record2 = record('id2', day1Mid, 'arbitrum', 'ethereum', 3, 2000)
        const record3 = record('id3', day1Late, 'polygon', 'ethereum', 7, 3000)
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

      it('handles records spanning multiple days with earliest preserved', async () => {
        // Create records across 3 days, multiple per day
        const day1Early = UnixTime(100)
        const day1Mid = UnixTime(200)
        const day2Early = UnixTime(100 + UnixTime.DAY)
        const day2Mid = UnixTime(200 + UnixTime.DAY)
        const day2Late = UnixTime(300 + UnixTime.DAY)
        const day3Early = UnixTime(100 + 2 * UnixTime.DAY)
        const day3Mid = UnixTime(200 + 2 * UnixTime.DAY)

        const record1 = record(
          'id1',
          day1Early,
          'ethereum',
          'arbitrum',
          5,
          1000,
        )
        const record2 = record('id2', day1Mid, 'arbitrum', 'ethereum', 3, 2000)
        const record3 = record('id3', day2Early, 'polygon', 'ethereum', 7, 3000)
        const record4 = record('id4', day2Mid, 'ethereum', 'polygon', 2, 4000)
        const record5 = record('id5', day2Late, 'arbitrum', 'polygon', 4, 5000)
        const record6 = record(
          'id6',
          day3Early,
          'ethereum',
          'arbitrum',
          6,
          6000,
        )
        const record7 = record('id7', day3Mid, 'arbitrum', 'ethereum', 8, 7000)
        const records = [
          record1,
          record2,
          record3,
          record4,
          record5,
          record6,
          record7,
        ]

        await repository.insertMany(records)

        const deleted = await repository.deleteAllButEarliestPerDayBefore(
          UnixTime(500 + 2 * UnixTime.DAY),
        )
        // Should keep: record1 (earliest day1), record3 (earliest day2), record6 (earliest day3)
        // Should delete: record2, record4, record5, record7
        expect(deleted).toEqual(4)

        const remaining = await repository.getAll()
        expect(remaining).toEqualUnsorted([record1, record3, record6])
      })
    },
  )

  describe(
    AggregatedInteropTransferRepository.prototype
      .deleteAllButEarliestPerDayBefore.name,
    () => {
      it('keeps earliest record per day and deletes others before timestamp', async () => {
        const day1Early = UnixTime(100)
        const day1Mid = UnixTime(200)
        const day1Late = UnixTime(300)
        const day2Early = UnixTime(100 + UnixTime.DAY)
        const day2Mid = UnixTime(200 + UnixTime.DAY)
        const day3Early = UnixTime(100 + 2 * UnixTime.DAY)
        const day3Mid = UnixTime(200 + 2 * UnixTime.DAY)

        const record1 = record(
          'id1',
          day1Early,
          'ethereum',
          'arbitrum',
          5,
          1000,
        )
        const record2 = record('id2', day1Mid, 'arbitrum', 'ethereum', 3, 2000)
        const record3 = record('id3', day1Late, 'polygon', 'ethereum', 7, 3000)
        const record4 = record('id4', day2Early, 'ethereum', 'polygon', 2, 4000)
        const record5 = record('id5', day2Mid, 'arbitrum', 'polygon', 4, 5000)
        const record6 = record(
          'id6',
          day3Early,
          'ethereum',
          'arbitrum',
          6,
          6000,
        )
        const record7 = record('id7', day3Mid, 'arbitrum', 'ethereum', 8, 7000)
        const records = [
          record1,
          record2,
          record3,
          record4,
          record5,
          record6,
          record7,
        ]

        await repository.insertMany(records)

        const deleted = await repository.deleteAllButEarliestPerDayBefore(
          UnixTime(500 + UnixTime.DAY),
        )
        expect(deleted).toEqual(3) // Should delete record2, record3, record5

        const remaining = await repository.getAll()
        expect(remaining).toEqualUnsorted([record1, record4, record6, record7])
      })

      it('returns 0 when no records are matched', async () => {
        const day1Early = UnixTime(100 + UnixTime.DAY)
        const day2Early = UnixTime(100 + 2 * UnixTime.DAY)

        await repository.insertMany([
          record('id1', day1Early, 'ethereum', 'arbitrum', 5, 1000),
          record('id2', day2Early, 'arbitrum', 'ethereum', 3, 2000),
        ])

        const deleted = await repository.deleteAllButEarliestPerDayBefore(
          UnixTime(50),
        )
        expect(deleted).toEqual(0)

        const remaining = await repository.getAll()
        expect(remaining).toHaveLength(2)
      })
    },
  )

  describe(
    AggregatedInteropTransferRepository.prototype.deleteByTimestamp.name,
    () => {
      it('deletes records with matching timestamp and returns count', async () => {
        const record1 = record(
          'id1',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          5,
          1000,
        )
        const record2 = record(
          'id2',
          UnixTime(200),
          'arbitrum',
          'ethereum',
          3,
          2000,
        )
        const record3 = record(
          'id3',
          UnixTime(200),
          'polygon',
          'ethereum',
          7,
          3000,
        )
        const record4 = record(
          'id4',
          UnixTime(300),
          'ethereum',
          'polygon',
          2,
          4000,
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
          record('id1', UnixTime(100), 'ethereum', 'arbitrum', 5, 1000),
          record('id2', UnixTime(200), 'arbitrum', 'ethereum', 3, 2000),
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

      it('deletes only records with exact timestamp match', async () => {
        const record1 = record(
          'id1',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          5,
          1000,
        )
        const record2 = record(
          'id2',
          UnixTime(200),
          'arbitrum',
          'ethereum',
          3,
          2000,
        )
        const record3 = record(
          'id3',
          UnixTime(300),
          'polygon',
          'ethereum',
          7,
          3000,
        )
        const records = [record1, record2, record3]

        await repository.insertMany(records)

        const deleted = await repository.deleteByTimestamp(UnixTime(200))
        expect(deleted).toEqual(1)

        const remaining = await repository.getAll()
        expect(remaining).toEqualUnsorted([record1, record3])
      })
    },
  )

  describe(
    AggregatedInteropTransferRepository.prototype.getByChainsTimestampAndId
      .name,
    () => {
      it('returns records matching timestamp, srcChains and dstChains', async () => {
        const record1 = record(
          'id1',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          5,
          1000,
        )
        const record2 = record(
          'id2',
          UnixTime(200),
          'ethereum',
          'arbitrum',
          3,
          2000,
        )
        const record3 = record(
          'id3',
          UnixTime(300),
          'ethereum',
          'arbitrum',
          7,
          3000,
          150,
        )
        const record4 = record(
          'id4',
          UnixTime(150),
          'polygon',
          'ethereum',
          2,
          4000,
        )
        const records = [record1, record2, record3, record4]

        await repository.insertMany(records)

        const result = await repository.getByChainsTimestampAndId(
          UnixTime(300),
          ['ethereum'],
          ['arbitrum'],
        )

        // Should only return record3 which matches timestamp 300
        expect(result).toEqual([record3])
      })

      it('returns records matching multiple srcChains and dstChains at same timestamp', async () => {
        const record1 = record(
          'id1',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          5,
          1000,
        )
        const record2 = record(
          'id2',
          UnixTime(200),
          'polygon',
          'optimism',
          3,
          2000,
        )
        const record3 = record(
          'id3',
          UnixTime(300),
          'ethereum',
          'arbitrum',
          7,
          3000,
        )
        const record4 = record(
          'id4',
          UnixTime(300),
          'polygon',
          'optimism',
          2,
          4000,
          250,
        )
        const records = [record1, record2, record3, record4]

        await repository.insertMany(records)

        const result = await repository.getByChainsTimestampAndId(
          UnixTime(300),
          ['ethereum', 'polygon'],
          ['arbitrum', 'optimism'],
        )

        // Should return record3 and record4 which match timestamp 300
        expect(result).toEqualUnsorted([record3, record4])
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
          UnixTime(300),
          'ethereum',
          'arbitrum',
          5,
          1000,
        )
        const record2 = record(
          'protocol2',
          UnixTime(300),
          'ethereum',
          'arbitrum',
          3,
          2000,
        )
        const record3 = record(
          'protocol3',
          UnixTime(300),
          'ethereum',
          'arbitrum',
          7,
          3000,
        )
        const records = [record1, record2, record3]

        await repository.insertMany(records)

        const result = await repository.getByChainsTimestampAndId(
          UnixTime(300),
          ['ethereum'],
          ['arbitrum'],
          ['protocol1', 'protocol3'],
        )

        expect(result).toEqualUnsorted([record1, record3])
      })

      it('returns all matching records when protocolIds is undefined', async () => {
        const record1 = record(
          'protocol1',
          UnixTime(300),
          'ethereum',
          'arbitrum',
          5,
          1000,
        )
        const record2 = record(
          'protocol2',
          UnixTime(300),
          'ethereum',
          'arbitrum',
          3,
          2000,
        )
        const records = [record1, record2]

        await repository.insertMany(records)

        const result = await repository.getByChainsTimestampAndId(
          UnixTime(300),
          ['ethereum'],
          ['arbitrum'],
          undefined,
        )

        expect(result).toEqualUnsorted([record1, record2])
      })

      it('returns empty array when protocolIds is empty array', async () => {
        const record1 = record(
          'protocol1',
          UnixTime(300),
          'ethereum',
          'arbitrum',
          5,
          1000,
        )
        const record2 = record(
          'protocol2',
          UnixTime(300),
          'ethereum',
          'arbitrum',
          3,
          2000,
        )
        const records = [record1, record2]

        await repository.insertMany(records)

        const result = await repository.getByChainsTimestampAndId(
          UnixTime(300),
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
  transferCount = 1,
  totalDurationSum = 0,
  srcValueUsd?: number,
  dstValueUsd?: number,
  avgValueAtRisk?: number,
  countUnder100 = 0,
  count100To1K = 0,
  count1KTo10K = 0,
  count10KTo100K = 0,
  countOver100K = 0,
): AggregatedInteropTransferRecord {
  return {
    timestamp,
    id,
    srcChain,
    dstChain,
    transferCount,
    totalDurationSum,
    srcValueUsd,
    dstValueUsd,
    avgValueAtRisk,
    countUnder100,
    count100To1K,
    count1KTo10K,
    count10KTo100K,
    countOver100K,
  }
}
