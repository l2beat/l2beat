import { Logger } from '@l2beat/backend-tools'
import type {
  AggregatedInteropDeployedTokenRecord,
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
import type {
  InteropPromotionService,
  ReconcileResult,
} from '../promotion/InteropPromotionService'
import type { InteropSyncersManager } from '../sync/InteropSyncersManager'
import { InteropAggregatingIndexer } from './InteropAggregatingIndexer'
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

      const aggregatedDeployedTokens: AggregatedInteropDeployedTokenRecord[] = [
        {
          timestamp: to,
          id: 'config1',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          tokenChain: 'arbitrum',
          tokenAddress: '0xarb',
          transferCount: 1,
          transfersWithDurationCount: 1,
          transferTypeStats: undefined,
          totalDurationSum: 5000,
          volume: 2000,
          minTransferValueUsd: 2000,
          maxTransferValueUsd: 2000,
          bridgeType: 'lockAndMint',
          mintedValueUsd: 2000,
          burnedValueUsd: 0,
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
      const aggregatedInteropDeployedToken = mockObject<
        Database['aggregatedInteropDeployedToken']
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
        insertMany: mockFn().resolvesTo(1),
      })

      const interopAggregateStatus = mockObject<
        Database['interopAggregateStatus']
      >({
        deleteOrphaned: mockFn().resolvesTo(0),
      })

      const transaction = mockFn(async (fn: any) => await fn())

      const db = mockDatabase({
        transaction,
        interopTransfer,
        aggregatedInteropTransfer,
        aggregatedInteropToken,
        aggregatedInteropDeployedToken,
        aggregatedInteropTokensPair,
        interopAggregateStatus,
      })
      const syncersManager = mockObject<InteropSyncersManager>({
        areSyncersFreshEnough: mockFn().resolvesTo(true),
      })

      const aggregationService = mockObject<InteropAggregationService>({
        aggregate: mockFn().returns({
          aggregatedTransfers,
          aggregatedTokens,
          aggregatedDeployedTokens,
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
          promotionService: mockPromotionService(),
          indexerService: mockObject<IndexerService>({}),
          minHeight: 0,
        },
        Logger.SILENT,
      )

      const result = await indexer.update(from, to)
      const retentionCutoff = to - 14 * UnixTime.DAY

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
      ).toHaveBeenCalledWith(retentionCutoff)
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
      ).toHaveBeenCalledWith(retentionCutoff)
      expect(aggregatedInteropToken.deleteByTimestamp).toHaveBeenCalledWith(to)
      expect(aggregatedInteropDeployedToken.insertMany).toHaveBeenCalledWith(
        aggregatedDeployedTokens,
      )
      expect(
        aggregatedInteropDeployedToken.deleteAllButEarliestPerDayBefore,
      ).toHaveBeenCalledWith(retentionCutoff)
      expect(
        aggregatedInteropDeployedToken.deleteByTimestamp,
      ).toHaveBeenCalledWith(to)
      expect(aggregatedInteropTokensPair.insertMany).toHaveBeenCalledWith(
        aggregatedTokensPairs,
      )
      expect(
        aggregatedInteropTokensPair.deleteAllButEarliestPerDayBefore,
      ).toHaveBeenCalledWith(retentionCutoff)
      expect(
        aggregatedInteropTokensPair.deleteByTimestamp,
      ).toHaveBeenCalledWith(to)
      expect(interopAggregateStatus.deleteOrphaned).toHaveBeenCalledTimes(1)
    })

    it('reconciles promotion and notifies when the snapshot is blocked', async () => {
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
      const aggregatedInteropDeployedToken = mockObject<
        Database['aggregatedInteropDeployedToken']
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

      const db = mockDatabase({
        transaction: mockFn(async (fn: any) => await fn()),
        interopTransfer,
        aggregatedInteropTransfer,
        aggregatedInteropToken,
        aggregatedInteropDeployedToken,
        aggregatedInteropTokensPair,
        interopAggregateStatus: mockObject<Database['interopAggregateStatus']>({
          deleteOrphaned: mockFn().resolvesTo(0),
        }),
      })
      const syncersManager = mockObject<InteropSyncersManager>({
        areSyncersFreshEnough: mockFn().resolvesTo(true),
      })
      const aggregationService = mockObject<InteropAggregationService>({
        aggregate: mockFn().returns({
          aggregatedTransfers: [],
          aggregatedTokens: [],
          aggregatedDeployedTokens: [],
          aggregatedTokensPairs: [],
          warnings: [],
        }),
      })

      const reasons = [
        {
          rule: 'maxLaneVolume',
          scope: 'p|nonMinting|ethereum|base',
          message: 'lane volume exceeds threshold',
        },
      ]
      const promotionService = mockPromotionService({
        status: 'blocked',
        reasons,
        notify: true,
      })
      const notifier = mockObject<InteropNotifier>({
        notifyBlockedSnapshot: mockFn().returns(undefined),
      })

      const indexer = new InteropAggregatingIndexer(
        {
          db,
          configs: [],
          aggregationService,
          promotionService,
          notifier,
          syncersManager,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
          minHeight: 0,
        },
        Logger.SILENT,
      )

      await indexer.update(from, to)

      expect(promotionService.reconcile).toHaveBeenCalledWith({
        timestamp: to,
        transfers: [],
        tokens: [],
      })
      expect(notifier.notifyBlockedSnapshot).toHaveBeenCalledWith(to, reasons)
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
      const aggregatedInteropDeployedToken = mockObject<
        Database['aggregatedInteropDeployedToken']
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
      const interopAggregateStatus = mockObject<
        Database['interopAggregateStatus']
      >({
        deleteOrphaned: mockFn().resolvesTo(0),
      })

      const transaction = mockFn(async (fn: any) => await fn())

      const db = mockDatabase({
        transaction,
        interopTransfer,
        aggregatedInteropTransfer,
        aggregatedInteropToken,
        aggregatedInteropDeployedToken,
        aggregatedInteropTokensPair,
        interopAggregateStatus,
      })
      const syncersManager = mockObject<InteropSyncersManager>({
        areSyncersFreshEnough: mockFn().resolvesTo(true),
      })

      const aggregationService = mockObject<InteropAggregationService>({
        aggregate: mockFn().returns({
          aggregatedTransfers: [],
          aggregatedTokens: [],
          aggregatedDeployedTokens: [],
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
          promotionService: mockPromotionService(),
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
      expect(aggregatedInteropDeployedToken.insertMany).toHaveBeenCalledWith([])
      expect(aggregatedInteropTokensPair.insertMany).toHaveBeenCalledWith([])
    })

    it('skips aggregation when syncers captured data is not fresh enough', async () => {
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
      const aggregatedInteropDeployedToken = mockObject<
        Database['aggregatedInteropDeployedToken']
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
        aggregatedInteropDeployedToken,
      })
      const syncersManager = mockObject<InteropSyncersManager>({
        areSyncersFreshEnough: mockFn().resolvesTo(false),
      })

      const aggregationService = mockObject<InteropAggregationService>({
        aggregate: mockFn().returns({
          aggregatedTransfers: [],
          aggregatedTokens: [],
          aggregatedDeployedTokens: [],
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
          promotionService: mockPromotionService(),
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
      const aggregatedInteropDeployedToken = mockObject<
        Database['aggregatedInteropDeployedToken']
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
      const interopAggregateStatus = mockObject<
        Database['interopAggregateStatus']
      >({
        deleteOrphaned: mockFn().resolvesTo(0),
      })

      const transaction = mockFn(async (fn: any) => await fn())
      const db = mockDatabase({
        transaction,
        interopTransfer,
        aggregatedInteropTransfer,
        aggregatedInteropToken,
        aggregatedInteropDeployedToken,
        aggregatedInteropTokensPair,
        interopAggregateStatus,
      })
      const syncersManager = mockObject<InteropSyncersManager>({
        areSyncersFreshEnough: mockFn().resolvesToOnce(false).resolvesTo(true),
      })

      const aggregationService = mockObject<InteropAggregationService>({
        aggregate: mockFn().returns({
          aggregatedTransfers: [],
          aggregatedTokens: [],
          aggregatedDeployedTokens: [],
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
          promotionService: mockPromotionService(),
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

function mockPromotionService(result?: ReconcileResult) {
  return mockObject<InteropPromotionService>({
    reconcile: mockFn().resolvesTo(
      result ?? { status: 'promoted', reasons: [], notify: false },
    ),
  })
}
