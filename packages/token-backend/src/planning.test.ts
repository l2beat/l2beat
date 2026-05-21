import type { DeployedTokenRecord, TokenDatabase } from '@l2beat/database'
import type { AbstractTokenRepository } from '@l2beat/database/dist/repositories/AbstractTokenRepository'
import type { DeployedTokenRepository } from '@l2beat/database/dist/repositories/DeployedTokenRepository'
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
})

function mockDb(opts: {
  existingDeployed?: DeployedTokenRecord
}): TokenDatabase {
  return mockObject<TokenDatabase>({
    deployedToken: mockObject<DeployedTokenRepository>({
      findByChainAndAddress: mockFn().resolvesTo(opts.existingDeployed),
    }),
    abstractToken: mockObject<AbstractTokenRepository>({}),
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

function assertSuccess<T>(
  result: { outcome: 'success'; plan: T } | { outcome: 'error'; error: string },
): asserts result is { outcome: 'success'; plan: T } {
  if (result.outcome !== 'success') {
    throw new Error(`Expected success, got error: ${result.error}`)
  }
}
