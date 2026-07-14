import type { DeployedTokenRecord, TokenDatabase } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { generatePlan } from './planning'

const USER = 'someone@l2beat.com'

describe('planning proof stamping', () => {
  describe('AddDeployedTokenIntent', () => {
    it('stamps a manual proof on insert when abstractTokenId is set', async () => {
      const db = mockDb({})
      const record = deployedRecord('ethereum', '0xaaa', 'USDC01')

      const result = await generatePlan(
        db,
        { type: 'AddDeployedTokenIntent', record },
        { user: USER, skipLogs: true },
      )

      expect(result).toEqual({
        outcome: 'success',
        plan: {
          intent: { type: 'AddDeployedTokenIntent', record },
          commands: [
            {
              type: 'AddDeployedTokenCommand',
              record: {
                ...record,
                abstractTokenAssignmentProof: { kind: 'manual', user: USER },
              },
            },
          ],
        },
      })
    })

    it('stamps a null proof on insert when abstractTokenId is null', async () => {
      const db = mockDb({})
      const record: DeployedTokenRecord = {
        ...deployedRecord('ethereum', '0xaaa', 'USDC01'),
        abstractTokenId: null,
      }

      const result = await generatePlan(
        db,
        { type: 'AddDeployedTokenIntent', record },
        { user: USER, skipLogs: true },
      )

      expect(result).toEqual({
        outcome: 'success',
        plan: {
          intent: { type: 'AddDeployedTokenIntent', record },
          commands: [
            {
              type: 'AddDeployedTokenCommand',
              record: { ...record, abstractTokenAssignmentProof: null },
            },
          ],
        },
      })
    })
  })

  describe('UpdateDeployedTokenIntent', () => {
    it('stamps a manual proof when abstractTokenId changes', async () => {
      const existing = deployedRecord('ethereum', '0xaaa', 'USDC01')
      const db = mockDb({ existingDeployed: existing })

      const result = await generatePlan(
        db,
        {
          type: 'UpdateDeployedTokenIntent',
          pk: { chain: existing.chain, address: existing.address },
          update: { abstractTokenId: 'USDT01' },
        },
        { user: USER, skipLogs: true },
      )

      assertSuccess(result)
      expect(result.plan.commands).toEqual([
        {
          type: 'UpdateDeployedTokenCommand',
          pk: { chain: existing.chain, address: existing.address },
          existing,
          update: {
            abstractTokenId: 'USDT01',
            abstractTokenAssignmentProof: { kind: 'manual', user: USER },
          },
        },
      ])
    })

    it('clears the proof when abstractTokenId is set to null', async () => {
      const existing = deployedRecord('ethereum', '0xaaa', 'USDC01')
      const db = mockDb({ existingDeployed: existing })

      const result = await generatePlan(
        db,
        {
          type: 'UpdateDeployedTokenIntent',
          pk: { chain: existing.chain, address: existing.address },
          update: { abstractTokenId: null },
        },
        { user: USER, skipLogs: true },
      )

      assertSuccess(result)
      expect(result.plan.commands).toEqual([
        {
          type: 'UpdateDeployedTokenCommand',
          pk: { chain: existing.chain, address: existing.address },
          existing,
          update: {
            abstractTokenId: null,
            abstractTokenAssignmentProof: null,
          },
        },
      ])
    })

    it('does not touch the proof when other fields change', async () => {
      const existing = deployedRecord('ethereum', '0xaaa', 'USDC01')
      const db = mockDb({ existingDeployed: existing })

      const result = await generatePlan(
        db,
        {
          type: 'UpdateDeployedTokenIntent',
          pk: { chain: existing.chain, address: existing.address },
          update: { symbol: 'X' },
        },
        { user: USER, skipLogs: true },
      )

      assertSuccess(result)
      expect(result.plan.commands).toEqual([
        {
          type: 'UpdateDeployedTokenCommand',
          pk: { chain: existing.chain, address: existing.address },
          existing,
          update: { symbol: 'X' },
        },
      ])
    })

    it('does not re-stamp the proof when abstractTokenId is the same as existing', async () => {
      const existing = deployedRecord('ethereum', '0xaaa', 'USDC01')
      const db = mockDb({ existingDeployed: existing })

      const result = await generatePlan(
        db,
        {
          type: 'UpdateDeployedTokenIntent',
          pk: { chain: existing.chain, address: existing.address },
          update: { abstractTokenId: existing.abstractTokenId, symbol: 'Y' },
        },
        { user: USER, skipLogs: true },
      )

      assertSuccess(result)
      expect(result.plan.commands).toEqual([
        {
          type: 'UpdateDeployedTokenCommand',
          pk: { chain: existing.chain, address: existing.address },
          existing,
          update: { abstractTokenId: existing.abstractTokenId, symbol: 'Y' },
        },
      ])
    })
  })

  describe('TokenRelation intents', () => {
    it('adds a token relation when both endpoints exist and the relation is new', async () => {
      const tokenFrom = deployedRecord('ethereum', '0xaaa', 'USDC01')
      const tokenTo = deployedRecord('arbitrum', '0xbbb', 'USDC01')
      const relation = tokenRelation(tokenFrom, tokenTo)
      const db = mockDb({
        deployedByPk: {
          [`${tokenFrom.chain}:${tokenFrom.address}`]: tokenFrom,
          [`${tokenTo.chain}:${tokenTo.address}`]: tokenTo,
        },
      })

      const result = await generatePlan(
        db,
        { type: 'AddTokenRelationIntent', record: relation },
        { user: USER, skipLogs: true },
      )

      assertSuccess(result)
      expect(result.plan.commands).toEqual([
        {
          type: 'AddTokenRelationCommand',
          record: relation,
        },
      ])
    })

    it('updates an existing token relation', async () => {
      const existing = tokenRelation(
        deployedRecord('ethereum', '0xaaa', 'USDC01'),
        deployedRecord('arbitrum', '0xbbb', 'USDC01'),
      )
      const db = mockDb({ existingRelation: existing })

      const result = await generatePlan(
        db,
        {
          type: 'UpdateTokenRelationIntent',
          pk: relationPk(existing),
          update: { transfer: { transferId: 'transfer-2' } },
        },
        { user: USER, skipLogs: true },
      )

      assertSuccess(result)
      expect(result.plan.commands).toEqual([
        {
          type: 'UpdateTokenRelationCommand',
          pk: relationPk(existing),
          existing,
          update: { transfer: { transferId: 'transfer-2' } },
        },
      ])
    })

    it('deletes an existing token relation', async () => {
      const existing = tokenRelation(
        deployedRecord('ethereum', '0xaaa', 'USDC01'),
        deployedRecord('arbitrum', '0xbbb', 'USDC01'),
      )
      const db = mockDb({ existingRelation: existing })

      const result = await generatePlan(
        db,
        { type: 'DeleteTokenRelationIntent', pk: relationPk(existing) },
        { user: USER, skipLogs: true },
      )

      assertSuccess(result)
      expect(result.plan.commands).toEqual([
        {
          type: 'DeleteTokenRelationCommand',
          pk: relationPk(existing),
          existing,
        },
      ])
    })
  })

  describe('DeleteDeployedTokenIntent', () => {
    it('leaves touching token relations in place when deleting the token', async () => {
      const existing = deployedRecord('ethereum', '0xaaa', 'USDC01')
      const db = mockDb({ existingDeployed: existing })

      const result = await generatePlan(
        db,
        {
          type: 'DeleteDeployedTokenIntent',
          pk: { chain: existing.chain, address: existing.address },
        },
        { user: USER, skipLogs: true },
      )

      assertSuccess(result)
      expect(result.plan.commands).toEqual([
        {
          type: 'DeleteDeployedTokenCommand',
          pk: { chain: existing.chain, address: existing.address },
          existing,
        },
      ])
    })
  })
})

