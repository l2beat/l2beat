import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeTokenDatabase } from '../test/tokenDatabase'
import type {
  DeployedTokenInsertable,
  DeployedTokenPrimaryKey,
} from './DeployedTokenRepository'
import {
  type TokenConnectionInsertable,
  TokenConnectionRepository,
  type TokenConnectionSelectable,
} from './TokenConnectionRepository'

describeTokenDatabase(TokenConnectionRepository.name, (db) => {
  const repository = db.tokenConnection
  const deployedTokens = db.deployedToken

  const tokenA: DeployedTokenPrimaryKey = {
    chain: 'ethereum',
    address: '0x' + '1'.repeat(40),
  }
  const tokenB: DeployedTokenPrimaryKey = {
    chain: 'arbitrum',
    address: '0x' + '2'.repeat(40),
  }
  const tokenC: DeployedTokenPrimaryKey = {
    chain: 'optimism',
    address: '0x' + '3'.repeat(40),
  }

  beforeEach(async () => {
    await deployedTokens.insert(deployedToken(tokenA))
    await deployedTokens.insert(deployedToken(tokenB))
    await deployedTokens.insert(deployedToken(tokenC))
  })

  afterEach(async () => {
    await repository.deleteAll()
    await deployedTokens.deleteAll()
  })

  describe(TokenConnectionRepository.prototype.upsertMany.name, () => {
    it('inserts new records', async () => {
      const connections = [
        tokenConnection({
          tokenFrom: tokenA,
          tokenTo: tokenB,
          type: 'canonical',
        }),
        tokenConnection({
          tokenFrom: tokenB,
          tokenTo: tokenC,
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
          tokenFrom: tokenA,
          tokenTo: tokenB,
          type: 'canonical',
          comment: 'initial',
        }),
      ])

      const updated = tokenConnection({
        tokenFrom: tokenA,
        tokenTo: tokenB,
        type: 'canonical',
        params: { type: 'canonical' },
        comment: 'updated comment',
      })

      await repository.upsert(updated)

      const result = await repository.getFromTo(tokenA, tokenB)
      expect(result).toEqual([updated])
    })
  })

  describe(
    TokenConnectionRepository.prototype.getConnectionsFromOrTo.name,
    () => {
      it('returns inbound and outbound connections', async () => {
        await repository.upsertMany([
          tokenConnection({
            tokenFrom: tokenA,
            tokenTo: tokenB,
            type: 'canonical',
          }),
          tokenConnection({
            tokenFrom: tokenC,
            tokenTo: tokenA,
            type: 'wrapper',
          }),
          tokenConnection({
            tokenFrom: tokenB,
            tokenTo: tokenC,
            type: 'wrapper',
          }),
        ])

        const result = await repository.getConnectionsFromOrTo(tokenA)
        expect(result).toEqualUnsorted([
          tokenConnection({
            tokenFrom: tokenA,
            tokenTo: tokenB,
            type: 'canonical',
          }),
          tokenConnection({
            tokenFrom: tokenC,
            tokenTo: tokenA,
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
          tokenFrom: tokenA,
          tokenTo: tokenB,
          type: 'canonical',
        }),
        tokenConnection({
          tokenFrom: tokenA,
          tokenTo: tokenC,
          type: 'wrapper',
        }),
        tokenConnection({
          tokenFrom: tokenB,
          tokenTo: tokenA,
          type: 'canonical',
        }),
      ])

      const result = await repository.getConnectionsFrom(tokenA)
      expect(result).toEqualUnsorted([
        tokenConnection({
          tokenFrom: tokenA,
          tokenTo: tokenB,
          type: 'canonical',
        }),
        tokenConnection({
          tokenFrom: tokenA,
          tokenTo: tokenC,
          type: 'wrapper',
        }),
      ])
    })
  })

  describe(TokenConnectionRepository.prototype.getConnectionsTo.name, () => {
    it('returns inbound connections', async () => {
      await repository.upsertMany([
        tokenConnection({
          tokenFrom: tokenA,
          tokenTo: tokenB,
          type: 'canonical',
        }),
        tokenConnection({
          tokenFrom: tokenC,
          tokenTo: tokenA,
          type: 'wrapper',
        }),
      ])

      const result = await repository.getConnectionsTo(tokenB)
      expect(result).toEqualUnsorted([
        tokenConnection({
          tokenFrom: tokenA,
          tokenTo: tokenB,
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
            tokenFrom: tokenA,
            tokenTo: tokenB,
            type: 'canonical',
          }),
          tokenConnection({
            tokenFrom: tokenB,
            tokenTo: tokenA,
            type: 'wrapper',
          }),
          tokenConnection({
            tokenFrom: tokenB,
            tokenTo: tokenC,
            type: 'canonical',
          }),
        ])

        const result = await repository.getConnectionsBetween(tokenA, tokenB)
        expect(result).toEqualUnsorted([
          tokenConnection({
            tokenFrom: tokenA,
            tokenTo: tokenB,
            type: 'canonical',
          }),
          tokenConnection({
            tokenFrom: tokenB,
            tokenTo: tokenA,
            type: 'wrapper',
          }),
        ])
      })
    },
  )

  describe(TokenConnectionRepository.prototype.deleteByTokens.name, () => {
    it('deletes connections touching provided tokens', async () => {
      await repository.upsertMany([
        tokenConnection({
          tokenFrom: tokenA,
          tokenTo: tokenB,
          type: 'canonical',
        }),
        tokenConnection({
          tokenFrom: tokenB,
          tokenTo: tokenA,
          type: 'canonical',
        }),
        tokenConnection({
          tokenFrom: tokenB,
          tokenTo: tokenC,
          type: 'wrapper',
        }),
      ])

      const deleted = await repository.deleteByTokens([tokenA])
      expect(deleted).toEqual(2)

      const remaining = await repository.getAll()
      expect(remaining).toEqual([
        tokenConnection({
          tokenFrom: tokenB,
          tokenTo: tokenC,
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
            tokenFrom: tokenA,
            tokenTo: tokenB,
            type: 'canonical',
          }),
          tokenConnection({
            tokenFrom: tokenA,
            tokenTo: tokenB,
            type: 'wrapper',
          }),
          tokenConnection({
            tokenFrom: tokenB,
            tokenTo: tokenC,
            type: 'wrapper',
          }),
        ])

        const deleted = await repository.deleteConnectionsFromTo(tokenA, tokenB)
        expect(deleted).toEqual(2)

        const remaining = await repository.getAll()
        expect(remaining).toEqual([
          tokenConnection({
            tokenFrom: tokenB,
            tokenTo: tokenC,
            type: 'wrapper',
          }),
        ])
      })
    },
  )
})

function deployedToken(
  key: DeployedTokenPrimaryKey,
  overrides: Partial<DeployedTokenInsertable> = {},
): DeployedTokenInsertable {
  return {
    chain: overrides.chain ?? key.chain,
    address: overrides.address ?? key.address,
    abstractTokenId: overrides.abstractTokenId,
    symbol: overrides.symbol ?? 'TOKEN',
    decimals: overrides.decimals ?? 18,
    deploymentTimestamp: overrides.deploymentTimestamp ?? UnixTime.toDate(0),
    comment: overrides.comment,
  }
}

interface TokenConnectionInput {
  tokenFrom: DeployedTokenPrimaryKey
  tokenTo: DeployedTokenPrimaryKey
  type: TokenConnectionInsertable['type']
  params?: TokenConnectionInsertable['params']
  comment?: string
}

function tokenConnection(
  input: TokenConnectionInput,
): TokenConnectionSelectable {
  return {
    tokenFromChain: input.tokenFrom.chain,
    tokenFromAddress: input.tokenFrom.address,
    tokenToChain: input.tokenTo.chain,
    tokenToAddress: input.tokenTo.address,
    type: input.type,
    params: input.params,
    comment: input.comment,
  }
}
