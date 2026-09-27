import { Logger } from '@l2beat/backend-tools'
import {
  type BlockProvider,
  getRpcMetricsContext,
  type LogsProvider,
} from '@l2beat/shared'
import type { Block, Log } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { IndexerService } from '../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../tools/uif/ids'
import type { BlockProcessor } from '../types'
import { BlockIndexer, type BlockIndexerDeps } from './BlockIndexer'

describe(BlockIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(BlockIndexer.prototype.update.name, () => {
    it('stops at configured timestamp and returns last processed block', async () => {
      const block1 = makeBlock(10, 1_000)
      const block2 = makeBlock(11, 2_000)
      const block3 = makeBlock(12, 3_000)
      const log1 = makeLog(block1, 1)
      const log2 = makeLog(block2, 2)
      const log3 = makeLog(block3, 3)
      const processBlock = mockFn().resolvesTo(undefined)

      const indexer = createIndexer({
        blockProvider: mockObject<BlockProvider>({
          getBlockWithTransactions: mockFn()
            .resolvesToOnce(block1)
            .resolvesToOnce(block2)
            .resolvesToOnce(block3),
        }),
        logsProvider: mockObject<LogsProvider>({
          getLogs: mockFn().resolvesTo([log1, log2, log3]),
        }),
        blockProcessors: [
          mockObject<BlockProcessor>({
            chain: 'ethereum',
            processBlock,
          }),
        ],
        stopBlockIndexerAtTimestampMs: 2_000,
      })

      const result = await indexer.update(10, 12)

      expect(result).toEqual(11)
      expect(processBlock).toHaveBeenCalledTimes(2)
      expect(processBlock).toHaveBeenCalledWith(block1, [log1])
      expect(processBlock).toHaveBeenCalledWith(block2, [log2])
    })

    it('confirms a block without logs through its receipts', async () => {
      const block1 = {
        ...makeBlock(10, 1_000),
        settledHeight: 8,
        transactions: [{ hash: '0xa' }, { hash: '0xb' }],
      }
      const block2 = {
        ...makeBlock(11, 2_000),
        settledHeight: 9,
        transactions: [{ hash: '0xc' }],
      }
      const processBlock = mockFn().resolvesTo(undefined)
      const receiptContexts: ReturnType<typeof getRpcMetricsContext>[] = []
      const getTransactionReceipt = mockFn<
        BlockProvider['getTransactionReceipt']
      >().executes(async (hash: string) => {
        receiptContexts.push(getRpcMetricsContext())
        if (hash === '0xc') {
          // receipt with logs: eth_getLogs must have been incomplete
          return { blockHash: block2.hash, logs: [{}] }
        }
        return { blockHash: block1.hash, logs: [] }
      })

      const indexer = createIndexer({
        blockProvider: mockObject<BlockProvider>({
          getBlockWithTransactions: mockFn()
            .resolvesToOnce(block1)
            .resolvesToOnce(block2),
          getTransactionReceipt,
        }),
        logsProvider: mockObject<LogsProvider>({
          getLogs: mockFn().resolvesTo([]),
        }),
        blockProcessors: [
          mockObject<BlockProcessor>({
            chain: 'ethereum',
            processBlock,
          }),
        ],
      })

      const result = await indexer.update(10, 11)

      expect(result).toEqual(10)
      expect(getTransactionReceipt).toHaveBeenCalledTimes(3)
      expect(processBlock).toHaveBeenOnlyCalledWith(block1, [])
      // receipts are attributed to the fetch, not left uncategorized
      expect(receiptContexts).toEqual([
        { coreFeature: 'blockSync.fetch', chain: 'ethereum' },
        { coreFeature: 'blockSync.fetch', chain: 'ethereum' },
        { coreFeature: 'blockSync.fetch', chain: 'ethereum' },
      ])
    })

    it('fetches logs from before the batch once the chain settles asynchronously', async () => {
      const blocks = new Map(
        [100, 101, 102, 103].map((number) => [
          number,
          { ...makeBlock(number, 1_000), settledHeight: number - 2 },
        ]),
      )
      const getLogs = mockFn<LogsProvider['getLogs']>().resolvesTo([])
      const indexer = createIndexer({
        blockProvider: mockObject<BlockProvider>({
          getBlockWithTransactions: async (number) => {
            const block = blocks.get(Number(number))
            if (!block) throw new Error(`Unexpected block ${number}`)
            return block
          },
        }),
        logsProvider: mockObject<LogsProvider>({ getLogs }),
      })

      await indexer.update(100, 101)
      await indexer.update(102, 103)

      expect(getLogs).toHaveBeenNthCalledWith(1, 100, 101)
      expect(getLogs).toHaveBeenNthCalledWith(2, 70, 103)
    })

    it('stops at a block whose receipts cannot be fetched', async () => {
      const block1 = { ...makeBlock(10, 1_000), settledHeight: 8 }
      const block2 = {
        ...makeBlock(11, 2_000),
        settledHeight: 9,
        transactions: [{ hash: '0xa' }],
      }
      const log1 = makeLog(block1, 1)
      const processBlock = mockFn().resolvesTo(undefined)

      const indexer = createIndexer({
        blockProvider: mockObject<BlockProvider>({
          getBlockWithTransactions: mockFn()
            .resolvesToOnce(block1)
            .resolvesToOnce(block2),
          getTransactionReceipt: mockFn().rejectsWith(new Error('rpc down')),
        }),
        logsProvider: mockObject<LogsProvider>({
          getLogs: mockFn().resolvesTo([log1]),
        }),
        blockProcessors: [
          mockObject<BlockProcessor>({ chain: 'ethereum', processBlock }),
        ],
      })

      const result = await indexer.update(10, 11)

      expect(result).toEqual(10)
      expect(processBlock).toHaveBeenOnlyCalledWith(block1, [log1])
    })

    it('rejects a block without logs when a receipt belongs to another block', async () => {
      const block1 = {
        ...makeBlock(10, 1_000),
        settledHeight: 8,
        transactions: [{ hash: '0xa' }],
      }

      const indexer = createIndexer({
        blockProvider: mockObject<BlockProvider>({
          getBlockWithTransactions: mockFn().resolvesToOnce(block1),
          getTransactionReceipt: mockFn().resolvesTo({
            blockHash: '0xreorged',
            logs: [],
          }),
        }),
        logsProvider: mockObject<LogsProvider>({
          getLogs: mockFn().resolvesTo([]),
        }),
      })

      await expect(indexer.update(10, 10)).toBeRejectedWith(
        "Couldn't get consistent blocks & logs",
      )
    })

    it('throws without processing when first block exceeds configured timestamp', async () => {
      const block = makeBlock(10, 3_000)
      const log = makeLog(block, 1)
      const processBlock = mockFn().resolvesTo(undefined)

      const indexer = createIndexer({
        blockProvider: mockObject<BlockProvider>({
          getBlockWithTransactions: mockFn().resolvesToOnce(block),
        }),
        logsProvider: mockObject<LogsProvider>({
          getLogs: mockFn().resolvesTo([log]),
        }),
        blockProcessors: [
          mockObject<BlockProcessor>({
            chain: 'ethereum',
            processBlock,
          }),
        ],
        stopBlockIndexerAtTimestampMs: 2_000,
      })

      await expect(indexer.update(10, 10)).toBeRejectedWith(
        /STOP_BLOCK_INDEXER_AT_TIMESTAMP_MS/,
      )
      expect(processBlock).not.toHaveBeenCalled()
    })
  })
})

function createIndexer(overrides: Partial<BlockIndexerDeps> = {}) {
  const defaults: BlockIndexerDeps = {
    source: 'ethereum',
    blockProvider: mockObject<BlockProvider>({
      getBlockWithTransactions: mockFn(),
    }),
    logsProvider: mockObject<LogsProvider>({
      getLogs: mockFn().resolvesTo([]),
    }),
    blockProcessors: [],
    stopBlockIndexerAtTimestampMs: undefined,
    batchSize: 50,
    minHeight: 1,
    parents: [],
    indexerService: mockObject<IndexerService>(),
  }

  return new BlockIndexer({ ...defaults, ...overrides }, Logger.SILENT)
}

function makeBlock(number: number, timestamp: number): Block {
  return {
    number,
    hash: `0x${number}`,
    logsBloom: `0x${'1'.repeat(512)}`,
    timestamp,
    transactions: [],
  }
}

function makeLog(block: Block, logIndex: number): Log {
  return {
    address: '0x1',
    topics: [],
    data: '0x',
    blockNumber: block.number,
    blockHash: block.hash,
    transactionHash: `0x${block.number}`,
    logIndex,
  }
}
