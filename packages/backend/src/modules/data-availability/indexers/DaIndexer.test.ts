import { Logger } from '@l2beat/backend-tools'
import type { DataAvailabilityRecord, Database } from '@l2beat/database'
import type { DaBlob, DaProvider } from '@l2beat/shared'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import { expect, type MockObject, mockFn, mockObject } from 'earl'
import type {
  BlockDaIndexedConfig,
  DataAvailabilityTrackingConfig,
} from '../../../config/Config'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { Configuration } from '../../../tools/uif/multi/types'
import type { BlobService } from '../services/BlobService'
import { DaService } from '../services/DaService'
import { DaIndexer } from './DaIndexer'

// All test cases work on one layer.
// DaIndexer assumes that all configurations will have the same layer.
// Rest of the code is generic and works the same regardless of layer type (see DaService)
const DA_LAYER = 'test-layer'

describe(DaIndexer.name, () => {
  describe(DaIndexer.prototype.multiUpdate.name, () => {
    it('fetches blobs, generates records, saves metrics to DB', async () => {
      const mockInbox = EthereumAddress.random()
      const configurations = [
        config('project-a', mockInbox),
        config('project-b'),
      ]
      const blobs = [blob(100, 100_000), blob(200, 200_000)]
      const previousRecords = [record('project', 100, 100_000)]
      const generatedRecords = [record('project', 100, 400_000)]

      const { indexer, repository, daService, daProvider } = mockIndexer({
        configurations,
        blobs,
        previousRecords,
        generatedRecords,
        batchSize: 50,
      })

      const updateCallback = await indexer.multiUpdate(
        100,
        200,
        toIndexerConfigurations(configurations),
      )
      const safeHeight = await updateCallback()

      expect(daProvider.getBlobs).toHaveBeenOnlyCalledWith(DA_LAYER, 100, 150)
      expect(repository.getForDaLayerInTimeRange).toHaveBeenOnlyCalledWith(
        DA_LAYER,
        UnixTime.toStartOf(100, 'hour'),
        UnixTime.toEndOf(200, 'hour'),
      )
      expect(daService.generateRecords).toHaveBeenOnlyCalledWith(
        blobs,
        previousRecords,
        configurations,
      )

      expect(repository.upsertMany).toHaveBeenOnlyCalledWith(generatedRecords)

      expect(safeHeight).toEqual(150)
    })

    it('fetches blobs from cache, generates records, saves metrics to DB', async () => {
      const mockInbox = EthereumAddress.random()
      const configurations = [
        config('project-a', mockInbox),
        config('project-b'),
      ]
      const blobs = [blob(100, 100_000), blob(200, 200_000)]
      const previousRecords = [record('project', 100, 100_000)]
      const generatedRecords = [record('project', 100, 400_000)]

      const {
        indexer,
        repository,
        daService,
        daProvider,
        blobService,
        syncMetadataRepository,
      } = mockIndexer({
        configurations,
        blobs,
        previousRecords,
        generatedRecords,
        batchSize: 50,
        useBlobService: true,
      })

      const updateCallback = await indexer.multiUpdate(
        100,
        200,
        toIndexerConfigurations(configurations),
      )
      const safeHeight = await updateCallback()

      expect(daProvider.getBlobs).not.toHaveBeenCalled()
      expect(blobService!.get).toHaveBeenOnlyCalledWith(DA_LAYER, 100, 150)
      expect(repository.getForDaLayerInTimeRange).toHaveBeenOnlyCalledWith(
        DA_LAYER,
        UnixTime.toStartOf(100, 'hour'),
        UnixTime.toEndOf(200, 'hour'),
      )
      expect(daService.generateRecords).toHaveBeenOnlyCalledWith(
        blobs,
        previousRecords,
        configurations,
      )

      expect(repository.upsertMany).toHaveBeenOnlyCalledWith(generatedRecords)

      expect(syncMetadataRepository.updateSyncedUntil).toHaveBeenOnlyCalledWith(
        'dataAvailability',
        configurations.map((c) => c.projectId),
        UnixTime.toEndOf(
          generatedRecords[generatedRecords.length - 1].timestamp,
          'hour',
        ),
        150,
      )

      expect(safeHeight).toEqual(150)
    })

    describe('handles batch size', () => {
      it('from + batchSize > to', async () => {
        const { indexer, daProvider } = mockIndexer({
          batchSize: 50,
        })

        const updateCallback = await indexer.multiUpdate(100, 200, [])
        const safeHeight = await updateCallback()

        expect(daProvider.getBlobs).toHaveBeenOnlyCalledWith(DA_LAYER, 100, 150)
        expect(safeHeight).toEqual(150)
      })

      it('from + batchSize < to', async () => {
        const { indexer, daProvider } = mockIndexer({
          batchSize: 150,
        })

        const updateCallback = await indexer.multiUpdate(100, 200, [])
        const safeHeight = await updateCallback()

        expect(daProvider.getBlobs).toHaveBeenOnlyCalledWith(DA_LAYER, 100, 200)
        expect(safeHeight).toEqual(200)
      })
    })

    it('handles empty blobs response', async () => {
      const { indexer, repository, daService, daProvider } = mockIndexer({
        blobs: [],
        batchSize: 100,
      })

      const updateCallback = await indexer.multiUpdate(100, 200, [])
      const safeHeight = await updateCallback()

      expect(daProvider.getBlobs).toHaveBeenOnlyCalledWith(DA_LAYER, 100, 200)
      expect(safeHeight).toEqual(200)

      expect(repository.getForDaLayerInTimeRange).not.toHaveBeenCalled()
      expect(repository.upsertMany).not.toHaveBeenCalled()
      expect(daService.generateRecords).not.toHaveBeenCalled()
    })
  })

  describe(DaIndexer.prototype.wipeData.name, () => {
    it('wipes all data saved by configuration', async () => {
      const configurations = [config('project-a'), config('project-b')]

      const { repository, indexer } = mockIndexer({
        configurations,
      })

      await indexer.wipeData([
        { id: createId('project-a') },
        { id: createId('project-b') },
      ])

      expect(repository.deleteByConfigIds).toHaveBeenOnlyCalledWith([
        createId('project-a'),
        createId('project-b'),
      ])
    })
  })

  describe(DaIndexer.prototype.trimData.name, () => {
    it('deletes records before the raised sinceBlock, keeping the boundary hour', async () => {
      const configuration = config('project-a', undefined, {
        sinceBlock: 200,
      })

      const { repository, indexer, daProvider } = mockIndexer({
        configurations: [configuration],
        // Block 200 is 15 minutes into hour 10
        blockTimestamps: () =>
          UnixTime(10 * UnixTime.HOUR + 15 * UnixTime.MINUTE),
      })

      await indexer.trimData([{ id: createId('project-a'), range: [100, 199] }])

      expect(daProvider.getBlockTimestamp).toHaveBeenOnlyCalledWith(
        DA_LAYER,
        200,
      )
      expect(
        repository.deleteByConfigOutsideTimeRange,
      ).toHaveBeenOnlyCalledWith(
        createId('project-a'),
        // Hour 10 holds in-range blobs and is never re-indexed, so it stays
        UnixTime(10 * UnixTime.HOUR),
        null,
      )
      expect(repository.deleteByConfigIds).not.toHaveBeenCalled()
    })

    it('deletes records after the untilBlock, boundary hour included', async () => {
      const configuration = config('project-a', undefined, {
        sinceBlock: 100,
        untilBlock: 300,
      })

      const { repository, indexer, daProvider } = mockIndexer({
        configurations: [configuration],
        // Block 300 is 1 minute into hour 20
        blockTimestamps: () => UnixTime(20 * UnixTime.HOUR + UnixTime.MINUTE),
      })

      await indexer.trimData([{ id: createId('project-a'), range: [301, 500] }])

      expect(daProvider.getBlockTimestamp).toHaveBeenOnlyCalledWith(
        DA_LAYER,
        300,
      )
      expect(
        repository.deleteByConfigOutsideTimeRange,
      ).toHaveBeenOnlyCalledWith(
        createId('project-a'),
        null,
        // Hour 20 straddles the boundary so it is deleted as well
        UnixTime(19 * UnixTime.HOUR),
      )
      expect(repository.deleteByConfigIds).not.toHaveBeenCalled()
    })

    it('trims both edges when the whole range changed', async () => {
      const configuration = config('project-a', undefined, {
        sinceBlock: 200,
        untilBlock: 300,
      })

      const { repository, indexer } = mockIndexer({
        configurations: [configuration],
        blockTimestamps: (blockNumber) =>
          UnixTime(
            blockNumber === 200 ? 10 * UnixTime.HOUR : 20 * UnixTime.HOUR,
          ),
      })

      await indexer.trimData([
        { id: createId('project-a'), range: [100, 199] },
        { id: createId('project-a'), range: [301, 500] },
      ])

      expect(repository.deleteByConfigOutsideTimeRange).toHaveBeenCalledTimes(2)
      expect(repository.deleteByConfigOutsideTimeRange).toHaveBeenNthCalledWith(
        1,
        createId('project-a'),
        UnixTime(10 * UnixTime.HOUR),
        null,
      )
      expect(repository.deleteByConfigOutsideTimeRange).toHaveBeenNthCalledWith(
        2,
        createId('project-a'),
        null,
        UnixTime(19 * UnixTime.HOUR),
      )
    })
  })

  describe('range edits trim instead of wiping', () => {
    it('trims when sinceBlock of an existing configuration is raised', async () => {
      const configuration = config('project-a', undefined, { sinceBlock: 200 })
      const { repository, indexer } = mockIndexer({
        configurations: [configuration],
        indexerService: mockIndexerService({
          minHeight: 100,
          maxHeight: null,
          currentHeight: 500,
        }),
        blockTimestamps: () => UnixTime(10 * UnixTime.HOUR),
      })

      await indexer.initialize()

      expect(
        repository.deleteByConfigOutsideTimeRange,
      ).toHaveBeenOnlyCalledWith(
        createId('project-a'),
        UnixTime(10 * UnixTime.HOUR),
        null,
      )
      expect(repository.deleteByConfigIds).not.toHaveBeenCalled()
    })

    it('trims when untilBlock of an existing configuration is set', async () => {
      const configuration = config('project-a', undefined, {
        sinceBlock: 100,
        untilBlock: 200,
      })
      const { repository, indexer, daProvider } = mockIndexer({
        configurations: [configuration],
        indexerService: mockIndexerService({
          minHeight: 100,
          maxHeight: null,
          currentHeight: 500,
        }),
        // Block 200 is 30 minutes into hour 20
        blockTimestamps: () =>
          UnixTime(20 * UnixTime.HOUR + 30 * UnixTime.MINUTE),
      })

      await indexer.initialize()

      // mergeConfigurations emits [maxHeight + 1, currentHeight] = [201, 500]
      expect(daProvider.getBlockTimestamp).toHaveBeenOnlyCalledWith(
        DA_LAYER,
        200,
      )
      expect(
        repository.deleteByConfigOutsideTimeRange,
      ).toHaveBeenOnlyCalledWith(
        createId('project-a'),
        null,
        UnixTime(19 * UnixTime.HOUR),
      )
      expect(repository.deleteByConfigIds).not.toHaveBeenCalled()
    })

    it('does nothing when sinceBlock of a never indexed configuration is raised', async () => {
      const configuration = config('project-a', undefined, { sinceBlock: 200 })
      const { repository, indexer, daProvider } = mockIndexer({
        configurations: [configuration],
        indexerService: mockIndexerService({
          minHeight: 100,
          maxHeight: null,
          currentHeight: null,
        }),
      })

      await indexer.initialize()

      expect(daProvider.getBlockTimestamp).not.toHaveBeenCalled()
      expect(repository.deleteByConfigOutsideTimeRange).not.toHaveBeenCalled()
      expect(repository.deleteByConfigIds).not.toHaveBeenCalled()
    })

    it('wipes when sinceBlock is raised past what was indexed', async () => {
      const configuration = config('project-a', undefined, { sinceBlock: 600 })
      const { repository, indexer, daProvider } = mockIndexer({
        configurations: [configuration],
        indexerService: mockIndexerService({
          minHeight: 100,
          maxHeight: null,
          currentHeight: 500,
        }),
      })

      await indexer.initialize()

      // All the indexed data is out of range, nothing is left to trim around
      expect(daProvider.getBlockTimestamp).not.toHaveBeenCalled()
      expect(repository.deleteByConfigOutsideTimeRange).not.toHaveBeenCalled()
      expect(repository.deleteByConfigIds).toHaveBeenOnlyCalledWith([
        createId('project-a'),
      ])
    })
  })

  describe('does not double count after a trim', () => {
    // Blocks are 10 minutes apart, blocks 1-6 fall into hour 100, blocks 7-12
    // fall into hour 101.
    const HOUR_0 = UnixTime(100 * UnixTime.HOUR)
    const HOUR_1 = UnixTime(101 * UnixTime.HOUR)
    const BLOB_SIZE = 100n
    const blockTimestamps = (blockNumber: number) =>
      UnixTime(HOUR_0 + (blockNumber - 1) * 10 * UnixTime.MINUTE)

    it('untilBlock trimmed and then extended counts each blob once', async () => {
      const inbox = EthereumAddress.random()
      const configuration = config('project-a', inbox, {
        sinceBlock: 1,
        untilBlock: 9,
      })

      const store = new InMemoryDataAvailabilityStore()

      const { indexer } = mockIndexer({
        configurations: [configuration],
        repository: store.asRepository(),
        daService: mockObject<DaService>({
          generateRecords: (blobs, previousRecords, configurations) =>
            new DaService().generateRecords(
              blobs,
              previousRecords,
              configurations,
            ),
        }),
        blockTimestamps,
        getBlobs: (from, to) => {
          const blobs: DaBlob[] = []
          for (let block = from; block <= to; block++) {
            blobs.push({
              type: 'ethereum',
              daLayer: DA_LAYER,
              blockTimestamp: blockTimestamps(block),
              blockNumber: block,
              size: BLOB_SIZE,
              inbox,
              sequencer: EthereumAddress.random(),
              topics: [],
            })
          }
          return blobs
        },
      })

      // The configuration was indexed up to block 12 before untilBlock was set
      await (
        await indexer.multiUpdate(
          1,
          12,
          toIndexerConfigurations([configuration]),
        )
      )()
      expect(store.totals()).toEqual([
        [HOUR_0, 6n * BLOB_SIZE],
        [HOUR_1, 6n * BLOB_SIZE],
      ])

      // untilBlock is set to 9, which falls into hour 101
      await indexer.trimData([{ id: createId('project-a'), range: [10, 12] }])
      expect(store.totals()).toEqual([[HOUR_0, 6n * BLOB_SIZE]])

      // untilBlock is extended again, indexing resumes from currentHeight + 1
      await (
        await indexer.multiUpdate(
          10,
          12,
          toIndexerConfigurations([configuration]),
        )
      )()

      // Blocks 7-9 are lost (bounded, one hour), blocks 10-12 are counted once.
      // Had we kept the boundary hour, it would hold 6 + 3 blobs.
      expect(store.totals()).toEqual([
        [HOUR_0, 6n * BLOB_SIZE],
        [HOUR_1, 3n * BLOB_SIZE],
      ])
    })
  })

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })
})

