import { createTrackedTxId } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { beforeEach, describe, expect, it } from 'vitest'
import { describeDatabase } from '../test/database'
import {
  type LivenessRecord,
  LivenessRepository,
  toRecord,
} from './LivenessRepository'

describe(toRecord.name, () => {
  // toStrictEqual, not toEqual: these assertions are about an optional key being present with value undefined, which toEqual ignores.
  it('maps the ungrouped sentinel to undefined', () => {
    const timestamp = UnixTime(1)

    expect(
      toRecord({
        timestamp: UnixTime.toDate(timestamp),
        blockNumber: 1,
        txHash: '0x1234',
        configurationId: 'config-id',
        groupingKey: 'none',
      }),
    ).toStrictEqual({
      timestamp,
      blockNumber: 1,
      txHash: '0x1234',
      configurationId: 'config-id',
      groupingKey: undefined,
    })
  })
})

describeDatabase(LivenessRepository.name, (db) => {
  const repository = db.liveness

  const txIdA = createTrackedTxId.random()
  const txIdB = createTrackedTxId.random()
  const txIdC = createTrackedTxId.random()

  const START = UnixTime.now()
  const DATA = [
    {
      timestamp: START - 1 * UnixTime.HOUR,
      blockNumber: 12345,
      txHash: '0x1234567890abcdef',
      configurationId: txIdA,
      groupingKey: undefined,
    },
    {
      timestamp: START - 2 * UnixTime.HOUR,
      blockNumber: 12340,
      txHash: '0xabcdef1234567890',
      configurationId: txIdA,
      groupingKey: undefined,
    },
    {
      timestamp: START - 3 * UnixTime.HOUR,
      blockNumber: 12346,
      txHash: '0xabcdef1234567890',
      configurationId: txIdB,
      groupingKey: undefined,
    },
    {
      timestamp: START - 3 * UnixTime.HOUR,
      blockNumber: 12347,
      txHash: '0x12345678901abcdef',
      configurationId: txIdC,
      groupingKey: undefined,
    },
  ]

  beforeEach(async () => {
    await repository.deleteAll()
    await repository.insertMany(DATA)
  })

  describe(LivenessRepository.prototype.insertMany.name, () => {
    it('only new rows', async () => {
      const newRows = [
        {
          timestamp: START - 5 * UnixTime.HOUR,
          blockNumber: 12349,
          txHash: '0x1234567890abcdef1',
          configurationId: txIdA,
          groupingKey: undefined,
        },
        {
          timestamp: START - 6 * UnixTime.HOUR,
          blockNumber: 12350,
          txHash: '0xabcdef1234567892',
          configurationId: txIdA,
          groupingKey: undefined,
        },
      ]
      await repository.insertMany(newRows)

      const results = await repository.getAll()
      const expected = [
        ...DATA.map((e) => ({
          ...e,
        })),
        ...newRows,
      ]
      expect(results).toHaveLength(expected.length)
      expect(results).toEqual(expect.arrayContaining(expected))
    })

    it('empty array', async () => {
      await expect(repository.insertMany([])).resolves.not.toThrow()
    })

    it('keeps the earliest transaction for each grouping key', async () => {
      const grouped = [
        {
          timestamp: START - 4 * UnixTime.MINUTE,
          blockNumber: 20,
          txHash: '0xgrouped-later',
          configurationId: txIdA,
          groupingKey: 'epoch-1',
        },
        {
          timestamp: START - 5 * UnixTime.MINUTE,
          blockNumber: 10,
          txHash: '0xgrouped-earlier',
          configurationId: txIdA,
          groupingKey: 'epoch-1',
        },
        {
          timestamp: START - 3 * UnixTime.MINUTE,
          blockNumber: 30,
          txHash: '0xgrouped-other-config',
          configurationId: txIdB,
          groupingKey: 'epoch-1',
        },
      ]

      await repository.insertMany(grouped)

      const results = await repository.getAll()
      const expected = [...DATA, grouped[1]!, grouped[2]!]
      expect(results).toHaveLength(expected.length)
      expect(results).toEqual(expect.arrayContaining(expected))
    })

    it('replaces a grouped transaction only when an earlier one arrives', async () => {
      const first = {
        timestamp: START - 4 * UnixTime.MINUTE,
        blockNumber: 20,
        txHash: '0xgrouped-first',
        configurationId: txIdA,
        groupingKey: 'epoch-1',
      }
      const earlier = {
        ...first,
        timestamp: START - 5 * UnixTime.MINUTE,
        blockNumber: 10,
        txHash: '0xgrouped-earlier',
      }
      const later = {
        ...first,
        timestamp: START - 3 * UnixTime.MINUTE,
        blockNumber: 30,
        txHash: '0xgrouped-later',
      }

      await repository.insertMany([first])
      await repository.insertMany([earlier])
      await repository.insertMany([later])

      const results = await repository.getAll()
      const expected = [...DATA, earlier]
      expect(results).toHaveLength(expected.length)
      expect(results).toEqual(expect.arrayContaining(expected))
    })

    it('stores a record per grouping key for one transaction', async () => {
      const sharedTx = {
        timestamp: START - 4 * UnixTime.MINUTE,
        blockNumber: 20,
        txHash: '0xgrouped-multicall',
        configurationId: txIdA,
      }
      const grouped = [
        { ...sharedTx, groupingKey: 'epoch-1' },
        { ...sharedTx, groupingKey: 'epoch-2' },
      ]

      await repository.insertMany(grouped)

      const results = await repository.getAll()
      const expected = [...DATA, ...grouped]
      expect(results).toHaveLength(expected.length)
      expect(results).toEqual(expect.arrayContaining(expected))
    })

    it('rejects the same ungrouped transaction twice', async () => {
      const record = {
        timestamp: START - 4 * UnixTime.MINUTE,
        blockNumber: 20,
        txHash: '0xungrouped-duplicate',
        configurationId: txIdA,
        groupingKey: undefined,
      }

      await expect(repository.insertMany([record, record])).rejects.toThrow()
    })

    it('big query', async () => {
      const records: LivenessRecord[] = []
      for (let i = 0; i < 15_000; i++) {
        records.push({
          timestamp: START - i * UnixTime.HOUR,
          blockNumber: i,
          txHash: `0xabcdef1234567892${i}`,
          configurationId: txIdA,
        })
      }
      await expect(repository.insertMany(records)).resolves.not.toThrow()
    })
  })

  describe(LivenessRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      const results = await repository.getAll()

      const expected = DATA.map((e) => ({
        ...e,
      }))
      expect(results).toHaveLength(expected.length)
      expect(results).toEqual(expect.arrayContaining(expected))
    })
  })

  describe(
    LivenessRepository.prototype.getLatestTimestampsByConfigId.name,
    () => {
      it('returns latest timestamp for each configuration', async () => {
        const results = await repository.getLatestTimestampsByConfigId()

        expect(results).toHaveLength(3)
        expect(results).toEqual(
          expect.arrayContaining([
            {
              configurationId: txIdA,
              latestTimestamp: START - 1 * UnixTime.HOUR,
            },
            {
              configurationId: txIdB,
              latestTimestamp: START - 3 * UnixTime.HOUR,
            },
            {
              configurationId: txIdC,
              latestTimestamp: START - 3 * UnixTime.HOUR,
            },
          ]),
        )
      })
    },
  )

  describe(
    LivenessRepository.prototype.getByConfigurationIdWithinTimeRange.name,
    () => {
      it('should return rows within given time range', async () => {
        const results = await repository.getByConfigurationIdWithinTimeRange(
          [txIdA, txIdB],
          START - 2 * UnixTime.HOUR,
          START + 0 * UnixTime.HOUR,
        )

        expect(results).toHaveLength(2)
        expect(results).toEqual(expect.arrayContaining([DATA[0]!, DATA[1]!]))
      })
    },
  )

  describe(
    LivenessRepository.prototype.getRecordsInRangeWithLatestBefore.name,
    () => {
      it('should return rows within given time range with latest before', async () => {
        const NEW_DATA = [
          {
            timestamp: START - 3 * UnixTime.HOUR,
            blockNumber: 12340,
            txHash: '0xabcdef1234567891',
            configurationId: txIdA,
            groupingKey: undefined,
          },
        ]
        await repository.insertMany(NEW_DATA)

        const results = await repository.getRecordsInRangeWithLatestBefore(
          [txIdA],
          START - 2 * UnixTime.HOUR,
          START - 1 * UnixTime.HOUR,
        )

        expect(results).toHaveLength(2)
        expect(results).toEqual(
          expect.arrayContaining([DATA[1]!, NEW_DATA[0]!]),
        )
      })

      it('should return rows within given time range, exclusive to', async () => {
        const NEW_DATA = [
          {
            timestamp: START,
            blockNumber: 12340,
            txHash: '0xabcdef1234567891',
            configurationId: txIdA,
          },
        ]
        await repository.insertMany(NEW_DATA)
        const results = await repository.getByConfigurationIdWithinTimeRange(
          [txIdA, txIdB],
          START - 2 * UnixTime.HOUR,
          START + 0 * UnixTime.HOUR,
        )

        expect(results).toHaveLength(2)
        expect(results).toEqual(expect.arrayContaining([DATA[0]!, DATA[1]!]))
      })

      it('should return record before from for each configuration, desc timestamp', async () => {
        await repository.deleteAll()
        const NEW_DATA = [
          {
            timestamp: START - 1 * UnixTime.HOUR,
            blockNumber: 12345,
            txHash: '0x1234567890abcdef',
            configurationId: txIdA,
            groupingKey: undefined,
          },
          {
            timestamp: START - 2 * UnixTime.HOUR,
            blockNumber: 12340,
            txHash: '0xabcdef1234567890',
            configurationId: txIdA,
            groupingKey: undefined,
          },
          {
            timestamp: START - 3 * UnixTime.HOUR - 1,
            blockNumber: 12340,
            txHash: '0xabcdef1234567891',
            configurationId: txIdA,
            groupingKey: undefined,
          },
          {
            timestamp: START - 3 * UnixTime.HOUR,
            blockNumber: 12346,
            txHash: '0xabcdef1234567890',
            configurationId: txIdB,
            groupingKey: undefined,
          },
          {
            timestamp: START - 4 * UnixTime.HOUR,
            blockNumber: 12346,
            txHash: '0xabcdef1234567891',
            configurationId: txIdB,
            groupingKey: undefined,
          },
        ]
        await repository.insertMany(NEW_DATA)

        const results = await repository.getRecordsInRangeWithLatestBefore(
          [txIdA, txIdB],
          START - 2 * UnixTime.HOUR,
          START - 1 * UnixTime.HOUR,
        )

        expect(results).toHaveLength(3)
        expect(results).toEqual(
          expect.arrayContaining([NEW_DATA[1]!, NEW_DATA[3]!, NEW_DATA[2]!]),
        )
      })
    },
  )

  describe(LivenessRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.deleteAll()

      const results = await repository.getAll()

      expect(results).toEqual([])
    })
  })

  describe(LivenessRepository.prototype.deleteByConfigIds.name, () => {
    it('deletes all rows for given configuration ids', async () => {
      const deleted = await repository.deleteByConfigIds([
        txIdA.toString(),
        txIdB.toString(),
      ])

      expect(deleted).toEqual(3)

      const results = await repository.getAll()
      expect(results).toHaveLength(1)
      expect(results).toEqual(expect.arrayContaining([DATA[3]!]))
    })

    it('returns 0 for empty ids', async () => {
      const deleted = await repository.deleteByConfigIds([])
      expect(deleted).toEqual(0)

      const results = await repository.getAll()
      expect(results).toHaveLength(DATA.length)
      expect(results).toEqual(expect.arrayContaining(DATA))
    })

    it('returns 0 when no matching config found', async () => {
      const deleted = await repository.deleteByConfigIds(['non-existent-id'])
      expect(deleted).toEqual(0)

      const results = await repository.getAll()
      expect(results).toHaveLength(DATA.length)
      expect(results).toEqual(expect.arrayContaining(DATA))
    })
  })

  describe(LivenessRepository.prototype.deleteFromById.name, () => {
    it('should delete rows inserted after certain timestamp for given configuration id inclusively', async () => {
      await repository.deleteAll()

      const records: LivenessRecord[] = [
        {
          timestamp: START,
          blockNumber: 12345,
          txHash: '0xabcdef1234567891',
          configurationId: txIdA,
          groupingKey: undefined,
        },
        {
          timestamp: START + 1 * UnixTime.HOUR,
          blockNumber: 12345,
          txHash: '0x1234567890abcdef',
          configurationId: txIdA,
          groupingKey: undefined,
        },
        {
          timestamp: START + 2 * UnixTime.HOUR,
          blockNumber: 12346,
          txHash: '0xabcdef1234567890',
          configurationId: txIdA,
          groupingKey: undefined,
        },
        {
          timestamp: START + 2 * UnixTime.HOUR,
          blockNumber: 12346,
          txHash: '0xabcdef1234567890',
          configurationId: txIdB,
          groupingKey: undefined,
        },
      ]
      await repository.insertMany(records)

      await repository.deleteFromById(txIdA, START + 1 * UnixTime.HOUR)

      const result = await repository.getAll()

      expect(result).toEqual([records[0]!, records[3]!])
    })
  })
})
