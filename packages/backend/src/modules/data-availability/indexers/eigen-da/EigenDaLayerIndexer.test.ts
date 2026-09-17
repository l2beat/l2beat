import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { EigenApiClient } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { TimestampDaIndexedConfig } from '../../../../config/Config'
import { mockDatabase } from '../../../../test/database'
import type { IndexerService } from '../../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../../tools/uif/ids'
import type {
  Configuration,
  SavedConfiguration,
} from '../../../../tools/uif/multi/types'
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
      const throughput = 123456789

      const { indexer, repository, eigenClient, syncMetadataRepository } =
        mockIndexer({
          configurations,
          daLayer: DA_LAYER,
          throughput,
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

      expect(eigenClient.getMetrics).toHaveBeenCalledExactlyOnceWith(
        expectedAdjustedFrom,
        expectedAdjustedTo - 1,
      )

      expect(repository.upsertMany).toHaveBeenCalledExactlyOnceWith([
        {
          timestamp: expectedAdjustedFrom,
          totalSize: BigInt(throughput),
          projectId: 'eigenda',
          daLayer: DA_LAYER,
          configurationId: configurations[0].id,
        },
      ])

      expect(
        syncMetadataRepository.updateSyncedUntil,
      ).toHaveBeenCalledExactlyOnceWith(
        'dataAvailability',
        configurations.map((c) => c.properties.projectId),
        expectedAdjustedTo,
      )

      expect(safeHeight).toEqual(expectedAdjustedTo)
    })

    it('should skip update within the sync disabled range', async () => {
      const configurations = [createConfiguration(DA_LAYER, DA_LAYER)]

      const { indexer, repository, eigenClient } = mockIndexer({
        configurations,
        daLayer: DA_LAYER,
      })

      const from = UnixTime.fromDate(new Date('2026-06-25T13:00:00Z'))
      const expectedAdjustedTo = from + UnixTime.HOUR

      const updateCallback = await indexer.multiUpdate(
        from,
        from + 30 * UnixTime.HOUR,
        configurations,
      )
      const safeHeight = await updateCallback()

      expect(eigenClient.getMetrics).not.toHaveBeenCalled()
      expect(repository.upsertMany).not.toHaveBeenCalled()
      expect(safeHeight).toEqual(expectedAdjustedTo)
    })

    it('should handle hour boundaries correctly', async () => {
      const configurations = [createConfiguration(DA_LAYER, DA_LAYER)]
      const throughput = 1000000

      const { indexer, eigenClient } = mockIndexer({
        configurations,
        daLayer: DA_LAYER,
        throughput,
      })

      // Start at exact hour boundary
      const from = UnixTime.fromDate(new Date('2022-01-01T13:00:00Z'))
      const to = from + UnixTime.HOUR

      const updateCallback = await indexer.multiUpdate(from, to, configurations)
      await updateCallback()

      expect(eigenClient.getMetrics).toHaveBeenCalledExactlyOnceWith(
        from, // Should remain the same since it's already at hour start
        from + UnixTime.HOUR - 1,
      )
    })
  })

  describe(EigenDaLayerIndexer.prototype.getDaLayerData.name, () => {
    it('should call eigenClient and format response correctly', async () => {
      const configurations = [createConfiguration(DA_LAYER, DA_LAYER)]
      const throughput = 10000000
      const from = 1641038400 // 2022-01-01T13:00:00Z
      const to = from + UnixTime.HOUR

      const { indexer, eigenClient } = mockIndexer({
        configurations,
        daLayer: DA_LAYER,
        throughput,
      })

      const result = await indexer.getDaLayerData(from, to)

      expect(eigenClient.getMetrics).toHaveBeenCalledExactlyOnceWith(
        from,
        to - 1,
      )

      expect(result).toEqual({
        timestamp: UnixTime.toStartOf(from, 'hour'),
        totalSize: BigInt(throughput),
        projectId: 'eigenda',
        daLayer: DA_LAYER,
        configurationId: configurations[0].id,
      })
    })

    it('should calculate totalSize correctly', async () => {
      const configurations = [createConfiguration(DA_LAYER, DA_LAYER)]
      const throughput = 2000000
      const from = 1641038400
      const to = from + UnixTime.HOUR

      const { indexer } = mockIndexer({
        configurations,
        daLayer: DA_LAYER,
        throughput,
      })

      const result = await indexer.getDaLayerData(from, to)

      const expectedTotalSize = BigInt(throughput)
      expect(result.totalSize).toEqual(expectedTotalSize)
    })
  })

  describe(EigenDaLayerIndexer.prototype.wipeData.name, () => {
    it('should delete records by configuration IDs', async () => {
      const configurations = [createConfiguration(DA_LAYER, DA_LAYER)]

      const { indexer, repository } = mockIndexer({
        configurations,
        daLayer: DA_LAYER,
      })

      const removalsConfigurations = [
        { type: 'wipe' as const, id: 'config-1' },
        { type: 'wipe' as const, id: 'config-2' },
      ]

      await indexer.wipeData(removalsConfigurations)

      expect(repository.deleteByConfigIds).toHaveBeenCalledExactlyOnceWith([
        'config-1',
        'config-2',
      ])
    })
  })

  describe(EigenDaLayerIndexer.prototype.trimData.name, () => {
    it('deletes the hourly buckets of the trimmed ranges', async () => {
      const configurations = [createConfiguration(DA_LAYER, DA_LAYER)]
      const { indexer, repository } = mockIndexer({
        configurations,
        daLayer: DA_LAYER,
      })

      const from = UnixTime.fromDate(new Date('2025-09-01T00:00:00Z'))
      await indexer.trimData([
        { id: 'config-1', range: [from, from + 3 * UnixTime.HOUR - 1] },
        { id: 'config-2', range: [from + 600, from + 5 * UnixTime.HOUR] },
      ])

      expect(repository.deleteByConfigIds).not.toHaveBeenCalled()
      expect(repository.deleteByConfigInTimeRange).toHaveBeenCalledTimes(2)
      expect(repository.deleteByConfigInTimeRange).toHaveBeenNthCalledWith(
        1,
        'config-1',
        from,
        from + 3 * UnixTime.HOUR - 1,
      )
      expect(repository.deleteByConfigInTimeRange).toHaveBeenNthCalledWith(
        2,
        'config-2',
        from,
        from + 5 * UnixTime.HOUR - 1,
      )
    })
  })

  describe('range edits', () => {
    // both timestamps are full hours
    const SINCE = UnixTime.fromDate(new Date('2025-09-01T00:00:00Z'))
    const CURRENT = SINCE + 48 * UnixTime.HOUR

    function saved(
      configuration: Configuration<TimestampDaIndexedConfig>,
      minHeight: number,
      maxHeight: number | null,
      currentHeight: number | null,
    ): SavedConfiguration<string> {
      return {
        id: configuration.id,
        properties: JSON.stringify(configuration.properties),
        minHeight,
        maxHeight,
        currentHeight,
      }
    }

    it('trims the tail when untilTimestamp is lowered', async () => {
      const configuration = {
        ...createConfiguration(DA_LAYER, DA_LAYER),
        minHeight: SINCE,
        maxHeight: SINCE + 24 * UnixTime.HOUR,
      }
      const { indexer, repository } = mockIndexer({
        configurations: [configuration],
        savedConfigurations: [saved(configuration, SINCE, null, CURRENT)],
        daLayer: DA_LAYER,
      })

      await indexer.initialize()

      expect(repository.deleteByConfigIds).not.toHaveBeenCalled()
      expect(
        repository.deleteByConfigInTimeRange,
      ).toHaveBeenCalledExactlyOnceWith(
        configuration.id,
        SINCE + 24 * UnixTime.HOUR,
        CURRENT - 1,
      )
    })

    it('trims the head when sinceTimestamp is raised', async () => {
      const configuration = {
        ...createConfiguration(DA_LAYER, DA_LAYER),
        minHeight: SINCE + 24 * UnixTime.HOUR,
        maxHeight: null,
      }
      const { indexer, repository } = mockIndexer({
        configurations: [configuration],
        savedConfigurations: [saved(configuration, SINCE, null, CURRENT)],
        daLayer: DA_LAYER,
      })

      await indexer.initialize()

      expect(repository.deleteByConfigIds).not.toHaveBeenCalled()
      expect(
        repository.deleteByConfigInTimeRange,
      ).toHaveBeenCalledExactlyOnceWith(
        configuration.id,
        SINCE,
        SINCE + 24 * UnixTime.HOUR - 1,
      )
    })

    it('still wipes when sinceTimestamp is lowered', async () => {
      const configuration = {
        ...createConfiguration(DA_LAYER, DA_LAYER),
        minHeight: SINCE - 24 * UnixTime.HOUR,
        maxHeight: null,
      }
      const { indexer, repository } = mockIndexer({
        configurations: [configuration],
        savedConfigurations: [saved(configuration, SINCE, null, CURRENT)],
        daLayer: DA_LAYER,
      })

      await indexer.initialize()

      expect(repository.deleteByConfigInTimeRange).not.toHaveBeenCalled()
      expect(repository.deleteByConfigIds).toHaveBeenCalledExactlyOnceWith([
        configuration.id,
      ])
    })
  })
})

