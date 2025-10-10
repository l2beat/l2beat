import { expect } from 'earl'
import { describeTokenDatabase } from '../test/tokenDatabase'
import type {
  DeployedTokenPrimaryKey,
  DeployedTokenRecord,
} from './DeployedTokenRepository'
import {
  type TokenConnectionRecord,
  TokenConnectionRepository,
} from './TokenConnectionRepository'

describeTokenDatabase(TokenConnectionRepository.name, (db) => {
  const repository = db.tokenConnection
  const deployedTokens = db.deployedToken

  async function insertConnections(
    connections: TokenConnectionRecord[],
  ): Promise<void> {
    for (const connection of connections) {
      await repository.insert(connection)
    }
  }

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

  describe(TokenConnectionRepository.prototype.insert.name, () => {
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
          params: { type: 'canonical', data: 'another' },
          comment: 'wrapped',
        }),
      ]

      for (const connection of connections) {
        await repository.insert(connection)
      }

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(connections)
    })
  })

  describe(
    TokenConnectionRepository.prototype.getConnectionsFromOrTo.name,
    () => {
      it('returns inbound and outbound connections', async () => {
        await insertConnections([
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
      await insertConnections([
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
      await insertConnections([
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
        await insertConnections([
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

  describe(TokenConnectionRepository.prototype.deleteByPK.name, () => {
    it('deletes connections touching provided tokens', async () => {
      await insertConnections([
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

      const deleted = await repository.deleteByPK([tokenA])
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
        await insertConnections([
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
  overrides: Partial<DeployedTokenRecord> = {},
): DeployedTokenRecord {
  return {
    chain: overrides.chain ?? key.chain,
    address: overrides.address ?? key.address,
    abstractTokenId: overrides.abstractTokenId ?? null,
    symbol: overrides.symbol ?? 'TOKEN',
    decimals: overrides.decimals ?? 18,
    deploymentTimestamp: 0,
    comment: overrides.comment ?? null,
  }
}

interface TokenConnectionInput {
  tokenFrom: DeployedTokenPrimaryKey
  tokenTo: DeployedTokenPrimaryKey
  type: TokenConnectionRecord['type']
  params?: TokenConnectionRecord['params']
  comment?: string
}

function tokenConnection(input: TokenConnectionInput): TokenConnectionRecord {
  return {
    tokenFromChain: input.tokenFrom.chain,
    tokenFromAddress: input.tokenFrom.address,
    tokenToChain: input.tokenTo.chain,
    tokenToAddress: input.tokenTo.address,
    type: input.type,
    params: input.params ?? null,
    comment: input.comment ?? null,
  }
}
