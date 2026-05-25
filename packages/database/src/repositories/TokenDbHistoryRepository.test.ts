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
        ingestionLog: null,
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
        ingestionLog: '1. Resolved abstract\n2. Wrote token',
      })

      const [stored] = await repository.getAll()
      expect(stored!).toHaveSubset({
        source: 'ingestion',
        userEmail: null,
        commandType: 'AddAbstractTokenCommand',
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
    ingestionLog: null,
  }
}
