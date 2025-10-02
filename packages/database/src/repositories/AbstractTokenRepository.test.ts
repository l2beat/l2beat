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

  describe(AbstractTokenRepository.prototype.insert.name, () => {
    it('inserts record and returns id', async () => {
      const record = abstractToken({
        id: 'TK0001',
        issuer: 'issuer',
        symbol: 'ISTK',
        category: 'stablecoin',
        iconUrl: 'https://example.com/icon.png',
        coingeckoId: 'coin-1',
        coingeckoListingTimestamp: UnixTime.toDate(10),
        comment: 'some comment',
      })

      const id = await repository.insert(record)
      expect(id).toEqual(record.id)

      const stored = await repository.findById(record.id)
      expect(stored).toEqual(record)
    })

    it('persists optional fields as undefined when not provided', async () => {
      const record = abstractToken({ id: 'TK0002' })

      const id = await repository.insert(record)
      expect(id).toEqual(record.id)

      const stored = await repository.findById(record.id)
      expect(stored).toEqual(record)
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
    issuer: overrides.issuer,
    symbol: overrides.symbol ?? 'TOKEN',
    category: overrides.category ?? 'generic',
    iconUrl: overrides.iconUrl,
    coingeckoId: overrides.coingeckoId,
    coingeckoListingTimestamp: overrides.coingeckoListingTimestamp,
    comment: overrides.comment,
  }
}
