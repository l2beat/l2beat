import { createTrackedTxId } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import { type LivenessRecord, LivenessRepository } from './LivenessRepository'

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
    },
    {
      timestamp: START - 2 * UnixTime.HOUR,
      blockNumber: 12340,
      txHash: '0xabcdef1234567890',
      configurationId: txIdA,
    },
    {
      timestamp: START - 3 * UnixTime.HOUR,
      blockNumber: 12346,
      txHash: '0xabcdef1234567890',
      configurationId: txIdB,
    },
    {
      timestamp: START - 3 * UnixTime.HOUR,
      blockNumber: 12347,
      txHash: '0x12345678901abcdef',
      configurationId: txIdC,
    },
  ]

  beforeEach(async function () {
    this.timeout(10000)

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
        },
        {
          timestamp: START - 6 * UnixTime.HOUR,
          blockNumber: 12350,
          txHash: '0xabcdef1234567892',
          configurationId: txIdA,
        },
      ]
      await repository.insertMany(newRows)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        ...DATA.map((e) => ({
          ...e,
        })),
        ...newRows,
      ])
    })

    it('empty array', async () => {
      await expect(repository.insertMany([])).not.toBeRejected()
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
      await expect(repository.insertMany(records)).not.toBeRejected()
    })
  })

  describe(LivenessRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      const results = await repository.getAll()

      expect(results).toEqualUnsorted(
        DATA.map((e) => ({
          ...e,
        })),
      )
    })
  })

  describe(
    LivenessRepository.prototype.getByConfigurationIdWithinTimeRange.name,
    () => {
      it('should return rows within given time range', async () => {
        const results = await repository.getByConfigurationIdWithinTimeRange(
          [txIdA, txIdB],
          START - 2 * UnixTime.HOUR,
          START + 0 * UnixTime.HOUR,
        )

        expect(results).toEqualUnsorted([DATA[0]!, DATA[1]!])
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
          },
        ]
        await repository.insertMany(NEW_DATA)

        const results = await repository.getRecordsInRangeWithLatestBefore(
          [txIdA],
          START - 2 * UnixTime.HOUR,
          START - 1 * UnixTime.HOUR,
        )

        expect(results).toEqualUnsorted([DATA[1]!, NEW_DATA[0]!])
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

        expect(results).toEqualUnsorted([DATA[0]!, DATA[1]!])
      })

      it('should return record before from for each configuration, desc timestamp', async () => {
        await repository.deleteAll()
        const NEW_DATA = [
          {
            timestamp: START - 1 * UnixTime.HOUR,
            blockNumber: 12345,
            txHash: '0x1234567890abcdef',
            configurationId: txIdA,
          },
          {
            timestamp: START - 2 * UnixTime.HOUR,
            blockNumber: 12340,
            txHash: '0xabcdef1234567890',
            configurationId: txIdA,
          },
          {
            timestamp: START - 3 * UnixTime.HOUR - 1,
            blockNumber: 12340,
            txHash: '0xabcdef1234567891',
            configurationId: txIdA,
          },
          {
            timestamp: START - 3 * UnixTime.HOUR,
            blockNumber: 12346,
            txHash: '0xabcdef1234567890',
            configurationId: txIdB,
          },
          {
            timestamp: START - 4 * UnixTime.HOUR,
            blockNumber: 12346,
            txHash: '0xabcdef1234567891',
            configurationId: txIdB,
          },
        ]
        await repository.insertMany(NEW_DATA)

        const results = await repository.getRecordsInRangeWithLatestBefore(
          [txIdA, txIdB],
          START - 2 * UnixTime.HOUR,
          START - 1 * UnixTime.HOUR,
        )

        expect(results).toEqualUnsorted([
          NEW_DATA[1]!,
          NEW_DATA[3]!,
          NEW_DATA[2]!,
        ])
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

  describe(LivenessRepository.prototype.deleteFromById.name, () => {
    it('should delete rows inserted after certain timestamp for given configuration id inclusively', async () => {
      await repository.deleteAll()

      const records: LivenessRecord[] = [
        {
          timestamp: START,
          blockNumber: 12345,
          txHash: '0xabcdef1234567891',
          configurationId: txIdA,
        },
        {
          timestamp: START + 1 * UnixTime.HOUR,
          blockNumber: 12345,
          txHash: '0x1234567890abcdef',
          configurationId: txIdA,
        },
        {
          timestamp: START + 2 * UnixTime.HOUR,
          blockNumber: 12346,
          txHash: '0xabcdef1234567890',
          configurationId: txIdA,
        },
        {
          timestamp: START + 2 * UnixTime.HOUR,
          blockNumber: 12346,
          txHash: '0xabcdef1234567890',
          configurationId: txIdB,
        },
      ]
      await repository.insertMany(records)

      await repository.deleteFromById(txIdA, START + 1 * UnixTime.HOUR)

      const result = await repository.getAll()

      expect(result).toEqual([records[0]!, records[3]!])
    })
  })
})
