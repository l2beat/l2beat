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
  project: string,
  timestamp: UnixTime,
  amount: number,
  value: number,
  valueForProject: number,
  valueForSummary: number,
) {
  return {
    configurationId: configId.repeat(12),
    project,
    timestamp,
    amount,
    value,
    valueForProject,
    valueForSummary,
  }
}
