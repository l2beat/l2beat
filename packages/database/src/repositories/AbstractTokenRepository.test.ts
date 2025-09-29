import { UnixTime } from '@l2beat/shared-pure'
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

  describe(AbstractTokenRepository.prototype.upsertMany.name, () => {
    it('inserts new records', async () => {
      const records = [
        abstractToken({ id: 'TK0001' }),
        abstractToken({
          id: 'TK0002',
          coingeckoListingTimestamp: UnixTime(20),
        }),
      ]

      const inserted = await repository.upsertMany(records)
      expect(inserted).toEqual(2)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(records)
    })

    it('updates existing records', async () => {
      await repository.upsertMany([
        abstractToken({ id: 'TK0001', issuer: 'Issuer A' }),
      ])

      const updated = abstractToken({
        id: 'TK0001',
        issuer: 'Issuer B',
        iconUrl: 'https://example.com/icon.png',
        coingeckoId: 'token-1',
        coingeckoListingTimestamp: UnixTime(30),
        comment: 'updated comment',
      })

      const inserted = await repository.upsert(updated)
      expect(inserted).toEqual(undefined)

      const result = await repository.findById('TK0001')
      expect(result).toEqual(updated)
    })
  })

  describe(AbstractTokenRepository.prototype.deleteByIds.name, () => {
    it('deletes selected records', async () => {
      await repository.upsertMany([
        abstractToken({ id: 'TK0001' }),
        abstractToken({ id: 'TK0002' }),
        abstractToken({ id: 'TK0003' }),
      ])

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
    issuer: overrides.issuer,
    symbol: overrides.symbol ?? 'TOKEN',
    category: overrides.category ?? 'generic',
    iconUrl: overrides.iconUrl,
    coingeckoId: overrides.coingeckoId,
    coingeckoListingTimestamp: overrides.coingeckoListingTimestamp,
    comment: overrides.comment,
  }
}
