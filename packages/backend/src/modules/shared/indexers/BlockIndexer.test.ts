import { Logger } from '@l2beat/backend-tools'
import type { BlockProvider } from '@l2beat/shared'
import { type Block, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { BlockProcessor } from '../types'
import { BlockIndexer, type BlockIndexerDeps } from './BlockIndexer'

describe(BlockIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(BlockIndexer.prototype.update.name, () => {
    it('fetches block and calls processors in LATEST_ONLY mode', async () => {
      const block = mockBlock(10)

      const mockBlockProvider = mockObject<BlockProvider>({
        getBlockWithTransactions: mockFn().resolvesTo(block),
      })

      const mockProcessor = mockObject<BlockProcessor>({
        processBlock: mockFn().resolvesTo(undefined),
      })

      const indexer = createIndexer({
        mode: 'LATEST_ONLY',
        blockProvider: mockBlockProvider,
        processors: [mockProcessor],
      })

      const newSafeHeight = await indexer.update(0, block.number)

      expect(mockBlockProvider.getBlockWithTransactions).toHaveBeenCalledWith(
        block.number,
      )

      expect(mockProcessor.processBlock).toHaveBeenCalledWith(block)

      expect(newSafeHeight).toEqual(block.number)
    })

    it('fetches block and calls processors in CONTINUOUS mode', async () => {
      const blocks = [mockBlock(8), mockBlock(9), mockBlock(10)]

      const mockBlockProvider = mockObject<BlockProvider>({
        getBlockWithTransactions: mockFn()
          .resolvesToOnce(blocks[0])
          .resolvesToOnce(blocks[1])
          .resolvesToOnce(blocks[2]),
      })

      const mockProcessor = mockObject<BlockProcessor>({
        processBlock: mockFn().resolvesTo(undefined),
      })

      const indexer = createIndexer({
        mode: 'CONTINUOUS',
        blockProvider: mockBlockProvider,
        processors: [mockProcessor],
      })

      const newSafeHeight = await indexer.update(8, 10)

      expect(
        mockBlockProvider.getBlockWithTransactions,
      ).toHaveBeenNthCalledWith(1, blocks[0].number)

      expect(
        mockBlockProvider.getBlockWithTransactions,
      ).toHaveBeenNthCalledWith(2, blocks[1].number)

      expect(
        mockBlockProvider.getBlockWithTransactions,
      ).toHaveBeenNthCalledWith(3, blocks[2].number)

      expect(mockProcessor.processBlock).toHaveBeenNthCalledWith(1, blocks[0])

      expect(mockProcessor.processBlock).toHaveBeenNthCalledWith(2, blocks[1])

      expect(mockProcessor.processBlock).toHaveBeenNthCalledWith(3, blocks[2])

      expect(newSafeHeight).toEqual(10)
    })

    it('handles processor errors', async () => {
      const block = mockBlock(10)

      const mockBlockProvider = mockObject<BlockProvider>({
        getBlockWithTransactions: mockFn().resolvesTo(block),
      })

      const mockProcessor1 = mockObject<BlockProcessor>({
        processBlock: mockFn().throws(new Error('Processor 1 failed')),
      })

      const mockProcessor2 = mockObject<BlockProcessor>({
        processBlock: mockFn().resolvesTo(undefined),
      })

      const indexer = createIndexer({
        mode: 'LATEST_ONLY',
        blockProvider: mockBlockProvider,
        processors: [mockProcessor1, mockProcessor2],
      })

      const newSafeHeight = await indexer.update(0, block.number)

      expect(mockBlockProvider.getBlockWithTransactions).toHaveBeenCalledWith(
        block.number,
      )

      expect(mockProcessor1.processBlock).toHaveBeenCalledWith(block)

      expect(mockProcessor2.processBlock).toHaveBeenCalledWith(block)

      expect(newSafeHeight).toEqual(block.number)
    })
  })

  describe(BlockIndexer.prototype.invalidate.name, () => {
    it('returns targetHeight', async () => {
      const indexer = createIndexer()

      const targetHeight = 10
      const newSafeHeight = await indexer.invalidate(targetHeight)

      expect(newSafeHeight).toEqual(targetHeight)
    })
  })
})

function createIndexer(deps?: Partial<BlockIndexerDeps>): BlockIndexer {
  return new BlockIndexer({
    logger: Logger.SILENT,
    parents: [],
    indexerService: mockObject<IndexerService>({}),
    minHeight: 0,
    mode: deps?.mode ?? 'LATEST_ONLY',
    source: 'test',
    blockProvider: mockObject<BlockProvider>({}),
    processors: [],
    ...deps,
  })
}

function mockBlock(blockNumber: number): Block {
  return {
    number: blockNumber,
    hash: 'hash',
    timestamp: UnixTime.now(),
    transactions: [],
  }
}
