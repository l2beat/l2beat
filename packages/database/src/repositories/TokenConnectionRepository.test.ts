import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeTokenDatabase } from '../test/tokenDatabase'
import type {
  DeployedTokenInsertable,
  DeployedTokenUpdate,
} from './DeployedTokenRepository'
import {
  type TokenConnectionInsertable,
  TokenConnectionRepository,
  type TokenConnectionSelectable,
} from './TokenConnectionRepository'

describeTokenDatabase(TokenConnectionRepository.name, (db) => {
  const repository = db.tokenConnection
  const deployedTokens = db.deployedToken

  beforeEach(async () => {
    await deployedTokens.insert(deployedToken({ id: 'DT000001' }))
    await deployedTokens.insert(deployedToken({ id: 'DT000002' }))
    await deployedTokens.insert(deployedToken({ id: 'DT000003' }))
  })

  afterEach(async () => {
    await repository.deleteAll()
    await deployedTokens.deleteAll()
  })

  describe(TokenConnectionRepository.prototype.upsertMany.name, () => {
    it('inserts new records', async () => {
      const connections = [
        tokenConnection({
          tokenFromId: 'DT000001',
          tokenToId: 'DT000002',
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 'DT000002',
          tokenToId: 'DT000003',
          type: 'wrapper',
          params: { type: 'canonical' },
          comment: 'wrapped',
        }),
      ]

      const inserted = await repository.upsertMany(connections)
      expect(inserted).toEqual(2)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(connections)
    })

    it('updates existing records when keys match', async () => {
      await repository.upsertMany([
        tokenConnection({
          tokenFromId: 'DT000001',
          tokenToId: 'DT000002',
          type: 'canonical',
          comment: 'initial',
        }),
      ])

      const updated = tokenConnection({
        tokenFromId: 'DT000001',
        tokenToId: 'DT000002',
        type: 'canonical',
        params: { type: 'canonical' },
        comment: 'updated comment',
      })

      await repository.upsert(updated)

      const result = await repository.getFromTo('DT000001', 'DT000002')
      expect(result).toEqual([updated])
    })
  })

  describe(
    TokenConnectionRepository.prototype.getConnectionsFromOrTo.name,
    () => {
      it('returns inbound and outbound connections', async () => {
        await repository.upsertMany([
          tokenConnection({
            tokenFromId: 'DT000001',
            tokenToId: 'DT000002',
            type: 'canonical',
          }),
          tokenConnection({
            tokenFromId: 'DT000003',
            tokenToId: 'DT000001',
            type: 'wrapper',
          }),
          tokenConnection({
            tokenFromId: 'DT000002',
            tokenToId: 'DT000003',
            type: 'wrapper',
          }),
        ])

        const result = await repository.getConnectionsFromOrTo('DT000001')
        expect(result).toEqualUnsorted([
          tokenConnection({
            tokenFromId: 'DT000001',
            tokenToId: 'DT000002',
            type: 'canonical',
          }),
          tokenConnection({
            tokenFromId: 'DT000003',
            tokenToId: 'DT000001',
            type: 'wrapper',
          }),
        ])
      })
    },
  )

  describe(TokenConnectionRepository.prototype.getConnectionsFrom.name, () => {
    it('returns outbound connections', async () => {
      await repository.upsertMany([
        tokenConnection({
          tokenFromId: 'DT000001',
          tokenToId: 'DT000002',
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 'DT000001',
          tokenToId: 'DT000003',
          type: 'wrapper',
        }),
        tokenConnection({
          tokenFromId: 'DT000002',
          tokenToId: 'DT000001',
          type: 'canonical',
        }),
      ])

      const result = await repository.getConnectionsFrom('DT000001')
      expect(result).toEqualUnsorted([
        tokenConnection({
          tokenFromId: 'DT000001',
          tokenToId: 'DT000002',
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 'DT000001',
          tokenToId: 'DT000003',
          type: 'wrapper',
        }),
      ])
    })
  })

  describe(TokenConnectionRepository.prototype.getConnectionsTo.name, () => {
    it('returns inbound connections', async () => {
      await repository.upsertMany([
        tokenConnection({
          tokenFromId: 'DT000001',
          tokenToId: 'DT000002',
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 'DT000003',
          tokenToId: 'DT000001',
          type: 'wrapper',
        }),
      ])

      const result = await repository.getConnectionsTo('DT000002')
      expect(result).toEqualUnsorted([
        tokenConnection({
          tokenFromId: 'DT000001',
          tokenToId: 'DT000002',
          type: 'canonical',
        }),
      ])
    })
  })

  describe(
    TokenConnectionRepository.prototype.getConnectionsBetween.name,
    () => {
      it('returns connections in both directions', async () => {
        await repository.upsertMany([
          tokenConnection({
            tokenFromId: 'DT000001',
            tokenToId: 'DT000002',
            type: 'canonical',
          }),
          tokenConnection({
            tokenFromId: 'DT000002',
            tokenToId: 'DT000001',
            type: 'wrapper',
          }),
          tokenConnection({
            tokenFromId: 'DT000002',
            tokenToId: 'DT000003',
            type: 'canonical',
          }),
        ])

        const result = await repository.getConnectionsBetween(
          'DT000001',
          'DT000002',
        )
        expect(result).toEqualUnsorted([
          tokenConnection({
            tokenFromId: 'DT000001',
            tokenToId: 'DT000002',
            type: 'canonical',
          }),
          tokenConnection({
            tokenFromId: 'DT000002',
            tokenToId: 'DT000001',
            type: 'wrapper',
          }),
        ])
      })
    },
  )

  describe(TokenConnectionRepository.prototype.deleteByTokenIds.name, () => {
    it('deletes connections touching provided token ids', async () => {
      await repository.upsertMany([
        tokenConnection({
          tokenFromId: 'DT000001',
          tokenToId: 'DT000002',
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 'DT000002',
          tokenToId: 'DT000001',
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 'DT000002',
          tokenToId: 'DT000003',
          type: 'wrapper',
        }),
      ])

      const deleted = await repository.deleteByTokenIds(['DT000001'])
      expect(deleted).toEqual(2)

      const remaining = await repository.getAll()
      expect(remaining).toEqual([
        tokenConnection({
          tokenFromId: 'DT000002',
          tokenToId: 'DT000003',
          type: 'wrapper',
        }),
      ])
    })
  })

  describe(
    TokenConnectionRepository.prototype.deleteConnectionsFromTo.name,
    () => {
      it('removes all connections between tokens regardless of type', async () => {
        await repository.upsertMany([
          tokenConnection({
            tokenFromId: 'DT000001',
            tokenToId: 'DT000002',
            type: 'canonical',
          }),
          tokenConnection({
            tokenFromId: 'DT000001',
            tokenToId: 'DT000002',
            type: 'wrapper',
          }),
          tokenConnection({
            tokenFromId: 'DT000002',
            tokenToId: 'DT000003',
            type: 'wrapper',
          }),
        ])

        const deleted = await repository.deleteConnectionsFromTo(
          'DT000001',
          'DT000002',
        )
        expect(deleted).toEqual(2)

        const remaining = await repository.getAll()
        expect(remaining).toEqual([
          tokenConnection({
            tokenFromId: 'DT000002',
            tokenToId: 'DT000003',
            type: 'wrapper',
          }),
        ])
      })
    },
  )
})

function deployedToken(
  overrides: DeployedTokenUpdate,
): DeployedTokenInsertable {
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

function tokenConnection(
  overrides: TokenConnectionInsertable,
): TokenConnectionSelectable {
  return {
    tokenFromId: overrides.tokenFromId,
    tokenToId: overrides.tokenToId,
    type: overrides.type,
    params: overrides.params,
    comment: overrides.comment ?? undefined,
  }
}
