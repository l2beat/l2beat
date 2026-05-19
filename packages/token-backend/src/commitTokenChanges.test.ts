import type {
  AbstractTokenRecord,
  DeployedTokenRecord,
  TokenDatabase,
} from '@l2beat/database'
import type { AbstractTokenRepository } from '@l2beat/database/dist/repositories/AbstractTokenRepository'
import type { DeployedTokenRepository } from '@l2beat/database/dist/repositories/DeployedTokenRepository'
import type {
  TokenDbHistoryEntryInsert,
  TokenDbHistoryRepository,
} from '@l2beat/database/dist/repositories/TokenDbHistoryRepository'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { Command } from './commands'
import { commitTokenChanges } from './commitTokenChanges'

describe(commitTokenChanges.name, () => {
  it('routes each command kind to the matching repository call in order', async () => {
    const abstractToken = mockObject<AbstractTokenRepository>({
      insert: mockFn().resolvesTo(undefined),
      updateById: mockFn().resolvesTo(undefined),
      deleteById: mockFn().resolvesTo(undefined),
    })
    const deployedToken = mockObject<DeployedTokenRepository>({
      insert: mockFn().resolvesTo(undefined),
      updateByChainAndAddress: mockFn().resolvesTo(undefined),
      deleteByPrimaryKey: mockFn().resolvesTo(undefined),
    })
    const tokenDb = mockObject<TokenDatabase>({
      abstractToken,
      deployedToken,
      tokenDbHistory: mockHistory(),
    })

    const abstract = abstractRecord('USDC01', 'USDC')
    const deployed = deployedRecord('ethereum', '0xaaa', 'USDC01')

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
    ]

    await commitTokenChanges(tokenDb, commands, {
      kind: 'manual',
      user: 'someone@x.io',
    })

    expect(abstractToken.insert).toHaveBeenOnlyCalledWith(abstract)
    expect(abstractToken.updateById).toHaveBeenOnlyCalledWith(abstract.id, {
      symbol: 'USDC2',
    })
    expect(abstractToken.deleteById).toHaveBeenOnlyCalledWith(abstract.id)
    expect(deployedToken.insert).toHaveBeenOnlyCalledWith(deployed)
    expect(deployedToken.updateByChainAndAddress).toHaveBeenOnlyCalledWith(
      { chain: deployed.chain, address: deployed.address },
      { symbol: 'USDC2' },
    )
    expect(deployedToken.deleteByPrimaryKey).toHaveBeenOnlyCalledWith({
      chain: deployed.chain,
      address: deployed.address,
    })
  })

  it('passes deployed-token commands through verbatim, including any proof field', async () => {
    const insert = mockFn().resolvesTo(undefined)
    const updateByChainAndAddress = mockFn().resolvesTo(undefined)
    const tokenDb = mockObject<TokenDatabase>({
      deployedToken: mockObject<DeployedTokenRepository>({
        insert,
        updateByChainAndAddress,
      }),
      tokenDbHistory: mockHistory(),
    })
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
      { kind: 'manual', user: 'someone@x.io' },
    )

    expect(insert).toHaveBeenOnlyCalledWith(deployed)
    expect(updateByChainAndAddress).toHaveBeenOnlyCalledWith(pk, {
      abstractTokenId: 'USDT01',
      abstractTokenAssignmentProof: { kind: 'coingecko' },
    })
  })

  describe('history recording', () => {
    it('stores the executed command verbatim with manual source', async () => {
      const insert = mockFn<[TokenDbHistoryEntryInsert], Promise<void>>(() =>
        Promise.resolve(),
      )
      const abstract = abstractRecord('USDC01', 'USDC')
      const deployed = deployedRecord('ethereum', '0xaaa', 'USDC01')
      const tokenDb = mockObject<TokenDatabase>({
        abstractToken: mockObject<AbstractTokenRepository>({
          insert: mockFn().resolvesTo(undefined),
          deleteById: mockFn().resolvesTo(undefined),
        }),
        deployedToken: mockObject<DeployedTokenRepository>({
          updateByChainAndAddress: mockFn().resolvesTo(undefined),
        }),
        tokenDbHistory: mockObject<TokenDbHistoryRepository>({ insert }),
      })

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
      })

      expect(insert).toHaveBeenCalledTimes(3)
      const entries = insert.calls.map((c) => c.args[0])

      expect(entries[0]!).toEqual({
        timestamp: expect.a(Number),
        source: 'manual',
        userEmail: 'someone@x.io',
        commandType: 'AddAbstractTokenCommand',
        command: commands[0],
        ingestionLog: null,
      })
      expect(entries[1]!).toEqual({
        timestamp: expect.a(Number),
        source: 'manual',
        userEmail: 'someone@x.io',
        commandType: 'UpdateDeployedTokenCommand',
        command: commands[1],
        ingestionLog: null,
      })
      expect(entries[2]!).toEqual({
        timestamp: expect.a(Number),
        source: 'manual',
        userEmail: 'someone@x.io',
        commandType: 'DeleteAbstractTokenCommand',
        command: commands[2],
        ingestionLog: null,
      })
    })

    it('records ingestion source with the ingestion log and no userEmail', async () => {
      const insert = mockFn<[TokenDbHistoryEntryInsert], Promise<void>>(() =>
        Promise.resolve(),
      )
      const abstract = abstractRecord('USDC01', 'USDC')
      const deployed = deployedRecord('ethereum', '0xaaa', 'USDC01')
      const tokenDb = mockObject<TokenDatabase>({
        abstractToken: mockObject<AbstractTokenRepository>({
          insert: mockFn().resolvesTo(undefined),
        }),
        deployedToken: mockObject<DeployedTokenRepository>({
          insert: mockFn().resolvesTo(undefined),
        }),
        tokenDbHistory: mockObject<TokenDbHistoryRepository>({ insert }),
      })

      await commitTokenChanges(
        tokenDb,
        [
          { type: 'AddAbstractTokenCommand', record: abstract },
          { type: 'AddDeployedTokenCommand', record: deployed },
        ],
        { kind: 'ingestion', log: 'step 1\nstep 2\nOutcome: write' },
      )

      expect(insert).toHaveBeenCalledTimes(2)
      for (const call of insert.calls) {
        expect(call.args[0].source).toEqual('ingestion')
        expect(call.args[0].userEmail).toEqual(null)
        expect(call.args[0].ingestionLog).toEqual(
          'step 1\nstep 2\nOutcome: write',
        )
      }
    })

    it('records manual source with a null ingestion log', async () => {
      const insert = mockFn<[TokenDbHistoryEntryInsert], Promise<void>>(() =>
        Promise.resolve(),
      )
      const abstract = abstractRecord('USDC01', 'USDC')
      const tokenDb = mockObject<TokenDatabase>({
        abstractToken: mockObject<AbstractTokenRepository>({
          insert: mockFn().resolvesTo(undefined),
        }),
        tokenDbHistory: mockObject<TokenDbHistoryRepository>({ insert }),
      })

      await commitTokenChanges(
        tokenDb,
        [{ type: 'AddAbstractTokenCommand', record: abstract }],
        { kind: 'manual', user: 'someone@x.io' },
      )

      expect(insert.calls[0]!.args[0].ingestionLog).toEqual(null)
    })
  })
})

function mockHistory() {
  return mockObject<TokenDbHistoryRepository>({
    insert: mockFn().resolvesTo(undefined),
  })
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
    comment: null,
    reviewed: false,
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
