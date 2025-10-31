import { Logger } from '@l2beat/backend-tools'
import type { DataAvailabilityRecord, Database } from '@l2beat/database'
import type { DaBlob, DaProvider } from '@l2beat/shared'
import {
  type Configuration,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import { expect, mockFn, mockObject } from 'earl'
import type {
  BlockDaIndexedConfig,
  DataAvailabilityTrackingConfig,
} from '../../../config/Config'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { BlobService } from '../services/BlobService'
import type { DaService } from '../services/DaService'
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

  describe(DaIndexer.prototype.removeData.name, () => {
    it('wipes all data saved by configuration', async () => {
      const configurations = [config('project-a'), config('project-b')]

      const { repository, indexer } = mockIndexer({
        configurations,
      })

      await indexer.removeData([
        { id: createId('project-a'), from: -1, to: -1 }, // from & to are ignored
        { id: createId('project-b'), from: -1, to: -1 }, // from & to are ignored
      ])

      expect(repository.deleteByConfigurationId).toHaveBeenNthCalledWith(
        1,
        createId('project-a'),
      )

      expect(repository.deleteByConfigurationId).toHaveBeenNthCalledWith(
        2,
        createId('project-b'),
      )
    })
  })

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })
})

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
}) {
  const repository = mockObject<Database['dataAvailability']>({
    deleteByConfigurationId: mockFn().resolvesTo({}),
    upsertMany: mockFn().resolvesTo(undefined),
    getForDaLayerInTimeRange: mockFn().resolvesTo($.previousRecords ?? []),
  })

  const syncMetadataRepository = mockObject<Database['syncMetadata']>({
    updateSyncedUntil: mockFn().resolvesTo(undefined),
  })

  const daService = mockObject<DaService>({
    generateRecords: mockFn().returns({
      records: $.generatedRecords ?? [],
      latestTimestamp:
        $.generatedRecords?.[$.generatedRecords.length - 1]?.timestamp ?? 0,
    }),
  })

  const daProvider = mockObject<DaProvider>({
    getBlobs: async () => $.blobs ?? [], // Empty response
  })

  const blobService = $.useBlobService
    ? mockObject<BlobService>({
        get: mockFn().resolvesTo($.blobs ?? []), // Empty response
      })
    : undefined

  const indexer = new DaIndexer({
    configurations: ($.configurations ?? [config('project-a')]).map((c) => ({
      id: c.configurationId,
      minHeight: c.sinceBlock,
      maxHeight: c.untilBlock ?? null,
      properties: c,
    })),
    daProvider,
    daService,
    logger: Logger.SILENT,
    daLayer: DA_LAYER,
    batchSize: $.batchSize ?? 100,
    parents: [],
    indexerService: $.indexerService ?? mockObject<IndexerService>(),
    db: mockDatabase({
      dataAvailability: repository,
      syncMetadata: syncMetadataRepository,
    }),
    blobService,
  })

  return {
    repository,
    syncMetadataRepository,
    indexer,
    daService,
    daProvider,
    blobService,
  }
}

function config(project: string, inbox?: string): BlockDaIndexedConfig {
  return {
    type: 'ethereum',
    configurationId: createId(project),
    projectId: ProjectId(project),
    daLayer: ProjectId(DA_LAYER),
    inbox: inbox ?? EthereumAddress.random(),
    sequencers: [],
    sinceBlock: 1,
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
