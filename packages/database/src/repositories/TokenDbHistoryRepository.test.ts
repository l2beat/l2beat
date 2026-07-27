import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeTokenDatabase } from '../test/tokenDatabase'
import {
  type TokenDbHistoryEntryInsert,
  TokenDbHistoryRepository,
} from './TokenDbHistoryRepository'

describeTokenDatabase(TokenDbHistoryRepository.name, (db) => {
  const repository = db.tokenDbHistory

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(TokenDbHistoryRepository.prototype.insert.name, () => {
    it('stores the executed command verbatim with the user email', async () => {
      const entry = manualAddDeployed(UnixTime(1000), 'someone@x.io')

      await repository.insert(entry)

      const stored = await repository.getAll()
      expect(stored).toHaveLength(1)
      expect(stored[0]!).toEqual({
        id: expect.a(String),
        timestamp: UnixTime(1000),
        source: 'manual',
        userEmail: 'someone@x.io',
        commandType: 'AddDeployedTokenCommand',
        command: entry.command,
        intent: null,
        ingestionLog: null,
      })
    })

    it('stores intent context when present', async () => {
      const entry = manualAddDeployed(UnixTime(1000), 'someone@x.io')

      await repository.insert({
        ...entry,
        intent: {
          type: 'MergeAbstractTokenIntent',
          sourceId: 'SOURCE',
          targetId: 'TARGET',
        },
      })

      const [stored] = await repository.getAll()
      expect(stored!.intent).toEqual({
        type: 'MergeAbstractTokenIntent',
        sourceId: 'SOURCE',
        targetId: 'TARGET',
      })
    })

    it('stores ingestion entries with the ingestion log and a null userEmail', async () => {
      await repository.insert({
        timestamp: UnixTime(1001),
        source: 'ingestion',
        userEmail: null,
        commandType: 'AddAbstractTokenCommand',
        command: {
          type: 'AddAbstractTokenCommand',
          record: { id: 'ABC123', symbol: 'USDC' },
        },
        intent: null,
        ingestionLog: '1. Resolved abstract\n2. Wrote token',
      })

      const [stored] = await repository.getAll()
      expect(stored!).toHaveSubset({
        source: 'ingestion',
        userEmail: null,
        commandType: 'AddAbstractTokenCommand',
        intent: null,
        ingestionLog: '1. Resolved abstract\n2. Wrote token',
      })
    })

    it('serializes BigInt values inside command JSON as strings', async () => {
      await repository.insert({
        timestamp: UnixTime(1002),
        source: 'ingestion',
        userEmail: null,
        commandType: 'UpdateDeployedTokenCommand',
        command: {
          type: 'UpdateDeployedTokenCommand',
          update: {
            abstractTokenAssignmentProof: {
              kind: 'non-swapping-transfer',
              transfer: {
                srcRawAmount: BigInt('123456789012345678901234567890'),
              },
            },
          },
        },
        intent: null,
        ingestionLog: null,
      })

      const [stored] = await repository.getAll()
      expect(stored!.command).toEqual({
        type: 'UpdateDeployedTokenCommand',
        update: {
          abstractTokenAssignmentProof: {
            kind: 'non-swapping-transfer',
            transfer: {
              srcRawAmount: '123456789012345678901234567890',
            },
          },
        },
      })
    })
  })

  describe(TokenDbHistoryRepository.prototype.getRecent.name, () => {
    it('returns the newest entries first', async () => {
      await repository.insert(manualAddDeployed(UnixTime(1000), 'first@x.io'))
      await repository.insert(manualAddDeployed(UnixTime(2000), 'second@x.io'))
      await repository.insert(manualAddDeployed(UnixTime(3000), 'third@x.io'))

      const recent = await repository.getRecent(2)

      expect(recent.map((e) => e.userEmail)).toEqual([
        'third@x.io',
        'second@x.io',
      ])
    })
  })

  describe(TokenDbHistoryRepository.prototype.getPage.name, () => {
    it('returns one newest-first page with the total count', async () => {
      await repository.insert(manualAddDeployed(UnixTime(1000), 'first@x.io'))
      await repository.insert(manualAddDeployed(UnixTime(2000), 'second@x.io'))
      await repository.insert(manualAddDeployed(UnixTime(3000), 'third@x.io'))

      const page = await repository.getPage({ offset: 1, limit: 1 })

      expect(page.totalCount).toEqual(3)
      expect(page.entries.map((e) => e.userEmail)).toEqual(['second@x.io'])
    })

    it('filters entries by token data in the command via search', async () => {
      await repository.insert(manualAddDeployed(UnixTime(1000), 'first@x.io'))
      await repository.insert({
        timestamp: UnixTime(2000),
        source: 'manual',
        userEmail: 'second@x.io',
        commandType: 'AddDeployedTokenCommand',
        command: {
          type: 'AddDeployedTokenCommand',
          record: {
            chain: 'arbitrum',
            address: '0x0000000000000000000000000000000000000bbb',
            symbol: 'DAI',
            abstractTokenId: 'DAI01',
          },
        },
        intent: null,
        ingestionLog: null,
      })

      const bySymbol = await repository.getPage({
        offset: 0,
        limit: 100,
        search: 'dai',
      })
      expect(bySymbol.totalCount).toEqual(1)
      expect(bySymbol.entries.map((e) => e.userEmail)).toEqual(['second@x.io'])

      const byChain = await repository.getPage({
        offset: 0,
        limit: 100,
        search: 'ethereum',
      })
      expect(byChain.totalCount).toEqual(1)
      expect(byChain.entries.map((e) => e.userEmail)).toEqual(['first@x.io'])

      const noMatch = await repository.getPage({
        offset: 0,
        limit: 100,
        search: 'nonexistent',
      })
      expect(noMatch.totalCount).toEqual(0)
      expect(noMatch.entries).toEqual([])
    })

    it('filters entries by intent via search', async () => {
      await repository.insert({
        ...manualAddDeployed(UnixTime(1000), 'someone@x.io'),
        intent: {
          type: 'MergeAbstractTokenIntent',
          sourceId: 'SOURCE',
          targetId: 'TARGET',
        },
      })

      const page = await repository.getPage({
        offset: 0,
        limit: 100,
        search: 'MergeAbstractTokenIntent',
      })

      expect(page.totalCount).toEqual(1)
      expect(page.entries[0]!.intent).toEqual({
        type: 'MergeAbstractTokenIntent',
        sourceId: 'SOURCE',
        targetId: 'TARGET',
      })
    })
  })
})

function manualAddDeployed(
  timestamp: UnixTime,
  userEmail: string,
): TokenDbHistoryEntryInsert {
  return {
    timestamp,
    source: 'manual',
    userEmail,
    commandType: 'AddDeployedTokenCommand',
    command: {
      type: 'AddDeployedTokenCommand',
      record: {
        chain: 'ethereum',
        address: '0x0000000000000000000000000000000000000aaa',
        symbol: 'USDC',
        abstractTokenId: 'USDC01',
      },
    },
    intent: null,
    ingestionLog: null,
  }
}
