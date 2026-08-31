import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type {
  BlockProvider,
  BlockTimestampProvider,
  IRpcClient,
  LogsProvider,
} from '@l2beat/shared'
import { EthereumAddress, type Log, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { Configuration } from '../../../tools/uif/multi/types'
import type { PrivacyAnonymitySetIndexerConfig } from '../types'
import { PrivacyAnonymitySetIndexer } from './PrivacyAnonymitySetIndexer'

const POOL = EthereumAddress('0x1111111111111111111111111111111111111111')
const DEPOSITOR = EthereumAddress('0x2222222222222222222222222222222222222222')
const TRANSACTION_SENDER = EthereumAddress(
  '0x3333333333333333333333333333333333333333',
)
const FIXED_TOPIC = `0x${'aa'.repeat(32)}`
const TRANSACTION_HASH = `0x${'bb'.repeat(32)}`
const privacyPoolsInterface = new utils.Interface([
  'event Deposited(address indexed depositor, uint256 commitment, uint256 label, uint256 value, uint256 precommitmentHash)',
])

describe(PrivacyAnonymitySetIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  it('stores a fixed deposit with its transaction sender', async () => {
    const from = UnixTime.toStartOf(UnixTime(1_700_000_000), 'day')
    const to = from + 5 * UnixTime.HOUR
    const timestamp = from + UnixTime.HOUR
    const configuration = fixedConfiguration('10000000000000000000')
    const log = makeLog({
      topics: [FIXED_TOPIC],
      timestamp,
    })
    const upsertMany =
      mockFn<Database['privacyAnonymitySetEvent']['upsertMany']>().resolvesTo(1)
    const indexer = makeIndexer({
      configuration,
      logs: [log],
      timestamps: new Map([[log.blockNumber, timestamp]]),
      getTransaction: mockFn<IRpcClient['getTransaction']>().resolvesTo({
        hash: TRANSACTION_HASH,
        value: undefined,
        from: TRANSACTION_SENDER.toString(),
        to: undefined,
        data: undefined,
        type: undefined,
        calls: undefined,
        blobVersionedHashes: undefined,
        blockNumber: log.blockNumber,
      }),
      upsertMany,
    })

    const save = await indexer.multiUpdate(from, to, [configuration])
    const safeHeight = await save()

    expect(upsertMany).toHaveBeenOnlyCalledWith([
      {
        configurationId: 'config-1',
        projectId: 'project-1',
        bucketId: 'bucket-1',
        chain: 'ethereum',
        timestamp,
        blockNumber: 100,
        txHash: TRANSACTION_HASH,
        logIndex: 7,
        sender: TRANSACTION_SENDER.toString(),
        amount: 10_000_000_000_000_000_000n,
      },
    ])
    expect(safeHeight).toEqual(to)
  })

  it('uses the Privacy Pools depositor without fetching a transaction', async () => {
    const from = UnixTime.toStartOf(UnixTime(1_700_000_000), 'day')
    const to = from + UnixTime.DAY
    const timestamp = from + UnixTime.HOUR
    const encoded = privacyPoolsInterface.encodeEventLog('Deposited', [
      DEPOSITOR.toString(),
      1n,
      2n,
      15_000_000_000_000_000_000n,
      3n,
    ])
    const configuration = privacyPoolsConfiguration(encoded.topics[0]!)
    const log = makeLog({
      topics: encoded.topics,
      data: encoded.data,
      timestamp,
    })
    const getTransaction = mockFn<IRpcClient['getTransaction']>()
    const upsertMany =
      mockFn<Database['privacyAnonymitySetEvent']['upsertMany']>().resolvesTo(1)
    const indexer = makeIndexer({
      configuration,
      logs: [log],
      timestamps: new Map([[log.blockNumber, timestamp]]),
      getTransaction,
      upsertMany,
    })

    const save = await indexer.multiUpdate(from, to, [configuration])
    await save()

    expect(getTransaction).not.toHaveBeenCalled()
    expect(upsertMany).toHaveBeenOnlyCalledWith([
      {
        configurationId: 'config-1',
        projectId: 'project-1',
        bucketId: 'bucket-1',
        chain: 'ethereum',
        timestamp,
        blockNumber: 100,
        txHash: TRANSACTION_HASH,
        logIndex: 7,
        sender: DEPOSITOR.toString(),
        amount: 15_000_000_000_000_000_000n,
      },
    ])
  })

  it('clamps one update to the next UTC day', async () => {
    const from = UnixTime.toStartOf(UnixTime(1_700_000_000), 'day')
    const configuration = fixedConfiguration('1')
    const upsertMany =
      mockFn<Database['privacyAnonymitySetEvent']['upsertMany']>().resolvesTo(0)
    const indexer = makeIndexer({
      configuration,
      logs: [],
      timestamps: new Map(),
      getTransaction: mockFn(),
      upsertMany,
    })

    const save = await indexer.multiUpdate(from, from + 36 * UnixTime.HOUR, [
      configuration,
    ])

    expect(await save()).toEqual(from + UnixTime.DAY)
  })
})

