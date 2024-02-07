import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { LivenessIndexer } from '../liveness/LivenessIndexer'
import { BaseAnalyzer } from './analyzers/types/BaseAnalyzer'
import { FinalityIndexer } from './FinalityIndexer'
import { FinalityRepository } from './repositories/FinalityRepository'
import { FinalityConfig } from './types/FinalityConfig'

const MIN_TIMESTAMP = UnixTime.fromDate(new Date('2024-02-07T00:00:00Z'))

describe(FinalityIndexer.name, () => {
  describe(FinalityIndexer.prototype.start.name, () => {
    it('initializes indexer state', async () => {
      const stateRepository = getMockStateRepository()
      const livenessIndexer = getMockFinalityIndexer({
        stateRepository,
      })

      await livenessIndexer.start()

      expect(stateRepository.setSafeHeight).toHaveBeenOnlyCalledWith(
        livenessIndexer.indexerId,
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

    it('throws if height is lower than minimum timestamp', async () => {
      const stateRepository = mockObject<IndexerStateRepository>({
        setSafeHeight: async () => 0, // return value is not important
      })
      const finalityIndexer = getMockFinalityIndexer({ stateRepository })

      const incorrectHeight = MIN_TIMESTAMP.add(-1, 'hours').toNumber()
      await expect(
        async () => await finalityIndexer.setSafeHeight(incorrectHeight),
      ).toBeRejectedWith(
        'Cannot set height to be lower than the minimum timestamp',
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
function getRandomInt() {
  const min = Math.ceil(1)
  const max = Math.floor(100)
  return Math.floor(Math.random() * (max - min + 1)) + 1
}

function getMockAnalyzer() {
  return mockObject<BaseAnalyzer>({
    getFinalityWithGranularity: async () => ({
      average: getRandomInt(),
      maximum: getRandomInt(),
      minimum: getRandomInt(),
    }),
  })
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

function getMockFinalityRuntimeConfigurations(): FinalityConfig[] {
  return [
    {
      projectId: ProjectId('project-a'),
      analyzer: getMockAnalyzer(),
    },
    {
      projectId: ProjectId('project-b'),
      analyzer: getMockAnalyzer(),
    },
  ]
}
