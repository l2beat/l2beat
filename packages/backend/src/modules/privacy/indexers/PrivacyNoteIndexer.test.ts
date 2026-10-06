import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { BlockProvider, LogsProvider } from '@l2beat/shared'
import { EthereumAddress, type Log, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { Configuration } from '../../../tools/uif/multi/types'
import type {
  PrivacyNoteIndexerConfig,
  PrivacyNoteIndexerConfigProperties,
} from '../types'
import { zkApiInterface } from '../zkapi/abi'
import { PrivacyNoteIndexer } from './PrivacyNoteIndexer'

const VAULT = EthereumAddress('0x1111111111111111111111111111111111111111')
const DESTINATION = EthereumAddress(
  '0x2222222222222222222222222222222222222222',
)

describe(PrivacyNoteIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  // One bucket configuration fetches all six lifecycle topics in one query, so
  // the challenge that re-activates the note is never synced apart from it.
  it('splits a deposit and its escape lifecycle into notes and status changes of one configuration', async () => {
    const from = UnixTime.toStartOf(UnixTime(1_700_000_000), 'day')
    const to = from + 5 * UnixTime.HOUR
    const timestamp = UnixTime(from + UnixTime.HOUR)
    const expiry = UnixTime(timestamp + 30 * UnixTime.DAY)
    const configurations = [configuration()]
    const logs = [
      vaultLog('NoteDeposited', [0, `0x${'11'.repeat(32)}`, 50_000, expiry, 1]),
      vaultLog('EscapeWithdrawalInitiated', [0, 1, 0, DESTINATION, expiry, 2]),
      vaultLog('EscapeWithdrawalChallenged', [0, 1, 3]),
    ].map((log, logIndex) => ({
      ...log,
      blockNumber: 100,
      blockHash: '0xblock',
      transactionHash: `0xtx${logIndex}`,
      logIndex,
      blockTimestamp: timestamp,
    }))

    const logsProvider = mockObject<LogsProvider>({
      getLogs: mockFn().returnsOnce(logs),
    })
    const privacyNote = mockObject<Database['privacyNote']>({
      upsertMany: mockFn().resolvesToOnce(1),
    })
    const privacyNoteStatusChange = mockObject<
      Database['privacyNoteStatusChange']
    >({
      upsertMany: mockFn().resolvesToOnce(2),
    })
    const indexer = makeIndexer({
      configurations,
      logsProvider,
      privacyNote,
      privacyNoteStatusChange,
    })

    const save = await indexer.multiUpdate(from, to, configurations)
    const safeHeight = await save()

    expect(logsProvider.getLogs).toHaveBeenOnlyCalledWith(
      50,
      150,
      [VAULT.toString()],
      [
        [
          'NoteDeposited',
          'MutualClose',
          'EscapeWithdrawalInitiated',
          'EscapeWithdrawalChallenged',
          'EscapeWithdrawalFinalized',
          'ExpiredClaimed',
        ].map((event) => zkApiInterface.getEventTopic(event)),
      ],
    )
    expect(privacyNote.upsertMany).toHaveBeenOnlyCalledWith([
      {
        configurationId: 'config-1',
        projectId: 'zkapi',
        noteId: 0,
        timestamp,
        txHash: '0xtx0',
        // 50k vault units at 1 gwei per unit.
        amount: 50_000_000_000_000n,
        expiresAt: expiry,
      },
    ])
    expect(privacyNoteStatusChange.upsertMany).toHaveBeenOnlyCalledWith([
      {
        configurationId: 'config-1',
        projectId: 'zkapi',
        noteId: 0,
        timestamp,
        blockNumber: 100,
        txHash: '0xtx1',
        logIndex: 1,
        active: false,
      },
      {
        configurationId: 'config-1',
        projectId: 'zkapi',
        noteId: 0,
        timestamp,
        blockNumber: 100,
        txHash: '0xtx2',
        logIndex: 2,
        active: true,
      },
    ])
    expect(safeHeight).toEqual(to)
  })

  // A note must never look active because only its closing event was removed.
  it('wipes notes and status changes together', async () => {
    const privacyNote = mockObject<Database['privacyNote']>({
      deleteByConfigIds: mockFn().resolvesToOnce(1),
    })
    const privacyNoteStatusChange = mockObject<
      Database['privacyNoteStatusChange']
    >({
      deleteByConfigIds: mockFn().resolvesToOnce(1),
    })
    const indexer = makeIndexer({ privacyNote, privacyNoteStatusChange })

    await indexer.wipeData([{ id: 'config-1' }])

    expect(privacyNote.deleteByConfigIds).toHaveBeenOnlyCalledWith(['config-1'])
    expect(privacyNoteStatusChange.deleteByConfigIds).toHaveBeenOnlyCalledWith([
      'config-1',
    ])
  })

  it('trims notes and status changes over the same range', async () => {
    const privacyNote = mockObject<Database['privacyNote']>({
      deleteByConfigInTimeRange: mockFn().resolvesToOnce(1),
    })
    const privacyNoteStatusChange = mockObject<
      Database['privacyNoteStatusChange']
    >({
      deleteByConfigInTimeRange: mockFn().resolvesToOnce(1),
    })
    const indexer = makeIndexer({ privacyNote, privacyNoteStatusChange })

    await indexer.trimData([{ id: 'config-1', range: [100, 200] }])

    expect(privacyNote.deleteByConfigInTimeRange).toHaveBeenOnlyCalledWith(
      'config-1',
      100,
      200,
    )
    expect(
      privacyNoteStatusChange.deleteByConfigInTimeRange,
    ).toHaveBeenOnlyCalledWith('config-1', 100, 200)
  })

  describe(PrivacyNoteIndexer.idToConfigurationId.name, () => {
    // A changed id wipes and re-syncs the configuration's data.
    it('keeps a stable id for the same note source', () => {
      expect(PrivacyNoteIndexer.idToConfigurationId(noteProperties())).toEqual(
        '863476145883',
      )
    })

    it('differs by unit conversion, since it changes every stored amount', () => {
      expect(
        PrivacyNoteIndexer.idToConfigurationId(noteProperties()),
      ).not.toEqual(
        PrivacyNoteIndexer.idToConfigurationId({
          ...noteProperties(),
          params: { weiPerUnit: '1' },
        }),
      )
    })
  })
})

