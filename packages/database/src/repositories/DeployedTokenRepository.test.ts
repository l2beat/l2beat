import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeTokenDatabase } from '../test/tokenDatabase'
import type { AbstractTokenRecord } from './AbstractTokenRepository'
import {
  type DeployedTokenRecord,
  DeployedTokenRepository,
} from './DeployedTokenRepository'

describeTokenDatabase(DeployedTokenRepository.name, (db) => {
  const repository = db.deployedToken
  const abstractTokens = db.abstractToken

  afterEach(async () => {
    await repository.deleteAll()
    await abstractTokens.deleteAll()
  })

  describe(DeployedTokenRepository.prototype.upsertMany.name, () => {
    it('inserts new records', async () => {
      const records = [
        deployedToken({ id: 'token-1', deploymentTimestamp: UnixTime(10) }),
        deployedToken({ id: 'token-2', deploymentTimestamp: UnixTime(20) }),
      ]

      const inserted = await repository.upsertMany(records)
      expect(inserted).toEqual(2)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(records)
    })

    it('updates existing records', async () => {
      await repository.upsertMany([
        deployedToken({ id: 'token-1', symbol: 'OLD', decimals: 8 }),
      ])

      const updated = deployedToken({
        id: 'token-1',
        symbol: 'NEW',
        decimals: 18,
        deploymentTimestamp: UnixTime(30),
      })

      const inserted = await repository.upsert(updated)
      expect(inserted).toEqual(undefined)

      const result = await repository.findById('token-1')
      expect(result).toEqual(updated)
    })
  })

  describe(DeployedTokenRepository.prototype.getByAbstractTokenIds.name, () => {
    it('returns matching records', async () => {
      await abstractTokens.upsertMany([
        abstractToken({ id: 'TK0001' }),
        abstractToken({ id: 'TK0002' }),
      ])

      const records = [
        deployedToken({
          id: 'token-1',
          abstractTokenId: 'TK0001',
          deploymentTimestamp: UnixTime(10),
        }),
        deployedToken({
          id: 'token-2',
          abstractTokenId: 'TK0002',
          deploymentTimestamp: UnixTime(20),
        }),
        deployedToken({ id: 'token-3', abstractTokenId: undefined }),
      ]
      await repository.upsertMany(records)

      const result = await repository.getByAbstractTokenIds(['TK0001'])
      expect(result).toEqual([records[0]!])
    })
  })

  describe(DeployedTokenRepository.prototype.deleteByIds.name, () => {
    it('removes selected records', async () => {
      await repository.upsertMany([
        deployedToken({ id: 'token-1' }),
        deployedToken({ id: 'token-2' }),
        deployedToken({ id: 'token-3' }),
      ])

      const deleted = await repository.deleteByIds(['token-1', 'token-3'])
      expect(deleted).toEqual(2)

      const remaining = await repository.getAll()
      expect(remaining).toEqual([deployedToken({ id: 'token-2' })])
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

function deployedToken(
  overrides: Partial<DeployedTokenRecord> & { id: string },
): DeployedTokenRecord {
  return {
    id: overrides.id,
    abstractTokenId: overrides.abstractTokenId,
    symbol: overrides.symbol ?? 'TOKEN',
    decimals: overrides.decimals ?? 18,
    deploymentTimestamp: overrides.deploymentTimestamp ?? UnixTime(0),
  }
}
