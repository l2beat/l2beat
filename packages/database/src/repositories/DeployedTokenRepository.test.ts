import { expect } from 'earl'
import { describeTokenDatabase } from '../test/tokenDatabase'
import type { AbstractTokenRecord } from './AbstractTokenRepository'
import {
  type DeployedTokenPrimaryKey,
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

  describe(DeployedTokenRepository.prototype.insert.name, () => {
    it('inserts record', async () => {
      const abstractTokenRecord = abstractToken({ id: 'TK0001' })
      await abstractTokens.insert(abstractTokenRecord)

      const record = deployedToken({
        chain: 'arbitrum',
        address: '0x' + '1'.repeat(40),
        abstractTokenId: abstractTokenRecord.id,
        symbol: 'ARB',
        decimals: 6,
        deploymentTimestamp: 10,
        comment: 'initial deployment',
      })

      await repository.insert(record)

      const stored = await repository.findByChainAndAddress(record)
      expect(stored).toEqual(record)
    })

    it('accepts optional fields', async () => {
      const record = deployedToken({
        chain: 'ethereum',
        address: '0x' + '2'.repeat(40),
      })

      await repository.insert(record)

      const stored = await repository.findByChainAndAddress(record)
      expect(stored).toEqual(record)
    })
  })

  describe(
    DeployedTokenRepository.prototype.updateByChainAndAddress.name,
    () => {
      it('updates record and returns number of affected rows', async () => {
        const firstAbstractToken = abstractToken({ id: 'TK0001' })
        const secondAbstractToken = abstractToken({ id: 'TK0002' })
        await abstractTokens.insert(firstAbstractToken)
        await abstractTokens.insert(secondAbstractToken)

        const record = deployedToken({
          chain: 'ethereum',
          address: '0x' + '2'.repeat(40),
          abstractTokenId: firstAbstractToken.id,
          symbol: 'TOKEN',
          decimals: 18,
          deploymentTimestamp: 10,
          comment: 'initial comment',
        })
        await repository.insert(record)

        const updatedRows = await repository.updateByChainAndAddress(
          {
            chain: record.chain,
            address: record.address,
          },
          {
            abstractTokenId: secondAbstractToken.id,
            symbol: 'UPDT',
            decimals: 8,
            deploymentTimestamp: 20,
            comment: 'updated comment',
          },
        )

        expect(updatedRows).toEqual(1)

        const stored = await repository.findByChainAndAddress(record)
        expect(stored).toEqual({
          ...record,
          abstractTokenId: secondAbstractToken.id,
          symbol: 'UPDT',
          decimals: 8,
          deploymentTimestamp: 20,
          comment: 'updated comment',
        })
      })
    },
  )

  describe(DeployedTokenRepository.prototype.getByAbstractTokenId.name, () => {
    it('returns matching records', async () => {
      await abstractTokens.insert(abstractToken({ id: 'TK0001' }))
      await abstractTokens.insert(abstractToken({ id: 'TK0002' }))

      const records = [
        deployedToken({
          abstractTokenId: 'TK0001',
          chain: 'ethereum',
          address: '0x' + '1'.repeat(40),
          deploymentTimestamp: 10,
        }),
        deployedToken({
          abstractTokenId: 'TK0002',
          chain: 'arbitrum',
          address: '0x' + '2'.repeat(40),
          deploymentTimestamp: 20,
        }),
        deployedToken({
          abstractTokenId: null,
          chain: 'optimism',
          address: '0x' + '3'.repeat(40),
        }),
      ]
      await repository.insert(records[0]!)
      await repository.insert(records[1]!)

      const result = await repository.getByAbstractTokenId('TK0001')
      expect(result).toEqual([records[0]!])
    })
  })

  describe(DeployedTokenRepository.prototype.deleteByPrimaryKeys.name, () => {
    it('removes selected records', async () => {
      const first = deployedToken({
        chain: 'ethereum',
        address: '0x' + '1'.repeat(40),
      })
      const second = deployedToken({
        chain: 'arbitrum',
        address: '0x' + '2'.repeat(40),
      })
      const third = deployedToken({
        chain: 'optimism',
        address: '0x' + '3'.repeat(40),
      })

      await repository.insert(first)
      await repository.insert(second)
      await repository.insert(third)

      const deleted = await repository.deleteByPrimaryKeys([
        toPrimaryKey(first),
        toPrimaryKey(third),
      ])
      expect(deleted).toEqual(2)

      const remaining = await repository.getAll()
      expect(remaining).toEqual([second])
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
    reviewed: overrides.reviewed ?? false,
  }
}

function deployedToken(
  overrides: Partial<DeployedTokenRecord> &
    Partial<DeployedTokenPrimaryKey> &
    Required<Pick<DeployedTokenPrimaryKey, 'chain' | 'address'>>,
): DeployedTokenRecord {
  return {
    chain: overrides.chain ?? 'ethereum',
    address: overrides.address,
    abstractTokenId: overrides.abstractTokenId ?? null,
    symbol: overrides.symbol ?? 'TOKEN',
    decimals: overrides.decimals ?? 18,
    deploymentTimestamp: overrides.deploymentTimestamp ?? 0,
    comment: overrides.comment ?? null,
  }
}

function toPrimaryKey(record: DeployedTokenRecord): DeployedTokenPrimaryKey {
  return {
    chain: record.chain,
    address: record.address,
  }
}
