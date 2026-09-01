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
        additionalCoingeckoEntries: [
          {
            coingeckoId: 'coin-1-bridged',
            coingeckoListingTimestamp: 20,
            iconUrl: 'https://example.com/bridged-icon.png',
          },
        ],
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
        additionalCoingeckoEntries: [
          {
            coingeckoId: 'updated-coin-1',
            coingeckoListingTimestamp: null,
            iconUrl: null,
          },
        ],
        comment: 'updated comment',
      })

      expect(updatedRows).toEqual(1)

      const stored = await repository.findById(record.id)
      expect(stored).toEqual({
        ...record,
        issuer: 'updated issuer',
        symbol: 'UPDT',
        iconUrl: 'https://example.com/updated-icon.png',
        additionalCoingeckoEntries: [
          {
            coingeckoId: 'updated-coin-1',
            coingeckoListingTimestamp: null,
            iconUrl: null,
          },
        ],
        comment: 'updated comment',
      })
    })

    it('allows clearing the category', async () => {
      const record = abstractToken({
        id: 'TK0001',
        category: 'stablecoin',
      })
      await repository.insert(record)

      const updatedRows = await repository.updateById(record.id, {
        category: null,
      })

      expect(updatedRows).toEqual(1)

      const stored = await repository.findById(record.id)
      expect(stored).toEqual({
        ...record,
        category: null,
      })
    })
  })

  describe(AbstractTokenRepository.prototype.findByCoingeckoId.name, () => {
    it('finds record by coingeckoId', async () => {
      const ethereum = abstractToken({
        id: 'TK0002',
        coingeckoId: 'ethereum',
        symbol: 'ETH',
        category: 'ether',
      })
      const usdc = abstractToken({
        id: 'TK0003',
        coingeckoId: 'usd-coin',
        additionalCoingeckoEntries: [
          {
            coingeckoId: 'bridged-usdc',
            coingeckoListingTimestamp: null,
            iconUrl: null,
          },
        ],
        symbol: 'USDC',
        category: 'stablecoin',
      })

      await repository.insert(ethereum)
      await repository.insert(usdc)

      const foundUsdc = await repository.findByCoingeckoId('usd-coin')
      expect(foundUsdc).toEqual(usdc)

      const foundBridgedUsdc =
        await repository.findByCoingeckoId('bridged-usdc')
      expect(foundBridgedUsdc).toEqual(usdc)
    })

    it('returns undefined when coingeckoId does not exist', async () => {
      await repository.insert(
        abstractToken({
          id: 'TK0001',
          coingeckoId: 'bitcoin',
        }),
      )

      const found = await repository.findByCoingeckoId('ethereum')
      expect(found).toEqual(undefined)
    })
  })

  describe(AbstractTokenRepository.prototype.getByIds.name, () => {
    it('returns empty array for empty ids', async () => {
      const result = await repository.getByIds([])
      expect(result).toEqual([])
    })

    it('returns selected fields for multiple ids', async () => {
      await repository.insert(
        abstractToken({
          id: 'TK0001',
          symbol: 'ETH',
          iconUrl: 'https://example.com/eth.png',
          issuer: 'ethereum',
          category: 'ether',
        }),
      )
      await repository.insert(
        abstractToken({
          id: 'TK0002',
          symbol: 'USDC',
          iconUrl: 'https://example.com/usdc.png',
        }),
      )
      await repository.insert(
        abstractToken({
          id: 'TK0003',
          symbol: 'DAI',
          iconUrl: null,
        }),
      )

      const result = await repository.getByIds(['TK0001', 'TK0003'])

      expect(result).toEqualUnsorted([
        {
          id: 'TK0001',
          symbol: 'ETH',
          iconUrl: 'https://example.com/eth.png',
          issuer: 'ethereum',
          category: 'ether',
        },
        {
          id: 'TK0003',
          symbol: 'DAI',
          iconUrl: null,
          issuer: null,
          category: null,
        },
      ])
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
    category: overrides.category ?? null,
    iconUrl: overrides.iconUrl ?? null,
    coingeckoId: overrides.coingeckoId ?? null,
    coingeckoListingTimestamp: overrides.coingeckoListingTimestamp ?? null,
    additionalCoingeckoEntries: overrides.additionalCoingeckoEntries ?? null,
    comment: overrides.comment ?? null,
    reviewed: overrides.reviewed ?? false,
    isPriceUnreliable: overrides.isPriceUnreliable ?? false,
  }
}
