import { Logger } from '@l2beat/backend-tools'
import type { PrivacyAnonymitySetDepositSource } from '@l2beat/config'
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
import { ERC20_TRANSFER_TOPIC, erc20Interface } from '../utils/erc20'
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
      timestamps: new Map([[log.blockNumber, timestamp]]),
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

  it('counts the funder of a one-time deposit address as the depositor', async () => {
    const from = UnixTime.toStartOf(UnixTime(1_700_000_000), 'day')
    const to = from + UnixTime.DAY
    const timestamp = from + UnixTime.HOUR
    const token = EthereumAddress('0x4444444444444444444444444444444444444444')
    const funded = EthereumAddress('0x5555555555555555555555555555555555555555')
    const unfunded = EthereumAddress(
      '0x6666666666666666666666666666666666666666',
    )
    const funder = EthereumAddress('0x7777777777777777777777777777777777777777')
    const swapPool = EthereumAddress(
      '0x8888888888888888888888888888888888888888',
    )
    const unfundedHash = `0x${'dd'.repeat(32)}`
    const transfer = (
      fromAddress: EthereumAddress,
      toAddress: EthereumAddress,
      log: { blockNumber: number; transactionHash: string; logIndex: number },
    ): Log => ({
      ...makeLog({
        ...erc20Interface.encodeEventLog('Transfer', [
          fromAddress.toString(),
          toAddress.toString(),
          10_000_000_000_000_000_000n,
        ]),
        timestamp,
        ...log,
      }),
      address: token.toString(),
    })
    const configuration = baseConfiguration({
      event: ERC20_TRANSFER_TOPIC,
      extractor: 'erc20Transfer',
      params: { to: POOL },
    })
    configuration.properties = {
      ...configuration.properties,
      address: token,
      topics: [null, utils.hexZeroPad(POOL, 32).toLowerCase()],
      fundingTokens: [token],
    }
    const deposits = [
      transfer(funded, POOL, {
        blockNumber: 100,
        transactionHash: TRANSACTION_HASH,
        logIndex: 7,
      }),
      transfer(unfunded, POOL, {
        blockNumber: 100,
        transactionHash: unfundedHash,
        logIndex: 9,
      }),
    ]
    const fundings = [
      // Swap output inside the deposit transaction is not a funding.
      transfer(swapPool, funded, {
        blockNumber: 100,
        transactionHash: TRANSACTION_HASH,
        logIndex: 5,
      }),
      transfer(funder, funded, {
        blockNumber: 90,
        transactionHash: `0x${'ee'.repeat(32)}`,
        logIndex: 1,
      }),
    ]
    const logsProvider = mockObject<LogsProvider>({
      getLogs: mockFn().returnsOnce(deposits).returnsOnce(fundings),
    })
    const upsertMany =
      mockFn<Database['privacyAnonymitySetEvent']['upsertMany']>().resolvesTo(1)
    const indexer = new PrivacyAnonymitySetIndexer(
      {
        chain: 'ethereum',
        configurations: [configuration],
        parents: [],
        indexerService: mockObject<IndexerService>({}),
        blockTimestampProvider: mockObject<BlockTimestampProvider>({
          getBlockNumberAtOrBefore: mockFn()
            .returnsOnce(50)
            .returnsOnce(150)
            .returnsOnce(10),
        }),
        blockProvider: mockObject<BlockProvider>({
          getBlockTimestamps: mockFn().returnsOnce(new Map([[100, timestamp]])),
        }),
        logsProvider,
        rpcClient: mockObject<IRpcClient>({ getTransaction: mockFn() }),
        db: mockDatabase({
          privacyAnonymitySetEvent: mockObject<
            Database['privacyAnonymitySetEvent']
          >({ upsertMany }),
        }),
      },
      Logger.SILENT,
    )

    const save = await indexer.multiUpdate(from, to, [configuration])
    await save()

    expect(logsProvider.getLogs).toHaveBeenNthCalledWith(
      1,
      50,
      150,
      [token.toString()],
      [[ERC20_TRANSFER_TOPIC], null, utils.hexZeroPad(POOL, 32).toLowerCase()],
    )
    expect(logsProvider.getLogs).toHaveBeenNthCalledWith(
      2,
      10,
      150,
      [token.toString()],
      [
        [ERC20_TRANSFER_TOPIC],
        null,
        [funded, unfunded].map((address) =>
          utils.hexZeroPad(address.toLowerCase(), 32),
        ),
      ],
    )
    expect(upsertMany).toHaveBeenOnlyCalledWith([
      expect.subset({ txHash: TRANSACTION_HASH, sender: funder.toString() }),
      expect.subset({ txHash: unfundedHash, sender: unfunded.toString() }),
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
      repository: mockObject<Database['privacyAnonymitySetEvent']>({
        upsertMany,
      }),
    })

    const save = await indexer.multiUpdate(from, from + 36 * UnixTime.HOUR, [
      configuration,
    ])

    expect(await save()).toEqual(from + UnixTime.DAY)
  })

  it('does not fetch transaction senders for boundary logs outside the range', async () => {
    const from = UnixTime.toStartOf(UnixTime(1_700_000_000), 'day')
    const to = from + UnixTime.DAY
    const timestamp = from - 1
    const configuration = fixedConfiguration('1')
    const log = makeLog({ topics: [FIXED_TOPIC], timestamp })
    const getTransaction = mockFn<IRpcClient['getTransaction']>()
    const upsertMany =
      mockFn<Database['privacyAnonymitySetEvent']['upsertMany']>().resolvesTo(0)
    const indexer = makeIndexer({
      configuration,
      logs: [log],
      timestamps: new Map([[log.blockNumber, timestamp]]),
      getTransaction,
      repository: mockObject<Database['privacyAnonymitySetEvent']>({
        upsertMany,
      }),
    })

    const save = await indexer.multiUpdate(from, to, [configuration])
    await save()

    expect(getTransaction).not.toHaveBeenCalled()
    expect(upsertMany).toHaveBeenOnlyCalledWith([])
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
      timestamps: new Map([[100, timestamp]]),
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
    timestamps: new Map(),
    getTransaction: mockFn(),
    repository,
  })
}

function makeIndexer({
  configuration,
  logs,
  timestamps,
  getTransaction,
  repository,
}: {
  configuration: Configuration<PrivacyAnonymitySetIndexerConfig>
  logs: Log[]
  timestamps: Map<number, UnixTime>
  getTransaction: IRpcClient['getTransaction']
  repository: Database['privacyAnonymitySetEvent']
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
        privacyAnonymitySetEvent: repository,
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
  source: PrivacyAnonymitySetDepositSource,
): Configuration<PrivacyAnonymitySetIndexerConfig> {
  const properties = {
    id: 'config-1',
    projectId: 'project-1',
    bucketId: 'bucket-1',
    chain: 'ethereum',
    address: POOL,
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
