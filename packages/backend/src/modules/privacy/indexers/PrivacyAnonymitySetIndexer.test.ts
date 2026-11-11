import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { BlockProvider, IRpcClient, LogsProvider } from '@l2beat/shared'
import { EthereumAddress, type Log, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { Configuration } from '../../../tools/uif/multi/types'
import type {
  EvmPrivacyAnonymitySetSource,
  PrivacyAnonymitySetIndexerConfig,
} from '../types'
import { DEPOSIT_TOPIC } from '../zkmoney/abi'
import {
  FUNDED,
  FUNDING_PARAMS,
  mockZkMoneyRpc,
  PORTAL,
  portalDeposit,
  transfer,
} from '../zkmoney/test/fixtures'
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
const umbraRegistryInterface = new utils.Interface([
  'event StealthKeyChanged(address indexed registrant, uint256 spendingPubKeyPrefix, uint256 spendingPubKey, uint256 viewingPubKeyPrefix, uint256 viewingPubKey)',
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
      repository: mockObject<Database['privacyAnonymitySetEvent']>({
        upsertMany,
      }),
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
      getTransaction,
      repository: mockObject<Database['privacyAnonymitySetEvent']>({
        upsertMany,
      }),
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

  it('stores a key registration under its registrant with amount 0', async () => {
    const from = UnixTime.toStartOf(UnixTime(1_700_000_000), 'day')
    const to = from + UnixTime.DAY
    const timestamp = from + UnixTime.HOUR
    const encoded = umbraRegistryInterface.encodeEventLog('StealthKeyChanged', [
      DEPOSITOR.toString(),
      2n,
      3n,
      2n,
      5n,
    ])
    const configuration = baseConfiguration({
      event: encoded.topics[0]!,
      extractor: 'umbraStealthKeyChanged',
      params: {},
    })
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
      getTransaction,
      repository: mockObject<Database['privacyAnonymitySetEvent']>({
        upsertMany,
      }),
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
        amount: 0n,
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
      getTransaction: mockFn(),
      repository: mockObject<Database['privacyAnonymitySetEvent']>({
        upsertMany,
      }),
    })

    const save = await indexer.multiUpdate(from, from + 36 * UnixTime.HOUR, [
      configuration,
    ])

    expect(await save()).toEqual(from + UnixTime.DAY)
  })

  it('fetches logs between the blocks the block timestamp table maps the range to', async () => {
    const day = UnixTime.toStartOf(UnixTime(1_700_000_000), 'day')
    const from = day + 1
    const to = day + 90 * UnixTime.MINUTE
    const configuration = fixedConfiguration('1')
    const findBlockNumberByChainAndTimestamp = mockFn<
      Database['privacyBlockTimestamp']['findBlockNumberByChainAndTimestamp']
    >()
      .resolvesToOnce(50)
      .resolvesToOnce(150)
    const getLogs = mockFn<LogsProvider['getLogs']>().resolvesTo([])
    const indexer = new PrivacyAnonymitySetIndexer(
      {
        chain: 'ethereum',
        configurations: [configuration],
        parents: [],
        indexerService: mockObject<IndexerService>({}),
        blockProvider: mockObject<BlockProvider>({}),
        logsProvider: mockObject<LogsProvider>({ getLogs }),
        rpcClient: mockObject<IRpcClient>({}),
        db: mockDatabase({
          privacyBlockTimestamp: mockObject<Database['privacyBlockTimestamp']>({
            findBlockNumberByChainAndTimestamp,
          }),
        }),
      },
      Logger.SILENT,
    )

    await indexer.multiUpdate(from, to, [configuration])

    expect(findBlockNumberByChainAndTimestamp).toHaveBeenNthCalledWith(
      1,
      'ethereum',
      day,
    )
    expect(findBlockNumberByChainAndTimestamp).toHaveBeenNthCalledWith(
      2,
      'ethereum',
      day + 2 * UnixTime.HOUR,
    )
    expect(getLogs).toHaveBeenOnlyCalledWith(
      50,
      150,
      [POOL.toString()],
      [[FIXED_TOPIC]],
    )
  })

  it('keeps logs of the first block even if it predates the range', async () => {
    const from = UnixTime.toStartOf(UnixTime(1_700_000_000), 'day')
    const to = from + UnixTime.DAY
    const timestamp = from - 1
    const configuration = fixedConfiguration('1')
    const log = makeLog({ topics: [FIXED_TOPIC], timestamp })
    const upsertMany =
      mockFn<Database['privacyAnonymitySetEvent']['upsertMany']>().resolvesTo(1)
    const indexer = makeIndexer({
      configuration,
      logs: [log],
      getTransaction: mockFn<IRpcClient['getTransaction']>().resolvesTo(
        makeTransaction(TRANSACTION_HASH),
      ),
      repository: mockObject<Database['privacyAnonymitySetEvent']>({
        upsertMany,
      }),
    })

    const save = await indexer.multiUpdate(from, to, [configuration])
    await save()

    expect(upsertMany.calls[0]?.args[0]).toEqual([
      expect.subset({ timestamp, txHash: TRANSACTION_HASH }),
    ])
  })

  it('fetches transaction senders in batches of 25', async () => {
    const from = UnixTime.toStartOf(UnixTime(1_700_000_000), 'day')
    const to = from + UnixTime.DAY
    const timestamp = from + UnixTime.HOUR
    const configuration = fixedConfiguration('1')
    const transactionHashes = Array.from(
      { length: 26 },
      (_, i) => `0x${i.toString(16).padStart(64, '0')}`,
    )
    const logs = transactionHashes.map((transactionHash, logIndex) =>
      makeLog({
        topics: [FIXED_TOPIC],
        timestamp,
        transactionHash,
        logIndex,
      }),
    )
    const firstBatch = deferred()
    const started: string[] = []
    const getTransaction = mockFn<IRpcClient['getTransaction']>().executes(
      async (hash) => {
        const waitsForFirstBatch = started.length < 25
        started.push(hash)
        if (waitsForFirstBatch) await firstBatch.promise
        return makeTransaction(hash)
      },
    )
    const upsertMany =
      mockFn<Database['privacyAnonymitySetEvent']['upsertMany']>().resolvesTo(
        26,
      )
    const indexer = makeIndexer({
      configuration,
      logs,
      getTransaction,
      repository: mockObject<Database['privacyAnonymitySetEvent']>({
        upsertMany,
      }),
    })

    const update = indexer.multiUpdate(from, to, [configuration])
    await new Promise<void>((resolve) => setImmediate(resolve))

    expect(getTransaction).toHaveBeenCalledTimes(25)

    firstBatch.resolve()
    const save = await update
    await save()

    expect(getTransaction).toHaveBeenCalledTimes(26)
    expect(upsertMany.calls[0]?.args[0]).toHaveLength(26)
  })

  // Two zk.money deposits batched in one transaction, served by an RPC mock
  // that plays the SIPA factory. The first is funded directly by FUNDER; the
  // second has no funding transfer in its part of the receipt, so its funder
  // cannot be traced.
  it('stores traced zk.money funders and drops deposits without one', async () => {
    const from = UnixTime.toStartOf(UnixTime(1_700_000_000), 'day')
    const to = from + UnixTime.DAY
    const timestamp = from + UnixTime.HOUR
    const FUNDER = EthereumAddress('0x71C7656EC7ab88b098defB751B7401B5f6d8976F')
    const traced = portalDeposit(1, { logIndex: 4 })
    const untraced = portalDeposit(2, { logIndex: 5 })
    const configuration = baseConfiguration(
      {
        event: DEPOSIT_TOPIC,
        extractor: 'zkMoneyDeposit',
        params: FUNDING_PARAMS,
      },
      PORTAL,
    )
    const upsertMany =
      mockFn<Database['privacyAnonymitySetEvent']['upsertMany']>().resolvesTo(1)
    const indexer = new PrivacyAnonymitySetIndexer(
      {
        chain: 'ethereum',
        configurations: [configuration],
        parents: [],
        indexerService: mockObject<IndexerService>({}),
        blockProvider: mockObject<BlockProvider>({
          getBlockTimestamps: mockFn().returnsOnce(
            new Map([[traced.blockNumber, timestamp]]),
          ),
        }),
        logsProvider: mockObject<LogsProvider>({
          getLogs: mockFn().returnsOnce([traced, untraced]),
        }),
        rpcClient: mockZkMoneyRpc({
          receipt: [
            transfer(FUNDER, PORTAL, FUNDED, { logIndex: 3 }),
            traced,
            untraced,
          ],
          implementation: EthereumAddress.ZERO,
        }),
        db: mockDatabase({
          privacyAnonymitySetEvent: mockObject<
            Database['privacyAnonymitySetEvent']
          >({ upsertMany }),
          privacyBlockTimestamp: blockTable(),
        }),
      },
      Logger.SILENT,
    )

    const save = await indexer.multiUpdate(from, to, [configuration])
    await save()

    expect(upsertMany).toHaveBeenOnlyCalledWith([
      {
        configurationId: 'config-1',
        projectId: 'project-1',
        bucketId: 'bucket-1',
        chain: 'ethereum',
        timestamp,
        blockNumber: traced.blockNumber,
        txHash: traced.transactionHash,
        logIndex: 4,
        sender: FUNDER.toString(),
        amount: FUNDED - BigInt(FUNDING_PARAMS.fundingCut),
      },
    ])
  })

  describe(PrivacyAnonymitySetIndexer.prototype.wipeData.name, () => {
    it('deletes all records for the given configurations', async () => {
      const deleteByConfigIds =
        mockFn<
          Database['privacyAnonymitySetEvent']['deleteByConfigIds']
        >().resolvesTo(3)
      const indexer = makeIdleIndexer(
        mockObject<Database['privacyAnonymitySetEvent']>({
          deleteByConfigIds,
        }),
      )

      await indexer.wipeData([{ id: 'config-1' }, { id: 'config-2' }])

      expect(deleteByConfigIds).toHaveBeenOnlyCalledWith([
        'config-1',
        'config-2',
      ])
    })
  })

  describe(PrivacyAnonymitySetIndexer.prototype.trimData.name, () => {
    it('deletes records for each configuration in the given time range', async () => {
      const deleteByConfigInTimeRange = mockFn<
        Database['privacyAnonymitySetEvent']['deleteByConfigInTimeRange']
      >()
        .resolvesToOnce(3)
        .resolvesToOnce(0)
      const indexer = makeIdleIndexer(
        mockObject<Database['privacyAnonymitySetEvent']>({
          deleteByConfigInTimeRange,
        }),
      )

      await indexer.trimData([
        { id: 'config-1', range: [100, 200] },
        { id: 'config-2', range: [300, 400] },
      ])

      expect(deleteByConfigInTimeRange).toHaveBeenNthCalledWith(
        1,
        'config-1',
        100,
        200,
      )
      expect(deleteByConfigInTimeRange).toHaveBeenNthCalledWith(
        2,
        'config-2',
        300,
        400,
      )
    })
  })

  describe(PrivacyAnonymitySetIndexer.idToConfigurationId.name, () => {
    it('keeps the existing configuration id', () => {
      expect(
        PrivacyAnonymitySetIndexer.idToConfigurationId({
          projectId: 'project-1',
          bucketId: 'bucket-1',
          chain: 'ethereum',
          address: POOL,
          event: FIXED_TOPIC,
          sinceTimestamp: UnixTime(0),
          extractor: 'fixedAmount',
          params: { amount: '1000000000000000000' },
        }),
      ).toEqual('c33ffb1b7442')
    })
  })
})

