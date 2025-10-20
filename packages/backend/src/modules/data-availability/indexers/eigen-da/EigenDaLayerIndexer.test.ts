import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { EigenApiClient } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { TimestampDaIndexedConfig } from '../../../../config/Config'
import { mockDatabase } from '../../../../test/database'
import type { IndexerService } from '../../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../../tools/uif/ids'
import type { Configuration } from '../../../../tools/uif/multi/types'
import { EigenDaLayerIndexer } from './EigenDaLayerIndexer'

const DA_LAYER = 'eigen-da'

describe(EigenDaLayerIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe('constructor', () => {
    it('should create indexer with valid configuration', () => {
      const configurations = [createConfiguration(DA_LAYER, DA_LAYER)]

      const { indexer } = mockIndexer({ configurations, daLayer: DA_LAYER })

      expect(indexer.daLayer).toEqual(DA_LAYER)
    })

    it('should throw when configurations have mismatched daLayer', () => {
      const configurations = [
        createConfiguration(DA_LAYER, DA_LAYER),
        createConfiguration('project2', 'different-layer'),
      ]

      expect(() => mockIndexer({ configurations, daLayer: DA_LAYER })).toThrow(
        'DaLayer mismatch detected in configurations',
      )
    })

    it('should throw when no configurations provided', () => {
      expect(() =>
        mockIndexer({ configurations: [], daLayer: DA_LAYER }),
      ).toThrow('Configurations should not be empty')
    })
  })

  describe(EigenDaLayerIndexer.prototype.multiUpdate.name, () => {
    it('should fetch data, save to database and update sync metadata', async () => {
      const configurations = [createConfiguration(DA_LAYER, DA_LAYER)]
      const throughputV1 = 12345678
      const throughputV2 = 123456789
      const expectedTotalSize = BigInt(
        Math.round(throughputV1 * (UnixTime.HOUR - 1)) + throughputV2,
      )

      const { indexer, repository, eigenClient, syncMetadataRepository } =
        mockIndexer({
          configurations,
          daLayer: DA_LAYER,
          throughputV1,
          throughputV2,
        })

      const from = UnixTime.fromDate(new Date('2022-01-01T12:30:00Z')) // 1641038200
      const expectedAdjustedFrom = UnixTime.toStartOf(from, 'hour') // 1641038400 (1:00 PM)
      const expectedAdjustedTo = expectedAdjustedFrom + UnixTime.HOUR

      const updateCallback = await indexer.multiUpdate(
        from,
        from + 30 * UnixTime.HOUR,
        configurations,
      )
      const safeHeight = await updateCallback()

      expect(eigenClient.getMetricsV1).toHaveBeenOnlyCalledWith(
        expectedAdjustedFrom,
        expectedAdjustedTo - 1,
      )
      expect(eigenClient.getMetricsV2).toHaveBeenOnlyCalledWith(
        expectedAdjustedFrom,
        expectedAdjustedTo - 1,
      )

      expect(repository.upsertMany).toHaveBeenOnlyCalledWith([
        {
          timestamp: expectedAdjustedFrom,
          totalSize: expectedTotalSize,
          projectId: 'eigenda',
          daLayer: DA_LAYER,
          configurationId: configurations[0].id,
        },
      ])

      expect(syncMetadataRepository.updateSyncedUntil).toHaveBeenOnlyCalledWith(
        'dataAvailability',
        configurations.map((c) => c.properties.projectId),
        expectedAdjustedTo,
      )

      expect(safeHeight).toEqual(expectedAdjustedTo)
    })

    it('should handle hour boundaries correctly', async () => {
      const configurations = [createConfiguration(DA_LAYER, DA_LAYER)]
      const throughputV1 = 1000000

      const { indexer, eigenClient } = mockIndexer({
        configurations,
        daLayer: DA_LAYER,
        throughputV1,
      })

      // Start at exact hour boundary
      const from = UnixTime.fromDate(new Date('2022-01-01T13:00:00Z'))
      const to = from + UnixTime.HOUR

      const updateCallback = await indexer.multiUpdate(from, to, configurations)
      await updateCallback()

      expect(eigenClient.getMetricsV1).toHaveBeenOnlyCalledWith(
        from, // Should remain the same since it's already at hour start
        from + UnixTime.HOUR - 1,
      )
      expect(eigenClient.getMetricsV2).toHaveBeenOnlyCalledWith(
        from, // Should remain the same since it's already at hour start
        from + UnixTime.HOUR - 1,
      )
    })
  })

  describe(EigenDaLayerIndexer.prototype.getDaLayerData.name, () => {
    it('should call eigenClient, sum V1 and V2 data and format response correctly', async () => {
      const configurations = [createConfiguration(DA_LAYER, DA_LAYER)]
      const throughputV1 = 5000000
      const throughputV2 = 10000000
      const from = 1641038400 // 2022-01-01T13:00:00Z
      const to = from + UnixTime.HOUR

      const { indexer, eigenClient } = mockIndexer({
        configurations,
        daLayer: DA_LAYER,
        throughputV1,
        throughputV2,
      })

      const result = await indexer.getDaLayerData(from, to)

      expect(eigenClient.getMetricsV1).toHaveBeenOnlyCalledWith(from, to - 1)
      expect(eigenClient.getMetricsV2).toHaveBeenOnlyCalledWith(from, to - 1)

      expect(result).toEqual({
        timestamp: UnixTime.toStartOf(from, 'hour'),
        totalSize: BigInt(
          Math.round(throughputV1 * (to - 1 - from)) + throughputV2,
        ),
        projectId: 'eigenda',
        daLayer: DA_LAYER,
        configurationId: configurations[0].id,
      })
    })

    it('should calculate totalSize correctly', async () => {
      const configurations = [createConfiguration(DA_LAYER, DA_LAYER)]
      const throughputV1 = 1000000
      const throughputV2 = 2000000
      const from = 1641038400
      const to = from + UnixTime.HOUR

      const { indexer } = mockIndexer({
        configurations,
        daLayer: DA_LAYER,
        throughputV1,
        throughputV2,
      })

      const result = await indexer.getDaLayerData(from, to)

      // totalSize should be throughput * (to - 1 - from) = 1000000 * 3599
      const expectedTotalSize = BigInt(
        Math.round(throughputV1 * (to - 1 - from)) + throughputV2,
      )
      expect(result.totalSize).toEqual(expectedTotalSize)
    })
  })

  describe(EigenDaLayerIndexer.prototype.removeData.name, () => {
    it('should delete records by configuration IDs', async () => {
      const configurations = [createConfiguration(DA_LAYER, DA_LAYER)]

      const { indexer, repository } = mockIndexer({
        configurations,
        daLayer: DA_LAYER,
      })

      const removalsConfigurations = [
        { id: 'config-1', from: -1, to: -1 },
        { id: 'config-2', from: -1, to: -1 },
      ]

      await indexer.removeData(removalsConfigurations)

      expect(repository.deleteByConfigurationId).toHaveBeenNthCalledWith(
        1,
        'config-1',
      )
      expect(repository.deleteByConfigurationId).toHaveBeenNthCalledWith(
        2,
        'config-2',
      )
    })
  })
})

