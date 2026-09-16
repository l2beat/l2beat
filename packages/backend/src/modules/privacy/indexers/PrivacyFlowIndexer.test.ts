import { Logger } from '@l2beat/backend-tools'
import type { PrivacyFlowExtractorConfig } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import type { BlockProvider, LogsProvider } from '@l2beat/shared'
import { EthereumAddress, type Log, UnixTime } from '@l2beat/shared-pure'
import { mockObject } from '@l2beat/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { Configuration } from '../../../tools/uif/multi/types'
import type { PrivacyFlowIndexerConfig, PrivacyLogTopicFilter } from '../types'
import { ERC20_TRANSFER_TOPIC, erc20Interface } from '../utils/erc20'
import { PrivacyFlowIndexer } from './PrivacyFlowIndexer'

const ADDRESS_A = EthereumAddress('0x1111111111111111111111111111111111111111')
const ADDRESS_B = EthereumAddress('0x2222222222222222222222222222222222222222')
const TOPIC_A =
  '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const TOPIC_B =
  '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
const POOL = EthereumAddress('0x3333333333333333333333333333333333333333')
const USER = EthereumAddress('0x4444444444444444444444444444444444444444')
const POOL_TOPIC = `0x${'00'.repeat(12)}${POOL.slice(2).toLowerCase()}`

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
        getLogs: vi.fn().mockReturnValueOnce([log]),
      })

      const blockProvider = mockObject<BlockProvider>({
        getBlockTimestamps: vi.fn(),
      })

      const privacyBlockTimestampRepo = mockObject<
        Database['privacyBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: vi
          .fn()
          .mockReturnValueOnce(50)
          .mockReturnValueOnce(150),
      })

      const privacyPriceRepo = mockObject<Database['privacyPrice']>({
        getPricesByPriceIdsInRange: vi.fn().mockReturnValueOnce([
          {
            priceId: 'ethereum',
            timestamp: UnixTime.toStartOf(blockTimestamp, 'hour'),
            priceUsd: 2000,
            configurationId: 'price-1',
          },
        ]),
      })

      const privacyFlowEventRepo = mockObject<Database['privacyFlowEvent']>({
        upsertMany: vi.fn().mockReturnValueOnce(undefined),
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

      expect(logsProvider.getLogs).toHaveBeenCalledExactlyOnceWith(
        50,
        150,
        [ADDRESS_A.toString()],
        [[TOPIC_A]],
      )

      expect(blockProvider.getBlockTimestamps).not.toHaveBeenCalled()

      expect(privacyFlowEventRepo.upsertMany).toHaveBeenCalledExactlyOnceWith([
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
      expect(safeHeight).toStrictEqual(to)
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
        getLogs: vi.fn().mockReturnValueOnce([]),
      })

      const privacyBlockTimestampRepo = mockObject<
        Database['privacyBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: vi
          .fn()
          .mockReturnValueOnce(10)
          .mockReturnValueOnce(20),
      })

      const privacyFlowEventRepo = mockObject<Database['privacyFlowEvent']>({
        upsertMany: vi.fn().mockReturnValueOnce(undefined),
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

      expect(safeHeight).toStrictEqual(expectedTo)
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
        getLogs: vi.fn(),
      })
      const privacyFlowEventRepo = mockObject<Database['privacyFlowEvent']>({
        upsertMany: vi.fn().mockReturnValueOnce(undefined),
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
      expect(privacyFlowEventRepo.upsertMany).toHaveBeenCalledExactlyOnceWith(
        [],
      )
      expect(safeHeight).toStrictEqual(to)
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
        findBlockNumberByChainAndTimestamp: vi.fn().mockReturnValue(undefined),
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
      ).rejects.toThrow('Missing block timestamp mapping')
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
        getLogs: vi.fn().mockReturnValueOnce(logs),
      })

      const blockProvider = mockObject<BlockProvider>({
        getBlockTimestamps: vi.fn().mockReturnValueOnce(
          new Map<number, UnixTime>([
            [100, blockTimestamp],
            [200, blockTimestamp],
          ]),
        ),
      })

      const privacyBlockTimestampRepo = mockObject<
        Database['privacyBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: vi
          .fn()
          .mockReturnValueOnce(50)
          .mockReturnValueOnce(250),
      })

      const privacyPriceRepo = mockObject<Database['privacyPrice']>({
        getPricesByPriceIdsInRange: vi.fn().mockReturnValueOnce([
          {
            priceId: 'ethereum',
            timestamp: UnixTime.toStartOf(blockTimestamp, 'hour'),
            priceUsd: 2000,
            configurationId: 'price-1',
          },
        ]),
      })

      const privacyFlowEventRepo = mockObject<Database['privacyFlowEvent']>({
        upsertMany: vi.fn().mockReturnValueOnce(undefined),
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

      expect(blockProvider.getBlockTimestamps).toHaveBeenCalledExactlyOnceWith([
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
        getLogs: vi.fn().mockReturnValueOnce([mismatchedLog]),
      })

      const privacyBlockTimestampRepo = mockObject<
        Database['privacyBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: vi
          .fn()
          .mockReturnValueOnce(50)
          .mockReturnValueOnce(150),
      })

      const privacyPriceRepo = mockObject<Database['privacyPrice']>({
        getPricesByPriceIdsInRange: vi.fn(),
      })

      const privacyFlowEventRepo = mockObject<Database['privacyFlowEvent']>({
        upsertMany: vi.fn().mockReturnValueOnce(undefined),
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
      expect(privacyFlowEventRepo.upsertMany).toHaveBeenCalledExactlyOnceWith(
        [],
      )
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
        getLogs: vi.fn().mockReturnValueOnce([log]),
      })

      const privacyBlockTimestampRepo = mockObject<
        Database['privacyBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: vi
          .fn()
          .mockReturnValueOnce(50)
          .mockReturnValueOnce(150),
      })

      const privacyPriceRepo = mockObject<Database['privacyPrice']>({
        getPricesByPriceIdsInRange: vi.fn().mockReturnValueOnce([
          {
            priceId: 'usdc',
            timestamp: UnixTime.toStartOf(blockTimestamp, 'hour'),
            priceUsd: 1.01,
            configurationId: 'price-usdc',
          },
        ]),
      })

      const privacyFlowEventRepo = mockObject<Database['privacyFlowEvent']>({
        upsertMany: vi.fn().mockReturnValueOnce(undefined),
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

      const call = privacyFlowEventRepo.upsertMany.mock.calls[0][0]
      expect(call?.length).toStrictEqual(1)
      // 2.5 USDC * $1.01
      expect(call?.[0]?.valueUsd).toStrictEqual(2.5 * 1.01)
      expect(call?.[0]?.amount).toStrictEqual(2_500_000n)
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
        getLogs: vi.fn().mockReturnValueOnce([log]),
      })

      const privacyBlockTimestampRepo = mockObject<
        Database['privacyBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: vi
          .fn()
          .mockReturnValueOnce(50)
          .mockReturnValueOnce(150),
      })

      const privacyPriceRepo = mockObject<Database['privacyPrice']>({
        getPricesByPriceIdsInRange: vi.fn().mockReturnValueOnce([]),
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
      }).rejects.toThrow('Missing price for ethereum')
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
        getLogs: vi.fn().mockReturnValueOnce([log]),
      })

      const privacyBlockTimestampRepo = mockObject<
        Database['privacyBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: vi
          .fn()
          .mockReturnValueOnce(50)
          .mockReturnValueOnce(150),
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
      ).rejects.toThrow()
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
        getLogs: vi.fn().mockReturnValueOnce([logA, logB]),
      })

      const privacyBlockTimestampRepo = mockObject<
        Database['privacyBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: vi
          .fn()
          .mockReturnValueOnce(50)
          .mockReturnValueOnce(200),
      })

      const privacyPriceRepo = mockObject<Database['privacyPrice']>({
        getPricesByPriceIdsInRange: vi.fn().mockReturnValueOnce([
          {
            priceId: 'ethereum',
            timestamp: UnixTime.toStartOf(blockTimestamp, 'hour'),
            priceUsd: 1,
            configurationId: 'price-1',
          },
        ]),
      })

      const privacyFlowEventRepo = mockObject<Database['privacyFlowEvent']>({
        upsertMany: vi.fn().mockReturnValueOnce(undefined),
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

      const getLogsCall = logsProvider.getLogs.mock.calls[0]
      expect(new Set(getLogsCall?.[2])).toStrictEqual(
        new Set([ADDRESS_A.toString(), ADDRESS_B.toString()]),
      )
      expect(new Set(getLogsCall?.[3]?.[0])).toStrictEqual(
        new Set([TOPIC_A, TOPIC_B]),
      )

      const records = privacyFlowEventRepo.upsertMany.mock.calls[0][0]
      expect(records?.length).toStrictEqual(2)
      expect(records?.map((r) => r.configurationId).sort()).toStrictEqual([
        'config-A',
        'config-B',
      ])
    })
  })

  describe('topic filters', () => {
    it('queries each topic filter group separately and matches within the group', async () => {
      const from = UnixTime.toStartOf(UnixTime(0), 'day')
      const to = from + 5 * UnixTime.HOUR
      const blockTimestamp = from + UnixTime.HOUR

      const fixedConfig = flowConfig({
        id: 'config-fixed',
        address: ADDRESS_A,
        event: TOPIC_A,
        priceId: 'ethereum',
        decimals: 18,
        fixedAmount: '1',
      })
      const depositConfig = transferConfig({
        id: 'config-deposit',
        direction: 'deposit',
        params: { to: POOL },
        topics: [null, POOL_TOPIC],
      })
      const withdrawalConfig = transferConfig({
        id: 'config-withdrawal',
        direction: 'withdrawal',
        params: { from: POOL },
        topics: [POOL_TOPIC],
      })
      const configs = [fixedConfig, depositConfig, withdrawalConfig]

      const fixedLog: Log = {
        address: ADDRESS_A.toString(),
        topics: [TOPIC_A],
        data: '0x',
        blockNumber: 100,
        blockHash: '0x',
        transactionHash: '0xtx1',
        logIndex: 0,
        blockTimestamp,
      }
      const depositLog = transferLog(USER, POOL, 10n, '0xtx2', blockTimestamp)
      const withdrawalLog = transferLog(POOL, USER, 7n, '0xtx3', blockTimestamp)

      const logsProvider = mockObject<LogsProvider>({
        getLogs: vi
          .fn()
          .mockReturnValueOnce([fixedLog])
          .mockReturnValueOnce([depositLog])
          .mockReturnValueOnce([withdrawalLog]),
      })
      const privacyBlockTimestampRepo = mockObject<
        Database['privacyBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: vi
          .fn()
          .mockReturnValueOnce(50)
          .mockReturnValueOnce(150),
      })
      const privacyPriceRepo = mockObject<Database['privacyPrice']>({
        getPricesByPriceIdsInRange: vi.fn().mockReturnValueOnce([
          {
            priceId: 'ethereum',
            timestamp: UnixTime.toStartOf(blockTimestamp, 'hour'),
            priceUsd: 1,
            configurationId: 'price-1',
          },
        ]),
      })
      const privacyFlowEventRepo = mockObject<Database['privacyFlowEvent']>({
        upsertMany: vi.fn().mockReturnValueOnce(undefined),
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

      expect(logsProvider.getLogs).toHaveBeenNthCalledWith(
        1,
        50,
        150,
        [ADDRESS_A.toString()],
        [[TOPIC_A]],
      )
      expect(logsProvider.getLogs).toHaveBeenNthCalledWith(
        2,
        50,
        150,
        [ADDRESS_B.toString()],
        [[ERC20_TRANSFER_TOPIC], null, POOL_TOPIC],
      )
      expect(logsProvider.getLogs).toHaveBeenNthCalledWith(
        3,
        50,
        150,
        [ADDRESS_B.toString()],
        [[ERC20_TRANSFER_TOPIC], POOL_TOPIC],
      )

      const records = privacyFlowEventRepo.upsertMany.mock.calls[0][0]
      expect(
        records?.map((r) => [r.configurationId, r.direction, r.amount]),
      ).toStrictEqual([
        ['config-fixed', 'deposit', 1n],
        ['config-deposit', 'deposit', 10n],
        ['config-withdrawal', 'withdrawal', 7n],
      ])
    })
  })

  describe(PrivacyFlowIndexer.prototype.trimData.name, () => {
    it('deletes records for each configuration in the given time range', async () => {
      const privacyFlowEventRepo = mockObject<Database['privacyFlowEvent']>({
        deleteByConfigInTimeRange: vi
          .fn()
          .mockReturnValueOnce(3)
          .mockReturnValueOnce(0),
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
        { id: 'config-1', range: [100, 200] as [number, number] },
        { id: 'config-2', range: [300, 400] as [number, number] },
      ]

      await indexer.trimData(removalConfigs)

      expect(
        privacyFlowEventRepo.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(1, 'config-1', 100, 200)
      expect(
        privacyFlowEventRepo.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(2, 'config-2', 300, 400)
    })
  })

  describe(PrivacyFlowIndexer.prototype.wipeData.name, () => {
    it('deletes all records for the given configurations', async () => {
      const privacyFlowEventRepo = mockObject<Database['privacyFlowEvent']>({
        deleteByConfigIds: vi.fn().mockReturnValue(3),
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

      await indexer.wipeData([{ id: 'config-1' }, { id: 'config-2' }])

      expect(
        privacyFlowEventRepo.deleteByConfigIds,
      ).toHaveBeenCalledExactlyOnceWith(['config-1', 'config-2'])
    })
  })

  describe(PrivacyFlowIndexer.idToConfigurationId.name, () => {
    it('keeps the existing configuration id', () => {
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
      expect(PrivacyFlowIndexer.idToConfigurationId(props)).toStrictEqual(
        '30b264b834f9',
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
      ).not.toStrictEqual(
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
      ).not.toStrictEqual(
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

function transferConfig(opts: {
  id: string
  direction: 'deposit' | 'withdrawal'
  params: Extract<
    PrivacyFlowExtractorConfig,
    { extractor: 'erc20Transfer' }
  >['params']
  topics: PrivacyLogTopicFilter
}): Configuration<PrivacyFlowIndexerConfig> {
  return {
    id: opts.id,
    minHeight: 0,
    maxHeight: null,
    properties: {
      id: opts.id,
      projectId: 'project-1',
      bucketId: 'bucket-1',
      direction: opts.direction,
      chain: 'ethereum',
      address: ADDRESS_B,
      event: ERC20_TRANSFER_TOPIC,
      topics: opts.topics,
      sinceTimestamp: UnixTime(0),
      priceId: 'ethereum',
      decimals: 18,
      extractor: 'erc20Transfer',
      params: opts.params,
    },
  }
}

function transferLog(
  from: EthereumAddress,
  to: EthereumAddress,
  value: bigint,
  transactionHash: string,
  blockTimestamp: number,
): Log {
  const encoded = erc20Interface.encodeEventLog('Transfer', [from, to, value])
  return {
    address: ADDRESS_B.toString(),
    topics: encoded.topics,
    data: encoded.data,
    blockNumber: 100,
    blockHash: '0x',
    transactionHash,
    logIndex: 0,
    blockTimestamp,
  }
}

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
