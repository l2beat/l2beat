import { Logger } from '@l2beat/backend-tools'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { Knex } from 'knex'

import { IndexerStateRepository } from '../../peripherals/database/IndexerStateRepository'
import {
  LivenessConfigurationRecord,
  LivenessConfigurationRepository,
} from '../../peripherals/database/LivenessConfigurationRepository'
import { LivenessRepository } from '../../peripherals/database/LivenessRepository'
import { HourlyIndexer } from './HourlyIndexer'
import { LivenessClient } from './LivenessClient'
import { LivenessIndexer } from './LivenessIndexer'
import {
  LivenessConfigEntry,
  makeLivenessFunctionCall,
} from './types/LivenessConfig'
import { LivenessId } from './types/LivenessId'
import { diffLivenessConfigurations } from './utils/diffLivenessConfigurations'
import { getSyncStatus } from './utils/getSyncStatus'

const MIN_TIMESTAMP = UnixTime.fromDate(new Date('2023-05-01T00:00:00Z'))
const TRX = mockObject<Knex.Transaction>({})

describe(LivenessIndexer.name, () => {
  describe(LivenessIndexer.prototype.update.name, () => {})

  describe(LivenessIndexer.prototype.getConfiguration.name, () => {})

  describe(LivenessIndexer.prototype.start.name, () => {
    it('initializes configurations and indexer state', async () => {
      const runtimeEntries = getMockRuntimeConfigurations()

      const removedConfig = mockObject<LivenessConfigurationRecord>({
        id: LivenessId.random(),
      })

      const databaseEntries: LivenessConfigurationRecord[] = [
        removedConfig,
        toRecordWithUntilTimestamp(runtimeEntries[1], undefined),
        // rest of the configurations would be considered "toAdd"
      ]

      const configurationRepository = getMockConfigRepository(databaseEntries)
      const livenessRepository = getMockLivenessRepository()
      const stateRepository = getMockStateRepository()
      const livenessIndexer = getMockLivenessIndexer({
        configurationRepository,
        livenessRepository,
        stateRepository,
        runtimeEntries,
      })

      await livenessIndexer.start()

      const { toAdd, toRemove, toTrim } = diffLivenessConfigurations(
        runtimeEntries,
        databaseEntries,
      )

      expect(configurationRepository.addMany).toHaveBeenOnlyCalledWith(
        toAdd,
        TRX,
      )
      expect(configurationRepository.deleteMany).toHaveBeenOnlyCalledWith(
        toRemove,
        TRX,
      )
      expect(
        configurationRepository.setUntilTimestamp,
      ).toHaveBeenOnlyCalledWith(toTrim[0].id, toTrim[0].untilTimestamp, TRX)
      expect(livenessRepository.deleteAfter).toHaveBeenOnlyCalledWith(
        toTrim[0].id,
        toTrim[0].untilTimestamp,
        TRX,
      )

      expect(configurationRepository.getAll).toHaveBeenCalledTimes(1)
      expect(stateRepository.runInTransaction).toHaveBeenCalledTimes(1)

      const syncStatus = getSyncStatus(databaseEntries, toAdd, MIN_TIMESTAMP)
      expect(stateRepository.setSafeHeight).toHaveBeenOnlyCalledWith(
        livenessIndexer.indexerId,
        syncStatus.toNumber(),
      )

      // 1st during this.initialize() -> this.setSafeHeight()
      // 2nd during super.start() -> this.getSafeHeight()
      expect(stateRepository.findIndexerState).toHaveBeenCalledTimes(2)
    })
  })

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
      const indexerState = {
        indexerId: 'liveness_indexer',
        safeHeight: 1,
        minTimestamp: MIN_TIMESTAMP,
      }
      const stateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: async () => indexerState,
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

    it('adds state to DB if undefined', async () => {
      const stateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: async () => undefined,
        add: async () => '',
      })
      const livenessIndexer = getMockLivenessIndexer({ stateRepository })

      const safeHeight = MIN_TIMESTAMP.toNumber()
      await livenessIndexer.setSafeHeight(safeHeight, TRX)

      expect(stateRepository.add).toHaveBeenOnlyCalledWith(
        {
          indexerId: livenessIndexer.indexerId,
          safeHeight: MIN_TIMESTAMP.toNumber(),
          minTimestamp: MIN_TIMESTAMP,
        },
        TRX,
      )
    })

    it('throws if minTimestamp is different than the one from DB', async () => {
      const indexerState = {
        indexerId: 'liveness_indexer',
        safeHeight: 1,
        minTimestamp: new UnixTime(0),
      }
      const stateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: async () => indexerState,
        setSafeHeight: async () => 0, // return value is not important
      })
      const livenessIndexer = getMockLivenessIndexer({ stateRepository })

      await expect(
        async () => await livenessIndexer.setSafeHeight(111, TRX),
      ).toBeRejectedWith('Minimum timestamp of this indexer cannot be updated')
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

