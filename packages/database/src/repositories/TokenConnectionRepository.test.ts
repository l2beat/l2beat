import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeTokenDatabase } from '../test/tokenDatabase'
import type { DeployedTokenRecord } from './DeployedTokenRepository'
import {
  type TokenConnectionRecord,
  TokenConnectionRepository,
} from './TokenConnectionRepository'

describeTokenDatabase(TokenConnectionRepository.name, (db) => {
  const repository = db.tokenConnection
  const deployedTokens = db.deployedToken

  beforeEach(async () => {
    await deployedTokens.upsertMany([
      deployedToken({ id: 'token-1' }),
      deployedToken({ id: 'token-2' }),
      deployedToken({ id: 'token-3' }),
    ])
  })

  afterEach(async () => {
    await repository.deleteAll()
    await deployedTokens.deleteAll()
  })

  describe(TokenConnectionRepository.prototype.upsertMany.name, () => {
    it('inserts new records', async () => {
      const connections = [
        tokenConnection({
          tokenFromId: 'token-1',
          tokenToId: 'token-2',
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 'token-2',
          tokenToId: 'token-3',
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
          tokenFromId: 'token-1',
          tokenToId: 'token-2',
          type: 'canonical',
          comment: 'initial',
        }),
      ])

      const updated = tokenConnection({
        tokenFromId: 'token-1',
        tokenToId: 'token-2',
        type: 'canonical',
        params: { type: 'canonical' },
        comment: 'updated comment',
      })

      await repository.upsert(updated)

      const result = await repository.getFromTo('token-1', 'token-2')
      expect(result).toEqual([updated])
    })
  })

  describe(TokenConnectionRepository.prototype.getConnectionsFrom.name, () => {
    it('returns outbound connections', async () => {
      await repository.upsertMany([
        tokenConnection({
          tokenFromId: 'token-1',
          tokenToId: 'token-2',
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 'token-1',
          tokenToId: 'token-3',
          type: 'wrapper',
        }),
        tokenConnection({
          tokenFromId: 'token-2',
          tokenToId: 'token-1',
          type: 'canonical',
        }),
      ])

      const result = await repository.getConnectionsFrom('token-1')
      expect(result).toEqualUnsorted([
        tokenConnection({
          tokenFromId: 'token-1',
          tokenToId: 'token-2',
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 'token-1',
          tokenToId: 'token-3',
          type: 'wrapper',
        }),
      ])
    })
  })

  describe(TokenConnectionRepository.prototype.getConnectionsTo.name, () => {
    it('returns inbound connections', async () => {
      await repository.upsertMany([
        tokenConnection({
          tokenFromId: 'token-1',
          tokenToId: 'token-2',
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 'token-3',
          tokenToId: 'token-1',
          type: 'wrapper',
        }),
      ])

      const result = await repository.getConnectionsTo('token-2')
      expect(result).toEqualUnsorted([
        tokenConnection({
          tokenFromId: 'token-1',
          tokenToId: 'token-2',
          type: 'canonical',
        }),
      ])
    })
  })

  describe(TokenConnectionRepository.prototype.getBetween.name, () => {
    it('returns connections in both directions', async () => {
      await repository.upsertMany([
        tokenConnection({
          tokenFromId: 'token-1',
          tokenToId: 'token-2',
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 'token-2',
          tokenToId: 'token-1',
          type: 'wrapper',
        }),
        tokenConnection({
          tokenFromId: 'token-2',
          tokenToId: 'token-3',
          type: 'canonical',
        }),
      ])

      const result = await repository.getBetween('token-1', 'token-2')
      expect(result).toEqualUnsorted([
        tokenConnection({
          tokenFromId: 'token-1',
          tokenToId: 'token-2',
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 'token-2',
          tokenToId: 'token-1',
          type: 'wrapper',
        }),
      ])
    })
  })

  describe(TokenConnectionRepository.prototype.deleteByTokenIds.name, () => {
    it('deletes connections touching provided token ids', async () => {
      await repository.upsertMany([
        tokenConnection({
          tokenFromId: 'token-1',
          tokenToId: 'token-2',
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 'token-2',
          tokenToId: 'token-1',
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 'token-2',
          tokenToId: 'token-3',
          type: 'wrapper',
        }),
      ])

      const deleted = await repository.deleteByTokenIds(['token-1'])
      expect(deleted).toEqual(2)

      const remaining = await repository.getAll()
      expect(remaining).toEqual([
        tokenConnection({
          tokenFromId: 'token-2',
          tokenToId: 'token-3',
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
            tokenFromId: 'token-1',
            tokenToId: 'token-2',
            type: 'canonical',
          }),
          tokenConnection({
            tokenFromId: 'token-1',
            tokenToId: 'token-2',
            type: 'wrapper',
          }),
          tokenConnection({
            tokenFromId: 'token-2',
            tokenToId: 'token-3',
            type: 'wrapper',
          }),
        ])

        const deleted = await repository.deleteConnectionsFromTo(
          'token-1',
          'token-2',
        )
        expect(deleted).toEqual(2)

        const remaining = await repository.getAll()
        expect(remaining).toEqual([
          tokenConnection({
            tokenFromId: 'token-2',
            tokenToId: 'token-3',
            type: 'wrapper',
          }),
        ])
      })
    },
  )
})

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

function tokenConnection(
  overrides: Partial<TokenConnectionRecord> & {
    tokenFromId: string
    tokenToId: string
    type: string
  },
): TokenConnectionRecord {
  return {
    tokenFromId: overrides.tokenFromId,
    tokenToId: overrides.tokenToId,
    type: overrides.type,
    params: overrides.params,
    comment: overrides.comment,
  }
}
