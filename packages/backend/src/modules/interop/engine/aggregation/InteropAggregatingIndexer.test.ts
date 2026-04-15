import { Logger } from '@l2beat/backend-tools'
import type {
  AggregatedInteropTokenRecord,
  AggregatedInteropTokensPairRecord,
  AggregatedInteropTransferRecord,
  Database,
  InteropTransferRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { InteropAggregationConfig } from '../../../../config/features/interop'
import { mockDatabase } from '../../../../test/database'
import type { IndexerService } from '../../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../../tools/uif/ids'
import type { InteropNotifier } from '../notifications/InteropNotifier'
import type { InteropSyncersManager } from '../sync/InteropSyncersManager'
import { InteropAggregatingIndexer } from './InteropAggregatingIndexer'
import {
  DefaultInteropAggregationAnalyzer,
  type InteropAggregationAnalyzer,
} from './InteropAggregationAnalyzer'
import type { InteropAggregationService } from './InteropAggregationService'

describe(InteropAggregatingIndexer.name, () => {
  const to = 1768484645
  const from = to - UnixTime.DAY
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(InteropAggregatingIndexer.prototype.update.name, () => {
    it('fetches transfers, aggregates via service, and saves to database', async () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer('across', 'msg1', 'deposit', to - UnixTime.HOUR, {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
        }),
      ]

      const configs: InteropAggregationConfig[] = [
        {
          id: 'config1',
          plugins: [{ plugin: 'across', bridgeType: 'lockAndMint' }],
          type: 'other',
        },
      ]

      const aggregatedTransfers: AggregatedInteropTransferRecord[] = [
        {
          timestamp: to,
          id: 'config1',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 1,
          transfersWithDurationCount: 1,
          totalDurationSum: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
          minTransferValueUsd: 2000,
          maxTransferValueUsd: 2000,
          avgValueInFlight: undefined,
          transferTypeStats: undefined,
          mintedValueUsd: 0,
          burnedValueUsd: 2000,
          countUnder100: 0,
          count100To1K: 0,
          count1KTo10K: 1,
          count10KTo100K: 0,
          countOver100K: 0,
          identifiedCount: 1,
          bridgeType: 'lockAndMint',
        },
      ]

      const aggregatedTokens: AggregatedInteropTokenRecord[] = [
        {
          timestamp: to,
          id: 'config1',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'eth',
          transferCount: 1,
          transfersWithDurationCount: 1,
          transferTypeStats: undefined,
          totalDurationSum: 5000,
          volume: 2000,
          minTransferValueUsd: 2000,
          maxTransferValueUsd: 2000,
          bridgeType: 'lockAndMint',
          mintedValueUsd: 0,
          burnedValueUsd: 2000,
        },
      ]

      const aggregatedTokensPairs: AggregatedInteropTokensPairRecord[] = [
        {
          timestamp: to,
          id: 'config1',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          tokenA: 'eth___',
          tokenB: 'eth___',
          transferCount: 1,
          transfersWithDurationCount: 1,
          transferTypeStats: undefined,
          totalDurationSum: 5000,
          volume: 2000,
          minTransferValueUsd: 2000,
          maxTransferValueUsd: 2000,
          bridgeType: 'lockAndMint',
        },
      ]

      const interopTransfer = mockObject<Database['interopTransfer']>({
        getByRange: mockFn().resolvesTo(transfers),
      })

      const aggregatedInteropTransfer = mockObject<
        Database['aggregatedInteropTransfer']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(1),
      })
      const aggregatedInteropToken = mockObject<
        Database['aggregatedInteropToken']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(1),
      })
      const aggregatedInteropTokensPair = mockObject<
        Database['aggregatedInteropTokensPair']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(1),
      })

      const transaction = mockFn(async (fn: any) => await fn())

      const db = mockDatabase({
        transaction,
        interopTransfer,
        aggregatedInteropTransfer,
        aggregatedInteropToken,
        aggregatedInteropTokensPair,
      })
      const syncersManager = mockObject<InteropSyncersManager>({
        areAllSyncersFollowing: mockFn().returns(true),
      })

      const aggregationService = mockObject<InteropAggregationService>({
        aggregate: mockFn().returns({
          aggregatedTransfers,
          aggregatedTokens,
          aggregatedTokensPairs,
          warnings: [],
        }),
      })

      const indexer = new InteropAggregatingIndexer(
        {
          db,
          configs,
          aggregationService,
          syncersManager,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
          minHeight: 0,
        },
        Logger.SILENT,
      )

      const result = await indexer.update(from, to)

      expect(result).toEqual(to)
      expect(interopTransfer.getByRange).toHaveBeenCalledWith(from, to)
      expect(aggregationService.aggregate).toHaveBeenCalledWith(
        transfers,
        configs,
        to,
      )
      expect(transaction).toHaveBeenCalledTimes(1)
      expect(
        aggregatedInteropTransfer.deleteAllButEarliestPerDayBefore,
      ).toHaveBeenCalledWith(from)
      expect(aggregatedInteropTransfer.deleteByTimestamp).toHaveBeenCalledWith(
        to,
      )
      expect(aggregatedInteropTransfer.insertMany).toHaveBeenCalledWith(
        aggregatedTransfers,
      )
      expect(aggregatedInteropToken.insertMany).toHaveBeenCalledWith(
        aggregatedTokens,
      )
      expect(
        aggregatedInteropToken.deleteAllButEarliestPerDayBefore,
      ).toHaveBeenCalledWith(from)
      expect(aggregatedInteropToken.deleteByTimestamp).toHaveBeenCalledWith(to)
      expect(aggregatedInteropTokensPair.insertMany).toHaveBeenCalledWith(
        aggregatedTokensPairs,
      )
      expect(
        aggregatedInteropTokensPair.deleteAllButEarliestPerDayBefore,
      ).toHaveBeenCalledWith(from)
      expect(
        aggregatedInteropTokensPair.deleteByTimestamp,
      ).toHaveBeenCalledWith(to)
    })

    it('handles empty transfers correctly', async () => {
      const transfers: InteropTransferRecord[] = []

      const configs: InteropAggregationConfig[] = [
        {
          id: 'config1',
          plugins: [{ plugin: 'across', bridgeType: 'lockAndMint' }],
          type: 'other',
        },
      ]

      const interopTransfer = mockObject<Database['interopTransfer']>({
        getByRange: mockFn().resolvesTo(transfers),
      })

      const aggregatedInteropTransfer = mockObject<
        Database['aggregatedInteropTransfer']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(0),
      })
      const aggregatedInteropToken = mockObject<
        Database['aggregatedInteropToken']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(0),
      })
      const aggregatedInteropTokensPair = mockObject<
        Database['aggregatedInteropTokensPair']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(0),
      })

      const transaction = mockFn(async (fn: any) => await fn())

      const db = mockDatabase({
        transaction,
        interopTransfer,
        aggregatedInteropTransfer,
        aggregatedInteropToken,
        aggregatedInteropTokensPair,
      })
      const syncersManager = mockObject<InteropSyncersManager>({
        areAllSyncersFollowing: mockFn().returns(true),
      })

      const aggregationService = mockObject<InteropAggregationService>({
        aggregate: mockFn().returns({
          aggregatedTransfers: [],
          aggregatedTokens: [],
          aggregatedTokensPairs: [],
          warnings: [],
        }),
      })

      const indexer = new InteropAggregatingIndexer(
        {
          db,
          configs,
          aggregationService,
          syncersManager,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
          minHeight: 0,
        },
        Logger.SILENT,
      )

      const result = await indexer.update(from, to)

      expect(result).toEqual(to)
      expect(aggregationService.aggregate).toHaveBeenCalledWith(
        transfers,
        configs,
        to,
      )
      expect(aggregatedInteropTransfer.insertMany).toHaveBeenCalledWith([])
      expect(aggregatedInteropToken.insertMany).toHaveBeenCalledWith([])
      expect(aggregatedInteropTokensPair.insertMany).toHaveBeenCalledWith([])
    })

    it('skips aggregation when not all syncers are following', async () => {
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getByRange: mockFn().resolvesTo([]),
      })
      const aggregatedInteropTransfer = mockObject<
        Database['aggregatedInteropTransfer']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(0),
      })
      const aggregatedInteropToken = mockObject<
        Database['aggregatedInteropToken']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(0),
      })
      const transaction = mockFn(async (fn: any) => await fn())
      const db = mockDatabase({
        transaction,
        interopTransfer,
        aggregatedInteropTransfer,
        aggregatedInteropToken,
      })
      const syncersManager = mockObject<InteropSyncersManager>({
        areAllSyncersFollowing: mockFn().returns(false),
      })

      const aggregationService = mockObject<InteropAggregationService>({
        aggregate: mockFn().returns({
          aggregatedTransfers: [],
          aggregatedTokens: [],
          aggregatedTokensPairs: [],
          warnings: [],
        }),
      })

      const indexer = new InteropAggregatingIndexer(
        {
          db,
          configs: [],
          aggregationService,
          syncersManager,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
          minHeight: 0,
        },
        Logger.SILENT,
      )

      const result = await indexer.update(from, to)

      expect(result).toEqual(to)
      expect(interopTransfer.getByRange).not.toHaveBeenCalled()
      expect(transaction).not.toHaveBeenCalled()
      expect(aggregatedInteropTransfer.insertMany).not.toHaveBeenCalled()
      expect(aggregatedInteropToken.insertMany).not.toHaveBeenCalled()
    })

    it('does not backfill a skipped hour on the next run', async () => {
      const nextTo = to + UnixTime.HOUR
      const nextFrom = nextTo - UnixTime.DAY
      const transfers: InteropTransferRecord[] = []

      const interopTransfer = mockObject<Database['interopTransfer']>({
        getByRange: mockFn().resolvesTo(transfers),
      })
      const aggregatedInteropTransfer = mockObject<
        Database['aggregatedInteropTransfer']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(0),
      })
      const aggregatedInteropToken = mockObject<
        Database['aggregatedInteropToken']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(0),
      })
      const aggregatedInteropTokensPair = mockObject<
        Database['aggregatedInteropTokensPair']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(0),
      })
      const transaction = mockFn(async (fn: any) => await fn())
      const db = mockDatabase({
        transaction,
        interopTransfer,
        aggregatedInteropTransfer,
        aggregatedInteropToken,
        aggregatedInteropTokensPair,
      })
      const syncersManager = mockObject<InteropSyncersManager>({
        areAllSyncersFollowing: mockFn().returnsOnce(false).returns(true),
      })

      const aggregationService = mockObject<InteropAggregationService>({
        aggregate: mockFn().returns({
          aggregatedTransfers: [],
          aggregatedTokens: [],
          aggregatedTokensPairs: [],
          warnings: [],
        }),
      })

      const indexer = new InteropAggregatingIndexer(
        {
          db,
          configs: [],
          aggregationService,
          syncersManager,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
          minHeight: 0,
        },
        Logger.SILENT,
      )

      const skippedResult = await indexer.update(from, to)
      const nextResult = await indexer.update(to + 1, nextTo)

      expect(skippedResult).toEqual(to)
      expect(nextResult).toEqual(nextTo)
      expect(interopTransfer.getByRange).toHaveBeenCalledTimes(1)
      expect(interopTransfer.getByRange).toHaveBeenCalledWith(nextFrom, nextTo)
      expect(aggregationService.aggregate).toHaveBeenCalledWith(
        transfers,
        [],
        nextTo,
      )
      expect(transaction).toHaveBeenCalledTimes(1)
      expect(aggregatedInteropTransfer.deleteByTimestamp).toHaveBeenCalledWith(
        nextTo,
      )
      expect(aggregatedInteropToken.deleteByTimestamp).toHaveBeenCalledWith(
        nextTo,
      )
      expect(
        aggregatedInteropTokensPair.deleteByTimestamp,
      ).toHaveBeenCalledWith(nextTo)
    })

    it('notifies when aggregate analysis finds suspicious groups', async () => {
      const transfers: InteropTransferRecord[] = []

      const interopTransfer = mockObject<Database['interopTransfer']>({
        getByRange: mockFn().resolvesTo(transfers),
      })
      const aggregatedInteropTransfer = mockObject<
        Database['aggregatedInteropTransfer']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(0),
      })
      const aggregatedInteropToken = mockObject<
        Database['aggregatedInteropToken']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(0),
      })
      const aggregatedInteropTokensPair = mockObject<
        Database['aggregatedInteropTokensPair']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(0),
      })
      const transaction = mockFn(async (fn: any) => await fn())

      const db = mockDatabase({
        transaction,
        interopTransfer,
        aggregatedInteropTransfer,
        aggregatedInteropToken,
        aggregatedInteropTokensPair,
      })
      const syncersManager = mockObject<InteropSyncersManager>({
        areAllSyncersFollowing: mockFn().returns(true),
      })
      const aggregationService = mockObject<InteropAggregationService>({
        aggregate: mockFn().returns({
          aggregatedTransfers: [],
          aggregatedTokens: [],
          aggregatedTokensPairs: [],
          warnings: [],
        }),
      })
      const aggregationAnalyzer = mockObject<InteropAggregationAnalyzer>({
        analyze: mockFn().resolvesTo({
          checkedGroups: 2,
          suspiciousGroups: [
            {
              id: 'stargate',
              bridgeType: 'nonMinting',
              srcChain: 'ethereum',
              dstChain: 'arbitrum',
              reasons: ['Count z-score=12.34'],
            },
          ],
        }),
      })
      const notifier = mockObject<
        Pick<InteropNotifier, 'notifySuspiciousAggregates'>
      >({
        notifySuspiciousAggregates: mockFn().returns(undefined),
      })

      const indexer = new InteropAggregatingIndexer(
        {
          db,
          configs: [],
          aggregationAnalyzer,
          aggregationService,
          notifier,
          syncersManager,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
          minHeight: 0,
        },
        Logger.SILENT,
      )

      await indexer.update(from, to)

      expect(aggregationAnalyzer.analyze).toHaveBeenCalledWith(to, [])
      expect(notifier.notifySuspiciousAggregates).toHaveBeenCalledWith(to, {
        checkedGroups: 2,
        suspiciousGroups: [
          {
            id: 'stargate',
            bridgeType: 'nonMinting',
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            reasons: ['Count z-score=12.34'],
          },
        ],
      })
    })

    it('notifies when a historically active group drops to zero in the current snapshot', async () => {
      const transfers: InteropTransferRecord[] = []
      const candidateDay = UnixTime.toStartOf(to, 'day')

      const interopTransfer = mockObject<Database['interopTransfer']>({
        getByRange: mockFn().resolvesTo(transfers),
      })
      const aggregatedInteropTransfer = mockObject<
        Database['aggregatedInteropTransfer']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(0),
        getGroupsWithStatsInTimeRange: mockFn().resolvesTo([
          {
            id: 'stargate',
            bridgeType: 'nonMinting',
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
          },
        ]),
        getDailyStatsForGroupInTimeRange: mockFn().resolvesTo(
          baselineHistoryForAnalyzer(to),
        ),
      })
      const aggregatedInteropToken = mockObject<
        Database['aggregatedInteropToken']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(0),
      })
      const aggregatedInteropTokensPair = mockObject<
        Database['aggregatedInteropTokensPair']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(0),
      })
      const transaction = mockFn(async (fn) => await fn())

      const db = mockDatabase({
        transaction,
        interopTransfer,
        aggregatedInteropTransfer,
        aggregatedInteropToken,
        aggregatedInteropTokensPair,
      })
      const syncersManager = mockObject<InteropSyncersManager>({
        areAllSyncersFollowing: mockFn().returns(true),
      })
      const aggregationService = mockObject<InteropAggregationService>({
        aggregate: mockFn().returns({
          aggregatedTransfers: [],
          aggregatedTokens: [],
          aggregatedTokensPairs: [],
          warnings: [],
        }),
      })
      const notifier = mockObject<InteropNotifier>({
        notifySuspiciousAggregates: mockFn().returns(undefined),
      })

      const indexer = new InteropAggregatingIndexer(
        {
          db,
          configs: [],
          aggregationAnalyzer: new DefaultInteropAggregationAnalyzer(db),
          aggregationService,
          notifier,
          syncersManager,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
          minHeight: 0,
        },
        Logger.SILENT,
      )

      await indexer.update(from, to)

      expect(
        aggregatedInteropTransfer.getGroupsWithStatsInTimeRange,
      ).toHaveBeenCalledWith(candidateDay - 13 * UnixTime.DAY, candidateDay)
      expect(
        aggregatedInteropTransfer.getDailyStatsForGroupInTimeRange,
      ).toHaveBeenCalledWith(
        'stargate',
        'nonMinting',
        'ethereum',
        'arbitrum',
        candidateDay - 13 * UnixTime.DAY,
        candidateDay,
      )
      expect(notifier.notifySuspiciousAggregates).toHaveBeenCalledTimes(1)

      const analysis = notifier.notifySuspiciousAggregates.calls[0]?.args[1]
      console.dir({ analysis }, { depth: null })
      expect(analysis?.checkedGroups).toEqual(1)
      expect(analysis?.suspiciousGroups).toHaveLength(1)
      expect(analysis?.suspiciousGroups[0]?.id).toEqual('stargate')
      expect(
        analysis?.suspiciousGroups[0]?.reasons.some((reason) =>
          reason.includes('Count z-score='),
        ),
      ).toEqual(true)
    })

    it('still persists aggregates when analysis fails', async () => {
      const transfers: InteropTransferRecord[] = []

      const interopTransfer = mockObject<Database['interopTransfer']>({
        getByRange: mockFn().resolvesTo(transfers),
      })
      const aggregatedInteropTransfer = mockObject<
        Database['aggregatedInteropTransfer']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(0),
      })
      const aggregatedInteropToken = mockObject<
        Database['aggregatedInteropToken']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(0),
      })
      const aggregatedInteropTokensPair = mockObject<
        Database['aggregatedInteropTokensPair']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(0),
      })
      const transaction = mockFn(async (fn: any) => await fn())

      const db = mockDatabase({
        transaction,
        interopTransfer,
        aggregatedInteropTransfer,
        aggregatedInteropToken,
        aggregatedInteropTokensPair,
      })
      const syncersManager = mockObject<InteropSyncersManager>({
        areAllSyncersFollowing: mockFn().returns(true),
      })
      const aggregationService = mockObject<InteropAggregationService>({
        aggregate: mockFn().returns({
          aggregatedTransfers: [],
          aggregatedTokens: [],
          aggregatedTokensPairs: [],
          warnings: [],
        }),
      })
      const aggregationAnalyzer = mockObject<InteropAggregationAnalyzer>({
        analyze: mockFn().rejectsWith(new Error('db unavailable')),
      })

      const indexer = new InteropAggregatingIndexer(
        {
          db,
          configs: [],
          aggregationAnalyzer,
          aggregationService,
          syncersManager,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
          minHeight: 0,
        },
        Logger.SILENT,
      )

      const result = await indexer.update(from, to)

      expect(result).toEqual(to)
      expect(aggregationAnalyzer.analyze).toHaveBeenCalledWith(to, [])
      expect(transaction).toHaveBeenCalledTimes(1)
      expect(aggregatedInteropTransfer.insertMany).toHaveBeenCalledWith([])
      expect(aggregatedInteropToken.insertMany).toHaveBeenCalledWith([])
      expect(aggregatedInteropTokensPair.insertMany).toHaveBeenCalledWith([])
    })
  })
})

