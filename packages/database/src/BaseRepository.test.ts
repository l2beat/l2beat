import { expect } from 'earl'
import { BaseRepository } from './BaseRepository'
import type { Database } from './database'
import { describeDatabase } from './test/database'

let nonce = 0
function toRow(value: number) {
  return {
    configurationId: 'test',
    priceId: 'ethereum',
    priceUsd: value,
    timestamp: new Date(nonce++),
  }
}

class TestRepository extends BaseRepository {
  async insert(value: number) {
    await this.db
      // We use prices because it is one of the simpler tables
      .insertInto('TvsPrice')
      .values(toRow(value))
      .execute()
  }

  async batchInsert(values: number[]) {
    await this.batch(values, 2, async (values) => {
      await this.db.insertInto('TvsPrice').values(values.map(toRow)).execute()
    })
  }

  async getAll() {
    const results = await this.db
      .selectFrom('TvsPrice')
      .select(['priceUsd'])
      .orderBy('priceUsd', 'asc')
      .execute()
    return results.map((row) => row.priceUsd)
  }

  async deleteAll() {
    await this.db.deleteFrom('TvsPrice').execute()
  }
}

function createTestRepository(db: Database) {
  const pgDb = db.activity['client']
  return new TestRepository(pgDb)
}

describeDatabase(BaseRepository.name, (db) => {
  const repository = createTestRepository(db)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe('transactions', () => {
    it('can run outside a transaction', async () => {
      await repository.insert(1)
      await repository.insert(2)

      const results = await repository.getAll()
      expect(results).toEqual([1, 2])
    })

    it('can run inside a transaction', async () => {
      await db.transaction(async () => {
        await repository.insert(1)
        await repository.insert(2)
      })
      const results = await repository.getAll()
      expect(results).toEqual([1, 2])
    })

    it('rollbacks inside a transaction', async () => {
      await db
        .transaction(async () => {
          await repository.insert(1)
          await repository.insert(2)
          throw new Error('rollback')
        })
        .catch(() => {})
      const results = await repository.getAll()
      expect(results).toEqual([])
    })

    it('runs multiple transactions in parallel', async () => {
      await Promise.allSettled([
        db.transaction(async () => {
          await repository.insert(1)
          await repository.insert(1)
          throw new Error('rollback')
        }),
        db.transaction(async () => {
          await repository.insert(2)
          await repository.insert(2)
        }),
        db.transaction(async () => {
          await repository.insert(3)
          await repository.insert(3)
        }),
        db.transaction(async () => {
          await repository.insert(4)
          await repository.insert(4)
          throw new Error('rollback')
        }),
      ])

      const results = await repository.getAll()
      expect(results).toEqual([2, 2, 3, 3])
    })
  })

  describe('batch', () => {
    it('executes multiple times', async () => {
      await repository.batchInsert([1, 2, 3, 4])

      const results = await repository.getAll()
      expect(results).toEqual([1, 2, 3, 4])
    })
  })
})
