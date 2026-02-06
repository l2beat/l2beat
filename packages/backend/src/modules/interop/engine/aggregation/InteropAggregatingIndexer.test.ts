import { Logger } from '@l2beat/backend-tools'
import type {
  AggregatedInteropTokenRecord,
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
          showAlways: ['lockAndMint'],
          plugins: [{ plugin: 'across' }],
        },
      ]

      const aggregatedTransfers: AggregatedInteropTransferRecord[] = [
        {
          timestamp: to,
          id: 'config1',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 1,
          totalDurationSum: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
          avgValueInFlight: undefined,
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
          totalDurationSum: 5000,
          volume: 2000,
          bridgeType: 'lockAndMint',
          mintedValueUsd: 0,
          burnedValueUsd: 2000,
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

      const transaction = mockFn(async (fn: any) => await fn())

      const db = mockDatabase({
        transaction,
        interopTransfer,
        aggregatedInteropTransfer,
        aggregatedInteropToken,
      })

      const aggregationService = mockObject<InteropAggregationService>({
        aggregate: mockFn().returns({
          aggregatedTransfers,
          aggregatedTokens,
          warnings: [],
        }),
      })

      const indexer = new InteropAggregatingIndexer(
        {
          db,
          configs,
          aggregationService,
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
    })

    it('handles empty transfers correctly', async () => {
      const transfers: InteropTransferRecord[] = []

      const configs: InteropAggregationConfig[] = [
        {
          id: 'config1',
          plugins: [{ plugin: 'across' }],
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

      const transaction = mockFn(async (fn: any) => await fn())

      const db = mockDatabase({
        transaction,
        interopTransfer,
        aggregatedInteropTransfer,
        aggregatedInteropToken,
      })

      const aggregationService = mockObject<InteropAggregationService>({
        aggregate: mockFn().returns({
          aggregatedTransfers: [],
          aggregatedTokens: [],
          warnings: [],
        }),
      })

      const indexer = new InteropAggregatingIndexer(
        {
          db,
          configs,
          aggregationService,
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