function vaultLog(
  event: string,
  args: unknown[],
): Pick<Log, 'address' | 'topics' | 'data'> {
  return {
    address: VAULT.toString(),
    ...zkApiInterface.encodeEventLog(zkApiInterface.getEvent(event), args),
  }
}

function makeIndexer(deps: {
  configurations?: Configuration<PrivacyNoteIndexerConfig>[]
  logsProvider?: LogsProvider
  privacyNote: Database['privacyNote']
  privacyNoteStatusChange: Database['privacyNoteStatusChange']
}) {
  return new PrivacyNoteIndexer(
    {
      chain: 'ethereum',
      configurations: deps.configurations ?? [configuration()],
      blockProvider: mockObject<BlockProvider>({}),
      logsProvider: deps.logsProvider ?? mockObject<LogsProvider>({}),
      db: mockDatabase({
        privacyBlockTimestamp: mockObject<Database['privacyBlockTimestamp']>({
          findBlockNumberByChainAndTimestamp: mockFn()
            .resolvesToOnce(50)
            .resolvesToOnce(150),
        }),
        privacyNote: deps.privacyNote,
        privacyNoteStatusChange: deps.privacyNoteStatusChange,
      }),
      parents: [],
      indexerService: mockObject<IndexerService>({}),
    },
    Logger.SILENT,
  )
}

function noteProperties(): PrivacyNoteIndexerConfigProperties {
  return {
    projectId: 'zkapi',
    bucketId: 'zkapi-ETH',
    chain: 'ethereum',
    address: VAULT,
    sinceTimestamp: UnixTime(0),
    extractor: 'zkApiNote',
    params: { weiPerUnit: '1000000000' },
  }
}

function configuration(): Configuration<PrivacyNoteIndexerConfig> {
  const properties: PrivacyNoteIndexerConfig = {
    id: 'config-1',
    ...noteProperties(),
  }

  return {
    id: properties.id,
    minHeight: properties.sinceTimestamp,
    maxHeight: null,
    properties,
  }
}
