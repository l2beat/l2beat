import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { TokenValueRepository } from './repository'

describeDatabase(TokenValueRepository.name, (db) => {
  const repository = db.tvsTokenValue

  describe(TokenValueRepository.prototype.insertMany.name, () => {
    it('inserts new records', async () => {
      const records = [
        tokenValue('a', 'ethereum', UnixTime(100), 10, 10000, 8000, 5000),
        tokenValue('b', 'arbitrum', UnixTime(100), 1000, 1000, 800, 500),
      ]

      const inserted = await repository.insertMany(records)
      expect(inserted).toEqual(2)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(records)
    })

    it('handles empty array', async () => {
      const inserted = await repository.insertMany([])
      expect(inserted).toEqual(0)
    })

    it('performs batch insert when more than 1000 records', async () => {
      const records = []
      for (let i = 0; i < 1500; i++) {
        records.push(
          tokenValue(
            'a',
            'ethereum',
            UnixTime(i),
            i + 10,
            (i + 10) * 1000,
            (i + 10) * 800,
            (i + 10) * 500,
          ),
        )
      }

      const inserted = await repository.insertMany(records)
      expect(inserted).toEqual(1500)

      const result = await repository.getAll()
      expect(result.length).toEqual(1500)
    })
  })

  describe(TokenValueRepository.prototype.getByProject.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        tokenValue('a', 'ethereum', UnixTime(50), 1, 1000, 800, 500),
        tokenValue('a', 'ethereum', UnixTime(100), 2, 2000, 1600, 1000),
        tokenValue('a', 'ethereum', UnixTime(150), 3, 3000, 2400, 1500),
        tokenValue('a', 'ethereum', UnixTime(200), 4, 4000, 3200, 2000),
        tokenValue('a', 'ethereum', UnixTime(250), 5, 5000, 4000, 2500),
        tokenValue('b', 'arbitrum', UnixTime(100), 10, 10000, 8000, 5000),
        tokenValue('b', 'arbitrum', UnixTime(200), 20, 20000, 16000, 10000),
        tokenValue('c', 'ethereum', UnixTime(150), 30, 30000, 24000, 15000),
      ])
    })

    it('returns records for a project within the specified time range (inclusive)', async () => {
      const result = await repository.getByProject(
        'ethereum',
        UnixTime(100),
        UnixTime(200),
      )

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(100), 2, 2000, 1600, 1000),
        tokenValue('a', 'ethereum', UnixTime(150), 3, 3000, 2400, 1500),
        tokenValue('a', 'ethereum', UnixTime(200), 4, 4000, 3200, 2000),
        tokenValue('c', 'ethereum', UnixTime(150), 30, 30000, 24000, 15000),
      ])
    })

    it('returns empty array when no records match the time range', async () => {
      const result = await repository.getByProject(
        'ethereum',
        UnixTime(300),
        UnixTime(400),
      )

      expect(result).toEqual([])
    })

    it('returns empty array when project does not exist', async () => {
      const result = await repository.getByProject(
        'non-existent',
        UnixTime(100),
        UnixTime(200),
      )

      expect(result).toEqual([])
    })

    it('handles single-point time range (from = to)', async () => {
      const result = await repository.getByProject(
        'ethereum',
        UnixTime(150),
        UnixTime(150),
      )

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(150), 3, 3000, 2400, 1500),
        tokenValue('c', 'ethereum', UnixTime(150), 30, 30000, 24000, 15000),
      ])
    })

    it('returns records from multiple configurations for the same project', async () => {
      const result = await repository.getByProject(
        'ethereum',
        UnixTime(150),
        UnixTime(150),
      )

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(150), 3, 3000, 2400, 1500),
        tokenValue('c', 'ethereum', UnixTime(150), 30, 30000, 24000, 15000),
      ])
    })

    it('respects time boundaries exactly', async () => {
      const result = await repository.getByProject(
        'ethereum',
        UnixTime(100),
        UnixTime(150),
      )

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(100), 2, 2000, 1600, 1000),
        tokenValue('a', 'ethereum', UnixTime(150), 3, 3000, 2400, 1500),
        tokenValue('c', 'ethereum', UnixTime(150), 30, 30000, 24000, 15000),
      ])
    })
  })

  describe(TokenValueRepository.prototype.deleteByConfigInTimeRange
    .name, () => {
    it('deletes data in range for matching config', async () => {
      await repository.insertMany([
        tokenValue('b', 'ethereum', UnixTime(1), 1, 1000, 800, 500),
        tokenValue('b', 'ethereum', UnixTime(2), 2, 2000, 1600, 1000),
        tokenValue('b', 'ethereum', UnixTime(3), 3, 3000, 2400, 1500),
        tokenValue('c', 'arbitrum', UnixTime(2), 1000, 1000, 800, 500),
      ])

      const deleted = await repository.deleteByConfigInTimeRange(
        'b'.repeat(12),
        UnixTime(1),
        UnixTime(2),
      )

      expect(deleted).toEqual(2)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        tokenValue('b', 'ethereum', UnixTime(3), 3, 3000, 2400, 1500),
        tokenValue('c', 'arbitrum', UnixTime(2), 1000, 1000, 800, 500),
      ])
    })

    it('returns 0 if no matching config found', async () => {
      await repository.insertMany([
        tokenValue('b', 'ethereum', UnixTime(1), 1, 1000, 800, 500),
      ])

      const deleted = await repository.deleteByConfigInTimeRange(
        'c'.repeat(12),
        UnixTime(1),
        UnixTime(2),
      )

      expect(deleted).toEqual(0)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        tokenValue('b', 'ethereum', UnixTime(1), 1, 1000, 800, 500),
      ])
    })
  })

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function tokenValue(
  configId: string,
  projectId: string,
  timestamp: UnixTime,
  amount: number,
  value: number,
  valueForProject: number,
  valueForSummary: number,
) {
  return {
    configurationId: configId.repeat(12),
    projectId,
    timestamp,
    tokenId: configId,
    amount,
    value,
    valueForProject,
    valueForSummary,
  }
}
