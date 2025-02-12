import { Logger } from '@l2beat/backend-tools'
import type { StateUpdateMode } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ChildIndexer } from '@l2beat/uif'
import { expect, mockFn, mockObject } from 'earl'

import type { Database, FinalityRecord } from '@l2beat/database'
import { FinalityIndexer } from './FinalityIndexer'
import type { BaseAnalyzer, Batch } from './analyzers/types/BaseAnalyzer'
import type { FinalityConfig } from './types/FinalityConfig'

const MIN_TIMESTAMP = UnixTime.fromDate(new Date('2024-02-07T00:00:00Z'))

describe(FinalityIndexer.name, () => {
  describe(FinalityIndexer.prototype.update.name, () => {
    it('skips update if to is earlier than minTimestamp', async () => {
      const finalityRepository = mockObject<Database['finality']>({
        insert: mockFn(),
      })

      const finalityIndexer = getMockFinalityIndexer({
        finalityRepository,
      })
      const mockIsConfigurationSynced = mockFn()
      finalityIndexer.isConfigurationSynced = mockIsConfigurationSynced

      const from = MIN_TIMESTAMP.toNumber()
      const to = MIN_TIMESTAMP.add(-1, 'days').toNumber()

      // TODO: refactor tests after uif update
      const result = await finalityIndexer.update(from + 1, to)
      expect(result).toEqual(to)
      expect(mockIsConfigurationSynced).not.toHaveBeenCalled()
      expect(finalityRepository.insert).not.toHaveBeenCalled()
    })

    it('skips update if the project is synced', async () => {
      const finalityRepository = mockObject<Database['finality']>({
        insert: mockFn(),
      })

      const finalityIndexer = getMockFinalityIndexer({
        finalityRepository,
      })
      const mockIsConfigurationSynced = mockFn().resolvesToOnce(true)
      finalityIndexer.isConfigurationSynced = mockIsConfigurationSynced

      const from = MIN_TIMESTAMP.toNumber()
      const to = MIN_TIMESTAMP.add(1, 'days').toNumber()

      // TODO: refactor tests after uif update
      const result = await finalityIndexer.update(from + 1, to)
      expect(mockIsConfigurationSynced).toHaveBeenCalledWith(
        new UnixTime(to).toStartOf('day'),
      )
      expect(finalityRepository.insert).not.toHaveBeenCalled()
      expect(result).toEqual(to)
    })

    it('skips adding to database if finalityData is undefined', async () => {
      const finalityRepository = mockObject<Database['finality']>({
        insert: mockFn(),
      })

      const finalityIndexer = getMockFinalityIndexer({
        finalityRepository,
      })
      const mockIsConfigurationSynced = mockFn().resolvesToOnce(false)
      finalityIndexer.isConfigurationSynced = mockIsConfigurationSynced
      finalityIndexer.getFinalityData = mockFn().resolvesToOnce(undefined)

      const from = MIN_TIMESTAMP.toNumber()
      const to = MIN_TIMESTAMP.add(1, 'days').toNumber()

      // TODO: refactor tests after uif update
      const result = await finalityIndexer.update(from + 1, to)
      expect(finalityRepository.insert).not.toHaveBeenCalled()
      expect(result).toEqual(to)
    })

    it('skips updates for target in the past', async () => {
      const finalityRepository = mockObject<Database['finality']>({
        insert: mockFn().resolvesToOnce(1),
      })
      const runtimeConfiguration = getMockFinalityRuntimeConfiguration([])
      const finalityIndexer = getMockFinalityIndexer({
        runtimeConfiguration,
        finalityRepository,
      })
      finalityIndexer.isConfigurationSynced = mockFn().resolvesToOnce(false)

      const start = UnixTime.now().add(-3, 'days')

      const from = start.toNumber()
      const to = start.add(1, 'days').toNumber()

      // https://linear.app/l2beat/issue/L2B-4752/refactor-finalityindexer-logic-to-allow-analyzers-different
      // TODO: refactor tests after uif update
      await finalityIndexer.update(from + 1, to)
      expect(finalityRepository.insert).not.toHaveBeenCalled()
    })

    it('correctly syncs not synced project', async () => {
      const start = UnixTime.now().toStartOf('day')
      const from = start.toNumber()
      const to = start.add(1, 'days').toNumber()

      const finalityRepository = mockObject<Database['finality']>({
        insert: mockFn().resolvesToOnce(1),
      })

      const runtimeConfiguration = getMockFinalityRuntimeConfiguration(
        [
          {
            l1Timestamp: 123,
            l2Blocks: [{ timestamp: 121, blockNumber: 12 }],
          },
          {
            l1Timestamp: 142,
            l2Blocks: [{ timestamp: 138, blockNumber: 15 }],
          },
        ],
        'analyze',
      )
      const finalityIndexer = getMockFinalityIndexer({
        runtimeConfiguration,
        finalityRepository,
      })
      finalityIndexer.isConfigurationSynced = mockFn().resolvesToOnce(false)

      // TODO: refactor tests after uif update
      await finalityIndexer.update(from + 1, to)
      expect(finalityRepository.insert).toHaveBeenCalledWith({
        projectId: ProjectId('project'),
        timestamp: start.add(1, 'days'),
        averageTimeToInclusion: 3,
        minimumTimeToInclusion: 2,
        maximumTimeToInclusion: 4,
        averageStateUpdate: 0,
      })
    })

    it('throws an error if data is negative', async () => {
      const start = UnixTime.now().toStartOf('day')
      const from = start.toNumber()
      const to = start.add(1, 'days').toNumber()
      const finalityIndexer = getMockFinalityIndexer({})
      finalityIndexer.isConfigurationSynced = mockFn().resolvesToOnce(false)
      finalityIndexer.getFinalityData = mockFn().resolvesToOnce({
        projectId: ProjectId('project'),
        timestamp: start.add(1, 'days'),
        averageTimeToInclusion: -1,
        minimumTimeToInclusion: -2,
        maximumTimeToInclusion: 4,
      })

      expect(
        async () => await finalityIndexer.update(from + 1, to),
      ).toBeRejectedWith(`Finality data cannot be negative: project`)
    })
  })

  describe(FinalityIndexer.prototype.isConfigurationSynced.name, () => {
    it('returns true if project is synced', async () => {
      const syncedTimestamp = new UnixTime(41234123)

      const finalityRepository = mockObject<Database['finality']>({
        findLatestByProjectId: mockFn().resolvesToOnce({
          projectId: ProjectId('project'),
          timestamp: syncedTimestamp,
        }),
      })

      const finalityIndexer = getMockFinalityIndexer({
        finalityRepository,
      })

      const result =
        await finalityIndexer.isConfigurationSynced(syncedTimestamp)
      expect(result).toEqual(true)
    })

    it('returns false if project is not synced', async () => {
      const syncedTimestamp = new UnixTime(41234123)

      const finalityRepository = mockObject<Database['finality']>({
        findLatestByProjectId: mockFn().resolvesToOnce({
          projectId: ProjectId('project'),
          timestamp: syncedTimestamp.add(-1, 'seconds'),
        }),
      })

      const finalityIndexer = getMockFinalityIndexer({
        finalityRepository,
      })

      const result =
        await finalityIndexer.isConfigurationSynced(syncedTimestamp)
      expect(result).toEqual(false)
    })
  })

  describe(FinalityIndexer.prototype.getFinalityData.name, () => {
    it('returns finality data', async () => {
      const project1Results = {
        averageTimeToInclusion: 2,
        minimumTimeToInclusion: 1,
        maximumTimeToInclusion: 3,
        averageStateUpdate: 0,
      }

      const runtimeConfiguration = getMockFinalityRuntimeConfiguration([
        {
          l1Timestamp: 123,
          l2Blocks: [{ timestamp: 122, blockNumber: 12 }],
        },
        {
          l1Timestamp: 234,
          l2Blocks: [{ timestamp: 232, blockNumber: 15 }],
        },
        {
          l1Timestamp: 345,
          l2Blocks: [{ timestamp: 342, blockNumber: 19 }],
        },
      ])
      const finalityIndexer = getMockFinalityIndexer({ runtimeConfiguration })

      const result = await finalityIndexer.getFinalityData(
        MIN_TIMESTAMP,
        runtimeConfiguration,
      )
      const EXPECTED: FinalityRecord = {
        projectId: ProjectId('project'),
        timestamp: MIN_TIMESTAMP,
        ...project1Results,
      }

      expect(result).toEqual(EXPECTED)
    })

    it('returns undefined if no data for given project', async () => {
      const runtimeConfiguration = getMockFinalityRuntimeConfiguration()
      const finalityIndexer = getMockFinalityIndexer({ runtimeConfiguration })

      const result = await finalityIndexer.getFinalityData(
        MIN_TIMESTAMP,
        runtimeConfiguration,
      )
      expect(result).toEqual(undefined)
    })

    it('calls for a state update if stateUpdateMode is set to analyze', async () => {
      const start = UnixTime.now().toStartOf('day')
      const from = start.toNumber()
      const to = start.add(1, 'days').toNumber()

      const runtimeConfiguration = getMockFinalityRuntimeConfiguration(
        [
          {
            l1Timestamp: 123,
            l2Blocks: [{ timestamp: 121, blockNumber: 12 }],
          },
          {
            l1Timestamp: 142,
            l2Blocks: [{ timestamp: 138, blockNumber: 15 }],
          },
        ],
        'analyze',
      )

      const finalityRepository = mockObject<Database['finality']>({
        insert: mockFn().resolvesToOnce(1),
      })

      const finalityIndexer = getMockFinalityIndexer({
        runtimeConfiguration,
        finalityRepository,
      })
      finalityIndexer.isConfigurationSynced = mockFn().resolvesToOnce(false)

      await finalityIndexer.update(from + 1, to)
      expect(finalityRepository.insert).toHaveBeenCalledWith({
        projectId: ProjectId('project'),
        timestamp: start.add(1, 'days'),
        averageTimeToInclusion: 3,
        minimumTimeToInclusion: 2,
        maximumTimeToInclusion: 4,
        averageStateUpdate: 0,
      })

      expect(
        runtimeConfiguration.analyzers.stateUpdate.analyzeInterval,
      ).toHaveBeenCalledTimes(1)
    })

    it('skips state update call if stateUpdateMode is set to disabled or zeroed', async () => {
      const modes = ['disabled', 'zeroed'] as const

      for (const mode of modes) {
        const start = UnixTime.now().toStartOf('day')
        const from = start.toNumber()
        const to = start.add(1, 'days').toNumber()

        const finalityRepository = mockObject<Database['finality']>({
          insert: mockFn().resolvesToOnce(1),
        })

        const runtimeConfiguration = getMockFinalityRuntimeConfiguration(
          [
            {
              l1Timestamp: 123,
              l2Blocks: [{ timestamp: 121, blockNumber: 12 }],
            },
            {
              l1Timestamp: 142,
              l2Blocks: [{ timestamp: 138, blockNumber: 15 }],
            },
          ],
          mode,
        )
        const finalityIndexer = getMockFinalityIndexer({
          runtimeConfiguration,
          finalityRepository,
        })
        finalityIndexer.isConfigurationSynced = mockFn().resolvesToOnce(false)

        // TODO: refactor tests after uif update
        await finalityIndexer.update(from + 1, to)
        expect(finalityRepository.insert).toHaveBeenCalledWith({
          projectId: ProjectId('project'),
          timestamp: start.add(1, 'days'),
          averageTimeToInclusion: 3,
          minimumTimeToInclusion: 2,
          maximumTimeToInclusion: 4,
          averageStateUpdate: null,
        })

        expect(
          runtimeConfiguration.analyzers.stateUpdate.analyzeInterval,
        ).not.toHaveBeenCalled()
      }
    })
  })

  describe(FinalityIndexer.prototype.initialize.name, () => {
    it('initializes indexer state', async () => {
      const safeHeight = MIN_TIMESTAMP.add(1, 'days')

      const stateRepository = getMockStateRepository({
        indexerId: 'finality_indexer',
        safeHeight: safeHeight.toNumber(),
        minTimestamp: MIN_TIMESTAMP,
      })
      const finalityIndexer = getMockFinalityIndexer({
        stateRepository,
      })

      const result = await finalityIndexer.initialize()

      expect(result).toEqual({
        safeHeight: safeHeight.toNumber(),
      })

      expect(stateRepository.findByIndexerId).toHaveBeenCalledTimes(1)
    })

    it('indexer state undefined', async () => {
      const stateRepository = mockObject<Database['indexerState']>({
        findByIndexerId: async () => undefined,
        upsert: async () => undefined,
        updateSafeHeight: async () => 0,
      })
      const finalityIndexer = getMockFinalityIndexer({
        stateRepository,
      })

      const result = await finalityIndexer.initialize()

      expect(result).toEqual({
        safeHeight: MIN_TIMESTAMP.toNumber(),
      })

      expect(stateRepository.findByIndexerId).toHaveBeenCalledTimes(1)
    })
  })

  describe(FinalityIndexer.prototype.getSafeHeight.name, () => {
    it('returns safe height from DB', async () => {
      const safeHeightDB = 123
      const stateRepository = mockObject<Database['indexerState']>({
        findByIndexerId: async () => ({
          indexerId: 'finality_indexer',
          safeHeight: safeHeightDB,
          minTimestamp: MIN_TIMESTAMP,
        }),
      })
      const finalityIndexer = getMockFinalityIndexer({ stateRepository })

      const safeHeight = await finalityIndexer.getSafeHeight()

      expect(safeHeight).toEqual(safeHeightDB)
      expect(stateRepository.findByIndexerId).toHaveBeenOnlyCalledWith(
        finalityIndexer.indexerId,
      )
    })
    it('returns minTimestamp if indexer state is undefined', async () => {
      const stateRepository = mockObject<Database['indexerState']>({
        findByIndexerId: async () => undefined,
      })
      const finalityIndexer = getMockFinalityIndexer({ stateRepository })

      const safeHeight = await finalityIndexer.getSafeHeight()

      expect(safeHeight).toEqual(MIN_TIMESTAMP.toNumber())
      expect(stateRepository.findByIndexerId).toHaveBeenOnlyCalledWith(
        finalityIndexer.indexerId,
      )
    })
  })

  describe(FinalityIndexer.prototype.setSafeHeight.name, () => {
    it('saves safe height in the database', async () => {
      const stateRepository = mockObject<Database['indexerState']>({
        updateSafeHeight: async () => 0, // return value is not important
      })
      const finalityIndexer = getMockFinalityIndexer({ stateRepository })

      const safeHeight = MIN_TIMESTAMP.add(1, 'hours').toNumber()
      await finalityIndexer.setSafeHeight(safeHeight)

      expect(stateRepository.updateSafeHeight).toHaveBeenOnlyCalledWith(
        'finality_indexer_project',
        safeHeight,
      )
    })
  })

  describe(FinalityIndexer.prototype.invalidate.name, () => {
    it('only returns target height', async () => {
      const livenessIndexer = getMockFinalityIndexer({})

      const targetHeight = 1
      const value = await livenessIndexer.invalidate(targetHeight)

      expect(value).toEqual(targetHeight)
    })
  })
})

