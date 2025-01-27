import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { createTrackedTxId } from '@l2beat/shared'
import { describeDatabase } from '../../test/database'
import type { LivenessRecord } from './entity'
import { LivenessRepository } from './repository'

describeDatabase(LivenessRepository.name, (db) => {
  const repository = db.liveness

  const txIdA = createTrackedTxId.random()
  const txIdB = createTrackedTxId.random()
  const txIdC = createTrackedTxId.random()

  const START = UnixTime.now()
  const DATA = [
    {
      timestamp: START.add(-1, 'hours'),
      blockNumber: 12345,
      txHash: '0x1234567890abcdef',
      configurationId: txIdA,
    },
    {
      timestamp: START.add(-2, 'hours'),
      blockNumber: 12340,
      txHash: '0xabcdef1234567890',
      configurationId: txIdA,
    },
    {
      timestamp: START.add(-3, 'hours'),
      blockNumber: 12346,
      txHash: '0xabcdef1234567890',
      configurationId: txIdB,
    },
    {
      timestamp: START.add(-3, 'hours'),
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
          timestamp: START.add(-5, 'hours'),
          blockNumber: 12349,
          txHash: '0x1234567890abcdef1',
          configurationId: txIdA,
        },
        {
          timestamp: START.add(-6, 'hours'),
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
          timestamp: START.add(-i, 'hours'),
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

  describe(LivenessRepository.prototype.getByConfigurationIdSince.name, () => {
    it('should return rows since given time', async () => {
      const results = await repository.getByConfigurationIdSince(
        [txIdA, txIdB],
        START.add(-2, 'hours'),
      )

      expect(results).toEqual([DATA[0]!, DATA[1]!])
    })
  })

  describe(LivenessRepository.prototype.getByConfigurationIdUpTo.name, () => {
    it('should return rows up to given time', async () => {
      const results = await repository.getByConfigurationIdUpTo(
        [txIdA, txIdB],
        START.add(-1, 'hours'),
      )

      expect(results).toEqual([DATA[1]!, DATA[2]!])
    })
  })

  describe(LivenessRepository.prototype.getByConfigurationIdWithinTimeRange
    .name, () => {
    it('should return rows within given time range', async () => {
      const results = await repository.getByConfigurationIdWithinTimeRange(
        [txIdA, txIdB],
        START.add(-2, 'hours'),
        START.add(0, 'hours'),
      )

      expect(results).toEqual([DATA[0]!, DATA[1]!])
    })
  })

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
          timestamp: START.add(1, 'hours'),
          blockNumber: 12345,
          txHash: '0x1234567890abcdef',
          configurationId: txIdA,
        },
        {
          timestamp: START.add(2, 'hours'),
          blockNumber: 12346,
          txHash: '0xabcdef1234567890',
          configurationId: txIdA,
        },
        {
          timestamp: START.add(2, 'hours'),
          blockNumber: 12346,
          txHash: '0xabcdef1234567890',
          configurationId: txIdB,
        },
      ]
      await repository.insertMany(records)

      await repository.deleteFromById(txIdA, START.add(1, 'hours'))

      const result = await repository.getAll()

      expect(result).toEqual([records[0]!, records[3]!])
    })
  })
})
