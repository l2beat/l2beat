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

  it('handles the case where everything works', () => {
    const block1 = { hash: '0x1', logsBloom: FULL_LOGS_BLOOM } as Block
    const block2 = { hash: '0x2', logsBloom: EMPTY_LOGS_BLOOM } as Block
    const block3 = { hash: '0x3', logsBloom: FULL_LOGS_BLOOM } as Block

    const logA = { data: '0xa', blockHash: '0x1' } as Log
    const logB = { data: '0xb', blockHash: '0x3' } as Log
    const logC = { data: '0xc', blockHash: '0x3' } as Log

    const result = onlyConsistent([block1, block2, block3], [logA, logB, logC])
    expect(result).toEqual([
      { block: block1, logs: [logA] },
      { block: block2, logs: [] },
      { block: block3, logs: [logB, logC] },
    ])
  })

  it('handles a reorg', () => {
    const block1 = { hash: '0x1', logsBloom: FULL_LOGS_BLOOM } as Block
    const block2 = { hash: '0x2', logsBloom: EMPTY_LOGS_BLOOM } as Block
    // This hash is reorged from 0x3 to 0x4
    const block3 = { hash: '0x4', logsBloom: FULL_LOGS_BLOOM } as Block

    const logA = { data: '0xa', blockHash: '0x1' } as Log
    const logB = { data: '0xb', blockHash: '0x3' } as Log
    const logC = { data: '0xc', blockHash: '0x3' } as Log

    const result = onlyConsistent([block1, block2, block3], [logA, logB, logC])
    expect(result).toEqual([
      { block: block1, logs: [logA] },
      { block: block2, logs: [] },
    ])
  })

  it('handles missing logs', () => {
    const block1 = { hash: '0x1', logsBloom: FULL_LOGS_BLOOM } as Block
    const block2 = { hash: '0x2', logsBloom: EMPTY_LOGS_BLOOM } as Block
    const block3 = { hash: '0x3', logsBloom: FULL_LOGS_BLOOM } as Block

    const logA = { data: '0xa', blockHash: '0x1' } as Log

    const result = onlyConsistent([block1, block2, block3], [logA])
    expect(result).toEqual([
      { block: block1, logs: [logA] },
      { block: block2, logs: [] },
    ])
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
