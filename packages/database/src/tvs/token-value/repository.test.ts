import { type TokenId, UnixTime } from '@l2beat/shared-pure'
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

  describe(TokenValueRepository.prototype.getByTokenIdInTimeRange.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        tokenValue('a', 'ethereum', UnixTime(105), 1, 1000, 800, 500),
        tokenValue('a', 'ethereum', UnixTime(110), 2, 2000, 1600, 1000),
        tokenValue('a', 'ethereum', UnixTime(115), 3, 3000, 2400, 1500),
        tokenValue('a', 'ethereum', UnixTime(120), 4, 4000, 3200, 2000),
        tokenValue('a', 'ethereum', UnixTime(125), 5, 5000, 4000, 2500),
        tokenValue('b', 'ethereum', UnixTime(110), 10, 10000, 8000, 5000),
        tokenValue('b', 'ethereum', UnixTime(120), 20, 20000, 16000, 10000),
        tokenValue('c', 'ethereum', UnixTime(115), 30, 30000, 24000, 15000),
      ])
    })

    it('returns record for a project and token within the specified time range (inclusive) in ascending time order', async () => {
      const result = await repository.getByTokenIdInTimeRange(
        'a' as TokenId,
        UnixTime(105),
        UnixTime(125),
      )

      expect(result).toEqual([
        tokenValue('a', 'ethereum', UnixTime(105), 1, 1000, 800, 500),
        tokenValue('a', 'ethereum', UnixTime(110), 2, 2000, 1600, 1000),
        tokenValue('a', 'ethereum', UnixTime(115), 3, 3000, 2400, 1500),
        tokenValue('a', 'ethereum', UnixTime(120), 4, 4000, 3200, 2000),
        tokenValue('a', 'ethereum', UnixTime(125), 5, 5000, 4000, 2500),
      ])
    })

    it('returns all records for a token when both time ranges are null', async () => {
      const result = await repository.getByTokenIdInTimeRange(
        'a' as TokenId,
        null,
        null,
      )

      expect(result).toEqual([
        tokenValue('a', 'ethereum', UnixTime(105), 1, 1000, 800, 500),
        tokenValue('a', 'ethereum', UnixTime(110), 2, 2000, 1600, 1000),
        tokenValue('a', 'ethereum', UnixTime(115), 3, 3000, 2400, 1500),
        tokenValue('a', 'ethereum', UnixTime(120), 4, 4000, 3200, 2000),
        tokenValue('a', 'ethereum', UnixTime(125), 5, 5000, 4000, 2500),
      ])
    })

    it('returns records from specified time when only fromInclusive is provided', async () => {
      const result = await repository.getByTokenIdInTimeRange(
        'a' as TokenId,
        UnixTime(115),
        null,
      )

      expect(result).toEqual([
        tokenValue('a', 'ethereum', UnixTime(115), 3, 3000, 2400, 1500),
        tokenValue('a', 'ethereum', UnixTime(120), 4, 4000, 3200, 2000),
        tokenValue('a', 'ethereum', UnixTime(125), 5, 5000, 4000, 2500),
      ])
    })

    it('returns records up to specified time when only toInclusive is provided', async () => {
      const result = await repository.getByTokenIdInTimeRange(
        'a' as TokenId,
        null,
        UnixTime(115),
      )

      expect(result).toEqual([
        tokenValue('a', 'ethereum', UnixTime(105), 1, 1000, 800, 500),
        tokenValue('a', 'ethereum', UnixTime(110), 2, 2000, 1600, 1000),
        tokenValue('a', 'ethereum', UnixTime(115), 3, 3000, 2400, 1500),
      ])
    })

    it('returns empty array when no records match the time range', async () => {
      const result = await repository.getByTokenIdInTimeRange(
        'a' as TokenId,
        UnixTime(130),
        UnixTime(140),
      )

      expect(result).toEqual([])
    })

    it('returns empty array when token does not exist', async () => {
      const result = await repository.getByTokenIdInTimeRange(
        'non-existent' as TokenId,
        UnixTime(110),
        UnixTime(120),
      )

      expect(result).toEqual([])
    })

    it('handles single-point time range (from = to)', async () => {
      const result = await repository.getByTokenIdInTimeRange(
        'a' as TokenId,
        UnixTime(115),
        UnixTime(115),
      )

      expect(result).toEqual([
        tokenValue('a', 'ethereum', UnixTime(115), 3, 3000, 2400, 1500),
      ])
    })
  })

  describe(TokenValueRepository.prototype.getByProjectAtOrBefore.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        // Token A with multiple timestamps
        tokenValue('a', 'ethereum', UnixTime(100), 1, 1000, 800, 500),
        tokenValue('a', 'ethereum', UnixTime(150), 5, 5000, 4000, 2500),
        tokenValue('a', 'ethereum', UnixTime(200), 10, 10000, 8000, 5000),

        // Token B with multiple timestamps
        tokenValue('b', 'ethereum', UnixTime(100), 2, 2000, 1600, 1000),
        tokenValue('b', 'ethereum', UnixTime(180), 8, 8000, 6400, 4000),

        // Token C with a single timestamp
        tokenValue('c', 'ethereum', UnixTime(100), 3, 3000, 2400, 1500),

        // Different project
        tokenValue('d', 'arbitrum', UnixTime(100), 10, 10000, 8000, 5000),
        tokenValue('d', 'arbitrum', UnixTime(200), 20, 20000, 16000, 10000),
      ])
    })

    it('returns latest record for each token at or before timestamp', async () => {
      const result = await repository.getByProjectAtOrBefore(
        'ethereum',
        UnixTime(180),
      )

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(150), 5, 5000, 4000, 2500),
        tokenValue('b', 'ethereum', UnixTime(180), 8, 8000, 6400, 4000),
        tokenValue('c', 'ethereum', UnixTime(100), 3, 3000, 2400, 1500),
      ])
    })

    it('returns records exactly at the timestamp when available', async () => {
      const result = await repository.getByProjectAtOrBefore(
        'ethereum',
        UnixTime(100),
      )

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(100), 1, 1000, 800, 500),
        tokenValue('b', 'ethereum', UnixTime(100), 2, 2000, 1600, 1000),
        tokenValue('c', 'ethereum', UnixTime(100), 3, 3000, 2400, 1500),
      ])
    })

    it('returns records before the timestamp when no exact match', async () => {
      const result = await repository.getByProjectAtOrBefore(
        'ethereum',
        UnixTime(170),
      )

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(150), 5, 5000, 4000, 2500),
        tokenValue('b', 'ethereum', UnixTime(100), 2, 2000, 1600, 1000),
        tokenValue('c', 'ethereum', UnixTime(100), 3, 3000, 2400, 1500),
      ])
    })

    it('returns empty array when no records before or at timestamp', async () => {
      const result = await repository.getByProjectAtOrBefore(
        'ethereum',
        UnixTime(50),
      )

      expect(result).toEqual([])
    })

    it('returns records up to the latest timestamp for each token', async () => {
      const result = await repository.getByProjectAtOrBefore(
        'ethereum',
        UnixTime(250),
      )

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(200), 10, 10000, 8000, 5000),
        tokenValue('b', 'ethereum', UnixTime(180), 8, 8000, 6400, 4000),
        tokenValue('c', 'ethereum', UnixTime(100), 3, 3000, 2400, 1500),
      ])
    })
  })

  describe(TokenValueRepository.prototype.getLastNonZeroValue.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        // Token A with multiple timestamps
        tokenValue('a', 'ethereum', UnixTime(100), 1, 1000, 800, 500),
        tokenValue('a', 'ethereum', UnixTime(150), 5, 5000, 4000, 2500),
        tokenValue('a', 'ethereum', UnixTime(200), 10, 10000, 8000, 5000),

        // Token B with zero value at some timestamps
        tokenValue('b', 'ethereum', UnixTime(100), 2, 2000, 1600, 1000),
        tokenValue('b', 'ethereum', UnixTime(130), 0, 0, 0, 0),

        // Token C with a single timestamp
        tokenValue('c', 'arbitrum', UnixTime(100), 3, 3000, 2400, 1500),
      ])
    })

    it('returns latest non-zero record for each token at or before timestamp', async () => {
      const result = await repository.getLastNonZeroValue(UnixTime(150))

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(150), 5, 5000, 4000, 2500),
        tokenValue('b', 'ethereum', UnixTime(100), 2, 2000, 1600, 1000),
        tokenValue('c', 'arbitrum', UnixTime(100), 3, 3000, 2400, 1500),
      ])
    })

    it('returns latest non-zero record for each token of given project at or before timestamp', async () => {
      const result = await repository.getLastNonZeroValue(
        UnixTime(150),
        'ethereum',
      )

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(150), 5, 5000, 4000, 2500),
        tokenValue('b', 'ethereum', UnixTime(100), 2, 2000, 1600, 1000),
      ])
    })
  })

  describe(
    TokenValueRepository.prototype.deleteByConfigInTimeRange.name,
    () => {
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
    },
  )

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
