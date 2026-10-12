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
        getAggregationBlockers: mockFn().resolvesTo([]),
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
          pluginClusters: [],
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
        getAggregationBlockers: mockFn().resolvesTo([]),
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
          pluginClusters: [],
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
        getAggregationBlockers: mockFn().resolvesTo([]),
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
          pluginClusters: [],
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

    describe('when syncers lag', () => {
      const configs: InteropAggregationConfig[] = [
        {
          id: 'p',
          plugins: [{ plugin: 'across', bridgeType: 'nonMinting' }],
          type: 'other',
        },
      ]
      const pluginClusters = [{ name: 'across', plugins: [{ name: 'across' }] }]
      const previousTimestamp = to - UnixTime.HOUR

      it('replaces stale lanes with the previous snapshot and marks where they came from', async () => {
        const freshArbitrum = aggregatedTransfer(
          'p',
          'ethereum',
          'arbitrum',
          to,
          2,
        )
        const freshAvalanche = aggregatedTransfer(
          'p',
          'ethereum',
          'avalanche',
          to,
          1,
        )
        const previousAvalanche = aggregatedTransfer(
          'p',
          'ethereum',
          'avalanche',
          previousTimestamp,
          10,
        )
        const previousTwiceCarried = {
          ...aggregatedTransfer('p', 'avalanche', 'base', previousTimestamp, 7),
          carriedFrom: previousTimestamp - UnixTime.HOUR,
        }
        const previousArbitrum = aggregatedTransfer(
          'p',
          'ethereum',
          'arbitrum',
          previousTimestamp,
          99,
        )
        const freshToken = aggregatedToken('p', 'ethereum', 'avalanche', to, 1)
        const previousToken = aggregatedToken(
          'p',
          'ethereum',
          'avalanche',
          previousTimestamp,
          10,
        )

        const { db, aggregatedInteropTransfer, aggregatedInteropToken } =
          mockAggregateDb({
            previousTimestamp,
            previousTransfers: [
              previousAvalanche,
              previousTwiceCarried,
              previousArbitrum,
            ],
            previousTokens: [previousToken],
          })
        const promotionService = mockPromotionService()
        const indexer = new InteropAggregatingIndexer(
          {
            db,
            configs,
            pluginClusters,
            aggregationService: mockAggregationService({
              aggregatedTransfers: [freshAvalanche, freshArbitrum],
              aggregatedTokens: [freshToken],
            }),
            syncersManager: mockObject<InteropSyncersManager>({
              getAggregationBlockers: mockFn().resolvesTo([
                { cluster: 'across', chain: 'avalanche' },
              ]),
            }),
            parents: [],
            promotionService,
            indexerService: mockObject<IndexerService>({}),
            minHeight: 0,
          },
          Logger.SILENT,
        )

        await indexer.update(from, to)

        const expectedTransfers = [
          freshArbitrum,
          {
            ...previousAvalanche,
            timestamp: to,
            carriedFrom: previousTimestamp,
          },
          { ...previousTwiceCarried, timestamp: to },
        ]
        expect(
          aggregatedInteropTransfer.getMaxTimestampAtOrBefore,
        ).toHaveBeenCalledWith(to - 1)
        expect(aggregatedInteropTransfer.insertMany).toHaveBeenCalledWith(
          expectedTransfers,
        )
        expect(aggregatedInteropToken.insertMany).toHaveBeenCalledWith([
          { ...previousToken, timestamp: to },
        ])
        expect(promotionService.reconcile).toHaveBeenCalledWith({
          timestamp: to,
          transfers: expectedTransfers,
          tokens: [{ ...previousToken, timestamp: to }],
        })
      })

      it('drops stale lanes when there is no previous snapshot', async () => {
        const freshArbitrum = aggregatedTransfer(
          'p',
          'ethereum',
          'arbitrum',
          to,
          2,
        )
        const freshAvalanche = aggregatedTransfer(
          'p',
          'ethereum',
          'avalanche',
          to,
          1,
        )
        const { db, aggregatedInteropTransfer } = mockAggregateDb({
          previousTimestamp: undefined,
        })
        const indexer = new InteropAggregatingIndexer(
          {
            db,
            configs,
            pluginClusters,
            aggregationService: mockAggregationService({
              aggregatedTransfers: [freshAvalanche, freshArbitrum],
            }),
            syncersManager: mockObject<InteropSyncersManager>({
              getAggregationBlockers: mockFn().resolvesTo([
                { cluster: 'across', chain: 'avalanche' },
              ]),
            }),
            parents: [],
            promotionService: mockPromotionService(),
            indexerService: mockObject<IndexerService>({}),
            minHeight: 0,
          },
          Logger.SILENT,
        )

        await indexer.update(from, to)

        expect(aggregatedInteropTransfer.insertMany).toHaveBeenCalledWith([
          freshArbitrum,
        ])
      })

      it('does not read the previous snapshot when the lagging cluster backs no project', async () => {
        const fresh = aggregatedTransfer('p', 'ethereum', 'avalanche', to, 1)
        const { db, aggregatedInteropTransfer } = mockAggregateDb({
          previousTimestamp: undefined,
        })
        const indexer = new InteropAggregatingIndexer(
          {
            db,
            configs,
            pluginClusters,
            aggregationService: mockAggregationService({
              aggregatedTransfers: [fresh],
            }),
            syncersManager: mockObject<InteropSyncersManager>({
              getAggregationBlockers: mockFn().resolvesTo([
                { cluster: 'unrelated', chain: 'avalanche' },
              ]),
            }),
            parents: [],
            promotionService: mockPromotionService(),
            indexerService: mockObject<IndexerService>({}),
            minHeight: 0,
          },
          Logger.SILENT,
        )

        await indexer.update(from, to)

        expect(
          aggregatedInteropTransfer.getMaxTimestampAtOrBefore,
        ).not.toHaveBeenCalled()
        expect(aggregatedInteropTransfer.insertMany).toHaveBeenCalledWith([
          fresh,
        ])
      })
    })
  })
})

