import type {
  AbstractTokenRecord,
  DeployedTokenRecord,
  TokenDatabase,
  TokenDenylistEntryRecord,
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

  describe('TokenRelation intents', () => {
    it('adds a token relation with its endpoints in the stored order', async () => {
      // A human names the endpoints in whichever order they think of them; a
      // relation is a fact about an unordered pair, so the stored order is
      // derived. Here arbitrum sorts before ethereum, so the two are swapped.
      const ethereumToken = deployedRecord('ethereum', '0xaaa', 'USDC01')
      const arbitrumToken = deployedRecord('arbitrum', '0xbbb', 'USDC01')
      const relation = tokenRelation(ethereumToken, arbitrumToken)
      const db = mockDb({
        deployedByPk: {
          [`${ethereumToken.chain}:${ethereumToken.address}`]: ethereumToken,
          [`${arbitrumToken.chain}:${arbitrumToken.address}`]: arbitrumToken,
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
          record: tokenRelation(arbitrumToken, ethereumToken),
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

describe('AddTokenToDenylistIntent', () => {
  it('adds the entry and deletes the token, leaving relations untouched', async () => {
    const existing = deployedRecord('ethereum', '0xaaa', 'USDC01')
    const relation = tokenRelation(existing, {
      chain: 'arbitrum',
      address: '0xbbb',
    })
    const db = mockDb({
      existingDeployed: existing,
      relations: [relation],
    })

    const result = await generatePlan(
      db,
      {
        type: 'AddTokenToDenylistIntent',
        pk: { chain: existing.chain, address: existing.address },
        reason: 'test token',
      },
      { user: USER, skipLogs: true },
    )

    assertSuccess(result)
    // No DeleteTokenRelationCommand even though a relation exists: relations
    // are observations and no interpretation (including a ban) deletes them.
    // The relations graph filters denylisted endpoints at display time.
    expect(result.plan.commands).toEqual([
      {
        type: 'AddTokenToDenylistCommand',
        record: {
          chain: existing.chain,
          address: existing.address,
          reason: 'test token',
        },
      },
      {
        type: 'DeleteDeployedTokenCommand',
        pk: { chain: existing.chain, address: existing.address },
        existing,
      },
    ])
  })

  it('denylists an uncatalogued address with no relations', async () => {
    const db = mockDb({})

    const result = await generatePlan(
      db,
      {
        type: 'AddTokenToDenylistIntent',
        pk: { chain: 'arbitrum', address: paddedAddress('0xAAA') },
        reason: 'test token',
      },
      { user: USER, skipLogs: true },
    )

    assertSuccess(result)
    expect(result.plan.commands).toEqual([
      {
        type: 'AddTokenToDenylistCommand',
        record: {
          chain: 'arbitrum',
          address: paddedAddress('0xaaa'),
          reason: 'test token',
        },
      },
    ])
  })

  it('crops an Address32-form address to the form the catalogue uses', async () => {
    // The missing-tokens dashboard displays Address32 forms; a ban recorded
    // under that form would never match an ingestion lookup.
    const existing = deployedRecord('ethereum', '0xaaa', 'USDC01')
    const address32 = `0x${'0'.repeat(24)}${existing.address.slice(2)}`
    const db = mockDb({
      deployedByPk: { [`ethereum:${existing.address}`]: existing },
    })

    const result = await generatePlan(
      db,
      {
        type: 'AddTokenToDenylistIntent',
        pk: { chain: 'ethereum', address: address32 },
        reason: 'test token',
      },
      { user: USER, skipLogs: true },
    )

    assertSuccess(result)
    expect(result.plan.commands).toEqual([
      {
        type: 'AddTokenToDenylistCommand',
        record: {
          chain: 'ethereum',
          address: existing.address,
          reason: 'test token',
        },
      },
      {
        type: 'DeleteDeployedTokenCommand',
        pk: { chain: 'ethereum', address: existing.address },
        existing,
      },
    ])
  })

  it('fails for a value that is not a token address', async () => {
    const db = mockDb({})

    const result = await generatePlan(
      db,
      {
        type: 'AddTokenToDenylistIntent',
        pk: { chain: 'arbitrum', address: '0xnothex' },
        reason: 'test token',
      },
      { user: USER, skipLogs: true },
    )

    expect(result).toEqual({
      outcome: 'error',
      error: '0xnothex is not a valid token address',
    })
  })

  it('fails when the chain is unknown and nothing references the address', async () => {
    // The chain field is free-form text — a typo'd chain would record an
    // entry that bans nothing while the UI reports success.
    const db = mockDb({ knownChains: ['arbitrum'] })

    const result = await generatePlan(
      db,
      {
        type: 'AddTokenToDenylistIntent',
        pk: { chain: 'arbtirum', address: paddedAddress('0xaaa') },
        reason: 'test token',
      },
      { user: USER, skipLogs: true },
    )

    expect(result).toEqual({
      outcome: 'error',
      error: `Chain arbtirum is not known to TokenDB and nothing references arbtirum+${paddedAddress('0xaaa')} — check the chain for a typo`,
    })
  })

  it('denylists an address on an unknown chain when it is queued for ingestion', async () => {
    // Production has queued tokens on chains that were never added to the
    // chain table — the queue entry proves the chain string is what
    // ingestion uses, so the ban is meaningful.
    const db = mockDb({
      knownChains: [],
      queued: [{ chain: 'solana', address: paddedAddress('0xaaa') }],
    })

    const result = await generatePlan(
      db,
      {
        type: 'AddTokenToDenylistIntent',
        pk: { chain: 'solana', address: paddedAddress('0xAAA') },
        reason: 'test token',
      },
      { user: USER, skipLogs: true },
    )

    assertSuccess(result)
    expect(result.plan.commands).toEqual([
      {
        type: 'AddTokenToDenylistCommand',
        record: {
          chain: 'solana',
          address: paddedAddress('0xaaa'),
          reason: 'test token',
        },
      },
    ])
  })

  it('fails when the address is already denylisted', async () => {
    const db = mockDb({
      denylisted: [
        {
          chain: 'arbitrum',
          address: paddedAddress('0xaaa'),
          reason: 'test token',
          createdAt: 1,
        },
      ],
    })

    const result = await generatePlan(
      db,
      {
        type: 'AddTokenToDenylistIntent',
        pk: { chain: 'arbitrum', address: paddedAddress('0xAAA') },
        reason: 'again',
      },
      { user: USER, skipLogs: true },
    )

    expect(result).toEqual({
      outcome: 'error',
      error: `arbitrum+${paddedAddress('0xaaa')} is already denylisted (test token)`,
    })
  })

  it('fails without a reason', async () => {
    const db = mockDb({})

    const result = await generatePlan(
      db,
      {
        type: 'AddTokenToDenylistIntent',
        pk: { chain: 'arbitrum', address: paddedAddress('0xaaa') },
        reason: '  ',
      },
      { user: USER, skipLogs: true },
    )

    expect(result).toEqual({
      outcome: 'error',
      error: 'A denylist entry requires a reason',
    })
  })
})

describe('DeleteTokenFromDenylistIntent', () => {
  it('deletes an existing entry', async () => {
    const entry = {
      chain: 'arbitrum',
      address: paddedAddress('0xaaa'),
      reason: 'test token',
      createdAt: 1,
    }
    const db = mockDb({ denylisted: [entry] })

    const result = await generatePlan(
      db,
      {
        type: 'DeleteTokenFromDenylistIntent',
        pk: { chain: 'arbitrum', address: paddedAddress('0xaaa') },
      },
      { user: USER, skipLogs: true },
    )

    assertSuccess(result)
    expect(result.plan.commands).toEqual([
      {
        type: 'DeleteTokenFromDenylistCommand',
        pk: { chain: 'arbitrum', address: paddedAddress('0xaaa') },
        existing: entry,
      },
    ])
  })

  it('finds the entry through an Address32-form address', async () => {
    const entry = {
      chain: 'arbitrum',
      address: paddedAddress('0xaaa'),
      reason: 'test token',
      createdAt: 1,
    }
    const db = mockDb({ denylisted: [entry] })

    const result = await generatePlan(
      db,
      {
        type: 'DeleteTokenFromDenylistIntent',
        pk: {
          chain: 'arbitrum',
          address: `0x${'0'.repeat(24)}${paddedAddress('0xaaa').slice(2)}`,
        },
      },
      { user: USER, skipLogs: true },
    )

    assertSuccess(result)
    expect(result.plan.commands).toEqual([
      {
        type: 'DeleteTokenFromDenylistCommand',
        pk: { chain: 'arbitrum', address: paddedAddress('0xaaa') },
        existing: entry,
      },
    ])
  })

  it('fails when the entry does not exist', async () => {
    const db = mockDb({})

    const result = await generatePlan(
      db,
      {
        type: 'DeleteTokenFromDenylistIntent',
        pk: { chain: 'arbitrum', address: paddedAddress('0xaaa') },
      },
      { user: USER, skipLogs: true },
    )

    expect(result).toEqual({
      outcome: 'error',
      error: `arbitrum+${paddedAddress('0xaaa')} is not denylisted`,
    })
  })
})

describe('AddDeployedTokenIntent denylist gate', () => {
  it('refuses to add a denylisted address', async () => {
    const record = deployedRecord('ethereum', '0xaaa', 'USDC01')
    const db = mockDb({
      denylisted: [
        {
          chain: record.chain,
          address: record.address,
          reason: 'test token',
          createdAt: 1,
        },
      ],
    })

    const result = await generatePlan(
      db,
      { type: 'AddDeployedTokenIntent', record },
      { user: USER, skipLogs: true },
    )

    expect(result).toEqual({
      outcome: 'error',
      error: `DeployedToken ${record.chain}+${record.address} is denylisted (test token) — remove the denylist entry first`,
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
        // The UI sends display ids (`<id>:<issuer>:<symbol>`); planning must
        // extract the unique identifier prefix.
        sourceId: `${source.id}:${source.issuer}:${source.symbol}`,
        targetId: `${target.id}:${target.issuer}:${target.symbol}`,
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
          comment:
            'Merged from SOURCE:null:USDC (category: null, coingeckoId: usd-coin-bridged)',
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

  it('appends the merge note to an existing comment even when the source has no CoinGecko data', async () => {
    const source = abstractRecord('SOURCE', 'DAI', {
      issuer: 'MakerDAO',
      category: 'other',
    })
    const target = abstractRecord('TARGET', 'DAI', {
      comment: 'existing note',
    })
    const db = mockDb({ abstractTokens: [source, target] })

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
          comment:
            'existing note\nMerged from SOURCE:MakerDAO:DAI (category: other, coingeckoId: null)',
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
  deployedByPk?: Record<string, DeployedTokenRecord>
  existingRelation?: ReturnType<typeof tokenRelation>
  relations?: ReturnType<typeof tokenRelation>[]
  denylisted?: TokenDenylistEntryRecord[]
  /** Chains known to the chain table. Undefined means every chain exists. */
  knownChains?: string[]
  queued?: { chain: string; address: string }[]
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
    chain: mockObject<TokenDatabase['chain']>({
      findByName: mockFn().executes(async (name: string) =>
        opts.knownChains === undefined || opts.knownChains.includes(name)
          ? {
              name,
              chainId: 1,
              explorerUrl: null,
              aliases: null,
              apis: null,
            }
          : undefined,
      ),
    }),
    tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>({
      findByChainAndAddress: mockFn().executes(
        async (pk: { chain: string; address: string }) => {
          const entry = opts.queued?.find(
            (queued) =>
              queued.chain === pk.chain &&
              queued.address === pk.address.toLowerCase(),
          )
          if (!entry) return undefined
          return {
            ...entry,
            state: 'pending' as const,
            message: null,
            createdAt: UnixTime(1),
            updatedAt: UnixTime(1),
          }
        },
      ),
    }),
    deployedToken: mockObject<TokenDatabase['deployedToken']>({
      findByChainAndAddress: findDeployed,
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
    tokenRelation: mockObject<TokenDatabase['tokenRelation']>({
      findByPrimaryKey: mockFn().resolvesTo(opts.existingRelation),
      getRelationsFor: mockFn().resolvesTo(opts.relations ?? []),
    }),
    tokenDenylist: mockObject<TokenDatabase['tokenDenylist']>({
      findByChainAndAddress: mockFn().executes(
        async (pk: { chain: string; address: string }) =>
          opts.denylisted?.find(
            (entry) =>
              entry.chain === pk.chain &&
              entry.address === pk.address.toLowerCase(),
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

function paddedAddress(shortAddress: string): string {
  return `0x${shortAddress.slice(2).toLowerCase().padStart(40, '0')}`
}

function deployedRecord(
  chain: string,
  shortAddress: string,
  abstractTokenId: string,
): DeployedTokenRecord {
  return {
    chain,
    address: paddedAddress(shortAddress),
    abstractTokenId,
    symbol: 'USDC',
    decimals: 6,
    deploymentTimestamp: UnixTime(1),
    comment: null,
    metadata: null,
  }
}

function tokenRelation(
  tokenA: Pick<DeployedTokenRecord, 'chain' | 'address'>,
  tokenB: Pick<DeployedTokenRecord, 'chain' | 'address'>,
) {
  return {
    tokenAChain: tokenA.chain,
    tokenAAddress: tokenA.address,
    tokenBChain: tokenB.chain,
    tokenBAddress: tokenB.address,
    plugin: 'superbridge',
    bridgeType: 'burnAndMint' as const,
    lockedToken: null,
    transfer: { transferId: 'transfer-1' },
  }
}

function relationPk(relation: ReturnType<typeof tokenRelation>) {
  return {
    tokenAChain: relation.tokenAChain,
    tokenAAddress: relation.tokenAAddress,
    tokenBChain: relation.tokenBChain,
    tokenBAddress: relation.tokenBAddress,
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
