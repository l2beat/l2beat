import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeTokenDatabase } from '../test/tokenDatabase'
import type { ChainRecord } from './ChainRepository'
import type {
  DeployedTokenPrimaryKey,
  DeployedTokenRecord,
} from './DeployedTokenRepository'
import {
  type JsonValue,
  type TokenRelationRecord,
  TokenRelationRepository,
} from './TokenRelationRepository'

describeTokenDatabase(TokenRelationRepository.name, (db) => {
  const repository = db.tokenRelation
  const deployedTokens = db.deployedToken
  const chains = db.chain

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
    await chains.insert(mockChain({ name: 'ethereum', chainId: 1 }))
    await chains.insert(mockChain({ name: 'arbitrum', chainId: 42161 }))
    await chains.insert(mockChain({ name: 'optimism', chainId: 10 }))

    await deployedTokens.insert(deployedToken(tokenA))
    await deployedTokens.insert(deployedToken(tokenB))
    await deployedTokens.insert(deployedToken(tokenC))
  })

  afterEach(async () => {
    await repository.deleteAll()
    await deployedTokens.deleteAll()
    await chains.deleteAll()
  })

  describe(TokenRelationRepository.prototype.insert.name, () => {
    it('inserts new records', async () => {
      const relations = [
        tokenRelation({
          tokenFrom: tokenA,
          tokenTo: tokenB,
          plugin: 'superbridge',
          sourceWasBurned: true,
          destinationWasMinted: true,
          bridgeType: 'burnAndMint',
        }),
        tokenRelation({
          tokenFrom: tokenB,
          tokenTo: tokenC,
          plugin: 'otherbridge',
          sourceWasBurned: false,
          destinationWasMinted: true,
          bridgeType: 'lockAndMint',
        }),
      ]

      for (const relation of relations) {
        await repository.insert(relation)
      }

      expect(await repository.getAll()).toEqualUnsorted(relations)
    })
  })

  describe(TokenRelationRepository.prototype.findByPrimaryKey.name, () => {
    it('returns a relation by its full identity', async () => {
      const relation = tokenRelation({
        tokenFrom: tokenA,
        tokenTo: tokenB,
        plugin: 'superbridge',
        sourceWasBurned: true,
        destinationWasMinted: true,
      })
      await repository.insert(relation)

      expect(await repository.findByPrimaryKey(relation)).toEqual(relation)
    })
  })

  describe(TokenRelationRepository.prototype.getByPrimaryKeys.name, () => {
    it('returns only the relations matching the requested identities', async () => {
      const relationA = tokenRelation({
        tokenFrom: tokenA,
        tokenTo: tokenB,
        plugin: 'superbridge',
        sourceWasBurned: true,
        destinationWasMinted: true,
      })
      const relationB = tokenRelation({
        tokenFrom: tokenB,
        tokenTo: tokenC,
        plugin: 'otherbridge',
        sourceWasBurned: false,
        destinationWasMinted: true,
      })
      await repository.insert(relationA)
      await repository.insert(relationB)

      expect(await repository.getByPrimaryKeys([relationB])).toEqual([
        relationB,
      ])
    })
  })

  describe(TokenRelationRepository.prototype.updateByPrimaryKey.name, () => {
    it('updates bridge metadata without changing identity columns', async () => {
      const relation = tokenRelation({
        tokenFrom: tokenA,
        tokenTo: tokenB,
        plugin: 'superbridge',
        sourceWasBurned: true,
        destinationWasMinted: true,
        bridgeType: 'burnAndMint',
      })
      await repository.insert(relation)

      const updatedTransfer = {
        transferId: 'transfer-updated',
        plugin: 'superbridge',
      }
      const updatedRows = await repository.updateByPrimaryKey(relation, {
        bridgeType: 'lockAndMint',
        transfer: updatedTransfer,
      })

      expect(updatedRows).toEqual(1)
      expect(await repository.findByPrimaryKey(relation)).toEqual({
        ...relation,
        bridgeType: 'lockAndMint',
        transfer: updatedTransfer,
      })
    })
  })

  describe(TokenRelationRepository.prototype.getRelationsFromOrTo.name, () => {
    it('returns inbound and outbound relations', async () => {
      const outgoing = tokenRelation({
        tokenFrom: tokenA,
        tokenTo: tokenB,
        plugin: 'superbridge',
        sourceWasBurned: true,
        destinationWasMinted: true,
      })
      const incoming = tokenRelation({
        tokenFrom: tokenC,
        tokenTo: tokenA,
        plugin: 'otherbridge',
        sourceWasBurned: false,
        destinationWasMinted: true,
      })
      await repository.insert(outgoing)
      await repository.insert(incoming)

      expect(await repository.getRelationsFromOrTo(tokenA)).toEqualUnsorted([
        outgoing,
        incoming,
      ])
    })
  })

  describe(TokenRelationRepository.prototype.getRelationsFrom.name, () => {
    it('returns outbound relations', async () => {
      const relationA = tokenRelation({
        tokenFrom: tokenA,
        tokenTo: tokenB,
        plugin: 'superbridge',
        sourceWasBurned: true,
        destinationWasMinted: true,
      })
      const relationB = tokenRelation({
        tokenFrom: tokenA,
        tokenTo: tokenC,
        plugin: 'otherbridge',
        sourceWasBurned: false,
        destinationWasMinted: true,
      })
      await repository.insert(relationA)
      await repository.insert(relationB)

      expect(await repository.getRelationsFrom(tokenA)).toEqualUnsorted([
        relationA,
        relationB,
      ])
    })
  })

  describe(TokenRelationRepository.prototype.getRelationsTo.name, () => {
    it('returns inbound relations', async () => {
      const relation = tokenRelation({
        tokenFrom: tokenA,
        tokenTo: tokenB,
        plugin: 'superbridge',
        sourceWasBurned: true,
        destinationWasMinted: true,
      })
      await repository.insert(relation)

      expect(await repository.getRelationsTo(tokenB)).toEqual([relation])
    })
  })

  describe(TokenRelationRepository.prototype.deleteByPrimaryKey.name, () => {
    it('deletes a single relation by its identity', async () => {
      const relation = tokenRelation({
        tokenFrom: tokenA,
        tokenTo: tokenB,
        plugin: 'superbridge',
        sourceWasBurned: true,
        destinationWasMinted: true,
      })
      await repository.insert(relation)

      expect(await repository.deleteByPrimaryKey(relation)).toEqual(1)
      expect(await repository.getAll()).toEqual([])
    })
  })
})

