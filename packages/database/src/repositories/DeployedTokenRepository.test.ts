import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeTokenDatabase } from '../test/tokenDatabase'
import type { AbstractTokenInsertable } from './AbstractTokenRepository'
import {
  type DeployedTokenPrimaryKey,
  DeployedTokenRepository,
  type DeployedTokenSelectable,
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
        deploymentTimestamp: UnixTime.toDate(10),
        comment: 'initial deployment',
      })

      await repository.insert(record)

      const stored = await repository.findByChainAndAddress(
        record.chain,
        record.address,
      )
      expect(stored).toEqual(record)
    })

    it('accepts optional fields', async () => {
      const record = deployedToken({
        chain: 'ethereum',
        address: '0x' + '2'.repeat(40),
      })

      await repository.insert(record)

      const stored = await repository.findByChainAndAddress(
        record.chain,
        record.address,
      )
      expect(stored).toEqual(record)
    })
  })

  describe(DeployedTokenRepository.prototype.update.name, () => {
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
        deploymentTimestamp: UnixTime.toDate(10),
        comment: 'initial comment',
      })
      await repository.insert(record)

      const updatedRows = await repository.update({
        chain: record.chain,
        address: record.address,
        abstractTokenId: secondAbstractToken.id,
        symbol: 'UPDT',
        decimals: 8,
        deploymentTimestamp: UnixTime.toDate(20),
        comment: 'updated comment',
      })

      expect(updatedRows).toEqual(1)

      const stored = await repository.findByChainAndAddress(
        record.chain,
        record.address,
      )
      expect(stored).toEqual({
        ...record,
        abstractTokenId: secondAbstractToken.id,
        symbol: 'UPDT',
        decimals: 8,
        deploymentTimestamp: UnixTime.toDate(20),
        comment: 'updated comment',
      })
    })
  })

  describe(DeployedTokenRepository.prototype.getByAbstractTokenId.name, () => {
    it('returns matching records', async () => {
      await abstractTokens.insert(abstractToken({ id: 'TK0001' }))
      await abstractTokens.insert(abstractToken({ id: 'TK0002' }))

      const records = [
        deployedToken({
          abstractTokenId: 'TK0001',
          chain: 'ethereum',
          address: '0x' + '1'.repeat(40),
          deploymentTimestamp: UnixTime.toDate(10),
        }),
        deployedToken({
          abstractTokenId: 'TK0002',
          chain: 'arbitrum',
          address: '0x' + '2'.repeat(40),
          deploymentTimestamp: UnixTime.toDate(20),
        }),
        deployedToken({
          abstractTokenId: undefined,
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
  overrides: Partial<AbstractTokenInsertable> & { id: string },
): AbstractTokenInsertable {
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
  overrides: Partial<DeployedTokenSelectable> &
    Partial<DeployedTokenPrimaryKey> &
    Required<Pick<DeployedTokenPrimaryKey, 'chain' | 'address'>>,
): DeployedTokenSelectable {
  return {
    chain: overrides.chain ?? 'ethereum',
    address: overrides.address,
    abstractTokenId: overrides.abstractTokenId,
    symbol: overrides.symbol ?? 'TOKEN',
    decimals: overrides.decimals ?? 18,
    deploymentTimestamp: overrides.deploymentTimestamp ?? UnixTime.toDate(0),
    comment: overrides.comment,
  }
}

function toPrimaryKey(
  record: DeployedTokenSelectable,
): DeployedTokenPrimaryKey {
  return {
    chain: record.chain,
    address: record.address,
  }
}