/** Minimal in-memory stand-in for the DataAvailability table */
class InMemoryDataAvailabilityStore {
  private records: DataAvailabilityRecord[] = []

  asRepository(): MockObject<Database['dataAvailability']> {
    return mockObject<Database['dataAvailability']>({
      upsertMany: async (records: DataAvailabilityRecord[]) => {
        for (const record of records) {
          const index = this.records.findIndex(
            (r) =>
              r.timestamp === record.timestamp &&
              r.daLayer === record.daLayer &&
              r.projectId === record.projectId &&
              r.configurationId === record.configurationId,
          )
          if (index === -1) {
            this.records.push({ ...record })
          } else {
            this.records[index] = { ...record }
          }
        }
        return records.length
      },
      getForDaLayerInTimeRange: async (
        daLayer: string,
        from: UnixTime,
        to: UnixTime,
      ) =>
        this.records
          .filter(
            (r) =>
              r.daLayer === daLayer && r.timestamp >= from && r.timestamp < to,
          )
          .map((r) => ({ ...r })),
      deleteByConfigOutsideTimeRange: async (
        configurationId: string,
        from: UnixTime | null,
        to: UnixTime | null,
      ) => {
        const before = this.records.length
        this.records = this.records.filter(
          (r) =>
            r.configurationId !== configurationId ||
            ((from === null || r.timestamp >= from) &&
              (to === null || r.timestamp <= to)),
        )
        return before - this.records.length
      },
    })
  }

