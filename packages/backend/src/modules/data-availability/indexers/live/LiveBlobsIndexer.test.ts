import { Logger } from '@l2beat/backend-tools'
import type { EthereumDaTrackingConfig } from '@l2beat/config'
import type { Database, LiveBlockRecord } from '@l2beat/database'
import type {
  EthereumBlobBatch,
  EthereumDaProvider,
  IRpcClient,
} from '@l2beat/shared'
import { ProjectId, slotStart, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { IndexerService } from '../../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../../tools/uif/ids'
import { LiveBlobsIndexer } from './LiveBlobsIndexer'
import { LIVE_WINDOW_BLOCKS } from './liveBlobs'

/**
 * Methodology: the database is mocked and the provider is a fake chain in
 * which block `n` sits in slot `n + SLOT_OFFSET`, has hash `0x<n>` and builds
 * on `0x<n - 1>`. Tests assert what is written, pruned and deleted
 */
describe(LiveBlobsIndexer.name, () => {
  const HEAD = 20_000_000
  const WINDOW_START = HEAD - LIVE_WINDOW_BLOCKS
  const INBOX = '0xinbox'

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(LiveBlobsIndexer.prototype.update.name, () => {
    it('stores a batch of blocks attributed by the configs in force at each', async () => {
      // The inbox changed hands at block HEAD - 7
      const configurations = [
        ethereumConfig('old', { inbox: INBOX, untilBlock: HEAD - 8 }),
        ethereumConfig('new', { inbox: INBOX, sinceBlock: HEAD - 7 }),
      ]
      const { indexer, db, daProvider } = setup({
        configurations,
        batchSize: 4,
        batches: {
          [HEAD - 8]: [batch({ txIndex: 2, to: INBOX, blobs: 3 })],
          [HEAD - 7]: [
            batch({ txIndex: 0, to: INBOX, blobs: 1 }),
            batch({ txIndex: 1, to: '0xelsewhere', blobs: 2 }),
          ],
        },
      })

      const newHeight = await indexer.update(HEAD - 9, HEAD)

      expect(newHeight).toEqual(HEAD - 6)
      expect(daProvider.getBlocksWithBlobBatches).toHaveBeenOnlyCalledWith(
        HEAD - 9,
        HEAD - 6,
      )
      expect(db.liveBlock.upsertMany).toHaveBeenOnlyCalledWith([
        liveBlock(HEAD - 9, 0),
        liveBlock(HEAD - 8, 3),
        liveBlock(HEAD - 7, 3),
        liveBlock(HEAD - 6, 0),
      ])
      expect(db.liveBlobBatch.upsertMany).toHaveBeenOnlyCalledWith([
        liveBatch(HEAD - 8, 2, INBOX, 3, ProjectId('old')),
        liveBatch(HEAD - 7, 0, INBOX, 1, ProjectId('new')),
        liveBatch(HEAD - 7, 1, '0xelsewhere', 2, undefined),
      ])
    })

    it('prunes the blocks that fell out of the window', async () => {
      const { indexer, db } = setup({ batchSize: 50 })

      await indexer.update(HEAD - 9, HEAD)

      expect(db.liveBlock.deleteBeforeBlock).toHaveBeenOnlyCalledWith(
        WINDOW_START,
      )
      expect(db.liveBlobBatch.deleteBeforeBlock).toHaveBeenOnlyCalledWith(
        WINDOW_START,
      )
    })

    it('skips the blocks older than the window', async () => {
      const { indexer, daProvider } = setup({ batchSize: 50 })

      const newHeight = await indexer.update(1, HEAD)

      expect(newHeight).toEqual(WINDOW_START + 49)
      expect(daProvider.getBlocksWithBlobBatches).toHaveBeenOnlyCalledWith(
        WINDOW_START,
        WINDOW_START + 49,
      )
    })

    it('refuses a batch that does not build on the newest stored block', async () => {
      // An orphaned block was stored: the target finds the fork there, and
      // until it does the update keeps failing rather than build on it
      const { indexer, db } = setup({
        stored: [{ ...liveBlock(HEAD - 10, 0), hash: '0xorphan' }],
      })

      await expect(indexer.update(HEAD - 9, HEAD)).toBeRejectedWith(
        `Block ${HEAD - 9} does not build on the block before it`,
      )
      expect(db.liveBlock.upsertMany).not.toHaveBeenCalled()
    })

    it('refuses a batch whose blocks do not build on each other', async () => {
      // A load-balanced RPC can serve a batch from nodes on both sides of a
      // reorg; the retried update fetches it again
      const { indexer } = setup({ brokenLinkAt: HEAD - 5 })

      await expect(indexer.update(HEAD - 9, HEAD)).toBeRejectedWith(
        `Block ${HEAD - 5} does not build on the block before it`,
      )
    })
  })

  describe(LiveBlobsIndexer.prototype.invalidate.name, () => {
    it('deletes the blocks above the height', async () => {
      const { indexer, db } = setup({})

      expect(await indexer.invalidate(HEAD - 3)).toEqual(HEAD - 3)

      expect(db.liveBlock.deleteAfterBlock).toHaveBeenOnlyCalledWith(HEAD - 3)
      expect(db.liveBlobBatch.deleteAfterBlock).toHaveBeenOnlyCalledWith(
        HEAD - 3,
      )
    })
  })

  describe(LiveBlobsIndexer.prototype.initialize.name, () => {
    it('wipes a state older than the window and starts at its start', async () => {
      const { indexer, db } = setup({ safeHeight: WINDOW_START - 2 })

      expect(await indexer.initialize()).toEqual({
        safeHeight: WINDOW_START - 1,
        configHash: undefined,
      })
      expect(db.liveBlock.deleteAll).toHaveBeenCalledTimes(1)
      expect(db.liveBlobBatch.deleteAll).toHaveBeenCalledTimes(1)
    })

    it('starts at the start of the window the first time', async () => {
      const { indexer } = setup({ safeHeight: undefined })

      expect(await indexer.initialize()).toEqual({
        safeHeight: WINDOW_START - 1,
        configHash: undefined,
      })
    })

    it('carries on from a state within the window', async () => {
      const { indexer, db } = setup({ safeHeight: WINDOW_START })

      expect(await indexer.initialize()).toEqual({
        safeHeight: WINDOW_START,
        configHash: undefined,
      })
      expect(db.liveBlock.deleteAll).not.toHaveBeenCalled()
    })
  })

  function setup(options: {
    configurations?: (EthereumDaTrackingConfig & { projectId: ProjectId })[]
    batchSize?: number
    batches?: Record<number, EthereumBlobBatch[]>
    safeHeight?: number
    stored?: LiveBlockRecord[]
    brokenLinkAt?: number
  }) {
    const stored = options.stored ?? []
    const liveBlock = mockObject<Database['liveBlock']>({
      getByBlockNumberRange: async (from: number, to: number) =>
        stored.filter((b) => from <= b.blockNumber && b.blockNumber <= to),
      upsertMany: mockFn().resolvesTo(0),
      deleteBeforeBlock: mockFn().resolvesTo(0),
      deleteAfterBlock: mockFn().resolvesTo(0),
      deleteAll: mockFn().resolvesTo(0),
    })
    const liveBlobBatch = mockObject<Database['liveBlobBatch']>({
      upsertMany: mockFn().resolvesTo(0),
      deleteBeforeBlock: mockFn().resolvesTo(0),
      deleteAfterBlock: mockFn().resolvesTo(0),
      deleteAll: mockFn().resolvesTo(0),
    })
    const db = mockObject<Database>({
      transaction: async <T>(fn: () => Promise<T>) => await fn(),
      liveBlock,
      liveBlobBatch,
    })
    const daProvider = mockObject<EthereumDaProvider>({
      getBlocksWithBlobBatches: mockFn(async (from: number, to: number) =>
        Array.from({ length: to - from + 1 }, (_, i) => ({
          number: from + i,
          hash: `0x${from + i}`,
          parentHash:
            from + i === options.brokenLinkAt
              ? '0xelsewhere'
              : `0x${from + i - 1}`,
          timestamp: timestampOf(from + i),
          batches: options.batches?.[from + i] ?? [],
        })),
      ),
    })
    const indexerService = mockObject<IndexerService>({
      getIndexerState: mockFn().resolvesTo(
        options.safeHeight === undefined
          ? undefined
          : { safeHeight: options.safeHeight, configHash: undefined },
      ),
    })
    const indexer = new LiveBlobsIndexer(
      {
        db,
        daProvider,
        rpc: mockObject<IRpcClient>({
          getLatestBlockNumber: mockFn().resolvesTo(HEAD),
        }),
        configurations: options.configurations ?? [],
        batchSize: options.batchSize ?? 50,
        indexerService,
        parents: [],
        minHeight: 0,
      },
      Logger.SILENT,
    )
    return { indexer, db: { liveBlock, liveBlobBatch }, daProvider }
  }
})

const SLOT_OFFSET = -8_000_000

function timestampOf(blockNumber: number) {
  return UnixTime(slotStart(blockNumber + SLOT_OFFSET))
}

function liveBlock(blockNumber: number, blobCount: number) {
  return {
    slot: blockNumber + SLOT_OFFSET,
    blockNumber,
    hash: `0x${blockNumber}`,
    timestamp: timestampOf(blockNumber),
    blobCount,
  }
}

function liveBatch(
  blockNumber: number,
  txIndex: number,
  to: string,
  blobs: number,
  projectId: ProjectId | undefined,
) {
  return {
    slot: blockNumber + SLOT_OFFSET,
    txIndex,
    blockNumber,
    from: '0xsequencer',
    to,
    blobs,
    projectId,
  }
}

function batch(
  fields: Pick<EthereumBlobBatch, 'txIndex' | 'to' | 'blobs'>,
): EthereumBlobBatch {
  return { from: '0xsequencer', topics: [], ...fields }
}

function ethereumConfig(
  projectId: string,
  fields: Partial<EthereumDaTrackingConfig>,
): EthereumDaTrackingConfig & { projectId: ProjectId } {
  return {
    type: 'ethereum',
    daLayer: ProjectId('ethereum'),
    inbox: '0xnone',
    sinceBlock: 0,
    ...fields,
    projectId: ProjectId(projectId),
  }
}
