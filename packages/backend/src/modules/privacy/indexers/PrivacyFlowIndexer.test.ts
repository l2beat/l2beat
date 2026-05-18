import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { BlockProvider, LogsProvider } from '@l2beat/shared'
import { EthereumAddress, type Log, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { Configuration } from '../../../tools/uif/multi/types'
import type { PrivacyFlowIndexerConfig } from '../types'
import { PrivacyFlowIndexer } from './PrivacyFlowIndexer'

const ADDRESS_A = EthereumAddress('0x1111111111111111111111111111111111111111')
const ADDRESS_B = EthereumAddress('0x2222222222222222222222222222222222222222')
const TOPIC_A =
  '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const TOPIC_B =
  '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'

describe(PrivacyFlowIndexer.name, () => {
  describe(PrivacyFlowIndexer.prototype.multiUpdate.name, () => {
    it('fetches logs, extracts records, and saves to DB', async () => {
      const from = UnixTime.toStartOf(UnixTime(0), 'day')
      const to = from + 5 * UnixTime.HOUR
      const blockTimestamp = from + UnixTime.HOUR

      const configs = [
        flowConfig({
          id: 'config-1',
          address: ADDRESS_A,
          event: TOPIC_A,
          priceId: 'ethereum',
          decimals: 18,
          fixedAmount: '1000000000000000000', // 1 ETH
        }),
      ]

      const log: Log = {
        address: ADDRESS_A.toString(),
        topics: [TOPIC_A],
        data: '0x',
        blockNumber: 100,
        blockHash: '0x',
        transactionHash: '0xtx1',
        logIndex: 0,
        blockTimestamp,
      }

      const logsProvider = mockObject<LogsProvider>({
        getLogs: mockFn().returnsOnce([log]),
      })

      const blockProvider = mockObject<BlockProvider>({
        getBlockTimestamps: mockFn(),
      })

      const privacyBlockTimestampRepo = mockObject<
        Database['privacyBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: mockFn()
          .returnsOnce(50)
          .returnsOnce(150),
      })

      const privacyPriceRepo = mockObject<Database['privacyPrice']>({
        getPricesByPriceIdsInRange: mockFn().returnsOnce([
          {
            priceId: 'ethereum',
            timestamp: UnixTime.toStartOf(blockTimestamp, 'hour'),
            priceUsd: 2000,
            configurationId: 'price-1',
          },
        ]),
      })

      const privacyFlowEventRepo = mockObject<Database['privacyFlowEvent']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new PrivacyFlowIndexer(
        {
          chain: 'ethereum',
          configurations: configs,
          blockProvider,
          logsProvider,
          db: mockDatabase({
            privacyBlockTimestamp: privacyBlockTimestampRepo,
            privacyPrice: privacyPriceRepo,
            privacyFlowEvent: privacyFlowEventRepo,
          }),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, configs)
      const safeHeight = await updateFn()

      expect(logsProvider.getLogs).toHaveBeenOnlyCalledWith(
        50,
        150,
        [ADDRESS_A.toString()],
        [TOPIC_A],
      )

      expect(blockProvider.getBlockTimestamps).not.toHaveBeenCalled()

      expect(privacyFlowEventRepo.upsertMany).toHaveBeenOnlyCalledWith([
        {
          configurationId: 'config-1',
          projectId: 'project-1',
          bucketId: 'bucket-1',
          chain: 'ethereum',
          direction: 'deposit',
          timestamp: blockTimestamp,
          blockNumber: 100,
          txHash: '0xtx1',
          logIndex: 0,
          count: 1,
          amount: 1_000_000_000_000_000_000n,
          priceId: 'ethereum',
          valueUsd: 2000,
        },
      ])

      // adjustedTo = min(toNext(from, 'day'), to). For 5-hour window inside a day,
      // adjustedTo === to.
      expect(safeHeight).toEqual(to)
    })

    it('clamps update window to next day boundary', async () => {
      const from = UnixTime.toStartOf(UnixTime.now(), 'day')
      const to = from + 36 * UnixTime.HOUR
      const expectedTo = from + UnixTime.DAY

      const configs = [
        flowConfig({
          id: 'config-1',
          address: ADDRESS_A,
          event: TOPIC_A,
          priceId: 'ethereum',
          decimals: 18,
          fixedAmount: '1',
        }),
      ]

      const logsProvider = mockObject<LogsProvider>({
        getLogs: mockFn().returnsOnce([]),
      })

      const privacyBlockTimestampRepo = mockObject<
        Database['privacyBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: mockFn()
          .returnsOnce(10)
          .returnsOnce(20),
      })

      const privacyFlowEventRepo = mockObject<Database['privacyFlowEvent']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new PrivacyFlowIndexer(
        {
          chain: 'ethereum',
          configurations: configs,
          blockProvider: mockObject<BlockProvider>({}),
          logsProvider,
          db: mockDatabase({
            privacyBlockTimestamp: privacyBlockTimestampRepo,
            privacyPrice: mockObject(),
            privacyFlowEvent: privacyFlowEventRepo,
          }),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, configs)
      const safeHeight = await updateFn()

      expect(safeHeight).toEqual(expectedTo)
    })

    it('skips log fetch when configurations slice is empty', async () => {
      const from = UnixTime.toStartOf(UnixTime.now(), 'hour')
      const to = from + UnixTime.HOUR

      const placeholder = flowConfig({
        id: 'config-1',
        address: ADDRESS_A,
        event: TOPIC_A,
        priceId: 'ethereum',
        decimals: 18,
        fixedAmount: '1',
      })

      const logsProvider = mockObject<LogsProvider>({
        getLogs: mockFn(),
      })
      const privacyFlowEventRepo = mockObject<Database['privacyFlowEvent']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new PrivacyFlowIndexer(
        {
          chain: 'ethereum',
          configurations: [placeholder],
          blockProvider: mockObject<BlockProvider>({}),
          logsProvider,
          db: mockDatabase({
            privacyBlockTimestamp: mockObject(),
            privacyPrice: mockObject(),
            privacyFlowEvent: privacyFlowEventRepo,
          }),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [])
      const safeHeight = await updateFn()

      expect(logsProvider.getLogs).not.toHaveBeenCalled()
      expect(privacyFlowEventRepo.upsertMany).toHaveBeenOnlyCalledWith([])
      expect(safeHeight).toEqual(to)
    })

    it('throws when block timestamp mapping is missing', async () => {
      const from = UnixTime.toStartOf(UnixTime.now(), 'hour')
      const to = from + UnixTime.HOUR

      const configs = [
        flowConfig({
          id: 'config-1',
          address: ADDRESS_A,
          event: TOPIC_A,
          priceId: 'ethereum',
          decimals: 18,
          fixedAmount: '1',
        }),
      ]

      const privacyBlockTimestampRepo = mockObject<
        Database['privacyBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: mockFn().returns(undefined),
      })

      const indexer = new PrivacyFlowIndexer(
        {
          chain: 'ethereum',
          configurations: configs,
          blockProvider: mockObject<BlockProvider>({}),
          logsProvider: mockObject<LogsProvider>({}),
          db: mockDatabase({
            privacyBlockTimestamp: privacyBlockTimestampRepo,
            privacyPrice: mockObject(),
            privacyFlowEvent: mockObject(),
          }),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      await expect(
        async () => await indexer.multiUpdate(from, to, configs),
      ).toBeRejectedWith('Missing block timestamp mapping')
    })

    it('queries blockProvider for logs without blockTimestamp', async () => {
      const from = UnixTime.toStartOf(UnixTime.now(), 'hour')
      const to = from + UnixTime.HOUR
      const blockTimestamp = from

      const configs = [
        flowConfig({
          id: 'config-1',
          address: ADDRESS_A,
          event: TOPIC_A,
          priceId: 'ethereum',
          decimals: 18,
          fixedAmount: '1000000000000000000',
        }),
      ]

      // Two logs in the same block + one in another block, none with
      // blockTimestamp. getBlockTimestamps must be called with deduped
      // block numbers.
      const logs: Log[] = [
        {
          address: ADDRESS_A.toString(),
          topics: [TOPIC_A],
          data: '0x',
          blockNumber: 100,
          blockHash: '0x',
          transactionHash: '0xtx1',
          logIndex: 0,
        },
        {
          address: ADDRESS_A.toString(),
          topics: [TOPIC_A],
          data: '0x',
          blockNumber: 100,
          blockHash: '0x',
          transactionHash: '0xtx2',
          logIndex: 1,
        },
        {
          address: ADDRESS_A.toString(),
          topics: [TOPIC_A],
          data: '0x',
          blockNumber: 200,
          blockHash: '0x',
          transactionHash: '0xtx3',
          logIndex: 0,
        },
      ]

      const logsProvider = mockObject<LogsProvider>({
        getLogs: mockFn().returnsOnce(logs),
      })

      const blockProvider = mockObject<BlockProvider>({
        getBlockTimestamps: mockFn().returnsOnce(
          new Map<number, UnixTime>([
            [100, blockTimestamp],
            [200, blockTimestamp],
          ]),
        ),
      })

      const privacyBlockTimestampRepo = mockObject<
        Database['privacyBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: mockFn()
          .returnsOnce(50)
          .returnsOnce(250),
      })

      const privacyPriceRepo = mockObject<Database['privacyPrice']>({
        getPricesByPriceIdsInRange: mockFn().returnsOnce([
          {
            priceId: 'ethereum',
            timestamp: UnixTime.toStartOf(blockTimestamp, 'hour'),
            priceUsd: 2000,
            configurationId: 'price-1',
          },
        ]),
      })

      const privacyFlowEventRepo = mockObject<Database['privacyFlowEvent']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new PrivacyFlowIndexer(
        {
          chain: 'ethereum',
          configurations: configs,
          blockProvider,
          logsProvider,
          db: mockDatabase({
            privacyBlockTimestamp: privacyBlockTimestampRepo,
            privacyPrice: privacyPriceRepo,
            privacyFlowEvent: privacyFlowEventRepo,
          }),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, configs)
      await updateFn()

      expect(blockProvider.getBlockTimestamps).toHaveBeenOnlyCalledWith([
        100, 200,
      ])
      expect(privacyFlowEventRepo.upsertMany).toHaveBeenCalledTimes(1)
    })

    it('skips logs that do not match any configuration', async () => {
      const from = UnixTime.toStartOf(UnixTime.now(), 'hour')
      const to = from + UnixTime.HOUR
      const blockTimestamp = from

      const configs = [
        flowConfig({
          id: 'config-1',
          address: ADDRESS_A,
          event: TOPIC_A,
          priceId: 'ethereum',
          decimals: 18,
          fixedAmount: '1',
        }),
      ]

      // Log with a different topic — must be filtered out.
      const mismatchedLog: Log = {
        address: ADDRESS_A.toString(),
        topics: [TOPIC_B],
        data: '0x',
        blockNumber: 100,
        blockHash: '0x',
        transactionHash: '0xtx1',
        logIndex: 0,
        blockTimestamp,
      }

      const logsProvider = mockObject<LogsProvider>({
        getLogs: mockFn().returnsOnce([mismatchedLog]),
      })

      const privacyBlockTimestampRepo = mockObject<
        Database['privacyBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: mockFn()
          .returnsOnce(50)
          .returnsOnce(150),
      })

      const privacyPriceRepo = mockObject<Database['privacyPrice']>({
        getPricesByPriceIdsInRange: mockFn(),
      })

      const privacyFlowEventRepo = mockObject<Database['privacyFlowEvent']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new PrivacyFlowIndexer(
        {
          chain: 'ethereum',
          configurations: configs,
          blockProvider: mockObject<BlockProvider>({}),
          logsProvider,
          db: mockDatabase({
            privacyBlockTimestamp: privacyBlockTimestampRepo,
            privacyPrice: privacyPriceRepo,
            privacyFlowEvent: privacyFlowEventRepo,
          }),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, configs)
      await updateFn()

      expect(privacyPriceRepo.getPricesByPriceIdsInRange).not.toHaveBeenCalled()
      expect(privacyFlowEventRepo.upsertMany).toHaveBeenOnlyCalledWith([])
    })

    it('computes valueUsd using decimals and price', async () => {
      const from = UnixTime.toStartOf(UnixTime.now(), 'hour')
      const to = from + UnixTime.HOUR
      const blockTimestamp = from

      const configs = [
        flowConfig({
          id: 'config-1',
          address: ADDRESS_A,
          event: TOPIC_A,
          priceId: 'usdc',
          decimals: 6, // 6-decimal token
          fixedAmount: '2500000', // 2.5 USDC
        }),
      ]

      const log: Log = {
        address: ADDRESS_A.toString(),
        topics: [TOPIC_A],
        data: '0x',
        blockNumber: 100,
        blockHash: '0x',
        transactionHash: '0xtx1',
        logIndex: 0,
        blockTimestamp,
      }

      const logsProvider = mockObject<LogsProvider>({
        getLogs: mockFn().returnsOnce([log]),
      })

      const privacyBlockTimestampRepo = mockObject<
        Database['privacyBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: mockFn()
          .returnsOnce(50)
          .returnsOnce(150),
      })

      const privacyPriceRepo = mockObject<Database['privacyPrice']>({
        getPricesByPriceIdsInRange: mockFn().returnsOnce([
          {
            priceId: 'usdc',
            timestamp: UnixTime.toStartOf(blockTimestamp, 'hour'),
            priceUsd: 1.01,
            configurationId: 'price-usdc',
          },
        ]),
      })

      const privacyFlowEventRepo = mockObject<Database['privacyFlowEvent']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new PrivacyFlowIndexer(
        {
          chain: 'ethereum',
          configurations: configs,
          blockProvider: mockObject<BlockProvider>({}),
          logsProvider,
          db: mockDatabase({
            privacyBlockTimestamp: privacyBlockTimestampRepo,
            privacyPrice: privacyPriceRepo,
            privacyFlowEvent: privacyFlowEventRepo,
          }),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, configs)
      await updateFn()

      const call = privacyFlowEventRepo.upsertMany.calls[0]?.args[0]
      expect(call?.length).toEqual(1)
      // 2.5 USDC * $1.01
      expect(call?.[0]?.valueUsd).toEqual(2.5 * 1.01)
      expect(call?.[0]?.amount).toEqual(2_500_000n)
    })

    it('throws when price is missing for raw record', async () => {
      const from = UnixTime.toStartOf(UnixTime.now(), 'hour')
      const to = from + UnixTime.HOUR
      const blockTimestamp = from

      const configs = [
        flowConfig({
          id: 'config-1',
          address: ADDRESS_A,
          event: TOPIC_A,
          priceId: 'ethereum',
          decimals: 18,
          fixedAmount: '1',
        }),
      ]

      const log: Log = {
        address: ADDRESS_A.toString(),
        topics: [TOPIC_A],
        data: '0x',
        blockNumber: 100,
        blockHash: '0x',
        transactionHash: '0xtx1',
        logIndex: 0,
        blockTimestamp,
      }

      const logsProvider = mockObject<LogsProvider>({
        getLogs: mockFn().returnsOnce([log]),
      })

      const privacyBlockTimestampRepo = mockObject<
        Database['privacyBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: mockFn()
          .returnsOnce(50)
          .returnsOnce(150),
      })

      const privacyPriceRepo = mockObject<Database['privacyPrice']>({
        getPricesByPriceIdsInRange: mockFn().returnsOnce([]),
      })

      const indexer = new PrivacyFlowIndexer(
        {
          chain: 'ethereum',
          configurations: configs,
          blockProvider: mockObject<BlockProvider>({}),
          logsProvider,
          db: mockDatabase({
            privacyBlockTimestamp: privacyBlockTimestampRepo,
            privacyPrice: privacyPriceRepo,
            privacyFlowEvent: mockObject(),
          }),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      await expect(async () => {
        const updateFn = await indexer.multiUpdate(from, to, configs)
        await updateFn()
      }).toBeRejectedWith('Missing price for ethereum')
    })

    it('throws when extractor fails on a single log', async () => {
      const from = UnixTime.toStartOf(UnixTime.now(), 'hour')
      const to = from + UnixTime.HOUR
      const blockTimestamp = from

      // privacyPoolsValue extractor tries to parse log data — this will throw
      // because we pass empty data. The indexer must propagate the error.
      const badConfig: Configuration<PrivacyFlowIndexerConfig> = {
        id: 'config-bad',
        minHeight: 0,
        maxHeight: null,
        properties: {
          id: 'config-bad',
          projectId: 'project-1',
          bucketId: 'bucket-1',
          direction: 'deposit',
          chain: 'ethereum',
          address: ADDRESS_A,
          event: TOPIC_A,
          sinceTimestamp: UnixTime(0),
          priceId: 'ethereum',
          decimals: 18,
          extractor: 'privacyPoolsValue',
          params: {},
        },
      }

      const log: Log = {
        address: ADDRESS_A.toString(),
        topics: [TOPIC_A],
        data: '0x',
        blockNumber: 100,
        blockHash: '0x',
        transactionHash: '0xtx1',
        logIndex: 0,
        blockTimestamp,
      }

      const logsProvider = mockObject<LogsProvider>({
        getLogs: mockFn().returnsOnce([log]),
      })

      const privacyBlockTimestampRepo = mockObject<
        Database['privacyBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: mockFn()
          .returnsOnce(50)
          .returnsOnce(150),
      })

      const indexer = new PrivacyFlowIndexer(
        {
          chain: 'ethereum',
          configurations: [badConfig],
          blockProvider: mockObject<BlockProvider>({}),
          logsProvider,
          db: mockDatabase({
            privacyBlockTimestamp: privacyBlockTimestampRepo,
            privacyPrice: mockObject(),
            privacyFlowEvent: mockObject(),
          }),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      await expect(
        async () => await indexer.multiUpdate(from, to, [badConfig]),
      ).toBeRejected()
    })

    it('groups logs and configurations by address + topic', async () => {
      const from = UnixTime.toStartOf(UnixTime.now(), 'hour')
      const to = from + UnixTime.HOUR
      const blockTimestamp = from

      const configA = flowConfig({
        id: 'config-A',
        address: ADDRESS_A,
        event: TOPIC_A,
        priceId: 'ethereum',
        decimals: 18,
        fixedAmount: '1',
      })
      const configB = flowConfig({
        id: 'config-B',
        address: ADDRESS_B,
        event: TOPIC_B,
        priceId: 'ethereum',
        decimals: 18,
        fixedAmount: '2',
      })

      const logA: Log = {
        address: ADDRESS_A.toString(),
        topics: [TOPIC_A],
        data: '0x',
        blockNumber: 100,
        blockHash: '0x',
        transactionHash: '0xtxA',
        logIndex: 0,
        blockTimestamp,
      }
      const logB: Log = {
        address: ADDRESS_B.toString(),
        topics: [TOPIC_B],
        data: '0x',
        blockNumber: 101,
        blockHash: '0x',
        transactionHash: '0xtxB',
        logIndex: 1,
        blockTimestamp,
      }

      const logsProvider = mockObject<LogsProvider>({
        getLogs: mockFn().returnsOnce([logA, logB]),
      })

      const privacyBlockTimestampRepo = mockObject<
        Database['privacyBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: mockFn()
          .returnsOnce(50)
          .returnsOnce(200),
      })

      const privacyPriceRepo = mockObject<Database['privacyPrice']>({
        getPricesByPriceIdsInRange: mockFn().returnsOnce([
          {
            priceId: 'ethereum',
            timestamp: UnixTime.toStartOf(blockTimestamp, 'hour'),
            priceUsd: 1,
            configurationId: 'price-1',
          },
        ]),
      })

      const privacyFlowEventRepo = mockObject<Database['privacyFlowEvent']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new PrivacyFlowIndexer(
        {
          chain: 'ethereum',
          configurations: [configA, configB],
          blockProvider: mockObject<BlockProvider>({}),
          logsProvider,
          db: mockDatabase({
            privacyBlockTimestamp: privacyBlockTimestampRepo,
            privacyPrice: privacyPriceRepo,
            privacyFlowEvent: privacyFlowEventRepo,
          }),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [configA, configB])
      await updateFn()

      const getLogsCall = logsProvider.getLogs.calls[0]?.args
      expect(new Set(getLogsCall?.[2])).toEqual(
        new Set([ADDRESS_A.toString(), ADDRESS_B.toString()]),
      )
      expect(new Set(getLogsCall?.[3])).toEqual(new Set([TOPIC_A, TOPIC_B]))

      const records = privacyFlowEventRepo.upsertMany.calls[0]?.args[0]
      expect(records?.length).toEqual(2)
      expect(records?.map((r) => r.configurationId).sort()).toEqual([
        'config-A',
        'config-B',
      ])
    })
  })

  describe(PrivacyFlowIndexer.prototype.removeData.name, () => {
    it('deletes records for each configuration in the given time range', async () => {
      const privacyFlowEventRepo = mockObject<Database['privacyFlowEvent']>({
        deleteByConfigInTimeRange: mockFn().returnsOnce(3).returnsOnce(0),
      })

      const placeholder = flowConfig({
        id: 'placeholder',
        address: ADDRESS_A,
        event: TOPIC_A,
        priceId: 'ethereum',
        decimals: 18,
        fixedAmount: '1',
      })

      const indexer = new PrivacyFlowIndexer(
        {
          chain: 'ethereum',
          configurations: [placeholder],
          blockProvider: mockObject<BlockProvider>({}),
          logsProvider: mockObject<LogsProvider>({}),
          db: mockDatabase({
            privacyBlockTimestamp: mockObject(),
            privacyPrice: mockObject(),
            privacyFlowEvent: privacyFlowEventRepo,
          }),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const removalConfigs = [
        { id: 'config-1', from: 100, to: 200 },
        { id: 'config-2', from: 300, to: 400 },
      ]

      await indexer.removeData(removalConfigs)

      expect(
        privacyFlowEventRepo.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(1, 'config-1', 100, 200)
      expect(
        privacyFlowEventRepo.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(2, 'config-2', 300, 400)
    })
  })

  describe(PrivacyFlowIndexer.idToConfigurationId.name, () => {
    it('is deterministic for the same input', () => {
      const props = {
        projectId: 'project-1',
        bucketId: 'bucket-1',
        direction: 'deposit' as const,
        chain: 'ethereum',
        address: ADDRESS_A,
        event: TOPIC_A,
        sinceTimestamp: UnixTime(0),
        priceId: 'ethereum',
        decimals: 18,
        extractor: 'fixedAmount' as const,
        params: { amount: '1000' },
      }
      expect(PrivacyFlowIndexer.idToConfigurationId(props)).toEqual(
        PrivacyFlowIndexer.idToConfigurationId(props),
      )
    })

    it('differs by direction', () => {
      const base = {
        projectId: 'project-1',
        bucketId: 'bucket-1',
        chain: 'ethereum',
        address: ADDRESS_A,
        event: TOPIC_A,
        sinceTimestamp: UnixTime(0),
        priceId: 'ethereum',
        decimals: 18,
        extractor: 'fixedAmount' as const,
        params: { amount: '1000' },
      }
      expect(
        PrivacyFlowIndexer.idToConfigurationId({
          ...base,
          direction: 'deposit',
        }),
      ).not.toEqual(
        PrivacyFlowIndexer.idToConfigurationId({
          ...base,
          direction: 'withdrawal',
        }),
      )
    })

    it('differs by params', () => {
      const base = {
        projectId: 'project-1',
        bucketId: 'bucket-1',
        direction: 'deposit' as const,
        chain: 'ethereum',
        address: ADDRESS_A,
        event: TOPIC_A,
        sinceTimestamp: UnixTime(0),
        priceId: 'ethereum',
        decimals: 18,
        extractor: 'fixedAmount' as const,
      }
      expect(
        PrivacyFlowIndexer.idToConfigurationId({
          ...base,
          params: { amount: '1000' },
        }),
      ).not.toEqual(
        PrivacyFlowIndexer.idToConfigurationId({
          ...base,
          params: { amount: '2000' },
        }),
      )
    })
  })

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })
})

function flowConfig(opts: {
  id: string
  address: EthereumAddress
  event: string
  priceId: string
  decimals: number
  fixedAmount: string
}): Configuration<PrivacyFlowIndexerConfig> {
  return {
    id: opts.id,
    minHeight: 0,
    maxHeight: null,
    properties: {
      id: opts.id,
      projectId: 'project-1',
      bucketId: 'bucket-1',
      direction: 'deposit',
      chain: 'ethereum',
      address: opts.address,
      event: opts.event,
      sinceTimestamp: UnixTime(0),
      priceId: opts.priceId,
      decimals: opts.decimals,
      extractor: 'fixedAmount',
      params: { amount: opts.fixedAmount },
    },
  }
}