  totals(): [UnixTime, bigint][] {
    return this.records
      .map((r): [UnixTime, bigint] => [r.timestamp, r.totalSize])
      .sort((a, b) => a[0] - b[0])
  }
}

function toIndexerConfigurations(
  configurations: BlockDaIndexedConfig[],
): Configuration<BlockDaIndexedConfig>[] {
  return configurations.map((c) => ({
    id: c.configurationId,
    minHeight: c.sinceBlock,
    maxHeight: c.untilBlock ?? null,
    properties: c,
  }))
}

function mockIndexer($: {
  configurations?: DataAvailabilityTrackingConfig['blockProjects']
  batchSize?: number
  indexerService?: IndexerService
  blobs?: DaBlob[]
  previousRecords?: DataAvailabilityRecord[]
  generatedRecords?: DataAvailabilityRecord[]
  useBlobService?: boolean
  repository?: MockObject<Database['dataAvailability']>
  daService?: MockObject<DaService>
  blockTimestamps?: (blockNumber: number) => UnixTime
  getBlobs?: (from: number, to: number) => DaBlob[]
}) {
  const repository =
    $.repository ??
    mockObject<Database['dataAvailability']>({
      deleteByConfigIds: mockFn().resolvesTo(10),
      deleteByConfigurationId: mockFn().resolvesTo({}),
      deleteByConfigOutsideTimeRange: mockFn().resolvesTo(10),
      upsertMany: mockFn().resolvesTo(undefined),
      getForDaLayerInTimeRange: mockFn().resolvesTo($.previousRecords ?? []),
    })

  const syncMetadataRepository = mockObject<Database['syncMetadata']>({
    updateSyncedUntil: mockFn().resolvesTo(undefined),
  })

  const daService =
    $.daService ??
    mockObject<DaService>({
      generateRecords: mockFn().returns({
        records: $.generatedRecords ?? [],
        latestTimestamp:
          $.generatedRecords?.[$.generatedRecords.length - 1]?.timestamp ?? 0,
      }),
    })

  const daProvider = mockObject<DaProvider>({
    getBlobs: async (_, from, to) =>
      $.getBlobs ? $.getBlobs(from, to) : ($.blobs ?? []), // Empty response
    getBlockTimestamp: mockFn(async (_: string, blockNumber: number) =>
      $.blockTimestamps ? $.blockTimestamps(blockNumber) : UnixTime(0),
    ),
  })

  const blobService = $.useBlobService
    ? mockObject<BlobService>({
        get: mockFn().resolvesTo($.blobs ?? []), // Empty response
      })
    : undefined

  const indexer = new DaIndexer(
    {
      configurations: ($.configurations ?? [config('project-a')]).map((c) => ({
        id: c.configurationId,
        minHeight: c.sinceBlock,
        maxHeight: c.untilBlock ?? null,
        properties: c,
      })),
      daProvider,
      daService,
      daLayer: DA_LAYER,
      batchSize: $.batchSize ?? 100,
      parents: [],
      indexerService: $.indexerService ?? mockObject<IndexerService>(),
      db: mockDatabase({
        dataAvailability: repository,
        syncMetadata: syncMetadataRepository,
      }),
      blobService,
    },
    Logger.SILENT,
  )

  return {
    repository,
    syncMetadataRepository,
    indexer,
    daService,
    daProvider,
    blobService,
  }
}