function mockAggregateDb(previous: {
  previousTimestamp: UnixTime | undefined
  previousTransfers?: AggregatedInteropTransferRecord[]
  previousTokens?: AggregatedInteropTokenRecord[]
}) {
  const aggregatedInteropTransfer = mockObject<
    Database['aggregatedInteropTransfer']
  >({
    deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
    deleteByTimestamp: mockFn().resolvesTo(0),
    insertMany: mockFn().resolvesTo(0),
    getMaxTimestampAtOrBefore: mockFn().resolvesTo(previous.previousTimestamp),
    getByTimestamp: mockFn().resolvesTo(previous.previousTransfers ?? []),
  })
  const aggregatedInteropToken = mockObject<Database['aggregatedInteropToken']>(
    {
      deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
      deleteByTimestamp: mockFn().resolvesTo(0),
      insertMany: mockFn().resolvesTo(0),
      getByTimestamp: mockFn().resolvesTo(previous.previousTokens ?? []),
    },
  )
  const aggregatedInteropDeployedToken = mockObject<
    Database['aggregatedInteropDeployedToken']
  >({
    deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
    deleteByTimestamp: mockFn().resolvesTo(0),
    insertMany: mockFn().resolvesTo(0),
    getByTimestamp: mockFn().resolvesTo([]),
  })
  const aggregatedInteropTokensPair = mockObject<
    Database['aggregatedInteropTokensPair']
  >({
    deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
    deleteByTimestamp: mockFn().resolvesTo(0),
    insertMany: mockFn().resolvesTo(0),
    getByTimestamp: mockFn().resolvesTo([]),
  })
  const db = mockDatabase({
    transaction: mockFn(async (fn: any) => await fn()),
    interopTransfer: mockObject<Database['interopTransfer']>({
      getByRange: mockFn().resolvesTo([]),
    }),
    aggregatedInteropTransfer,
    aggregatedInteropToken,
    aggregatedInteropDeployedToken,
    aggregatedInteropTokensPair,
    interopAggregateStatus: mockObject<Database['interopAggregateStatus']>({
      deleteOrphaned: mockFn().resolvesTo(0),
    }),
  })
  return { db, aggregatedInteropTransfer, aggregatedInteropToken }
}

function mockAggregationService(result: {
  aggregatedTransfers?: AggregatedInteropTransferRecord[]
  aggregatedTokens?: AggregatedInteropTokenRecord[]
}) {
  return mockObject<InteropAggregationService>({
    aggregate: mockFn().returns({
      aggregatedTransfers: result.aggregatedTransfers ?? [],
      aggregatedTokens: result.aggregatedTokens ?? [],
      aggregatedDeployedTokens: [],
      aggregatedTokensPairs: [],
    }),
  })
}

function aggregatedTransfer(
  id: string,
  srcChain: string,
  dstChain: string,
  timestamp: UnixTime,
  transferCount: number,
): AggregatedInteropTransferRecord {
  return {
    timestamp,
    id,
    bridgeType: 'nonMinting',
    srcChain,
    dstChain,
    transferTypeStats: undefined,
    transferCount,
    transfersWithDurationCount: transferCount,
    identifiedCount: transferCount,
    totalDurationSum: 0,
    srcValueUsd: undefined,
    dstValueUsd: undefined,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    avgValueInFlight: undefined,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
    countUnder100: 0,
    count100To1K: 0,
    count1KTo10K: 0,
    count10KTo100K: 0,
    countOver100K: 0,
  }
}

function aggregatedToken(
  id: string,
  srcChain: string,
  dstChain: string,
  timestamp: UnixTime,
  transferCount: number,
): AggregatedInteropTokenRecord {
  return {
    timestamp,
    id,
    bridgeType: 'nonMinting',
    srcChain,
    dstChain,
    abstractTokenId: 'eth',
    transferTypeStats: undefined,
    transferCount,
    transfersWithDurationCount: transferCount,
    totalDurationSum: 0,
    volume: 0,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
  }
}

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