interface TokenRelationInput {
  tokenFrom: DeployedTokenPrimaryKey
  tokenTo: DeployedTokenPrimaryKey
  plugin: string
  sourceWasBurned: boolean
  destinationWasMinted: boolean
  bridgeType?: TokenRelationRecord['bridgeType']
  transfer?: JsonValue
}

function tokenRelation(input: TokenRelationInput): TokenRelationRecord {
  return {
    tokenFromChain: input.tokenFrom.chain,
    tokenFromAddress: input.tokenFrom.address.toLowerCase(),
    tokenToChain: input.tokenTo.chain,
    tokenToAddress: input.tokenTo.address.toLowerCase(),
    plugin: input.plugin,
    sourceWasBurned: input.sourceWasBurned,
    destinationWasMinted: input.destinationWasMinted,
    bridgeType: input.bridgeType ?? null,
    transfer:
      input.transfer ??
      ({
        transferId: `${input.plugin}:${input.tokenFrom.chain}:${input.tokenTo.chain}`,
        plugin: input.plugin,
      } satisfies Record<string, unknown>),
  }
}

function deployedToken(pk: DeployedTokenPrimaryKey): DeployedTokenRecord {
  return {
    chain: pk.chain,
    address: pk.address.toLowerCase(),
    abstractTokenId: null,
    symbol: 'TOKEN',
    decimals: 18,
    deploymentTimestamp: UnixTime(1),
    comment: null,
    metadata: null,
    abstractTokenAssignmentProof: null,
  }
}

function mockChain(props: Partial<ChainRecord>): ChainRecord {
  return {
    name: 'ethereum',
    chainId: 1,
    explorerUrl: 'https://etherscan.io',
    aliases: null,
    apis: null,
    ...props,
  }
}