function createTransfer(
  plugin: string,
  transferId: string,
  type: string,
  timestamp: UnixTime,
  overrides: {
    srcChain: string
    dstChain: string
    srcAbstractTokenId: string
    dstAbstractTokenId: string
    duration: number
    srcValueUsd?: number
    dstValueUsd?: number
    srcWasBurned?: boolean
    dstWasMinted?: boolean
  },
): InteropTransferRecord {
  return {
    plugin,
    transferId,
    type,
    bridgeType: undefined,
    timestamp,
    srcTime: timestamp,
    srcTxHash: 'random-hash',
    srcLogIndex: 0,
    srcEventId: 'random-event-id',
    srcTokenAddress: undefined,
    srcRawAmount: undefined,
    srcWasBurned: overrides.srcWasBurned ?? undefined,
    srcSymbol: undefined,
    srcAmount: undefined,
    srcPrice: undefined,
    dstTime: timestamp + overrides.duration,
    dstTxHash: 'random-hash',
    dstLogIndex: 0,
    dstEventId: 'random-event-id',
    dstTokenAddress: undefined,
    dstRawAmount: undefined,
    dstWasMinted: overrides.dstWasMinted ?? undefined,
    dstSymbol: undefined,
    dstAmount: undefined,
    dstPrice: undefined,
    isProcessed: false,
    srcChain: overrides.srcChain,
    dstChain: overrides.dstChain,
    srcAbstractTokenId: overrides.srcAbstractTokenId,
    dstAbstractTokenId: overrides.dstAbstractTokenId,
    duration: overrides.duration,
    srcValueUsd: overrides.srcValueUsd,
    dstValueUsd: overrides.dstValueUsd,
  }
}