function getMockFinalityIndexer(params: {
  stateRepository?: Database['indexerState']
  finalityRepository?: Database['finality']
  runtimeConfiguration?: FinalityConfig
}) {
  const { stateRepository, finalityRepository, runtimeConfiguration } = params

  return new FinalityIndexer(
    Logger.SILENT,
    mockObject<ChildIndexer>({
      start: async () => {},
      tick: async () => 1,
      subscribe: () => {},
    }),
    mockObject<Database>({
      indexerState: stateRepository ?? mockObject<Database['indexerState']>({}),
      finality: finalityRepository ?? mockObject<Database['finality']>({}),
    }),
    runtimeConfiguration ?? getMockFinalityRuntimeConfiguration(),
  )
}

function getMockStateRepository(
  indexerState = {
    indexerId: 'finality_indexer',
    safeHeight: MIN_TIMESTAMP.toNumber(),
    minTimestamp: MIN_TIMESTAMP,
  },
) {
  return mockObject<Database['indexerState']>({
    findByIndexerId: async () => indexerState,
    upsert: async () => undefined,
    updateSafeHeight: async () => 0,
  })
}

function getMockFinalityRuntimeConfiguration(
  results?: Batch[],
  stateUpdateMode?: StateUpdateMode,
) {
  return {
    projectId: ProjectId('project'),
    analyzers: {
      timeToInclusion: mockObject<BaseAnalyzer>({
        analyzeInterval: mockFn().resolvesTo(results),
      }),
      stateUpdate: mockObject<BaseAnalyzer>({
        analyzeInterval: mockFn().resolvesTo(results),
      }),
    },
    minTimestamp: MIN_TIMESTAMP,
    stateUpdateMode: stateUpdateMode ?? 'analyze',
  }
}