function makeIdleIndexer(
  repository: Database['privacyAnonymitySetEvent'],
): PrivacyAnonymitySetIndexer {
  return makeIndexer({
    configuration: fixedConfiguration('1'),
    logs: [],
    getTransaction: mockFn(),
    repository,
  })
}

function makeIndexer({
  configuration,
  logs,
  getTransaction,
  repository,
}: {
  configuration: Configuration<PrivacyAnonymitySetIndexerConfig>
  logs: Log[]
  getTransaction: IRpcClient['getTransaction']
  repository: Database['privacyAnonymitySetEvent']
}) {
  return new PrivacyAnonymitySetIndexer(
    {
      chain: 'ethereum',
      configurations: [configuration],
      parents: [],
      indexerService: mockObject<IndexerService>({}),
      blockProvider: mockObject<BlockProvider>({}),
      logsProvider: mockObject<LogsProvider>({
        getLogs: mockFn().returnsOnce(logs),
      }),
      rpcClient: mockObject<IRpcClient>({ getTransaction }),
      db: mockDatabase({
        privacyAnonymitySetEvent: repository,
        privacyBlockTimestamp: blockTable(),
      }),
    },
    Logger.SILENT,
  )
}

function blockTable(): Database['privacyBlockTimestamp'] {
  return mockObject<Database['privacyBlockTimestamp']>({
    findBlockNumberByChainAndTimestamp: mockFn().resolvesTo(100),
  })
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
  source: EvmPrivacyAnonymitySetSource,
  address = POOL,
): Configuration<PrivacyAnonymitySetIndexerConfig> {
  const properties = {
    id: 'config-1',
    projectId: 'project-1',
    bucketId: 'bucket-1',
    chain: 'ethereum',
    address,
    sinceTimestamp: UnixTime(0),
    ...source,
  } satisfies PrivacyAnonymitySetIndexerConfig

  return {
    id: 'config-1',
    minHeight: 0,
    maxHeight: null,
    properties,
  }
}

function makeLog({
  topics,
  data = '0x',
  timestamp,
  blockNumber = 100,
  transactionHash = TRANSACTION_HASH,
  logIndex = 7,
}: {
  topics: string[]
  data?: string
  timestamp: UnixTime
  blockNumber?: number
  transactionHash?: string
  logIndex?: number
}): Log {
  return {
    address: POOL.toString(),
    topics,
    data,
    blockNumber,
    blockHash: `0x${'cc'.repeat(32)}`,
    transactionHash,
    logIndex,
    blockTimestamp: timestamp,
  }
}

function makeTransaction(
  hash: string,
): Awaited<ReturnType<IRpcClient['getTransaction']>> {
  return {
    hash,
    value: undefined,
    from: TRANSACTION_SENDER.toString(),
    to: undefined,
    data: undefined,
    type: undefined,
    calls: undefined,
    blobVersionedHashes: undefined,
    blockNumber: 100,
  }
}

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((res) => {
    resolve = res
  })
  return { promise, resolve }
}