function makeIndexer({
  configuration,
  logs,
  timestamps,
  getTransaction,
  upsertMany,
}: {
  configuration: Configuration<PrivacyAnonymitySetIndexerConfig>
  logs: Log[]
  timestamps: Map<number, UnixTime>
  getTransaction: IRpcClient['getTransaction']
  upsertMany: Database['privacyAnonymitySetEvent']['upsertMany']
}) {
  return new PrivacyAnonymitySetIndexer(
    {
      chain: 'ethereum',
      configurations: [configuration],
      parents: [],
      indexerService: mockObject<IndexerService>({}),
      blockTimestampProvider: mockObject<BlockTimestampProvider>({
        getBlockNumberAtOrBefore: mockFn().returnsOnce(50).returnsOnce(150),
      }),
      blockProvider: mockObject<BlockProvider>({
        getBlockTimestamps: mockFn().returnsOnce(timestamps),
      }),
      logsProvider: mockObject<LogsProvider>({
        getLogs: mockFn().returnsOnce(logs),
      }),
      rpcClient: mockObject<IRpcClient>({ getTransaction }),
      db: mockDatabase({
        privacyAnonymitySetEvent: mockObject<
          Database['privacyAnonymitySetEvent']
        >({ upsertMany }),
      }),
    },
    Logger.SILENT,
  )
}

function fixedConfiguration(
  amount: string,
): Configuration<PrivacyAnonymitySetIndexerConfig> {
  return baseConfiguration({
    event: FIXED_TOPIC,
    extractor: 'fixedAmount',
    params: { amount },
  })
}

function privacyPoolsConfiguration(
  event: string,
): Configuration<PrivacyAnonymitySetIndexerConfig> {
  return baseConfiguration({
    event,
    extractor: 'privacyPoolsValue',
    params: {},
  })
}

function baseConfiguration(
  extractor: Pick<
    PrivacyAnonymitySetIndexerConfig,
    'event' | 'extractor' | 'params'
  >,
): Configuration<PrivacyAnonymitySetIndexerConfig> {
  return {
    id: 'config-1',
    minHeight: 0,
    maxHeight: null,
    properties: {
      id: 'config-1',
      projectId: 'project-1',
      bucketId: 'bucket-1',
      chain: 'ethereum',
      address: POOL,
      sinceTimestamp: UnixTime(0),
      ...extractor,
    } as PrivacyAnonymitySetIndexerConfig,
  }
}

function makeLog({
  topics,
  data = '0x',
  timestamp,
}: {
  topics: string[]
  data?: string
  timestamp: UnixTime
}): Log {
  return {
    address: POOL.toString(),
    topics,
    data,
    blockNumber: 100,
    blockHash: `0x${'cc'.repeat(32)}`,
    transactionHash: TRANSACTION_HASH,
    logIndex: 7,
    blockTimestamp: timestamp,
  }
}
