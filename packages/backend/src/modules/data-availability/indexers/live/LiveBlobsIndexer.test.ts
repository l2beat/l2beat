import { Logger } from '@l2beat/backend-tools'
import type { EthereumDaTrackingConfig } from '@l2beat/config'
import type {
  Database,
  LiveBlobBatchRecord,
  LiveBlockRecord,
} from '@l2beat/database'
import type { EthereumBlobBatch, EthereumDaProvider } from '@l2beat/shared'
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
          [HEAD - 8]: [
            batch({ blockNumber: HEAD - 8, txIndex: 2, to: INBOX, blobs: 3 }),
          ],
          [HEAD - 7]: [
            batch({ blockNumber: HEAD - 7, txIndex: 0, to: INBOX, blobs: 1 }),
            batch({
              blockNumber: HEAD - 7,
              txIndex: 1,
              to: '0xelsewhere',
              blobs: 2,
            }),
          ],
        },
      })

      const newHeight = await indexer.update(HEAD - 9, HEAD)

      expect(newHeight).toEqual(HEAD - 6)
      expect(
        daProvider.getBlocksWithBlobBatchesFromReceipts,
      ).toHaveBeenOnlyCalledWith(HEAD - 9, HEAD - 6)
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

    it('attributes a batch on a shared inbox to the project naming its sender', async () => {
      // One project posts to the inbox from a named sequencer, another takes
      // anything sent there: the named sender is the closer match, whichever
      // config comes first
      const { indexer, db } = setup({
        configurations: [
          ethereumConfig('open', { inbox: INBOX }),
          ethereumConfig('named', {
            inbox: INBOX,
            sequencers: ['0xSEQUENCER'],
          }),
        ],
        batches: {
          [HEAD - 9]: [
            batch({ blockNumber: HEAD - 9, txIndex: 0, to: INBOX, blobs: 1 }),
          ],
        },
      })

      await indexer.update(HEAD - 9, HEAD - 9)

      expect(db.liveBlobBatch.upsertMany).toHaveBeenOnlyCalledWith([
        liveBatch(HEAD - 9, 0, INBOX, 1, ProjectId('named')),
      ])
    })

    it('logs how long after its slot started the newest block was stored', async () => {
      // The view can show a block no sooner than this
      const info = mockFn().returns(undefined)
      const logger: Logger = mockObject<Logger>({
        info,
        tag: () => logger,
        for: () => logger,
      })
      const { indexer } = setup({
        now: Number(timestampOf(HEAD - 6)) + 2.5,
        logger,
      })

      await indexer.update(HEAD - 9, HEAD - 6)

      expect(info).toHaveBeenLastCalledWith('Stored live blocks', {
        from: HEAD - 9,
        to: HEAD - 6,
        delaySeconds: 2.5,
      })
    })

    it('drops what was stored at the fetched heights before storing', async () => {
      // A replay after a crash may fetch a chain other than the stored one
      const { indexer, db } = setup({ batchSize: 4 })

      await indexer.update(HEAD - 9, HEAD)

      expect(db.liveBlock.deleteAfterBlock).toHaveBeenOnlyCalledWith(HEAD - 10)
      expect(db.liveBlobBatch.deleteAfterBlock).toHaveBeenOnlyCalledWith(
        HEAD - 10,
      )
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
      expect(
        daProvider.getBlocksWithBlobBatchesFromReceipts,
      ).toHaveBeenOnlyCalledWith(WINDOW_START, WINDOW_START + 49)
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

  describe('reattributing the stored batches', () => {
    it('updates the stored batches whose project changed, on the first update only', async () => {
      // Stored before a deploy that moved the inbox to another project; the
      // window is not fetched again for it
      const kept = liveBatch(HEAD - 20, 0, '0xelsewhere', 1, undefined)
      const moved = liveBatch(HEAD - 20, 1, INBOX, 2, ProjectId('old'))
      const { indexer, db } = setup({
        configurations: [ethereumConfig('new', { inbox: INBOX })],
        storedBatches: [kept, moved],
      })

      await indexer.update(HEAD - 9, HEAD - 9)
      const reads = db.liveBlobBatch.getByBlockNumberRange.calls.length
      await indexer.update(HEAD - 8, HEAD - 8)

      expect(db.liveBlobBatch.upsertMany).toHaveBeenNthCalledWith(1, [
        { ...moved, projectId: ProjectId('new') },
      ])
      expect(db.liveBlobBatch.getByBlockNumberRange).toHaveBeenCalledTimes(
        reads,
      )
    })

    it('matches a stored batch by the topics of its events', async () => {
      // Some projects are told only by an event their batch emits
      const stored = {
        ...liveBatch(HEAD - 20, 0, '0xelsewhere', 1, undefined),
        topics: ['0xtopic'],
      }
      const { indexer, db } = setup({
        configurations: [ethereumConfig('topical', { topics: ['0xTOPIC'] })],
        storedBatches: [stored],
      })

      await indexer.update(HEAD - 9, HEAD - 9)

      expect(db.liveBlobBatch.upsertMany).toHaveBeenNthCalledWith(1, [
        { ...stored, projectId: ProjectId('topical') },
      ])
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

  function setup(options: {
    configurations?: (EthereumDaTrackingConfig & { projectId: ProjectId })[]
    batchSize?: number
    batches?: Record<number, EthereumBlobBatch[]>
    stored?: LiveBlockRecord[]
    storedBatches?: LiveBlobBatchRecord[]
    brokenLinkAt?: number
    now?: number
    logger?: Logger
  }) {
    const stored = options.stored ?? []
    const liveBlock = mockObject<Database['liveBlock']>({
      findByBlockNumber: async (blockNumber: number) =>
        stored.find((b) => b.blockNumber === blockNumber),
      upsertMany: mockFn().resolvesTo(0),
      deleteBeforeBlock: mockFn().resolvesTo(0),
      deleteAfterBlock: mockFn().resolvesTo(0),
    })
    const storedBatches = options.storedBatches ?? []
    const liveBlobBatch = mockObject<Database['liveBlobBatch']>({
      getByBlockNumberRange: mockFn(async (from: number, to: number) =>
        storedBatches.filter(
          (b) => from <= b.blockNumber && b.blockNumber <= to,
        ),
      ),
      upsertMany: mockFn().resolvesTo(0),
      deleteBeforeBlock: mockFn().resolvesTo(0),
      deleteAfterBlock: mockFn().resolvesTo(0),
    })
    const db = mockObject<Database>({
      transaction: async <T>(fn: () => Promise<T>) => await fn(),
      liveBlock,
      liveBlobBatch,
    })
    const daProvider = mockObject<EthereumDaProvider>({
      getBlocksWithBlobBatchesFromReceipts: mockFn(
        async (from: number, to: number) =>
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
    const indexerService = mockObject<IndexerService>({})
    const indexer = new LiveBlobsIndexer(
      {
        db,
        daProvider,
        configurations: options.configurations ?? [],
        batchSize: options.batchSize ?? 50,
        indexerService,
        parents: [],
        minHeight: 0,
        now: () => options.now ?? Number(timestampOf(HEAD)),
      },
      options.logger ?? Logger.SILENT,
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
    txHash: txHashOf(blockNumber, txIndex),
    blockNumber,
    from: '0xsequencer',
    to,
    blobs,
    topics: [],
    projectId,
  }
}

function txHashOf(blockNumber: number, txIndex: number) {
  return `0x${blockNumber}${txIndex}`
}

function batch(
  fields: Pick<EthereumBlobBatch, 'txIndex' | 'to' | 'blobs'> & {
    blockNumber: number
  },
): EthereumBlobBatch {
  const { blockNumber, ...rest } = fields
  return {
    txHash: txHashOf(blockNumber, fields.txIndex),
    from: '0xsequencer',
    topics: [],
    ...rest,
  }
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
