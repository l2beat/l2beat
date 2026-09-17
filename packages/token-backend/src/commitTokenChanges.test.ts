import type {
  AbstractTokenRecord,
  DeployedTokenRecord,
  TokenDatabase,
  TokenDbHistoryEntryInsert,
  TokenRelationRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import type { Command } from './commands'
import { commitTokenChanges } from './commitTokenChanges'

describe(commitTokenChanges.name, () => {
  it('routes each command kind to the matching repository call in order', async () => {
    const abstractToken = {
      insert: vi.fn().mockResolvedValue(undefined),
      updateById: vi.fn().mockResolvedValue(undefined),
      deleteById: vi.fn().mockResolvedValue(undefined),
    } as unknown as TokenDatabase['abstractToken']
    const deployedToken = {
      insert: vi.fn().mockResolvedValue(undefined),
      updateByChainAndAddress: vi.fn().mockResolvedValue(undefined),
      deleteByPrimaryKey: vi.fn().mockResolvedValue(undefined),
    } as unknown as TokenDatabase['deployedToken']
    const tokenRelation = {
      insert: vi.fn().mockResolvedValue(undefined),
      updateByPrimaryKey: vi.fn().mockResolvedValue(undefined),
      deleteByPrimaryKey: vi.fn().mockResolvedValue(undefined),
    } as unknown as TokenDatabase['tokenRelation']
    const tokenDb = {
      abstractToken,
      deployedToken,
      tokenRelation,
      tokenDbHistory: mockHistory(),
    } as unknown as TokenDatabase

    const abstract = abstractRecord('USDC01', 'USDC')
    const deployed = deployedRecord('ethereum', '0xaaa', 'USDC01')
    const relation = tokenRelationRecord(
      deployed,
      deployedRecord('arbitrum', '0xbbb', 'USDC01'),
    )

    const commands: Command[] = [
      { type: 'AddAbstractTokenCommand', record: abstract },
      {
        type: 'UpdateAbstractTokenCommand',
        id: abstract.id,
        existing: abstract,
        update: { symbol: 'USDC2' },
      },
      {
        type: 'DeleteAbstractTokenCommand',
        id: abstract.id,
        existing: abstract,
      },
      { type: 'AddDeployedTokenCommand', record: deployed },
      {
        type: 'UpdateDeployedTokenCommand',
        pk: { chain: deployed.chain, address: deployed.address },
        existing: deployed,
        update: { symbol: 'USDC2' },
      },
      {
        type: 'DeleteDeployedTokenCommand',
        pk: { chain: deployed.chain, address: deployed.address },
        existing: deployed,
      },
      { type: 'AddTokenRelationCommand', record: relation },
      {
        type: 'UpdateTokenRelationCommand',
        pk: relationPk(relation),
        existing: relation,
        update: { transfer: { transferId: 'transfer-2' } },
      },
      {
        type: 'DeleteTokenRelationCommand',
        pk: relationPk(relation),
        existing: relation,
      },
    ]

    await commitTokenChanges(tokenDb, commands, {
      kind: 'manual',
      user: 'someone@x.io',
      intent: null,
    })

    expect(abstractToken.insert).toHaveBeenCalledExactlyOnceWith(abstract)
    expect(abstractToken.updateById).toHaveBeenCalledExactlyOnceWith(
      abstract.id,
      {
        symbol: 'USDC2',
      },
    )
    expect(abstractToken.deleteById).toHaveBeenCalledExactlyOnceWith(
      abstract.id,
    )
    expect(deployedToken.insert).toHaveBeenCalledExactlyOnceWith(deployed)
    expect(
      deployedToken.updateByChainAndAddress,
    ).toHaveBeenCalledExactlyOnceWith(
      { chain: deployed.chain, address: deployed.address },
      { symbol: 'USDC2' },
    )
    expect(deployedToken.deleteByPrimaryKey).toHaveBeenCalledExactlyOnceWith({
      chain: deployed.chain,
      address: deployed.address,
    })
    expect(tokenRelation.insert).toHaveBeenCalledExactlyOnceWith(relation)
    expect(tokenRelation.updateByPrimaryKey).toHaveBeenCalledExactlyOnceWith(
      relationPk(relation),
      { transfer: { transferId: 'transfer-2' } },
    )
    expect(tokenRelation.deleteByPrimaryKey).toHaveBeenCalledExactlyOnceWith(
      relationPk(relation),
    )
  })

  it('passes deployed-token commands through verbatim, including any proof field', async () => {
    const insert = vi.fn().mockResolvedValue(undefined)
    const updateByChainAndAddress = vi.fn().mockResolvedValue(undefined)
    const tokenDb = {
      deployedToken: {
        insert,
        updateByChainAndAddress,
      } as unknown as TokenDatabase['deployedToken'],
      tokenDbHistory: mockHistory(),
    } as unknown as TokenDatabase
    const deployed: DeployedTokenRecord = {
      ...deployedRecord('ethereum', '0xaaa', 'USDC01'),
      abstractTokenAssignmentProof: { kind: 'manual', user: 'someone@x.io' },
    }
    const pk = { chain: deployed.chain, address: deployed.address }

    await commitTokenChanges(
      tokenDb,
      [
        { type: 'AddDeployedTokenCommand', record: deployed },
        {
          type: 'UpdateDeployedTokenCommand',
          pk,
          existing: deployed,
          update: {
            abstractTokenId: 'USDT01',
            abstractTokenAssignmentProof: { kind: 'coingecko' },
          },
        },
      ],
      { kind: 'manual', user: 'someone@x.io', intent: null },
    )

    expect(insert).toHaveBeenCalledExactlyOnceWith(deployed)
    expect(updateByChainAndAddress).toHaveBeenCalledExactlyOnceWith(pk, {
      abstractTokenId: 'USDT01',
      abstractTokenAssignmentProof: { kind: 'coingecko' },
    })
  })

  describe('history recording', () => {
    it('stores the executed command verbatim with manual source', async () => {
      const insert = vi.fn<(entry: TokenDbHistoryEntryInsert) => Promise<void>>(
        () => Promise.resolve(),
      )
      const abstract = abstractRecord('USDC01', 'USDC')
      const deployed = deployedRecord('ethereum', '0xaaa', 'USDC01')
      const tokenDb = {
        abstractToken: {
          insert: vi.fn().mockResolvedValue(undefined),
          deleteById: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['abstractToken'],
        deployedToken: {
          updateByChainAndAddress: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['deployedToken'],
        tokenDbHistory: {
          insert,
        } as unknown as TokenDatabase['tokenDbHistory'],
      } as unknown as TokenDatabase

      const commands: Command[] = [
        { type: 'AddAbstractTokenCommand', record: abstract },
        {
          type: 'UpdateDeployedTokenCommand',
          pk: { chain: deployed.chain, address: deployed.address },
          existing: deployed,
          update: { symbol: 'USDC2' },
        },
        {
          type: 'DeleteAbstractTokenCommand',
          id: abstract.id,
          existing: abstract,
        },
      ]

      await commitTokenChanges(tokenDb, commands, {
        kind: 'manual',
        user: 'someone@x.io',
        intent: { type: 'DeleteAbstractTokenIntent', id: abstract.id },
      })

      expect(insert).toHaveBeenCalledTimes(3)
      const entries = insert.mock.calls.map((c) => c[0])

      expect(entries[0]!).toStrictEqual({
        timestamp: expect.any(Number),
        source: 'manual',
        userEmail: 'someone@x.io',
        commandType: 'AddAbstractTokenCommand',
        command: commands[0],
        intent: { type: 'DeleteAbstractTokenIntent', id: abstract.id },
        ingestionLog: null,
      })
      expect(entries[1]!).toStrictEqual({
        timestamp: expect.any(Number),
        source: 'manual',
        userEmail: 'someone@x.io',
        commandType: 'UpdateDeployedTokenCommand',
        command: commands[1],
        intent: { type: 'DeleteAbstractTokenIntent', id: abstract.id },
        ingestionLog: null,
      })
      expect(entries[2]!).toStrictEqual({
        timestamp: expect.any(Number),
        source: 'manual',
        userEmail: 'someone@x.io',
        commandType: 'DeleteAbstractTokenCommand',
        command: commands[2],
        intent: { type: 'DeleteAbstractTokenIntent', id: abstract.id },
        ingestionLog: null,
      })
    })

    it('records ingestion source with the ingestion log and no userEmail', async () => {
      const insert = vi.fn<(entry: TokenDbHistoryEntryInsert) => Promise<void>>(
        () => Promise.resolve(),
      )
      const abstract = abstractRecord('USDC01', 'USDC')
      const deployed = deployedRecord('ethereum', '0xaaa', 'USDC01')
      const tokenDb = {
        abstractToken: {
          insert: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['abstractToken'],
        deployedToken: {
          insert: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['deployedToken'],
        tokenDbHistory: {
          insert,
        } as unknown as TokenDatabase['tokenDbHistory'],
      } as unknown as TokenDatabase

      await commitTokenChanges(
        tokenDb,
        [
          { type: 'AddAbstractTokenCommand', record: abstract },
          { type: 'AddDeployedTokenCommand', record: deployed },
        ],
        { kind: 'ingestion', log: 'step 1\nstep 2\nOutcome: write' },
      )

      expect(insert).toHaveBeenCalledTimes(2)
      for (const call of insert.mock.calls) {
        expect(call[0].source).toStrictEqual('ingestion')
        expect(call[0].userEmail).toStrictEqual(null)
        expect(call[0].intent).toStrictEqual(null)
        expect(call[0].ingestionLog).toStrictEqual(
          'step 1\nstep 2\nOutcome: write',
        )
      }
    })

    it('records manual source with a null ingestion log', async () => {
      const insert = vi.fn<(entry: TokenDbHistoryEntryInsert) => Promise<void>>(
        () => Promise.resolve(),
      )
      const abstract = abstractRecord('USDC01', 'USDC')
      const tokenDb = {
        abstractToken: {
          insert: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['abstractToken'],
        tokenDbHistory: {
          insert,
        } as unknown as TokenDatabase['tokenDbHistory'],
      } as unknown as TokenDatabase

      await commitTokenChanges(
        tokenDb,
        [{ type: 'AddAbstractTokenCommand', record: abstract }],
        { kind: 'manual', user: 'someone@x.io', intent: null },
      )

      expect(insert.mock.calls[0]![0].ingestionLog).toStrictEqual(null)
      expect(insert.mock.calls[0]![0].intent).toStrictEqual(null)
    })
  })
})

function mockHistory() {
  return {
    insert: vi.fn().mockResolvedValue(undefined),
  } as unknown as TokenDatabase['tokenDbHistory']
}

function abstractRecord(id: string, symbol: string): AbstractTokenRecord {
  return {
    id,
    issuer: null,
    symbol,
    category: null,
    iconUrl: null,
    coingeckoId: null,
    coingeckoListingTimestamp: null,
    additionalCoingeckoEntries: null,
    comment: null,
    reviewed: false,
    isPriceUnreliable: false,
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
    ignored: false,
    metadata: null,
  }
}

function tokenRelationRecord(
  tokenA: Pick<DeployedTokenRecord, 'chain' | 'address'>,
  tokenB: Pick<DeployedTokenRecord, 'chain' | 'address'>,
): TokenRelationRecord {
  return {
    tokenAChain: tokenA.chain,
    tokenAAddress: tokenA.address,
    tokenBChain: tokenB.chain,
    tokenBAddress: tokenB.address,
    plugin: 'superbridge',
    bridgeType: 'burnAndMint',
    lockedToken: null,
    transfer: { transferId: 'transfer-1' },
  }
}

function relationPk(relation: TokenRelationRecord) {
  return {
    tokenAChain: relation.tokenAChain,
    tokenAAddress: relation.tokenAAddress,
    tokenBChain: relation.tokenBChain,
    tokenBAddress: relation.tokenBAddress,
    plugin: relation.plugin,
    bridgeType: relation.bridgeType,
  }
}