function mockIndexer($: {
  configurations: Configuration<TimestampDaIndexedConfig>[]
  daLayer: string
  throughputV1?: number
  throughputV2?: number
  configurationsTrimmingDisabled?: boolean
}) {
  const repository = mockObject<Database['dataAvailability']>({
    deleteByConfigurationId: mockFn().resolvesTo(10),
    upsertMany: mockFn().resolvesTo(undefined),
  })

  const syncMetadataRepository = mockObject<Database['syncMetadata']>({
    updateSyncedUntil: mockFn().resolvesTo(undefined),
  })

  const eigenClient = mockObject<EigenApiClient>({
    getMetricsV1: mockFn().resolvesTo($.throughputV1 ?? 1000000),
    getMetricsV2: mockFn().resolvesTo($.throughputV2 ?? 2000000),
  })

  const indexerService = mockObject<IndexerService>({
    getSavedConfigurations: mockFn().resolvesTo([]),
    insertConfigurations: mockFn().resolvesTo(undefined),
    upsertConfigurations: mockFn().resolvesTo(undefined),
    deleteConfigurations: mockFn().resolvesTo(undefined),
    updateConfigurationsCurrentHeight: mockFn().resolvesTo(undefined),
    setInitialState: mockFn().resolvesTo(undefined),
    setSafeHeight: mockFn().resolvesTo(undefined),
    getSafeHeight: mockFn().resolvesTo(0),
  })

  const db = mockDatabase({
    transaction: mockFn(async (fun) => await fun()),
    dataAvailability: repository,
    syncMetadata: syncMetadataRepository,
  })

  const indexer = new EigenDaLayerIndexer({
    daLayer: $.daLayer,
    eigenClient,
    configurations: $.configurations,
    logger: Logger.SILENT,
    parents: [],
    indexerService,
    db,
    configurationsTrimmingDisabled: $.configurationsTrimmingDisabled,
    dataWipingAfterDeleteDisabled: false,
  })

  return {
    indexer,
    repository,
    syncMetadataRepository,
    eigenClient,
    indexerService,
    db,
  }
}

function createConfiguration(
  projectId: string,
  daLayer: string,
): Configuration<TimestampDaIndexedConfig> {
  return {
    id: `config-${projectId}`,
    minHeight: 1640995200, // 2022-01-01 00:00:00 UTC
    maxHeight: null,
    properties: {
      configurationId: `config-${projectId}`,
      projectId: ProjectId(projectId),
      type: 'baseLayer' as const,
      daLayer,
      sinceTimestamp: UnixTime.fromDate(new Date('2022-01-01T00:00:00Z')),
    },
  }
}
