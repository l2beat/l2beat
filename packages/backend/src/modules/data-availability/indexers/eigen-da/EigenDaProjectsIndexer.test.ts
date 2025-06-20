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
import { EigenDaProjectsIndexer } from './EigenDaProjectsIndexer'

const DA_LAYER = 'eigen-da'

describe(EigenDaProjectsIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe('constructor', () => {
    it('should create indexer with valid configuration', () => {
      const configurations = [createConfiguration('project1', DA_LAYER)]

      const { indexer } = mockIndexer({ configurations, daLayer: DA_LAYER })

      expect(indexer.daLayer).toEqual(DA_LAYER)
    })

    it('should throw when configurations have mismatched daLayer', () => {
      const configurations = [
        createConfiguration('project1', DA_LAYER),
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

  describe(EigenDaProjectsIndexer.prototype.multiUpdate.name, () => {
    it('should update at 02:00:00 and save to database', async () => {
      const configurations = [
        createConfiguration('project1', DA_LAYER, 'customer1'),
      ]
      const mockProjectData = [
        {
          customer_id: 'customer1',
          datetime: UnixTime.fromDate(new Date('2025-05-31T00:00:00Z')),
          total_size_mb: 100,
        },
      ]

      const { indexer, repository, eigenClient } = mockIndexer({
        configurations,
        daLayer: DA_LAYER,
        projectData: mockProjectData,
      })

      // Set time to 01:00:00
      const from = UnixTime.fromDate(new Date('2025-06-01T01:00:00Z'))
      const expectedAdjustedFrom = UnixTime.toStartOf(from, 'hour')
      const expectedAdjustedTo = expectedAdjustedFrom + UnixTime.HOUR

      const updateCallback = await indexer.multiUpdate(
        from,
        from + 30 * UnixTime.HOUR,
        configurations,
      )
      const safeHeight = await updateCallback()

      // should ask for previous day
      expect(eigenClient.getByProjectData).toHaveBeenOnlyCalledWith(
        UnixTime.toStartOf(expectedAdjustedTo, 'day') - UnixTime.DAY,
      )

      expect(repository.upsertMany).toHaveBeenOnlyCalledWith([
        {
          timestamp: mockProjectData[0].datetime,
          totalSize: BigInt(Math.round(100 * 1024 * 1024)),
          projectId: configurations[0].properties.projectId,
          daLayer: DA_LAYER,
          configurationId: configurations[0].id,
        },
      ])

      expect(safeHeight).toEqual(expectedAdjustedTo)
    })

    it('should skip update when not at 02:00:00', async () => {
      const configurations = [
        createConfiguration('project1', DA_LAYER, 'customer1'),
      ]

      const { indexer, repository, eigenClient } = mockIndexer({
        configurations,
        daLayer: DA_LAYER,
      })

      // Set time to 03:00:00 (not 02:00:00)
      const from = UnixTime.fromDate(new Date('2022-01-01T03:00:00Z'))
      const expectedAdjustedFrom = UnixTime.toStartOf(from, 'hour')
      const expectedAdjustedTo = expectedAdjustedFrom + UnixTime.HOUR

      const updateCallback = await indexer.multiUpdate(
        from,
        from + 30 * UnixTime.HOUR,
        configurations,
      )
      const safeHeight = await updateCallback()

      expect(eigenClient.getByProjectData).not.toHaveBeenCalled()
      expect(repository.upsertMany).not.toHaveBeenCalled()
      expect(safeHeight).toEqual(expectedAdjustedTo)
    })

    it('should handle empty data response', async () => {
      const configurations = [
        createConfiguration('project1', DA_LAYER, 'customer1'),
      ]

      const { indexer, repository, eigenClient } = mockIndexer({
        configurations,
        daLayer: DA_LAYER,
        projectData: [],
      })

      const from = UnixTime.fromDate(new Date('2022-01-01T01:00:00Z'))
      const expectedAdjustedFrom = UnixTime.toStartOf(from, 'hour')
      const expectedAdjustedTo = expectedAdjustedFrom + UnixTime.HOUR

      const updateCallback = await indexer.multiUpdate(
        from,
        from + 30 * UnixTime.HOUR,
        configurations,
      )
      const safeHeight = await updateCallback()

      expect(eigenClient.getByProjectData).toHaveBeenCalled()
      expect(repository.upsertMany).not.toHaveBeenCalled()
      expect(safeHeight).toEqual(expectedAdjustedTo)
    })
  })

  describe(EigenDaProjectsIndexer.prototype.getByProjectData.name, () => {
    it('should fetch data and filter by configuration', async () => {
      const configurations = [
        createConfiguration('project1', DA_LAYER, 'customer1'),
        createConfiguration('project2', DA_LAYER, 'customer2'),
      ]

      const startOfDay = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))
      const mockData = [
        {
          customer_id: 'customer1',
          datetime: startOfDay + UnixTime.HOUR,
          total_size_mb: 100,
        },
        {
          customer_id: 'customer2',
          datetime: startOfDay + 2 * UnixTime.HOUR,
          total_size_mb: 200,
        },
        {
          customer_id: 'unknown',
          datetime: startOfDay + 3 * UnixTime.HOUR,
          total_size_mb: 300,
        },
      ]

      const { indexer } = mockIndexer({
        configurations,
        daLayer: DA_LAYER,
        projectData: mockData,
      })

      const to = startOfDay + UnixTime.DAY + 2 * UnixTime.HOUR
      const result = await indexer.getByProjectData(to)

      expect(result).toEqual([
        {
          timestamp: startOfDay + UnixTime.HOUR,
          totalSize: BigInt(Math.round(100 * 1024 * 1024)),
          projectId: configurations[0].properties.projectId,
          daLayer: DA_LAYER,
          configurationId: configurations[0].id,
        },
        {
          timestamp: startOfDay + 2 * UnixTime.HOUR,
          totalSize: BigInt(Math.round(200 * 1024 * 1024)),
          projectId: configurations[1].properties.projectId,
          daLayer: DA_LAYER,
          configurationId: configurations[1].id,
        },
      ])
    })

    it('should filter out data outside the target day', async () => {
      const configurations = [
        createConfiguration('project1', DA_LAYER, 'customer1'),
      ]

      const startOfDay = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))
      const mockData = [
        {
          customer_id: 'customer1',
          datetime: startOfDay - UnixTime.HOUR, // Before start of day
          total_size_mb: 100,
        },
        {
          customer_id: 'customer1',
          datetime: startOfDay + UnixTime.HOUR, // Within day
          total_size_mb: 200,
        },
        {
          customer_id: 'customer1',
          datetime: startOfDay + UnixTime.DAY, // After end of day
          total_size_mb: 300,
        },
      ]

      const { indexer } = mockIndexer({
        configurations,
        daLayer: DA_LAYER,
        projectData: mockData,
      })

      const to = startOfDay + UnixTime.DAY + 2 * UnixTime.HOUR
      const result = await indexer.getByProjectData(to)

      expect(result).toEqual([
        {
          timestamp: startOfDay + UnixTime.HOUR,
          totalSize: BigInt(Math.round(200 * 1024 * 1024)),
          projectId: configurations[0].properties.projectId,
          daLayer: DA_LAYER,
          configurationId: configurations[0].id,
        },
      ])
    })

    it('should handle early dates before first file date', async () => {
      const configurations = [
        createConfiguration('project1', DA_LAYER, 'customer1'),
      ]

      const { indexer, eigenClient } = mockIndexer({
        configurations,
        daLayer: DA_LAYER,
        projectData: [],
      })

      // Use date before 2025-05-30 (first file date)
      const earlyDate = UnixTime.fromDate(new Date('2025-01-01T02:00:00Z'))
      const to = earlyDate + UnixTime.DAY

      await indexer.getByProjectData(to)

      // Should call with first file date instead of calculated date
      const firstFileDate = UnixTime.fromDate(
        new Date('2025-05-30T00:00:00.000Z'),
      )
      expect(eigenClient.getByProjectData).toHaveBeenOnlyCalledWith(
        firstFileDate,
      )
    })
  })

  describe(EigenDaProjectsIndexer.prototype.removeData.name, () => {
    it('should delete records by configuration IDs', async () => {
      const configurations = [
        createConfiguration('project1', DA_LAYER, 'customer1'),
      ]

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
  projectData?: {
    customer_id: string
    datetime: number
    total_size_mb: number
  }[]
  configurationsTrimmingDisabled?: boolean
}) {
  const repository = mockObject<Database['dataAvailability']>({
    deleteByConfigurationId: mockFn().resolvesTo(10),
    upsertMany: mockFn().resolvesTo(undefined),
  })

  const eigenClient = mockObject<EigenApiClient>({
    getByProjectData: mockFn().resolvesTo($.projectData ?? []),
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
    dataAvailability: repository,
  })

  const indexer = new EigenDaProjectsIndexer({
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
    eigenClient,
    indexerService,
    db,
  }
}

function createConfiguration(
  projectId: string,
  daLayer: string,
  customerId?: string,
): Configuration<TimestampDaIndexedConfig> {
  return {
    id: `config-${projectId}`,
    minHeight: 1640995200, // 2022-01-01 00:00:00 UTC
    maxHeight: null,
    properties: {
      configurationId: `config-${projectId}`,
      projectId: ProjectId(projectId),
      type: 'eigen-da',
      daLayer: ProjectId(daLayer),
      sinceTimestamp: UnixTime.fromDate(new Date('2022-01-01T00:00:00Z')),
      customerId: customerId ?? 'default-customer',
    },
  }
}