/** Saved state of the single 'project-a' configuration */
function mockIndexerService(saved: {
  minHeight: number
  maxHeight: number | null
  currentHeight: number | null
}) {
  return mockObject<IndexerService>({
    getSavedConfigurations: mockFn().resolvesTo([
      {
        id: createId('project-a'),
        properties: 'old-properties',
        ...saved,
      },
    ]),
    insertConfigurations: mockFn().resolvesTo(undefined),
    upsertConfigurations: mockFn().resolvesTo(undefined),
    deleteConfigurations: mockFn().resolvesTo(undefined),
  })
}

function config(
  project: string,
  inbox?: string,
  blocks?: { sinceBlock?: number; untilBlock?: number },
): BlockDaIndexedConfig {
  return {
    type: 'ethereum',
    configurationId: createId(project),
    projectId: ProjectId(project),
    daLayer: ProjectId(DA_LAYER),
    inbox: inbox ?? EthereumAddress.random(),
    sequencers: [],
    sinceBlock: blocks?.sinceBlock ?? 1,
    untilBlock: blocks?.untilBlock,
    topics: inbox ? ['topic'] : [],
  }
}

function blob(timestamp: number, size: number): DaBlob {
  return {
    daLayer: DA_LAYER,
    blockTimestamp: UnixTime(timestamp),
    blockNumber: 1,
    size: BigInt(size),
    type: 'ethereum',
    inbox: '',
    sequencer: '',
    topics: [],
  }
}

function record(
  projectId: string,
  timestamp: number,
  size: number,
): DataAvailabilityRecord {
  return {
    configurationId: createId(projectId),
    projectId,
    daLayer: DA_LAYER,
    timestamp: UnixTime(timestamp),
    totalSize: BigInt(size),
  }
}

function createId(project: string) {
  const hash = createHash('sha1').update(project).digest('hex')
  return hash.slice(0, 12)
}
