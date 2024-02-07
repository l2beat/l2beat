import { Logger } from '@l2beat/backend-tools'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { Knex } from 'knex'

import { IndexerStateRepository } from '../../peripherals/database/IndexerStateRepository'
import { HourlyIndexer } from './HourlyIndexer'
import { LivenessClient } from './LivenessClient'
import { LivenessIndexer } from './LivenessIndexer'
import {
  LivenessConfigurationRecord,
  LivenessConfigurationRepository,
} from './repositories/LivenessConfigurationRepository'
import {
  LivenessRecord,
  LivenessRepository,
} from './repositories/LivenessRepository'
import {
  LivenessConfigEntry,
  makeLivenessFunctionCall,
} from './types/LivenessConfig'
import { LivenessId } from './types/LivenessId'
import { adjustToForBigqueryCall, findConfigurationsToSync } from './utils'
import { diffLivenessConfigurations } from './utils/diffLivenessConfigurations'
import { getSafeHeight } from './utils/getSafeHeight'

const MIN_TIMESTAMP = UnixTime.fromDate(new Date('2023-05-01T00:00:00Z'))
const TRX = mockObject<Knex.Transaction>({})

describe(LivenessIndexer.name, () => {
  describe(LivenessIndexer.prototype.update.name, () => {
    it('updates liveness data', async () => {
      const from = MIN_TIMESTAMP.add(365, 'days')
      const to = from.add(1, 'hours')
      const runtimeEntries = getMockRuntimeConfigurations()
      const databaseEntries = runtimeEntries.map((r) => toRecord(r, from))
      const configurationRepository = getMockConfigRepository(databaseEntries)
      const livenessRepository = getMockLivenessRepository()
      const livenessResults = getMockLivenessResults()
      const livenessClient = mockObject<LivenessClient>({
        getLivenessData: async () => livenessResults,
      })
      const livenessIndexer = getMockLivenessIndexer({
        configurationRepository,
        livenessRepository,
        runtimeEntries,
        livenessClient,
      })
      const [configurationsToSync, adjustedTo] =
        await livenessIndexer.getConfiguration(from.toNumber(), to.toNumber())

      const value = await livenessIndexer.update(from.toNumber(), to.toNumber())

      expect(value).toEqual(adjustedTo.toNumber())
      expect(livenessClient.getLivenessData).toHaveBeenOnlyCalledWith(
        configurationsToSync,
        from,
        adjustedTo,
      )
      expect(livenessRepository.addMany).toHaveBeenOnlyCalledWith(
        livenessResults,
        TRX,
      )
      expect(
        configurationRepository.setLastSyncedTimestamp,
      ).toHaveBeenOnlyCalledWith(
        runtimeEntries.map((r) => r.id),
        adjustedTo,
        TRX,
      )
    })

    it('skips update if there are no configurations to sync', async () => {
      const from = MIN_TIMESTAMP
      const to = from.add(365, 'days')
      const runtimeEntries = getMockRuntimeConfigurations()
      const databaseEntries = runtimeEntries.map((r) => toRecord(r, to))
      const configurationRepository = getMockConfigRepository(databaseEntries)
      const livenessIndexer = getMockLivenessIndexer({
        configurationRepository,
        runtimeEntries,
      })
      const livenessClient = mockObject<LivenessClient>({
        getLivenessData: async () => [],
      })
      const adjustedTo = adjustToForBigqueryCall(from.toNumber(), to.toNumber())

      const value = await livenessIndexer.update(from.toNumber(), to.toNumber())

      expect(value).toEqual(adjustedTo.toNumber())
      expect(livenessClient.getLivenessData).not.toHaveBeenCalled()
    })
  })

  describe(LivenessIndexer.prototype.getConfiguration.name, () => {
    it('adjusts to and finds configurations to sync', async () => {
      const from = MIN_TIMESTAMP
      const to = from.add(365, 'days')

      const runtimeEntries = getMockRuntimeConfigurations()
      const databaseEntries = runtimeEntries.map((r) => toRecord(r))
      const configurationRepository = getMockConfigRepository(databaseEntries)

      const livenessIndexer = getMockLivenessIndexer({
        configurationRepository,
        runtimeEntries,
      })

      const [configurationsToSync, adjustedTo] =
        await livenessIndexer.getConfiguration(from.toNumber(), to.toNumber())

      const expectedAdjustedTo = adjustToForBigqueryCall(
        from.toNumber(),
        to.toNumber(),
      )

      expect(adjustedTo).toEqual(expectedAdjustedTo)

      const expectedConfigurationsToSync = findConfigurationsToSync(
        runtimeEntries,
        databaseEntries,
        from,
        adjustedTo,
      )

      expect(configurationsToSync).toEqual(expectedConfigurationsToSync)

      expect(configurationRepository.getAll).toHaveBeenCalledTimes(1)
    })
  })

  describe(LivenessIndexer.prototype.start.name, () => {
    it('initializes configurations and indexer state', async () => {
      const runtimeEntries = [
        getMockRuntimeConfigurations()[0],
        {
          ...getMockRuntimeConfigurations()[1],
          untilTimestamp: MIN_TIMESTAMP.add(1, 'days'),
        },
      ]

      const databaseEntries: LivenessConfigurationRecord[] = [
        mockObject<LivenessConfigurationRecord>({
          id: LivenessId.random(),
          lastSyncedTimestamp: undefined,
          sinceTimestamp: MIN_TIMESTAMP,
        }),
        {
          ...toRecord(runtimeEntries[1]),
          untilTimestamp: undefined,
        },
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

      const syncStatus = getSafeHeight(databaseEntries, toAdd, MIN_TIMESTAMP)
      expect(stateRepository.setSafeHeight).toHaveBeenOnlyCalledWith(
        livenessIndexer.indexerId,
        syncStatus,
        TRX,
      )

      // 1st during this.initialize() -> this.setSafeHeight()
      // 2nd during super.start() -> this.getSafeHeight()
      expect(stateRepository.findIndexerState).toHaveBeenCalledTimes(2)
    })

    it('indexer state undefined', async () => {
      const configurationRepository = getMockConfigRepository([])
      const livenessRepository = getMockLivenessRepository()
      const stateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: async () => undefined,
        add: async () => '',
        setSafeHeight: async () => 0,
        runInTransaction: async (fn) => fn(TRX),
      })
      const livenessIndexer = getMockLivenessIndexer({
        configurationRepository,
        livenessRepository,
        stateRepository,
        runtimeEntries: [],
      })

      await livenessIndexer.start()

      expect(stateRepository.add).toHaveBeenOnlyCalledWith(
        {
          indexerId: livenessIndexer.indexerId,
          safeHeight: MIN_TIMESTAMP.toNumber(),
          minTimestamp: MIN_TIMESTAMP,
        },
        TRX,
      )
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
      const stateRepository = mockObject<IndexerStateRepository>({
        setSafeHeight: async () => 0, // return value is not important
      })
      const livenessIndexer = getMockLivenessIndexer({ stateRepository })

      const safeHeight = MIN_TIMESTAMP.add(1, 'hours').toNumber()
      await livenessIndexer.setSafeHeight(safeHeight, TRX)

      expect(stateRepository.setSafeHeight).toHaveBeenOnlyCalledWith(
        'liveness_indexer',
        safeHeight,
        TRX,
      )
    })

    it('throws if height is lower than minimum timestamp', async () => {
      const stateRepository = mockObject<IndexerStateRepository>({
        setSafeHeight: async () => 0, // return value is not important
      })
      const livenessIndexer = getMockLivenessIndexer({ stateRepository })

      const incorrectHeight = MIN_TIMESTAMP.add(-1, 'hours').toNumber()
      await expect(
        async () => await livenessIndexer.setSafeHeight(incorrectHeight, TRX),
      ).toBeRejectedWith(
        'Cannot set height to be lower than the minimum timestamp',
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
  configurationRepository?: LivenessConfigurationRepository
  livenessRepository?: LivenessRepository
  runtimeEntries?: LivenessConfigEntry[]
  livenessClient?: LivenessClient
}) {
  const {
    stateRepository,
    configurationRepository,
    livenessRepository,
    runtimeEntries,
    livenessClient,
  } = params

  return new LivenessIndexer(
    Logger.SILENT,
    mockObject<HourlyIndexer>({
      start: async () => {},
      tick: async () => 1,
      subscribe: () => {},
    }),
    livenessClient ?? mockObject<LivenessClient>({}),
    stateRepository ?? mockObject<IndexerStateRepository>({}),
    livenessRepository ?? mockObject<LivenessRepository>({}),
    configurationRepository ?? mockObject<LivenessConfigurationRepository>({}),
    runtimeEntries ?? [],
    MIN_TIMESTAMP,
  )
}

function getMockLivenessRepository() {
  return mockObject<LivenessRepository>({
    deleteAfter: async () => 0,
    runInTransaction: async (fn) => fn(TRX),
    addMany: async () => 0,
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
    setLastSyncedTimestamp: async () => 0,
  })
}

function getMockStateRepository(
  indexerState = {
    indexerId: 'liveness_indexer',
    safeHeight: MIN_TIMESTAMP.toNumber(),
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
    }),
  ]
}

function getMockLivenessResults(): LivenessRecord[] {
  return [
    {
      livenessId: getMockRuntimeConfigurations()[0].id,
      blockNumber: 1,
      timestamp: UnixTime.now(),
      txHash: '',
    },
    {
      livenessId: getMockRuntimeConfigurations()[1].id,
      blockNumber: 1,
      timestamp: UnixTime.now(),
      txHash: '',
    },
  ]
}

function toRecord(
  entry: LivenessConfigEntry,
  lastSyncedTimestamp?: UnixTime,
): LivenessConfigurationRecord {
  return {
    id: entry.id,
    projectId: entry.projectId,
    type: entry.type,
    sinceTimestamp: entry.sinceTimestamp,
    untilTimestamp: entry.untilTimestamp,
    debugInfo: '',
    lastSyncedTimestamp,
  }
}
