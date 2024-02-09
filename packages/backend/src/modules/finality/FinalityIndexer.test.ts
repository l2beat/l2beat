import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { LivenessIndexer } from '../liveness/LivenessIndexer'
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
    it('have all projects synced', async () => {
      const finalityRepository = mockObject<FinalityRepository>({
        getProjectsSyncedOnTimestamp: mockFn().resolvesToOnce([
          ProjectId('project-1'),
        ]),
        addMany: mockFn(),
      })
      const runtimeConfigurations = getMockFinalityRuntimeConfigurations([
        undefined,
      ])

      const finalityIndexer = getMockFinalityIndexer({
        runtimeConfigurations,
        finalityRepository,
      })

      const from = MIN_TIMESTAMP.toNumber()
      const to = MIN_TIMESTAMP.add(1, 'days').toNumber()

      const result = await finalityIndexer.update(from, to)
      expect(finalityRepository.addMany).not.toHaveBeenCalled()
      expect(result).toEqual(to)
    })

    it('correctly syncs not synced projects', async () => {
      const project2Results = { average: 4, minimum: 1, maximum: 7 }

      const finalityRepository = mockObject<FinalityRepository>({
        getProjectsSyncedOnTimestamp: mockFn().resolvesToOnce([
          ProjectId('project-1'),
        ]),
        addMany: mockFn().resolvesToOnce(1),
      })
      const runtimeConfigurations = getMockFinalityRuntimeConfigurations([
        undefined,
        project2Results,
      ])

      const finalityIndexer = getMockFinalityIndexer({
        runtimeConfigurations,
        finalityRepository,
      })

      const from = MIN_TIMESTAMP.toNumber()
      const to = MIN_TIMESTAMP.add(1, 'days').toNumber()

      await finalityIndexer.update(from, to)
      expect(finalityRepository.addMany).toHaveBeenNthCalledWith(1, [
        {
          projectId: ProjectId('project-2'),
          timestamp: MIN_TIMESTAMP.add(1, 'days'),
          ...project2Results,
        },
      ])
    })

    it('correctly syncs all projects on full day', async () => {
      const project1Results = { average: 2, minimum: 1, maximum: 3 }
      const project2Results = { average: 4, minimum: 1, maximum: 7 }

      const finalityRepository = mockObject<FinalityRepository>({
        getProjectsSyncedOnTimestamp: mockFn().resolvesToOnce([]),
        addMany: mockFn().resolvesToOnce(1),
      })
      const runtimeConfigurations = getMockFinalityRuntimeConfigurations([
        project1Results,
        project2Results,
      ])

      const finalityIndexer = getMockFinalityIndexer({
        runtimeConfigurations,
        finalityRepository,
      })

      const from = MIN_TIMESTAMP.toNumber()
      const to = MIN_TIMESTAMP.add(1, 'days').toNumber()

      await finalityIndexer.update(from, to)
      expect(finalityRepository.addMany).toHaveBeenNthCalledWith(1, [
        {
          projectId: ProjectId('project-1'),
          timestamp: MIN_TIMESTAMP.add(1, 'days'),
          ...project1Results,
        },
        {
          projectId: ProjectId('project-2'),
          timestamp: MIN_TIMESTAMP.add(1, 'days'),
          ...project2Results,
        },
      ])
    })
  })

  describe(FinalityIndexer.prototype.getSyncStatus.name, () => {
    it('correctly returns configurations to sync', async () => {
      const finalityRepository = mockObject<FinalityRepository>({
        getProjectsSyncedOnTimestamp: mockFn().resolvesToOnce([
          ProjectId('project-1'),
          ProjectId('project-2'),
        ]),
      })
      const runtimeConfigurations = getMockFinalityRuntimeConfigurations([
        undefined,
        undefined,
        undefined,
      ])

      const finalityIndexer = getMockFinalityIndexer({
        finalityRepository,
        runtimeConfigurations,
      })

      const results = await finalityIndexer.getSyncStatus(MIN_TIMESTAMP)
      expect(results).toEqualUnsorted([
        {
          projectId: ProjectId('project-3'),
          analyzer: runtimeConfigurations[2].analyzer,
        },
      ])
    })
  })

  describe(FinalityIndexer.prototype.getFinalityData.name, () => {
    it('returns finality data', async () => {
      const project1Results = { average: 2, minimum: 1, maximum: 3 }
      const project2Results = { average: 4, minimum: 1, maximum: 7 }

      const configurations = getMockFinalityRuntimeConfigurations([
        project1Results,
        project2Results,
      ])
      const finalityIndexer = getMockFinalityIndexer({})

      const results = await finalityIndexer.getFinalityData(
        MIN_TIMESTAMP,
        configurations,
      )
      const EXPECTED: FinalityRecord[] = [
        {
          projectId: ProjectId('project-1'),
          timestamp: MIN_TIMESTAMP,
          ...project1Results,
        },
        {
          projectId: ProjectId('project-2'),
          timestamp: MIN_TIMESTAMP,
          ...project2Results,
        },
      ]
      expect(results).toEqualUnsorted(EXPECTED)
    })

    it('does not return project when undefined', async () => {
      const project1Results = { average: 2, minimum: 1, maximum: 3 }
      const project2Results = undefined

      const configurations = getMockFinalityRuntimeConfigurations([
        project1Results,
        project2Results,
      ])
      const finalityIndexer = getMockFinalityIndexer({})

      const results = await finalityIndexer.getFinalityData(
        MIN_TIMESTAMP,
        configurations,
      )
      const EXPECTED: FinalityRecord[] = [
        {
          projectId: ProjectId('project-1'),
          timestamp: MIN_TIMESTAMP,
          ...project1Results,
        },
      ]
      expect(results).toEqualUnsorted(EXPECTED)
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
        runtimeConfigurations: [],
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
        'finality_indexer',
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
  runtimeConfigurations?: FinalityConfig[]
}) {
  const { stateRepository, finalityRepository, runtimeConfigurations } = params

  return new FinalityIndexer(
    Logger.SILENT,
    mockObject<LivenessIndexer>({
      start: async () => {},
      tick: async () => 1,
      subscribe: () => {},
    }),
    stateRepository ?? mockObject<IndexerStateRepository>({}),
    finalityRepository ?? mockObject<FinalityRepository>({}),
    runtimeConfigurations ?? [],
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

function getMockFinalityRuntimeConfigurations(
  results: (
    | {
        average: number
        minimum: number
        maximum: number
      }
    | undefined
  )[],
): FinalityConfig[] {
  return results.map((r, i) => ({
    projectId: ProjectId(`project-${i + 1}`),
    analyzer: mockObject<BaseAnalyzer>({
      getFinalityWithGranularity: mockFn().resolvesTo(r),
    }),
  }))
}
