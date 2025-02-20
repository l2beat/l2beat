import { createHash } from 'crypto'
import { Logger } from '@l2beat/backend-tools'
import type { DataAvailabilityRecord, Database } from '@l2beat/database'
import type { DaProvider } from '@l2beat/shared'
import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import { type MockObject, expect, mockFn, mockObject } from 'earl'
import type {
  DaTrackingConfig,
  DataAvailabilityTrackingConfig,
} from '../../../config/Config'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { DaService } from '../services/DaService'
import { DaIndexer } from './DaIndexer'

// All test cases work on one layer.
// DaIndexer assumes that all configurations will have the same layer.
// Rest of the code is generic and works the same regardless of layer type (see DaService)
const DA_LAYER = 'test-layer'

describe(DaIndexer.name, () => {
  describe(DaIndexer.prototype.multiUpdate.name, () => {
    it('handles empty blobs response', async () => {
      const daProvider = mockObject<DaProvider>({
        getBlobs: async () => [], // Empty response
      })

      const { indexer, repository, daService } = mockIndexer({
        daProvider,
        batchSize: 100,
      })

      const updateCallback = await indexer.multiUpdate(100, 200, [])
      const safeHeight = await updateCallback()

      expect(daProvider.getBlobs).toHaveBeenOnlyCalledWith(100, 200)
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

      expect(repository.deleteByProject).toHaveBeenNthCalledWith(
        1,
        'project-a',
        DA_LAYER,
      )

      expect(repository.deleteByProject).toHaveBeenNthCalledWith(
        2,
        'project-b',
        DA_LAYER,
      )
    })
  })

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })
})

function config(project: string): {
  configurationId: string
  config: DaTrackingConfig
} {
  return {
    configurationId: createId(project),
    config: {
      type: 'ethereum',
      projectId: ProjectId(project),
      daLayer: ProjectId(DA_LAYER),
      inbox: EthereumAddress.ZERO,
      sequencers: [],
      sinceBlock: 1,
    },
  }
}

function mockIndexer($: {
  configurations?: DataAvailabilityTrackingConfig['projects']
  daService?: MockObject<DaService>
  daProvider?: DaProvider
  batchSize?: number
  indexerService?: IndexerService
  previousRecords?: DataAvailabilityRecord[]
}) {
  const repository = mockObject<Database['dataAvailability']>({
    deleteByProject: mockFn().resolvesTo({}),
    upsertMany: mockFn().resolvesTo(undefined),
    getForDaLayerInTimeRange: mockFn().resolvesTo($.previousRecords ?? []),
  })

  const daService =
    $.daService ??
    mockObject<DaService>({
      generateRecords: mockFn(),
    })

  const indexer = new DaIndexer({
    configurations: ($.configurations ?? [config('project-a')]).map((c) => ({
      id: c.configurationId,
      minHeight: c.config.sinceBlock,
      maxHeight: c.config.untilBlock ?? null,
      properties: c.config,
    })),
    daProvider: $.daProvider ?? mockObject<DaProvider>(),
    daService,
    logger: Logger.SILENT,
    daLayer: DA_LAYER,
    batchSize: $.batchSize ?? 100,
    parents: [],
    indexerService: $.indexerService ?? mockObject<IndexerService>(),
    db: mockDatabase({
      dataAvailability: repository,
    }),
    serializeConfiguration: (value: DaTrackingConfig) => JSON.stringify(value),
  })

  return { repository, indexer, daService }
}

function createId(project: string) {
  const hash = createHash('sha1').update(project).digest('hex')
  return hash.slice(0, 12)
}
