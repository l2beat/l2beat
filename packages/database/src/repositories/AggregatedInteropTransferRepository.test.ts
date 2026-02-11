import { type InteropBridgeType, UnixTime } from '@l2beat/shared-pure'
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
          record({
            id: 'id1',
            timestamp: UnixTime(100),
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            transferCount: 5,
            identifiedCount: 1000,
          }),
          record({
            id: 'id2',
            timestamp: UnixTime(200),
            srcChain: 'arbitrum',
            dstChain: 'ethereum',
            transferCount: 3,
            identifiedCount: 2000,
          }),
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
            record({
              id: `id${i}`,
              timestamp: UnixTime(i),
              srcChain: 'ethereum',
              dstChain: 'arbitrum',
              transferCount: 1,
              identifiedCount: 100,
            }),
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
        record({
          id: 'id1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 5,
          identifiedCount: 1000,
        }),
        record({
          id: 'id2',
          timestamp: UnixTime(200),
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          transferCount: 3,
          identifiedCount: 2000,
        }),
        record({
          id: 'id3',
          timestamp: UnixTime(300),
          srcChain: 'polygon',
          dstChain: 'ethereum',
          transferCount: 7,
          identifiedCount: 3000,
        }),
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

        const record1 = record({
          id: 'id1',
          timestamp: day1Early,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 5,
          identifiedCount: 1000,
        })
        const record2 = record({
          id: 'id2',
          timestamp: day1Mid,
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          transferCount: 3,
          identifiedCount: 2000,
        })
        const record3 = record({
          id: 'id3',
          timestamp: day1Late,
          srcChain: 'polygon',
          dstChain: 'ethereum',
          transferCount: 7,
          identifiedCount: 3000,
        })
        const record4 = record({
          id: 'id4',
          timestamp: day2Early,
          srcChain: 'ethereum',
          dstChain: 'polygon',
          transferCount: 2,
          identifiedCount: 4000,
        })
        const record5 = record({
          id: 'id5',
          timestamp: day2Mid,
          srcChain: 'arbitrum',
          dstChain: 'polygon',
          transferCount: 4,
          identifiedCount: 5000,
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
          transferCount: 5,
          identifiedCount: 1000,
        })
        const record2 = record({
          id: 'id2',
          timestamp: day1Mid,
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          transferCount: 3,
          identifiedCount: 2000,
        })
        const record3 = record({
          id: 'id3',
          timestamp: day2Early,
          srcChain: 'polygon',
          dstChain: 'ethereum',
          transferCount: 7,
          identifiedCount: 3000,
        })
        const record4 = record({
          id: 'id4',
          timestamp: day2Mid,
          srcChain: 'ethereum',
          dstChain: 'polygon',
          transferCount: 2,
          identifiedCount: 4000,
        })
        const record5 = record({
          id: 'id5',
          timestamp: day3Early,
          srcChain: 'arbitrum',
          dstChain: 'polygon',
          transferCount: 4,
          identifiedCount: 5000,
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
            transferCount: 5,
            identifiedCount: 1000,
          }),
          record({
            id: 'id2',
            timestamp: day2Early,
            srcChain: 'arbitrum',
            dstChain: 'ethereum',
            transferCount: 3,
            identifiedCount: 2000,
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
          transferCount: 5,
          identifiedCount: 1000,
        })
        const record2 = record({
          id: 'id2',
          timestamp: day2Early,
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          transferCount: 3,
          identifiedCount: 2000,
        })
        const record3 = record({
          id: 'id3',
          timestamp: day3Early,
          srcChain: 'polygon',
          dstChain: 'ethereum',
          transferCount: 7,
          identifiedCount: 3000,
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
          transferCount: 5,
          identifiedCount: 1000,
        })
        const record2 = record({
          id: 'id2',
          timestamp: day1Mid,
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          transferCount: 3,
          identifiedCount: 2000,
        })
        const record3 = record({
          id: 'id3',
          timestamp: day1Late,
          srcChain: 'polygon',
          dstChain: 'ethereum',
          transferCount: 7,
          identifiedCount: 3000,
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

      it('handles records spanning multiple days with earliest preserved', async () => {
        // Create records across 3 days, multiple per day
        const day1Early = UnixTime(100)
        const day1Mid = UnixTime(200)
        const day2Early = UnixTime(100 + UnixTime.DAY)
        const day2Mid = UnixTime(200 + UnixTime.DAY)
        const day2Late = UnixTime(300 + UnixTime.DAY)
        const day3Early = UnixTime(100 + 2 * UnixTime.DAY)
        const day3Mid = UnixTime(200 + 2 * UnixTime.DAY)

        const record1 = record({
          id: 'id1',
          timestamp: day1Early,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 5,
          identifiedCount: 1000,
        })
        const record2 = record({
          id: 'id2',
          timestamp: day1Mid,
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          transferCount: 3,
          identifiedCount: 2000,
        })
        const record3 = record({
          id: 'id3',
          timestamp: day2Early,
          srcChain: 'polygon',
          dstChain: 'ethereum',
          transferCount: 7,
          identifiedCount: 3000,
        })
        const record4 = record({
          id: 'id4',
          timestamp: day2Mid,
          srcChain: 'ethereum',
          dstChain: 'polygon',
          transferCount: 2,
          identifiedCount: 4000,
        })
        const record5 = record({
          id: 'id5',
          timestamp: day2Late,
          srcChain: 'arbitrum',
          dstChain: 'polygon',
          transferCount: 4,
          identifiedCount: 5000,
        })
        const record6 = record({
          id: 'id6',
          timestamp: day3Early,
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 6,
          identifiedCount: 6000,
        })
        const record7 = record({
          id: 'id7',
          timestamp: day3Mid,
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          transferCount: 8,
          identifiedCount: 7000,
        })
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
    AggregatedInteropTransferRepository.prototype.deleteByTimestamp.name,
    () => {
      it('deletes records with matching timestamp and returns count', async () => {
        const record1 = record({
          id: 'id1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 5,
          identifiedCount: 1000,
        })
        const record2 = record({
          id: 'id2',
          timestamp: UnixTime(200),
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          transferCount: 3,
          identifiedCount: 2000,
        })
        const record3 = record({
          id: 'id3',
          timestamp: UnixTime(200),
          srcChain: 'polygon',
          dstChain: 'ethereum',
          transferCount: 7,
          identifiedCount: 3000,
        })
        const record4 = record({
          id: 'id4',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'polygon',
          transferCount: 2,
          identifiedCount: 4000,
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
            transferCount: 5,
            identifiedCount: 1000,
          }),
          record({
            id: 'id2',
            timestamp: UnixTime(200),
            srcChain: 'arbitrum',
            dstChain: 'ethereum',
            transferCount: 3,
            identifiedCount: 2000,
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

      it('deletes only records with exact timestamp match', async () => {
        const record1 = record({
          id: 'id1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 5,
          identifiedCount: 1000,
        })
        const record2 = record({
          id: 'id2',
          timestamp: UnixTime(200),
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          transferCount: 3,
          identifiedCount: 2000,
        })
        const record3 = record({
          id: 'id3',
          timestamp: UnixTime(300),
          srcChain: 'polygon',
          dstChain: 'ethereum',
          transferCount: 7,
          identifiedCount: 3000,
        })
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
    AggregatedInteropTransferRepository.prototype.getByChainsAndTimestamp.name,
    () => {
      it('returns records matching timestamp, srcChains and dstChains', async () => {
        const record1 = record({
          id: 'id1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 5,
          identifiedCount: 1000,
        })
        const record2 = record({
          id: 'id2',
          timestamp: UnixTime(200),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 3,
          identifiedCount: 2000,
        })
        const record3 = record({
          id: 'id3',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 7,
          identifiedCount: 3000,
          totalDurationSum: 150,
        })
        const record4 = record({
          id: 'id4',
          timestamp: UnixTime(150),
          srcChain: 'polygon',
          dstChain: 'ethereum',
          transferCount: 2,
          identifiedCount: 4000,
        })
        const records = [record1, record2, record3, record4]

        await repository.insertMany(records)

        const result = await repository.getByChainsAndTimestamp(
          UnixTime(300),
          ['ethereum'],
          ['arbitrum'],
        )

        // Should only return record3 which matches timestamp 300
        expect(result).toEqual([record3])
      })

      it('returns records matching multiple srcChains and dstChains at same timestamp', async () => {
        const record1 = record({
          id: 'id1',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 5,
          identifiedCount: 1000,
        })
        const record2 = record({
          id: 'id2',
          timestamp: UnixTime(200),
          srcChain: 'polygon',
          dstChain: 'optimism',
          transferCount: 3,
          identifiedCount: 2000,
        })
        const record3 = record({
          id: 'id3',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 7,
          identifiedCount: 3000,
        })
        const record4 = record({
          id: 'id4',
          timestamp: UnixTime(300),
          srcChain: 'polygon',
          dstChain: 'optimism',
          transferCount: 2,
          identifiedCount: 4000,
          totalDurationSum: 250,
        })
        const records = [record1, record2, record3, record4]

        await repository.insertMany(records)

        const result = await repository.getByChainsAndTimestamp(
          UnixTime(300),
          ['ethereum', 'polygon'],
          ['arbitrum', 'optimism'],
        )

        // Should return record3 and record4 which match timestamp 300
        expect(result).toEqualUnsorted([record3, record4])
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
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 5,
          identifiedCount: 1000,
          bridgeType: 'lockAndMint',
        })
        const record2 = record({
          id: 'protocol2',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 3,
          identifiedCount: 2000,
          bridgeType: 'burnAndMint',
        })
        const record3 = record({
          id: 'protocol3',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 7,
          identifiedCount: 3000,
          bridgeType: 'lockAndMint',
        })
        const records = [record1, record2, record3]

        await repository.insertMany(records)

        const result = await repository.getByChainsAndTimestamp(
          UnixTime(300),
          ['ethereum'],
          ['arbitrum'],
          'lockAndMint',
        )

        expect(result).toEqualUnsorted([record1, record3])
      })

      it('returns all matching records when bridgeType is undefined', async () => {
        const record1 = record({
          id: 'protocol1',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 5,
          identifiedCount: 1000,
          bridgeType: 'lockAndMint',
        })
        const record2 = record({
          id: 'protocol2',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 3,
          identifiedCount: 2000,
          bridgeType: 'burnAndMint',
        })
        const records = [record1, record2]

        await repository.insertMany(records)

        const result = await repository.getByChainsAndTimestamp(
          UnixTime(300),
          ['ethereum'],
          ['arbitrum'],
          undefined,
        )

        expect(result).toEqualUnsorted([record1, record2])
      })
    },
  )

  describe(
    AggregatedInteropTransferRepository.prototype
      .getSummedTransferCountsByChainsIdAndTimestamp.name,
    () => {
      it('returns summed transferCount and identifiedCount for matching records', async () => {
        const record1 = record({
          id: 'protocol1',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 5,
          identifiedCount: 100,
          bridgeType: 'lockAndMint',
        })
        const record2 = record({
          id: 'protocol1',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'polygon',
          transferCount: 3,
          identifiedCount: 200,
          bridgeType: 'lockAndMint',
        })
        const record3 = record({
          id: 'protocol2',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 7,
          identifiedCount: 300,
          bridgeType: 'lockAndMint',
        })
        await repository.insertMany([record1, record2, record3])

        const result =
          await repository.getSummedTransferCountsByChainsIdAndTimestamp(
            UnixTime(300),
            'protocol1',
            ['ethereum'],
            ['arbitrum', 'polygon'],
            'lockAndMint',
          )

        expect(result).toEqual({
          transferCount: 8,
          identifiedCount: 300,
        })
      })

      it('returns zeros when no records match', async () => {
        const result =
          await repository.getSummedTransferCountsByChainsIdAndTimestamp(
            UnixTime(300),
            'protocol1',
            ['ethereum'],
            ['arbitrum'],
          )

        expect(result).toEqual({
          transferCount: 0,
          identifiedCount: 0,
        })
      })

      it('returns zeros when srcChains or dstChains is empty', async () => {
        await repository.insertMany([
          record({
            id: 'protocol1',
            timestamp: UnixTime(100),
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            transferCount: 5,
            identifiedCount: 1000,
          }),
        ])

        expect(
          await repository.getSummedTransferCountsByChainsIdAndTimestamp(
            UnixTime(100),
            'protocol1',
            [],
            ['arbitrum'],
          ),
        ).toEqual({
          transferCount: 0,
          identifiedCount: 0,
        })
        expect(
          await repository.getSummedTransferCountsByChainsIdAndTimestamp(
            UnixTime(100),
            'protocol1',
            ['ethereum'],
            [],
          ),
        ).toEqual({
          transferCount: 0,
          identifiedCount: 0,
        })
      })

      it('filters by bridgeType when provided', async () => {
        const record1 = record({
          id: 'protocol1',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 5,
          identifiedCount: 1000,
          bridgeType: 'lockAndMint',
        })
        const record2 = record({
          id: 'protocol1',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 10,
          identifiedCount: 2000,
          bridgeType: 'burnAndMint',
        })
        await repository.insertMany([record1, record2])

        const result =
          await repository.getSummedTransferCountsByChainsIdAndTimestamp(
            UnixTime(300),
            'protocol1',
            ['ethereum'],
            ['arbitrum'],
            'lockAndMint',
          )

        expect(result).toEqual({
          transferCount: 5,
          identifiedCount: 1000,
        })
      })

      it('sums all matching records when bridgeType is undefined', async () => {
        const record1 = record({
          id: 'protocol1',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 5,
          identifiedCount: 1000,
          bridgeType: 'lockAndMint',
        })
        const record2 = record({
          id: 'protocol1',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 10,
          identifiedCount: 2000,
          bridgeType: 'burnAndMint',
        })
        await repository.insertMany([record1, record2])

        const result =
          await repository.getSummedTransferCountsByChainsIdAndTimestamp(
            UnixTime(300),
            'protocol1',
            ['ethereum'],
            ['arbitrum'],
          )

        expect(result).toEqual({
          transferCount: 15,
          identifiedCount: 3000,
        })
      })

      it('filters by id and excludes records with different id', async () => {
        const record1 = record({
          id: 'protocol1',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 5,
          identifiedCount: 1000,
        })
        const record2 = record({
          id: 'protocol2',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 100,
          identifiedCount: 10000,
        })
        await repository.insertMany([record1, record2])

        const result =
          await repository.getSummedTransferCountsByChainsIdAndTimestamp(
            UnixTime(300),
            'protocol1',
            ['ethereum'],
            ['arbitrum'],
          )

        expect(result).toEqual({
          transferCount: 5,
          identifiedCount: 1000,
        })
      })
    },
  )

  describe(
    AggregatedInteropTransferRepository.prototype.getByChainsIdAndTimestamp
      .name,
    () => {
      it('returns records matching timestamp, id, srcChains, dstChains, and bridgeType', async () => {
        const record1 = record({
          id: 'protocol1',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 5,
          identifiedCount: 1000,
          bridgeType: 'lockAndMint',
        })
        const record2 = record({
          id: 'protocol2',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 3,
          identifiedCount: 2000,
          bridgeType: 'lockAndMint',
        })
        const record3 = record({
          id: 'protocol1',
          timestamp: UnixTime(300),
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 7,
          identifiedCount: 3000,
          bridgeType: 'burnAndMint',
        })
        const records = [record1, record2, record3]

        await repository.insertMany(records)

        const result = await repository.getByChainsIdAndTimestamp(
          UnixTime(300),
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
            transferCount: 5,
            identifiedCount: 1000,
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
  transferCount = 1,
  identifiedCount = 1,
  totalDurationSum = 0,
  bridgeType = 'unknown',
  srcValueUsd,
  dstValueUsd,
  avgValueInFlight,
  mintedValueUsd,
  burnedValueUsd,
  countUnder100 = 0,
  count100To1K = 0,
  count1KTo10K = 0,
  count10KTo100K = 0,
  countOver100K = 0,
}: {
  id: string
  timestamp: UnixTime
  srcChain: string
  dstChain: string
  transferCount?: number
  identifiedCount?: number
  totalDurationSum?: number
  bridgeType?: InteropBridgeType
  srcValueUsd?: number
  dstValueUsd?: number
  avgValueInFlight?: number
  mintedValueUsd?: number
  burnedValueUsd?: number
  countUnder100?: number
  count100To1K?: number
  count1KTo10K?: number
  count10KTo100K?: number
  countOver100K?: number
}): AggregatedInteropTransferRecord {
  return {
    timestamp,
    id,
    srcChain,
    dstChain,
    transferCount,
    identifiedCount,
    totalDurationSum,
    srcValueUsd,
    dstValueUsd,
    avgValueInFlight,
    mintedValueUsd,
    burnedValueUsd,
    countUnder100,
    count100To1K,
    count1KTo10K,
    count10KTo100K,
    countOver100K,
    bridgeType,
  }
}