function getMockLivenessRepository() {
  return mockObject<LivenessRepository>({
    deleteAfter: async () => 0,
  })
}

function getMockConfigRepository(
  databaseEntries: LivenessConfigurationRecord[],
) {
  return mockObject<LivenessConfigurationRepository>({
    addMany: async () => [],
    deleteMany: async () => 0,
    setUntilTimestamp: async () => 0,
    getAll: async () => databaseEntries,
  })
}

function getMockStateRepository(
  indexerState = {
    indexerId: 'liveness_indexer',
    safeHeight: 1,
    minTimestamp: MIN_TIMESTAMP,
  },
) {
  const stateRepository = mockObject<IndexerStateRepository>({
    findIndexerState: async () => indexerState,
    add: async () => '',
    setSafeHeight: async () => 0,
    runInTransaction: async (fn) => fn(TRX),
  })
  return stateRepository
}

function getMockRuntimeConfigurations() {
  return [
    makeLivenessFunctionCall({
      projectId: ProjectId('test'),
      type: 'STATE',
      formula: 'functionCall',
      address: EthereumAddress.random(),
      selector: '0x',
      sinceTimestamp: MIN_TIMESTAMP,
    }),
    // this one has updated untilTimestamp
    makeLivenessFunctionCall({
      projectId: ProjectId('test2'),
      type: 'STATE',
      formula: 'functionCall',
      address: EthereumAddress.random(),
      selector: '0x',
      sinceTimestamp: MIN_TIMESTAMP,
      untilTimestamp: MIN_TIMESTAMP.add(1, 'days'),
    }),
  ]
}

function getMockLivenessIndexer(params: {
  stateRepository?: IndexerStateRepository
  configurationRepository?: LivenessConfigurationRepository
  livenessRepository?: LivenessRepository
  runtimeEntries?: LivenessConfigEntry[]
}) {
  const {
    stateRepository,
    configurationRepository,
    livenessRepository,
    runtimeEntries,
  } = params

  return new LivenessIndexer(
    Logger.SILENT,
    mockObject<HourlyIndexer>({
      start: async () => {},
      tick: async () => 1,
      subscribe: () => {},
    }),
    mockObject<LivenessClient>({}),
    stateRepository ?? mockObject<IndexerStateRepository>({}),
    livenessRepository ?? mockObject<LivenessRepository>({}),
    configurationRepository ?? mockObject<LivenessConfigurationRepository>({}),
    runtimeEntries ?? [],
    MIN_TIMESTAMP,
  )
}

function toRecordWithUntilTimestamp(
  entry: LivenessConfigEntry,
  untilTimestamp: UnixTime | undefined,
): LivenessConfigurationRecord {
  return {
    id: entry.id,
    projectId: entry.projectId,
    type: entry.type,
    sinceTimestamp: entry.sinceTimestamp,
    untilTimestamp,
    debugInfo: '',
  }
}