function mockIndexer($: {
  configurations: Configuration<TimestampDaIndexedConfig>[]
  savedConfigurations?: SavedConfiguration<string>[]
  daLayer: string
  throughput?: number
}) {
  const repository = {
    deleteByConfigIds: vi.fn().mockResolvedValue(10),
    deleteByConfigurationId: vi.fn().mockResolvedValue(10),
    deleteByConfigInTimeRange: vi.fn().mockResolvedValue(10),
    upsertMany: vi.fn().mockResolvedValue(undefined),
  } as unknown as Database['dataAvailability']

  const syncMetadataRepository = {
    updateSyncedUntil: vi.fn().mockResolvedValue(undefined),
  } as unknown as Database['syncMetadata']

  const eigenClient = {
    getMetrics: vi.fn().mockResolvedValue({
      total_bytes_posted: $.throughput ?? 2000000,
    }),
  } as unknown as EigenApiClient

  const indexerService = {
    getSavedConfigurations: vi
      .fn()
      .mockResolvedValue($.savedConfigurations ?? []),
    insertConfigurations: vi.fn().mockResolvedValue(undefined),
    upsertConfigurations: vi.fn().mockResolvedValue(undefined),
    deleteConfigurations: vi.fn().mockResolvedValue(undefined),
    updateConfigurationsCurrentHeight: vi.fn().mockResolvedValue(undefined),
    setInitialState: vi.fn().mockResolvedValue(undefined),
    setSafeHeight: vi.fn().mockResolvedValue(undefined),
    getSafeHeight: vi.fn().mockResolvedValue(0),
  } as unknown as IndexerService

  const db = mockDatabase({
    transaction: vi.fn(async (fun) => await fun()),
    dataAvailability: repository,
    syncMetadata: syncMetadataRepository,
  })

  const indexer = new EigenDaLayerIndexer(
    {
      daLayer: $.daLayer,
      eigenClient,
      configurations: $.configurations,
      parents: [],
      indexerService,
      db,
    },
    Logger.SILENT,
  )

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