function baselineHistoryForAnalyzer(candidateTimestamp: UnixTime) {
  return [
    historyPointAt(candidateTimestamp, -13, {
      transferCount: 900,
      identifiedCount: 860,
      srcVolumeUsd: 1_900_000,
      dstVolumeUsd: 1_940_000,
    }),
    historyPointAt(candidateTimestamp, -12, {
      transferCount: 980,
      identifiedCount: 940,
      srcVolumeUsd: 2_050_000,
      dstVolumeUsd: 2_020_000,
    }),
    historyPointAt(candidateTimestamp, -11, {
      transferCount: 1_040,
      identifiedCount: 980,
      srcVolumeUsd: 2_150_000,
      dstVolumeUsd: 2_110_000,
    }),
    historyPointAt(candidateTimestamp, -10, {
      transferCount: 1_000,
      identifiedCount: 960,
      srcVolumeUsd: 2_000_000,
      dstVolumeUsd: 2_030_000,
    }),
    historyPointAt(candidateTimestamp, -9, {
      transferCount: 1_100,
      identifiedCount: 1_040,
      srcVolumeUsd: 2_120_000,
      dstVolumeUsd: 2_140_000,
    }),
    historyPointAt(candidateTimestamp, -8, {
      transferCount: 950,
      identifiedCount: 900,
      srcVolumeUsd: 1_970_000,
      dstVolumeUsd: 1_980_000,
    }),
    historyPointAt(candidateTimestamp, -7, {
      transferCount: 1_020,
      identifiedCount: 980,
      srcVolumeUsd: 2_010_000,
      dstVolumeUsd: 1_990_000,
    }),
    historyPointAt(candidateTimestamp, -6, {
      transferCount: 995,
      identifiedCount: 950,
      srcVolumeUsd: 1_995_000,
      dstVolumeUsd: 2_005_000,
    }),
    historyPointAt(candidateTimestamp, -5, {
      transferCount: 1_015,
      identifiedCount: 970,
      srcVolumeUsd: 2_025_000,
      dstVolumeUsd: 2_010_000,
    }),
    historyPointAt(candidateTimestamp, -4, {
      transferCount: 990,
      identifiedCount: 945,
      srcVolumeUsd: 1_980_000,
      dstVolumeUsd: 1_970_000,
    }),
    historyPointAt(candidateTimestamp, -3, {
      transferCount: 1_030,
      identifiedCount: 985,
      srcVolumeUsd: 2_040_000,
      dstVolumeUsd: 2_020_000,
    }),
    historyPointAt(candidateTimestamp, -2, {
      transferCount: 1_005,
      identifiedCount: 960,
      srcVolumeUsd: 2_000_000,
      dstVolumeUsd: 1_995_000,
    }),
    historyPointAt(candidateTimestamp, -1, {
      transferCount: 985,
      identifiedCount: 940,
      srcVolumeUsd: 1_990_000,
      dstVolumeUsd: 1_985_000,
    }),
  ]
}

function historyPointAt(
  candidateTimestamp: UnixTime,
  offsetDays: number,
  overrides: Partial<{
    transferCount: number
    identifiedCount: number
    srcVolumeUsd: number
    dstVolumeUsd: number
  }> = {},
) {
  return {
    timestamp:
      UnixTime.toStartOf(candidateTimestamp, 'day') + offsetDays * UnixTime.DAY,
    transferCount: 1_000,
    identifiedCount: 950,
    srcVolumeUsd: 2_000_000,
    dstVolumeUsd: 2_000_000,
    ...overrides,
  }
}
