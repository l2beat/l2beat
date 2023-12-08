import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import {
  IndexerStateRecord,
  IndexerStateRepository,
} from '../../peripherals/database/IndexerStateRepository'
import { LivenessConfigurationRepository } from '../../peripherals/database/LivenessConfigurationRepository'
import { LivenessRepository } from '../../peripherals/database/LivenessRepository'
import { HourlyIndexer } from './HourlyIndexer'
import { LivenessClient } from './LivenessClient'
import { LivenessIndexer } from './LivenessIndexer'

const MIN_TIMESTAMP = UnixTime.fromDate(new Date('2023-05-01T00:00:00Z'))

describe(LivenessIndexer.name, () => {
  describe(LivenessIndexer.prototype.start.name, () => {})

  describe(LivenessIndexer.prototype.update.name, () => {})

  describe(LivenessIndexer.prototype.getConfiguration.name, () => {})

  describe(LivenessIndexer.prototype.getSafeHeight.name, () => {
    it('returns safe height from DB', async () => {
      const safeHeightDB = 123
      const stateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: async () => ({
          indexerId: 'liveness_indexer',
          safeHeight: safeHeightDB,
          minTimestamp: MIN_TIMESTAMP,
        }),
      })
      const livenessIndexer = getMockLivenessIndexer({ stateRepository })

      const safeHeight = await livenessIndexer.getSafeHeight()

      expect(safeHeight).toEqual(safeHeightDB)
      expect(stateRepository.findIndexerState).toHaveBeenOnlyCalledWith(
        livenessIndexer.indexerId,
      )
    })
    it('returns minTimestamp if indexer state is undefined', async () => {
      const stateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: async () => undefined,
      })
      const livenessIndexer = getMockLivenessIndexer({ stateRepository })

      const safeHeight = await livenessIndexer.getSafeHeight()

      expect(safeHeight).toEqual(MIN_TIMESTAMP.toNumber())
      expect(stateRepository.findIndexerState).toHaveBeenOnlyCalledWith(
        livenessIndexer.indexerId,
      )
    })
  })

  describe(LivenessIndexer.prototype.setSafeHeight.name, () => {
    it('saves safe height in the database', async () => {
      const stateRepository = mockObject<IndexerStateRepository>({
        setSafeHeight: async () => 0, // return value is not important
      })
      const livenessIndexer = getMockLivenessIndexer({ stateRepository })

      const safeHeight = 123
      await livenessIndexer.setSafeHeight(safeHeight)

      expect(stateRepository.setSafeHeight).toHaveBeenOnlyCalledWith(
        'liveness_indexer',
        safeHeight,
      )
    })
  })

  describe(LivenessIndexer.prototype.invalidate.name, () => {
    it('only returns target height', async () => {
      const livenessIndexer = getMockLivenessIndexer({})

      const targetHeight = 1
      const value = await livenessIndexer.invalidate(targetHeight)

      expect(value).toEqual(targetHeight)
    })
  })
})

function getMockLivenessIndexer(params: {
  stateRepository?: IndexerStateRepository
  minTimestamp?: UnixTime
}) {
  const { stateRepository, minTimestamp } = params

  return new LivenessIndexer(
    Logger.SILENT,
    mockObject<HourlyIndexer>({
      start: async () => {},
      tick: async () => 1,
      subscribe: () => {},
    }),
    mockObject<LivenessClient>({}),
    stateRepository ?? mockObject<IndexerStateRepository>({}),
    mockObject<LivenessRepository>({}),
    mockObject<LivenessConfigurationRepository>({}),
    [],
    minTimestamp ?? MIN_TIMESTAMP,
  )
}
