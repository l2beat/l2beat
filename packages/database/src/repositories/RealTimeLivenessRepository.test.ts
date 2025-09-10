import { createTrackedTxId } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import { RealTimeLivenessRepository } from './RealTimeLivenessRepository'

describeDatabase(RealTimeLivenessRepository.name, (db) => {
  const repository = db.realTimeLiveness

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
    await repository.upsertMany(DATA)
  })

  describe(RealTimeLivenessRepository.prototype.upsertMany.name, () => {
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
      await repository.upsertMany(newRows)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        ...DATA.map((e) => ({
          ...e,
        })),
        ...newRows,
      ])
    })

    it('update on conflict', async () => {
      const newRows = [
        {
          timestamp: START - 4 * UnixTime.HOUR,
          blockNumber: 12348,
          txHash: '0xabcdef1234567890',
          configurationId: txIdB,
        },
        {
          timestamp: START - 4 * UnixTime.HOUR,
          blockNumber: 12349,
          txHash: '0x12345678901abcdef',
          configurationId: txIdC,
        },
      ]
      await repository.upsertMany(newRows)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([DATA[0]!, DATA[1]!, ...newRows])
    })

    it('empty array', async () => {
      await expect(repository.upsertMany([])).not.toBeRejected()
    })
  })

  describe(RealTimeLivenessRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      const results = await repository.getAll()

      expect(results).toEqualUnsorted(
        DATA.map((e) => ({
          ...e,
        })),
      )
    })
  })

  describe(RealTimeLivenessRepository.prototype.getLatestRecords.name, () => {
    it('should return latest records', async () => {
      const results = await repository.getLatestRecords()

      expect(results).toEqualUnsorted([DATA[0]!, DATA[2]!, DATA[3]!])
    })
  })

  describe(RealTimeLivenessRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.deleteAll()

      const results = await repository.getAll()

      expect(results).toEqual([])
    })
  })
})
