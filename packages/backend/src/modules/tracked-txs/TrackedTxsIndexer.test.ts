import { Logger } from '@l2beat/backend-tools'
import {
  EthereumAddress,
  ProjectId,
  TrackedTxsConfigType,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { Knex } from 'knex'

import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { LivenessClient } from '../liveness/LivenessClient'
import { HourlyIndexer } from '../tracked-txs/HourlyIndexer'
import { TrackedTxsClient } from '../tracked-txs/TrackedTxsClient'
import { adjustToForBigqueryCall } from '../tracked-txs/utils'
import { getSafeHeight } from '../tracked-txs/utils/getSafeHeight'
import {
  TrackedTxsConfigRecord,
  TrackedTxsConfigsRepository,
} from './repositories/TrackedTxsConfigsRepository'
import { TrackedTxsIndexer } from './TrackedTxsIndexer'
import { TrackedTxResult } from './types/model'
import { TrackedTxConfigEntry } from './types/TrackedTxsConfig'
import { TrackedTxId } from './types/TrackedTxId'
import { TxUpdaterInterface } from './types/TxUpdaterInterface'
import { diffTrackedTxConfigurations } from './utils/diffTrackedTxConfigurations'
import { findConfigurationsToSync } from './utils/findConfigurationsToSync'

const MIN_TIMESTAMP = UnixTime.fromDate(new Date('2023-05-01T00:00:00Z'))
const TRX = mockObject<Knex.Transaction>({})

describe(TrackedTxsIndexer.name, () => {
  describe(TrackedTxsIndexer.prototype.update.name, () => {
    it('downloads data and passes it to updaters', async () => {
      const from = MIN_TIMESTAMP.add(365, 'days')
      const to = from.add(1, 'hours')
      const runtimeEntries = getMockRuntimeConfigurations()
      const databaseEntries = runtimeEntries.flatMap((r) => toRecords(r, from))
      const configurationRepository = getMockConfigRepository(databaseEntries)
      const trackedTxResults = getMockTrackedTxResults()
      const trackedTxsClient = mockObject<TrackedTxsClient>({
        getData: async () => trackedTxResults,
      })

      const livenessUpdater = mockObject<TxUpdaterInterface>({
        update: mockFn(),
      })
      const mockedUpdaters = {
        liveness: livenessUpdater,
      }

      const trackedTxIndexer = getMockTrackedTxsIndexer({
        configRepository: configurationRepository,
        configs: runtimeEntries,
        trackedTxsClient,
        updaters: mockedUpdaters,
      })
      const [configurationsToSync, adjustedTo] =
        await trackedTxIndexer.getConfiguration(from.toNumber(), to.toNumber())

      const value = await trackedTxIndexer.update(
        from.toNumber(),
        to.toNumber(),
      )

      expect(value).toEqual(adjustedTo.toNumber())
      expect(trackedTxsClient.getData).toHaveBeenOnlyCalledWith(
        configurationsToSync,
        from,
        adjustedTo,
      )
      expect(livenessUpdater.update).toHaveBeenOnlyCalledWith(
        trackedTxResults,
        TRX,
      )
      expect(
        configurationRepository.setLastSyncedTimestamp,
      ).toHaveBeenOnlyCalledWith(
        runtimeEntries.flatMap((r) => r.uses.map((u) => u.id)),
        adjustedTo,
        TRX,
      )
    })

    it('skips update if there are no configurations to sync', async () => {
      const from = MIN_TIMESTAMP
      const to = from.add(365, 'days')
      const configs = getMockRuntimeConfigurations()
      const databaseEntries = configs.flatMap((r) => toRecords(r, to))
      const configRepository = getMockConfigRepository(databaseEntries)
      const trackedTxsIndexer = getMockTrackedTxsIndexer({
        configRepository,
        configs,
      })
      const livenessClient = mockObject<LivenessClient>({
        getLivenessData: async () => [],
      })
      const adjustedTo = adjustToForBigqueryCall(from.toNumber(), to.toNumber())

      const value = await trackedTxsIndexer.update(
        from.toNumber(),
        to.toNumber(),
      )

      expect(value).toEqual(adjustedTo.toNumber())
      expect(livenessClient.getLivenessData).not.toHaveBeenCalled()
    })
  })

  describe(TrackedTxsIndexer.prototype.getConfiguration.name, () => {
    it('adjusts to and finds configurations to sync', async () => {
      const from = MIN_TIMESTAMP
      const to = from.add(365, 'days')

      const runtimeEntries = getMockRuntimeConfigurations()
      const databaseEntries = runtimeEntries.flatMap((r) => toRecords(r))
      const configRepository = getMockConfigRepository(databaseEntries)

      const livenessIndexer = getMockTrackedTxsIndexer({
        configRepository,
        configs: runtimeEntries,
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

      expect(configRepository.getAll).toHaveBeenCalledTimes(1)
    })
  })

  describe(TrackedTxsIndexer.prototype.start.name, () => {
    it('initializes configurations and indexer state', async () => {
      const runtimeEntries = [
        getMockRuntimeConfigurations()[0],
        {
          ...getMockRuntimeConfigurations()[1],
          untilTimestamp: MIN_TIMESTAMP.add(1, 'days'),
        },
      ]

      const databaseEntries: TrackedTxsConfigRecord[] = [
        mockObject<TrackedTxsConfigRecord>({
          sinceTimestamp: MIN_TIMESTAMP,
          untilTimestamp: undefined,
          lastSyncedTimestamp: undefined,
          type: 'liveness',
          subtype: 'batchSubmissions',
          id: TrackedTxId.random(),
        }),
        mockObject<TrackedTxsConfigRecord>({
          ...toRecords(runtimeEntries[1]),
          untilTimestamp: undefined,
        }),
        // rest of the configurations would be considered "toAdd"
      ]

      const configurationRepository = getMockConfigRepository(databaseEntries)
      const stateRepository = getMockStateRepository()

      const mockedLivenessUpdater = mockObject<TxUpdaterInterface>({
        deleteAfter: mockFn(),
      })

      const trackedTxsIndexer = getMockTrackedTxsIndexer({
        configRepository: configurationRepository,
        stateRepository,
        configs: runtimeEntries,
        updaters: {
          liveness: mockedLivenessUpdater,
        },
      })

      await trackedTxsIndexer.start()

      const { toAdd, toRemove, toTrim } = diffTrackedTxConfigurations(
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
      expect(mockedLivenessUpdater.deleteAfter).toHaveBeenOnlyCalledWith(
        toTrim[0].id,
        toTrim[0].untilTimestamp,
        TRX,
      )

      expect(configurationRepository.getAll).toHaveBeenCalledTimes(1)
      expect(stateRepository.runInTransaction).toHaveBeenCalledTimes(1)

      const syncStatus = getSafeHeight(
        databaseEntries,
        toAdd,
        MIN_TIMESTAMP.add(-1, 'days'),
      )
      expect(stateRepository.setSafeHeight).toHaveBeenOnlyCalledWith(
        trackedTxsIndexer.indexerId,
        syncStatus,
        TRX,
      )

      // 1st during this.initialize() -> this.setSafeHeight()
      // 2nd during super.start() -> this.getSafeHeight()
      expect(stateRepository.findIndexerState).toHaveBeenCalledTimes(2)
    })

    it('indexer state undefined', async () => {
      const configurationRepository = getMockConfigRepository([])
      const stateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: async () => undefined,
        add: async () => '',
        setSafeHeight: async () => 0,
        runInTransaction: async (fn) => fn(TRX),
      })
      const livenessIndexer = getMockTrackedTxsIndexer({
        configRepository: configurationRepository,
        stateRepository,
        configs: [],
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

  describe(TrackedTxsIndexer.prototype.getSafeHeight.name, () => {
    it('returns safe height from DB', async () => {
      const safeHeightDB = 123
      const stateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: async () => ({
          indexerId: 'liveness_indexer',
          safeHeight: safeHeightDB,
          minTimestamp: MIN_TIMESTAMP,
        }),
      })
      const livenessIndexer = getMockTrackedTxsIndexer({ stateRepository })

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
      const livenessIndexer = getMockTrackedTxsIndexer({ stateRepository })

      const safeHeight = await livenessIndexer.getSafeHeight()

      expect(safeHeight).toEqual(MIN_TIMESTAMP.toNumber())
      expect(stateRepository.findIndexerState).toHaveBeenOnlyCalledWith(
        livenessIndexer.indexerId,
      )
    })
  })

  describe(TrackedTxsIndexer.prototype.setSafeHeight.name, () => {
    it('saves safe height in the database', async () => {
      const stateRepository = mockObject<IndexerStateRepository>({
        setSafeHeight: async () => 0, // return value is not important
      })
      const livenessIndexer = getMockTrackedTxsIndexer({ stateRepository })

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
      const livenessIndexer = getMockTrackedTxsIndexer({ stateRepository })

      const incorrectHeight = MIN_TIMESTAMP.add(-1, 'hours').toNumber()
      await expect(
        async () => await livenessIndexer.setSafeHeight(incorrectHeight, TRX),
      ).toBeRejectedWith(
        'Cannot set height to be lower than the minimum timestamp',
      )
    })
  })

  describe(TrackedTxsIndexer.prototype.invalidate.name, () => {
    it('only returns target height', async () => {
      const livenessIndexer = getMockTrackedTxsIndexer({})

      const targetHeight = 1
      const value = await livenessIndexer.invalidate(targetHeight)

      expect(value).toEqual(targetHeight)
    })
  })
})

function getMockTrackedTxsIndexer(params: {
  stateRepository?: IndexerStateRepository
  configRepository?: TrackedTxsConfigsRepository
  configs?: TrackedTxConfigEntry[]
  trackedTxsClient?: TrackedTxsClient
  updaters?: Record<TrackedTxsConfigType, TxUpdaterInterface>
}) {
  const {
    stateRepository,
    configRepository,
    configs,
    trackedTxsClient,
    updaters,
  } = params

  return new TrackedTxsIndexer(
    Logger.SILENT,
    mockObject<HourlyIndexer>({
      start: async () => {},
      tick: async () => 1,
      subscribe: () => {},
    }),
    trackedTxsClient ?? mockObject<TrackedTxsClient>({}),
    stateRepository ?? mockObject<IndexerStateRepository>({}),
    configRepository ?? mockObject<TrackedTxsConfigsRepository>({}),
    configs ?? [],
    updaters ?? {
      liveness: mockObject<TxUpdaterInterface>({}),
    },
    MIN_TIMESTAMP,
  )
}

function getMockConfigRepository(databaseEntries: TrackedTxsConfigRecord[]) {
  return mockObject<TrackedTxsConfigsRepository>({
    addMany: async () => [],
    deleteMany: async () => 0,
    setUntilTimestamp: async () => 0,
    getAll: async () => databaseEntries,
    setLastSyncedTimestamp: async () => 0,
  })
}

function getMockStateRepository(
  indexerState = {
    indexerId: 'tracked_txs_indexer',
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

function getMockRuntimeConfigurations(): TrackedTxConfigEntry[] {
  return [
    {
      formula: 'functionCall',
      projectId: ProjectId('test'),
      address: EthereumAddress.random(),
      selector: '0x',
      sinceTimestamp: MIN_TIMESTAMP,
      uses: [
        {
          type: 'liveness',
          subType: 'batchSubmissions',
          id: TrackedTxId.random(),
        },
      ],
    },
    {
      formula: 'functionCall',
      projectId: ProjectId('test2'),
      address: EthereumAddress.random(),
      selector: '0x',
      sinceTimestamp: MIN_TIMESTAMP,
      uses: [
        {
          type: 'liveness',
          subType: 'stateUpdates',
          id: TrackedTxId.random(),
        },
      ],
    },
  ]
}

function getMockTrackedTxResults(): TrackedTxResult[] {
  return [
    {
      type: 'functionCall',
      projectId: ProjectId('test'),
      blockNumber: 1,
      blockTimestamp: UnixTime.now(),
      toAddress: EthereumAddress.random(),
      gasPrice: 25,
      gasUsed: 100,
      input: '',
      hash: '',
      use: {
        type: 'liveness',
        subType: 'batchSubmissions',
        id: getMockRuntimeConfigurations()[0].uses[0].id,
      },
    },
    {
      type: 'transfer',
      use: {
        id: getMockRuntimeConfigurations()[1].uses[0].id,
        type: 'liveness',
        subType: 'stateUpdates',
      },
      blockNumber: 1,
      blockTimestamp: UnixTime.now(),
      hash: '',
      gasPrice: 25,
      gasUsed: 100,
      fromAddress: EthereumAddress.random(),
      toAddress: EthereumAddress.random(),
      projectId: ProjectId('test2'),
    },
  ]
}

function toRecords(
  entry: TrackedTxConfigEntry,
  lastSyncedTimestamp?: UnixTime,
): TrackedTxsConfigRecord[] {
  return entry.uses.map((use) => ({
    id: use.id,
    projectId: entry.projectId,
    type: use.type,
    subType: use.subType,
    sinceTimestamp: entry.sinceTimestamp,
    untilTimestamp: entry.untilTimestamp,
    debugInfo: '',
    lastSyncedTimestamp,
  }))
}
