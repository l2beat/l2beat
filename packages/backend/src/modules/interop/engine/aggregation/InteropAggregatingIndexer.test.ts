import { Logger } from '@l2beat/backend-tools'
import type { Database, InteropTransferRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { InteropAggregationConfig } from '../../../../config/features/interop'
import { mockDatabase } from '../../../../test/database'
import type { IndexerService } from '../../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../../tools/uif/ids'
import { InteropAggregatingIndexer } from './InteropAggregatingIndexer'

describe(InteropAggregatingIndexer.name, () => {
  const to = 1768484645
  const from = to - UnixTime.DAY
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(InteropAggregatingIndexer.prototype.update.name, () => {
    it('aggregates transfers and saves to database', async () => {
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
        createTransfer('across', 'msg2', 'deposit', to - 2 * UnixTime.HOUR, {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: 6000,
          srcValueUsd: 3000,
          dstValueUsd: 3000,
        }),
      ]

      const configs: InteropAggregationConfig[] = [
        {
          id: 'config1',
          bridgeType: 'lockAndMint',
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
        insertMany: mockFn().resolvesTo(2),
      })
      const aggregatedInteropToken = mockObject<
        Database['aggregatedInteropToken']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(2),
      })

      const transaction = mockFn(async (fn: any) => await fn())

      const db = mockDatabase({
        transaction,
        interopTransfer,
        aggregatedInteropTransfer,
        aggregatedInteropToken,
      })

      const indexer = new InteropAggregatingIndexer({
        db,
        configs,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
        logger: Logger.SILENT,
        minHeight: 0,
      })

      const result = await indexer.update(from, to)

      expect(result).toEqual(to)
      expect(interopTransfer.getByRange).toHaveBeenCalledWith(from, to)
      expect(transaction).toHaveBeenCalledTimes(1)
      expect(
        aggregatedInteropTransfer.deleteAllButEarliestPerDayBefore,
      ).toHaveBeenCalledWith(from)
      expect(aggregatedInteropTransfer.deleteByTimestamp).toHaveBeenCalledWith(
        to,
      )
      expect(aggregatedInteropTransfer.insertMany).toHaveBeenCalledWith([
        {
          timestamp: to,
          id: 'config1',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 2,
          totalDurationSum: 11000,
          srcValueUsd: 5000,
          dstValueUsd: 5000,
        },
      ])
      expect(aggregatedInteropToken.insertMany).toHaveBeenCalledWith([
        {
          timestamp: to,
          id: 'config1',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'eth',
          transferCount: 2,
          totalDurationSum: 11000,
          volume: 5000,
        },
      ])
      expect(
        aggregatedInteropToken.deleteAllButEarliestPerDayBefore,
      ).toHaveBeenCalledWith(from)
      expect(aggregatedInteropToken.deleteByTimestamp).toHaveBeenCalledWith(to)
    })

    it('filters transfers by plain plugin, chain plugin, and abstractTokenId plugin simultaneously', async () => {
      const transfers: InteropTransferRecord[] = [
        // Plain plugin filter: across (should match config1)
        createTransfer('across', 'msg1', 'deposit', to - UnixTime.HOUR, {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
        }),
        createTransfer('stargate', 'msg2', 'deposit', to - 2 * UnixTime.HOUR, {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: 6000,
          srcValueUsd: 3000,
          dstValueUsd: 3000,
        }),
        // Chain plugin filter: cctp-v1 with ethereum chain (should match config2)
        createTransfer('cctp-v1', 'msg3', 'deposit', to - 3 * UnixTime.HOUR, {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'usdc',
          dstAbstractTokenId: 'usdc',
          duration: 7000,
          srcValueUsd: 1000,
          dstValueUsd: 1000,
        }),
        createTransfer('cctp-v1', 'msg4', 'deposit', to - 4 * UnixTime.HOUR, {
          srcChain: 'polygon',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'usdc',
          dstAbstractTokenId: 'usdc',
          duration: 8000,
          srcValueUsd: 1500,
          dstValueUsd: 1500,
        }),
        createTransfer('cctp-v1', 'msg5', 'deposit', to - 5 * UnixTime.HOUR, {
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          srcAbstractTokenId: 'usdc',
          dstAbstractTokenId: 'usdc',
          duration: 9000,
          srcValueUsd: 2500,
          dstValueUsd: 2500,
        }),
        // AbstractTokenId plugin filter: stargate with eth token (should match config3)
        createTransfer('stargate', 'msg6', 'deposit', to - 6 * UnixTime.HOUR, {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: 10000,
          srcValueUsd: 4000,
          dstValueUsd: 4000,
        }),
        createTransfer('stargate', 'msg7', 'deposit', to - 7 * UnixTime.HOUR, {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'usdc',
          dstAbstractTokenId: 'usdc',
          duration: 11000,
          srcValueUsd: 500,
          dstValueUsd: 500,
        }),
        createTransfer('stargate', 'msg8', 'deposit', to - 8 * UnixTime.HOUR, {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'usdc',
          duration: 12000,
          srcValueUsd: 3500,
          dstValueUsd: 3500,
        }),
      ]

      const configs: InteropAggregationConfig[] = [
        // Config1: Plain plugin filter - should match msg1 (across)
        {
          id: 'config1',
          bridgeType: 'lockAndMint',
          plugins: [{ plugin: 'across' }],
        },
        // Config2: Chain plugin filter - should match msg3 (ethereum->arbitrum) and msg5 (arbitrum->ethereum)
        {
          id: 'config2',
          bridgeType: 'lockAndMint',
          plugins: [{ chain: 'ethereum', plugin: 'cctp-v1' }],
        },
        // Config3: AbstractTokenId plugin filter - should match msg6 (eth->eth) and msg8 (eth->usdc, src is eth)
        {
          id: 'config3',
          bridgeType: 'lockAndMint',
          plugins: [
            {
              abstractTokenId: 'eth',
              plugin: 'stargate',
            },
          ],
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
        insertMany: mockFn().resolvesTo(5),
      })
      const aggregatedInteropToken = mockObject<
        Database['aggregatedInteropToken']
      >({
        deleteAllButEarliestPerDayBefore: mockFn().resolvesTo(0),
        deleteByTimestamp: mockFn().resolvesTo(0),
        insertMany: mockFn().resolvesTo(5),
      })

      const transaction = mockFn(async (fn: any) => await fn())

      const db = mockDatabase({
        interopTransfer,
        aggregatedInteropTransfer,
        aggregatedInteropToken,
        transaction,
      })

      const indexer = new InteropAggregatingIndexer({
        db,
        configs,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
        logger: Logger.SILENT,
        minHeight: 0,
      })

      await indexer.update(0, to)

      expect(
        aggregatedInteropTransfer.deleteAllButEarliestPerDayBefore,
      ).toHaveBeenCalledWith(from)
      expect(aggregatedInteropTransfer.deleteByTimestamp).toHaveBeenCalledWith(
        to,
      )
      expect(aggregatedInteropTransfer.insertMany).toHaveBeenCalledWith([
        // Config1: Plain plugin filter - should match msg1 (across)
        {
          timestamp: to,
          id: 'config1',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 1,
          totalDurationSum: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
        },
        // Config2: Chain plugin filter - should match msg3 (ethereum->arbitrum)
        {
          timestamp: to,
          id: 'config2',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 1,
          totalDurationSum: 7000,
          srcValueUsd: 1000,
          dstValueUsd: 1000,
        },
        // Config2: Chain plugin filter - should match msg5 (arbitrum->ethereum)
        {
          timestamp: to,
          id: 'config2',
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          transferCount: 1,
          totalDurationSum: 9000,
          srcValueUsd: 2500,
          dstValueUsd: 2500,
        },
        // Config3: AbstractTokenId plugin filter - should match msg6 (eth->eth)
        {
          timestamp: to,
          id: 'config3',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          transferCount: 3,
          totalDurationSum: 28000,
          srcValueUsd: 10500,
          dstValueUsd: 10500,
        },
      ])
      expect(aggregatedInteropToken.insertMany).toHaveBeenCalledWith([
        // Config1: Plain plugin filter - should match msg1 (across)
        {
          timestamp: to,
          id: 'config1',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'eth',
          transferCount: 1,
          totalDurationSum: 5000,
          volume: 2000,
        },
        // Config2: Chain plugin filter - should match msg3 (ethereum->arbitrum)
        {
          timestamp: to,
          id: 'config2',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'usdc',
          transferCount: 1,
          totalDurationSum: 7000,
          volume: 1000,
        },
        // Config2: Chain plugin filter - should match msg5 (arbitrum->ethereum)
        {
          timestamp: to,
          id: 'config2',
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
          abstractTokenId: 'usdc',
          transferCount: 1,
          totalDurationSum: 9000,
          volume: 2500,
        },
        // Config3: AbstractTokenId plugin filter - should match msg6 (eth->eth) and msg8 (eth->usdc)
        {
          timestamp: to,
          id: 'config3',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'eth',
          transferCount: 2,
          totalDurationSum: 22000,
          volume: 7500,
        },
        {
          timestamp: to,
          id: 'config3',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          abstractTokenId: 'usdc',
          transferCount: 1,
          totalDurationSum: 12000,
          volume: 3500,
        },
      ])
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
    srcWasBurned: undefined,
    srcSymbol: undefined,
    srcAmount: undefined,
    srcPrice: undefined,
    dstTime: timestamp + overrides.duration,
    dstTxHash: 'random-hash',
    dstLogIndex: 0,
    dstEventId: 'random-event-id',
    dstTokenAddress: undefined,
    dstRawAmount: undefined,
    dstWasMinted: undefined,
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
