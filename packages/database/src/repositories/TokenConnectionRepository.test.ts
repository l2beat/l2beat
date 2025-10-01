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
      deployedToken({ id: 1 }),
      deployedToken({ id: 2 }),
      deployedToken({ id: 3 }),
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
          tokenFromId: 1,
          tokenToId: 2,
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 2,
          tokenToId: 3,
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
          tokenFromId: 1,
          tokenToId: 2,
          type: 'canonical',
          comment: 'initial',
        }),
      ])

      const updated = tokenConnection({
        tokenFromId: 1,
        tokenToId: 2,
        type: 'canonical',
        params: { type: 'canonical' },
        comment: 'updated comment',
      })

      await repository.upsert(updated)

      const result = await repository.getFromTo(1, 2)
      expect(result).toEqual([updated])
    })
  })

  describe(
    TokenConnectionRepository.prototype.getConnectionsFromOrTo.name,
    () => {
      it('returns inbound and outbound connections', async () => {
        await repository.upsertMany([
          tokenConnection({
            tokenFromId: 1,
            tokenToId: 2,
            type: 'canonical',
          }),
          tokenConnection({
            tokenFromId: 3,
            tokenToId: 1,
            type: 'wrapper',
          }),
          tokenConnection({
            tokenFromId: 2,
            tokenToId: 3,
            type: 'wrapper',
          }),
        ])

        const result = await repository.getConnectionsFromOrTo(1)
        expect(result).toEqualUnsorted([
          tokenConnection({
            tokenFromId: 1,
            tokenToId: 2,
            type: 'canonical',
          }),
          tokenConnection({
            tokenFromId: 3,
            tokenToId: 1,
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
          tokenFromId: 1,
          tokenToId: 2,
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 1,
          tokenToId: 3,
          type: 'wrapper',
        }),
        tokenConnection({
          tokenFromId: 2,
          tokenToId: 1,
          type: 'canonical',
        }),
      ])

      const result = await repository.getConnectionsFrom(1)
      expect(result).toEqualUnsorted([
        tokenConnection({
          tokenFromId: 1,
          tokenToId: 2,
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 1,
          tokenToId: 3,
          type: 'wrapper',
        }),
      ])
    })
  })

  describe(TokenConnectionRepository.prototype.getConnectionsTo.name, () => {
    it('returns inbound connections', async () => {
      await repository.upsertMany([
        tokenConnection({
          tokenFromId: 1,
          tokenToId: 2,
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 3,
          tokenToId: 1,
          type: 'wrapper',
        }),
      ])

      const result = await repository.getConnectionsTo(2)
      expect(result).toEqualUnsorted([
        tokenConnection({
          tokenFromId: 1,
          tokenToId: 2,
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
            tokenFromId: 1,
            tokenToId: 2,
            type: 'canonical',
          }),
          tokenConnection({
            tokenFromId: 2,
            tokenToId: 1,
            type: 'wrapper',
          }),
          tokenConnection({
            tokenFromId: 2,
            tokenToId: 3,
            type: 'canonical',
          }),
        ])

        const result = await repository.getConnectionsBetween(1, 2)
        expect(result).toEqualUnsorted([
          tokenConnection({
            tokenFromId: 1,
            tokenToId: 2,
            type: 'canonical',
          }),
          tokenConnection({
            tokenFromId: 2,
            tokenToId: 1,
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
          tokenFromId: 1,
          tokenToId: 2,
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 2,
          tokenToId: 1,
          type: 'canonical',
        }),
        tokenConnection({
          tokenFromId: 2,
          tokenToId: 3,
          type: 'wrapper',
        }),
      ])

      const deleted = await repository.deleteByTokenIds([1])
      expect(deleted).toEqual(2)

      const remaining = await repository.getAll()
      expect(remaining).toEqual([
        tokenConnection({
          tokenFromId: 2,
          tokenToId: 3,
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
            tokenFromId: 1,
            tokenToId: 2,
            type: 'canonical',
          }),
          tokenConnection({
            tokenFromId: 1,
            tokenToId: 2,
            type: 'wrapper',
          }),
          tokenConnection({
            tokenFromId: 2,
            tokenToId: 3,
            type: 'wrapper',
          }),
        ])

        const deleted = await repository.deleteConnectionsFromTo(1, 2)
        expect(deleted).toEqual(2)

        const remaining = await repository.getAll()
        expect(remaining).toEqual([
          tokenConnection({
            tokenFromId: 2,
            tokenToId: 3,
            type: 'wrapper',
          }),
        ])
      })
    },
  )
})

function deployedToken(
  overrides: Partial<DeployedTokenRecord> & { id: number },
): DeployedTokenRecord {
  const idHex = overrides.id.toString(16).padStart(40, '0')

  return {
    id: overrides.id,
    chain: overrides.chain ?? 'ethereum',
    address: overrides.address ?? `0x${idHex}`,
    abstractTokenId: overrides.abstractTokenId,
    symbol: overrides.symbol ?? 'TOKEN',
    decimals: overrides.decimals ?? 18,
    deploymentTimestamp: overrides.deploymentTimestamp ?? UnixTime(0),
    comment: overrides.comment,
  }
}

function tokenConnection(
  overrides: Partial<TokenConnectionRecord> & {
    tokenFromId: number
    tokenToId: number
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
