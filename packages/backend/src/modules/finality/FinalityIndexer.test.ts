import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'
import { expect, mockFn, mockObject } from 'earl'

import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { BaseAnalyzer } from './analyzers/types/BaseAnalyzer'
import { FinalityIndexer } from './FinalityIndexer'
import {
  FinalityRecord,
  FinalityRepository,
} from './repositories/FinalityRepository'
import { FinalityConfig } from './types/FinalityConfig'

const MIN_TIMESTAMP = UnixTime.fromDate(new Date('2024-02-07T00:00:00Z'))

describe(FinalityIndexer.name, () => {
  describe(FinalityIndexer.prototype.update.name, () => {
    it('skips update if to is earlier than minTimestamp', async () => {
      const finalityRepository = mockObject<FinalityRepository>({
        add: mockFn(),
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
      expect(finalityRepository.add).not.toHaveBeenCalled()
    })

    it('skips update if the project is synced', async () => {
      const finalityRepository = mockObject<FinalityRepository>({
        add: mockFn(),
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
      expect(finalityRepository.add).not.toHaveBeenCalled()
      expect(result).toEqual(to)
    })

    it('skips adding to database if finalityData is undefined', async () => {
      const finalityRepository = mockObject<FinalityRepository>({
        add: mockFn(),
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
      expect(finalityRepository.add).not.toHaveBeenCalled()
      expect(result).toEqual(to)
    })

    it('correctly syncs not synced project', async () => {
      const finalityRepository = mockObject<FinalityRepository>({
        add: mockFn().resolvesToOnce(1),
      })
      const runtimeConfiguration = getMockFinalityRuntimeConfiguration([2, 4])
      const finalityIndexer = getMockFinalityIndexer({
        runtimeConfiguration,
        finalityRepository,
      })
      finalityIndexer.isConfigurationSynced = mockFn().resolvesToOnce(false)

      const from = MIN_TIMESTAMP.toNumber()
      const to = MIN_TIMESTAMP.add(1, 'days').toNumber()

      // TODO: refactor tests after uif update
      await finalityIndexer.update(from + 1, to)
      expect(finalityRepository.add).toHaveBeenCalledWith({
        projectId: ProjectId('project'),
        timestamp: MIN_TIMESTAMP.add(1, 'days'),
        averageTimeToInclusion: 3,
        minimumTimeToInclusion: 2,
        maximumTimeToInclusion: 4,
      })
    })
  })

  describe(FinalityIndexer.prototype.isConfigurationSynced.name, () => {
    it('returns true if project is synced', async () => {
      const syncedTimestamp = new UnixTime(41234123)

      const finalityRepository = mockObject<FinalityRepository>({
        findLatestByProjectId: mockFn().resolvesToOnce({
          projectId: ProjectId('project'),
          timestamp: syncedTimestamp,
        }),
      })

      const finalityIndexer = getMockFinalityIndexer({
        finalityRepository,
      })

      const result = await finalityIndexer.isConfigurationSynced(
        syncedTimestamp,
      )
      expect(result).toEqual(true)
    })

    it('returns false if project is not synced', async () => {
      const syncedTimestamp = new UnixTime(41234123)

      const finalityRepository = mockObject<FinalityRepository>({
        findLatestByProjectId: mockFn().resolvesToOnce({
          projectId: ProjectId('project'),
          timestamp: syncedTimestamp.add(-1, 'seconds'),
        }),
      })

      const finalityIndexer = getMockFinalityIndexer({
        finalityRepository,
      })

      const result = await finalityIndexer.isConfigurationSynced(
        syncedTimestamp,
      )
      expect(result).toEqual(false)
    })
  })

  describe(FinalityIndexer.prototype.getFinalityData.name, () => {
    it('returns finality data', async () => {
      const project1Results = {
        averageTimeToInclusion: 2,
        minimumTimeToInclusion: 1,
        maximumTimeToInclusion: 3,
      }

      const runtimeConfiguration = getMockFinalityRuntimeConfiguration([
        1, 2, 3,
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
  })

  describe(FinalityIndexer.prototype.start.name, () => {
    it('initializes indexer state', async () => {
      const stateRepository = getMockStateRepository()
      const finalityIndexer = getMockFinalityIndexer({
        stateRepository,
      })

      await finalityIndexer.start()

      expect(stateRepository.setSafeHeight).toHaveBeenOnlyCalledWith(
        finalityIndexer.indexerId,
        MIN_TIMESTAMP.toNumber(),
      )

      // 1st during this.initialize() -> this.setSafeHeight()
      // 2nd during super.start() -> this.getSafeHeight()
      expect(stateRepository.findIndexerState).toHaveBeenCalledTimes(2)
    })

    it('indexer state undefined', async () => {
      const stateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: async () => undefined,
        add: async () => '',
        setSafeHeight: async () => 0,
      })
      const finalityIndexer = getMockFinalityIndexer({
        stateRepository,
      })

      await finalityIndexer.start()

      expect(stateRepository.add).toHaveBeenNthCalledWith(1, {
        indexerId: finalityIndexer.indexerId,
        safeHeight: MIN_TIMESTAMP.toNumber(),
        minTimestamp: MIN_TIMESTAMP,
      })
    })
  })

  describe(FinalityIndexer.prototype.getSafeHeight.name, () => {
    it('returns safe height from DB', async () => {
      const safeHeightDB = 123
      const stateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: async () => ({
          indexerId: 'finality_indexer',
          safeHeight: safeHeightDB,
          minTimestamp: MIN_TIMESTAMP,
        }),
      })
      const finalityIndexer = getMockFinalityIndexer({ stateRepository })

      const safeHeight = await finalityIndexer.getSafeHeight()

      expect(safeHeight).toEqual(safeHeightDB)
      expect(stateRepository.findIndexerState).toHaveBeenOnlyCalledWith(
        finalityIndexer.indexerId,
      )
    })
    it('returns minTimestamp if indexer state is undefined', async () => {
      const stateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: async () => undefined,
      })
      const finalityIndexer = getMockFinalityIndexer({ stateRepository })

      const safeHeight = await finalityIndexer.getSafeHeight()

      expect(safeHeight).toEqual(MIN_TIMESTAMP.toNumber())
      expect(stateRepository.findIndexerState).toHaveBeenOnlyCalledWith(
        finalityIndexer.indexerId,
      )
    })
  })

  describe(FinalityIndexer.prototype.setSafeHeight.name, () => {
    it('saves safe height in the database', async () => {
      const stateRepository = mockObject<IndexerStateRepository>({
        setSafeHeight: async () => 0, // return value is not important
      })
      const finalityIndexer = getMockFinalityIndexer({ stateRepository })

      const safeHeight = MIN_TIMESTAMP.add(1, 'hours').toNumber()
      await finalityIndexer.setSafeHeight(safeHeight)

      expect(stateRepository.setSafeHeight).toHaveBeenOnlyCalledWith(
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
  stateRepository?: IndexerStateRepository
  finalityRepository?: FinalityRepository
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
    stateRepository ?? mockObject<IndexerStateRepository>({}),
    finalityRepository ?? mockObject<FinalityRepository>({}),
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
  const stateRepository = mockObject<IndexerStateRepository>({
    findIndexerState: async () => indexerState,
    add: async () => '',
    setSafeHeight: async () => 0,
  })
  return stateRepository
}

function getMockFinalityRuntimeConfiguration(
  results?: number[],
): FinalityConfig {
  return {
    projectId: ProjectId('project'),
    analyzer: mockObject<BaseAnalyzer>({
      getFinalityWithGranularity: mockFn().resolvesTo(results),
    }),
    minTimestamp: MIN_TIMESTAMP,
  }
}
