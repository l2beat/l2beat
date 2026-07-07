import type {
  AbstractTokenRecord,
  DeployedTokenRecord,
  TokenDatabase,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { generatePlan, Plan } from './planning'

const USER = 'someone@l2beat.com'

describe('Plan', () => {
  it('defaults missing additional CoinGecko entries on abstract token records', () => {
    const parsed = Plan.parse({
      intent: {
        type: 'UpdateAbstractTokenIntent',
        id: 'ABC123',
        update: {
          additionalCoingeckoEntries: [
            {
              coingeckoId: 'bridged-token',
              coingeckoListingTimestamp: 1782345600,
              iconUrl: 'https://example.com/icon.png',
            },
          ],
        },
      },
      commands: [
        {
          type: 'UpdateAbstractTokenCommand',
          id: 'ABC123',
          existing: {
            id: 'ABC123',
            symbol: 'USDT',
            issuer: null,
            category: null,
            iconUrl: null,
            coingeckoId: 'tether',
            coingeckoListingTimestamp: null,
            comment: null,
            reviewed: false,
            isPriceUnreliable: false,
          },
          update: {
            additionalCoingeckoEntries: [
              {
                coingeckoId: 'bridged-token',
                coingeckoListingTimestamp: 1782345600,
                iconUrl: 'https://example.com/icon.png',
              },
            ],
          },
        },
      ],
    })

    expect(parsed.commands[0]).toEqual({
      type: 'UpdateAbstractTokenCommand',
      id: 'ABC123',
      existing: {
        id: 'ABC123',
        symbol: 'USDT',
        issuer: null,
        category: null,
        iconUrl: null,
        coingeckoId: 'tether',
        coingeckoListingTimestamp: null,
        additionalCoingeckoEntries: null,
        comment: null,
        reviewed: false,
        isPriceUnreliable: false,
      },
      update: {
        additionalCoingeckoEntries: [
          {
            coingeckoId: 'bridged-token',
            coingeckoListingTimestamp: 1782345600,
            iconUrl: 'https://example.com/icon.png',
          },
        ],
      },
    })
  })
})

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

describe('MergeAbstractTokenIntent', () => {
  it('copies source CoinGecko entries, reassigns deployed tokens, and deletes source', async () => {
    const source = abstractRecord('SOURCE', 'USDC', {
      coingeckoId: 'usd-coin-bridged',
      coingeckoListingTimestamp: UnixTime(100),
      iconUrl: 'https://example.com/source.png',
      additionalCoingeckoEntries: [
        {
          coingeckoId: 'usd-coin-extra',
          coingeckoListingTimestamp: UnixTime(200),
          iconUrl: 'https://example.com/extra.png',
        },
        {
          coingeckoId: 'usd-coin',
          coingeckoListingTimestamp: UnixTime(300),
          iconUrl: 'https://example.com/duplicate-primary.png',
        },
      ],
    })
    const target = abstractRecord('TARGET', 'USDC', {
      coingeckoId: 'usd-coin',
      additionalCoingeckoEntries: [
        {
          coingeckoId: 'usd-coin-extra',
          coingeckoListingTimestamp: UnixTime(201),
          iconUrl: 'https://example.com/existing-extra.png',
        },
      ],
    })
    const firstDeployed = deployedRecord('base', '0xbbb', source.id)
    const secondDeployed = deployedRecord('ethereum', '0xaaa', source.id)
    const db = mockDb({
      abstractTokens: [source, target],
      deployedTokens: [secondDeployed, firstDeployed],
    })

    const result = await generatePlan(
      db,
      {
        type: 'MergeAbstractTokenIntent',
        sourceId: source.id,
        targetId: target.id,
      },
      { user: USER, skipLogs: true },
    )

    assertSuccess(result)
    expect(result.plan.commands).toEqual([
      {
        type: 'UpdateAbstractTokenCommand',
        existing: target,
        id: target.id,
        update: {
          additionalCoingeckoEntries: [
            {
              coingeckoId: 'usd-coin-extra',
              coingeckoListingTimestamp: UnixTime(201),
              iconUrl: 'https://example.com/existing-extra.png',
            },
            {
              coingeckoId: 'usd-coin-bridged',
              coingeckoListingTimestamp: UnixTime(100),
              iconUrl: 'https://example.com/source.png',
            },
          ],
        },
      },
      {
        type: 'UpdateDeployedTokenCommand',
        existing: firstDeployed,
        pk: { chain: firstDeployed.chain, address: firstDeployed.address },
        update: {
          abstractTokenId: target.id,
          abstractTokenAssignmentProof: { kind: 'manual', user: USER },
        },
      },
      {
        type: 'UpdateDeployedTokenCommand',
        existing: secondDeployed,
        pk: { chain: secondDeployed.chain, address: secondDeployed.address },
        update: {
          abstractTokenId: target.id,
          abstractTokenAssignmentProof: { kind: 'manual', user: USER },
        },
      },
      {
        type: 'DeleteAbstractTokenCommand',
        id: source.id,
        existing: source,
      },
    ])
  })

  it('fails when source and target are the same token', async () => {
    const db = mockDb({})

    const result = await generatePlan(
      db,
      {
        type: 'MergeAbstractTokenIntent',
        sourceId: 'USDC01',
        targetId: 'USDC01',
      },
      { user: USER, skipLogs: true },
    )

    expect(result).toEqual({
      outcome: 'error',
      error: 'Cannot merge an abstract token into itself',
    })
  })

  it('fails when target token does not exist', async () => {
    const source = abstractRecord('SOURCE', 'USDC')
    const db = mockDb({ abstractTokens: [source] })

    const result = await generatePlan(
      db,
      {
        type: 'MergeAbstractTokenIntent',
        sourceId: source.id,
        targetId: 'TARGET',
      },
      { user: USER, skipLogs: true },
    )

    expect(result).toEqual({
      outcome: 'error',
      error: "AbstractToken TARGET doesn't exist",
    })
  })
})

function mockDb(opts: {
  existingDeployed?: DeployedTokenRecord
  abstractTokens?: AbstractTokenRecord[]
  deployedTokens?: DeployedTokenRecord[]
}): TokenDatabase {
  return mockObject<TokenDatabase>({
    deployedToken: mockObject<TokenDatabase['deployedToken']>({
      findByChainAndAddress: mockFn().resolvesTo(opts.existingDeployed),
      getByAbstractTokenId: mockFn((id: string) =>
        Promise.resolve(
          (opts.deployedTokens ?? []).filter(
            (token) => token.abstractTokenId === id,
          ),
        ),
      ),
    }),
    abstractToken: mockObject<TokenDatabase['abstractToken']>({
      findById: mockFn((id: string) =>
        Promise.resolve(
          (opts.abstractTokens ?? []).find((token) => token.id === id),
        ),
      ),
    }),
  })
}

function abstractRecord(
  id: string,
  symbol: string,
  overrides: Partial<AbstractTokenRecord> = {},
): AbstractTokenRecord {
  return {
    id,
    symbol,
    issuer: null,
    category: null,
    iconUrl: null,
    coingeckoId: null,
    coingeckoListingTimestamp: null,
    additionalCoingeckoEntries: null,
    comment: null,
    reviewed: false,
    isPriceUnreliable: false,
    ...overrides,
  }
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
