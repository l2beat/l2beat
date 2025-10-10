import { expect } from 'earl'
import { describeTokenDatabase } from '../test/tokenDatabase'
import {
  type AbstractTokenRecord,
  AbstractTokenRepository,
} from './AbstractTokenRepository'

describeTokenDatabase(AbstractTokenRepository.name, (db) => {
  const repository = db.abstractToken

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(AbstractTokenRepository.prototype.insert.name, () => {
    it('inserts record and returns id', async () => {
      const record = abstractToken({
        id: 'TK0001',
        issuer: 'issuer',
        symbol: 'ISTK',
        category: 'stablecoin',
        iconUrl: 'https://example.com/icon.png',
        coingeckoId: 'coin-1',
        coingeckoListingTimestamp: 10,
        comment: 'some comment',
      })

      const id = await repository.insert(record)
      expect(id).toEqual(record.id)

      const stored = await repository.findById(record.id)
      expect(stored).toEqual(record)
    })

    it('accepts optional fields', async () => {
      const record = abstractToken({ id: 'TK0002' })

      const id = await repository.insert(record)
      expect(id).toEqual(record.id)

      const stored = await repository.findById(record.id)
      expect(stored).toEqual(record)
    })
  })

  describe(AbstractTokenRepository.prototype.updateById.name, () => {
    it('updates record and returns number of affected rows', async () => {
      const record = abstractToken({
        id: 'TK0001',
        issuer: 'issuer',
        symbol: 'ISTK',
        category: 'stablecoin',
        iconUrl: 'https://example.com/icon.png',
        coingeckoId: 'coin-1',
        coingeckoListingTimestamp: 10,
        comment: 'initial comment',
      })
      await repository.insert(record)

      const updatedRows = await repository.updateById(record.id, {
        issuer: 'updated issuer',
        symbol: 'UPDT',
        iconUrl: 'https://example.com/updated-icon.png',
        comment: 'updated comment',
      })

      expect(updatedRows).toEqual(1)

      const stored = await repository.findById(record.id)
      expect(stored).toEqual({
        ...record,
        issuer: 'updated issuer',
        symbol: 'UPDT',
        iconUrl: 'https://example.com/updated-icon.png',
        comment: 'updated comment',
      })
    })
  })

  describe(AbstractTokenRepository.prototype.deleteByIds.name, () => {
    it('deletes selected records', async () => {
      await repository.insert(abstractToken({ id: 'TK0001' }))
      await repository.insert(abstractToken({ id: 'TK0002' }))
      await repository.insert(abstractToken({ id: 'TK0003' }))

      const deleted = await repository.deleteByIds(['TK0001', 'TK0003'])
      expect(deleted).toEqual(2)

      const remaining = await repository.getAll()
      expect(remaining).toEqual([abstractToken({ id: 'TK0002' })])
    })
  })
})

function abstractToken(
  overrides: Partial<AbstractTokenRecord> & { id: string },
): AbstractTokenRecord {
  return {
    id: overrides.id,
    issuer: overrides.issuer ?? null,
    symbol: overrides.symbol ?? 'TOKEN',
    category: overrides.category ?? 'other',
    iconUrl: overrides.iconUrl ?? null,
    coingeckoId: overrides.coingeckoId ?? null,
    coingeckoListingTimestamp: overrides.coingeckoListingTimestamp ?? null,
    comment: overrides.comment ?? null,
    reviewed: false,
  }
}