function mockDb(opts: {
  existingDeployed?: DeployedTokenRecord
  deployedByPk?: Record<string, DeployedTokenRecord>
  existingRelation?: ReturnType<typeof tokenRelation>
}): TokenDatabase {
  const findDeployed = mockFn().executes(
    async (pk: { chain: string; address: string }) => {
      return (
        opts.deployedByPk?.[`${pk.chain}:${pk.address.toLowerCase()}`] ??
        opts.existingDeployed
      )
    },
  )

  return mockObject<TokenDatabase>({
    deployedToken: mockObject<TokenDatabase['deployedToken']>({
      findByChainAndAddress: findDeployed,
    }),
    abstractToken: mockObject<TokenDatabase['abstractToken']>({}),
    tokenRelation: mockObject<TokenDatabase['tokenRelation']>({
      findByPrimaryKey: mockFn().resolvesTo(opts.existingRelation),
    }),
  })
}

function deployedRecord(
  chain: string,
  shortAddress: string,
  abstractTokenId: string,
): DeployedTokenRecord {
  return {
    chain,
    address: `0x${shortAddress.slice(2).padStart(40, '0')}`,
    abstractTokenId,
    symbol: 'USDC',
    decimals: 6,
    deploymentTimestamp: UnixTime(1),
    comment: null,
    metadata: null,
  }
}

function tokenRelation(
  tokenFrom: Pick<DeployedTokenRecord, 'chain' | 'address'>,
  tokenTo: Pick<DeployedTokenRecord, 'chain' | 'address'>,
) {
  return {
    tokenFromChain: tokenFrom.chain,
    tokenFromAddress: tokenFrom.address,
    tokenToChain: tokenTo.chain,
    tokenToAddress: tokenTo.address,
    plugin: 'superbridge',
    bridgeType: 'burnAndMint' as const,
    transfer: { transferId: 'transfer-1' },
  }
}

function relationPk(relation: ReturnType<typeof tokenRelation>) {
  return {
    tokenFromChain: relation.tokenFromChain,
    tokenFromAddress: relation.tokenFromAddress,
    tokenToChain: relation.tokenToChain,
    tokenToAddress: relation.tokenToAddress,
    plugin: relation.plugin,
    bridgeType: relation.bridgeType,
  }
}

function assertSuccess<T>(
  result: { outcome: 'success'; plan: T } | { outcome: 'error'; error: string },
): asserts result is { outcome: 'success'; plan: T } {
  if (result.outcome !== 'success') {
    throw new Error(`Expected success, got error: ${result.error}`)
  }
}
