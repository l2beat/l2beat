import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeTokenDatabase } from '../test/tokenDatabase'
import type { AbstractTokenInsertable } from './AbstractTokenRepository'
import {
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
    it('inserts record and returns id', async () => {
      const abstractTokenRecord = abstractToken({ id: 'TK0001' })
      await abstractTokens.insert(abstractTokenRecord)

      const record = deployedToken({
        id: 'DT000001',
        chain: 'arbitrum',
        address: '0x' + '1'.repeat(40),
        abstractTokenId: abstractTokenRecord.id,
        symbol: 'ARB',
        decimals: 6,
        deploymentTimestamp: UnixTime.toDate(10),
        comment: 'initial deployment',
      })

      const id = await repository.insert(record)
      expect(id).toEqual(record.id)

      const stored = await repository.findById(record.id)
      expect(stored).toEqual(record)
    })

    it('accepts optional fields', async () => {
      const record = deployedToken({ id: 'DT000002' })

      const id = await repository.insert(record)
      expect(id).toEqual(record.id)

      const stored = await repository.findById(record.id)
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
        id: 'DT000001',
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
        id: record.id,
        address: '0x' + '3'.repeat(40),
        abstractTokenId: secondAbstractToken.id,
        symbol: 'UPDT',
        decimals: 8,
        deploymentTimestamp: UnixTime.toDate(20),
        comment: 'updated comment',
      })

      expect(updatedRows).toEqual(1)

      const stored = await repository.findById(record.id)
      expect(stored).toEqual({
        ...record,
        address: '0x' + '3'.repeat(40),
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
          id: 'DT000001',
          abstractTokenId: 'TK0001',
          deploymentTimestamp: UnixTime.toDate(10),
        }),
        deployedToken({
          id: 'DT000002',
          abstractTokenId: 'TK0002',
          deploymentTimestamp: UnixTime.toDate(20),
        }),
        deployedToken({ id: 'DT000003', abstractTokenId: undefined }),
      ]
      await repository.insert(records[0]!)
      await repository.insert(records[1]!)

      const result = await repository.getByAbstractTokenId('TK0001')
      expect(result).toEqual([records[0]!])
    })
  })

  describe(DeployedTokenRepository.prototype.deleteByIds.name, () => {
    it('removes selected records', async () => {
      await repository.insert(deployedToken({ id: 'DT000001' }))
      await repository.insert(deployedToken({ id: 'DT000002' }))
      await repository.insert(deployedToken({ id: 'DT000003' }))

      const deleted = await repository.deleteByIds(['DT000001', 'DT000003'])
      expect(deleted).toEqual(2)

      const remaining = await repository.getAll()
      expect(remaining).toEqual([deployedToken({ id: 'DT000002' })])
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
  overrides: Partial<DeployedTokenSelectable> & { id: string },
): DeployedTokenSelectable {
  return {
    id: overrides.id,
    chain: overrides.chain ?? 'ethereum',
    address: overrides.address ?? `0x${overrides.id}`,
    abstractTokenId: overrides.abstractTokenId,
    symbol: overrides.symbol ?? 'TOKEN',
    decimals: overrides.decimals ?? 18,
    deploymentTimestamp: overrides.deploymentTimestamp ?? UnixTime.toDate(0),
    comment: overrides.comment,
  }
}
