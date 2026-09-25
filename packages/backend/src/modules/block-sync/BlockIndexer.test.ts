import { Logger } from '@l2beat/backend-tools'
import type { BlockProvider, LogsProvider } from '@l2beat/shared'
import type { Block, Log } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { IndexerService } from '../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../tools/uif/ids'
import type { BlockProcessor } from '../types'
import {
  BlockIndexer,
  type BlockIndexerDeps,
  onlyConsistent,
} from './BlockIndexer'

describe(onlyConsistent.name, () => {
  const EMPTY_LOGS_BLOOM = `0x${'0'.repeat(512)}`
  const FULL_LOGS_BLOOM = `0x${'1'.repeat(512)}`
  const noConfirm = mockFn<(block: Block) => Promise<boolean>>()

  it('handles the case where everything works', async () => {
    const block1 = { hash: '0x1', logsBloom: FULL_LOGS_BLOOM } as Block
    const block2 = { hash: '0x2', logsBloom: EMPTY_LOGS_BLOOM } as Block
    const block3 = { hash: '0x3', logsBloom: FULL_LOGS_BLOOM } as Block

    const logA = { data: '0xa', blockHash: '0x1' } as Log
    const logB = { data: '0xb', blockHash: '0x3' } as Log
    const logC = { data: '0xc', blockHash: '0x3' } as Log

    const result = await onlyConsistent(
      [block1, block2, block3],
      [logA, logB, logC],
      noConfirm,
    )
    expect(result).toEqual([
      { block: block1, logs: [logA] },
      { block: block2, logs: [] },
      { block: block3, logs: [logB, logC] },
    ])
    expect(noConfirm).not.toHaveBeenCalled()
  })

  it('handles a reorg', async () => {
    const block1 = { hash: '0x1', logsBloom: FULL_LOGS_BLOOM } as Block
    const block2 = { hash: '0x2', logsBloom: EMPTY_LOGS_BLOOM } as Block
    // This hash is reorged from 0x3 to 0x4
    const block3 = { hash: '0x4', logsBloom: FULL_LOGS_BLOOM } as Block

    const logA = { data: '0xa', blockHash: '0x1' } as Log
    const logB = { data: '0xb', blockHash: '0x3' } as Log
    const logC = { data: '0xc', blockHash: '0x3' } as Log

    const result = await onlyConsistent(
      [block1, block2, block3],
      [logA, logB, logC],
      noConfirm,
    )
    expect(result).toEqual([
      { block: block1, logs: [logA] },
      { block: block2, logs: [] },
    ])
    expect(noConfirm).not.toHaveBeenCalled()
  })

  it('handles missing logs', async () => {
    const block1 = { hash: '0x1', logsBloom: FULL_LOGS_BLOOM } as Block
    const block2 = { hash: '0x2', logsBloom: EMPTY_LOGS_BLOOM } as Block
    const block3 = { hash: '0x3', logsBloom: FULL_LOGS_BLOOM } as Block

    const logA = { data: '0xa', blockHash: '0x1' } as Log

    const result = await onlyConsistent(
      [block1, block2, block3],
      [logA],
      noConfirm,
    )
    expect(result).toEqual([
      { block: block1, logs: [logA] },
      { block: block2, logs: [] },
    ])
    expect(noConfirm).not.toHaveBeenCalled()
  })

  describe('asynchronous execution (settledHeight present)', () => {
    const tx = { hash: '0xt' }
    function asyncBlock(
      number: number,
      logsBloom: string,
      transactions: Block['transactions'],
    ): Block {
      return {
        ...makeBlock(number, 0),
        logsBloom,
        settledHeight: 1,
        transactions,
      }
    }

    it('ignores the bloom when logs are present', async () => {
      // header bloom is empty because it describes other (settled) blocks
      const block1 = asyncBlock(1, EMPTY_LOGS_BLOOM, [tx])
      const logA = { data: '0xa', blockHash: block1.hash } as Log

      const result = await onlyConsistent([block1], [logA], noConfirm)

      expect(result).toEqual([{ block: block1, logs: [logA] }])
      expect(noConfirm).not.toHaveBeenCalled()
    })

    it('accepts a block without transactions regardless of the bloom', async () => {
      const block1 = asyncBlock(1, FULL_LOGS_BLOOM, [])

      const result = await onlyConsistent([block1], [], noConfirm)

      expect(result).toEqual([{ block: block1, logs: [] }])
      expect(noConfirm).not.toHaveBeenCalled()
    })

    it('confirms a block with transactions but no logs', async () => {
      const block1 = asyncBlock(1, FULL_LOGS_BLOOM, [tx])
      const block2 = asyncBlock(2, FULL_LOGS_BLOOM, [tx])
      const confirm = mockFn<(block: Block) => Promise<boolean>>()
        .resolvesToOnce(true)
        .resolvesToOnce(false)

      const result = await onlyConsistent([block1, block2], [], confirm)

      expect(result).toEqual([{ block: block1, logs: [] }])
      expect(confirm).toHaveBeenCalledTimes(2)
      expect(confirm).toHaveBeenNthCalledWith(1, block1)
      expect(confirm).toHaveBeenNthCalledWith(2, block2)
    })

    it('keeps the bloom rule for blocks without settledHeight', async () => {
      const block1 = { ...makeBlock(1, 0), transactions: [tx] }

      const result = await onlyConsistent([block1], [], noConfirm)

      expect(result).toEqual([])
      expect(noConfirm).not.toHaveBeenCalled()
    })
  })
})

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
      const getTransactionReceipt = mockFn<
        BlockProvider['getTransactionReceipt']
      >().executes(async (hash: string) => {
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
