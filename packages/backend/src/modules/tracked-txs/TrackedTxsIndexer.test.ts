import { Logger } from '@l2beat/backend-tools'
import { TrackedTxConfigEntry } from '@l2beat/shared'
import {
  EthereumAddress,
  TrackedTxsConfigType,
  UnixTime,
} from '@l2beat/shared-pure'
import { ProjectId } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { DatabaseMiddleware } from '../../peripherals/database/DatabaseMiddleware'
import { IndexerService } from '../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../tools/uif/ids'
import { mockDbMiddleware } from '../../tools/uif/multi/MultiIndexer.test'
import { removal, update } from '../../tools/uif/multi/test/mockConfigurations'
import {
  RemovalConfiguration,
  UpdateConfiguration,
} from '../../tools/uif/multi/types'
import { TrackedTxsClient } from './TrackedTxsClient'
import { TrackedTxsIndexer } from './TrackedTxsIndexer'
import { L2CostsUpdater } from './modules/l2-costs/L2CostsUpdater'
import { L2CostsRepository } from './modules/l2-costs/repositories/L2CostsRepository'
import { LivenessUpdater } from './modules/liveness/LivenessUpdater'
import { LivenessRepository } from './modules/liveness/repositories/LivenessRepository'
import { TxUpdaterInterface } from './types/TxUpdaterInterface'
import { TrackedTxResult } from './types/model'

describe(TrackedTxsIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })
  describe(TrackedTxsIndexer.prototype.multiUpdate.name, () => {
    it('fetches txs and calls updaters', async () => {
      const from = 100
      const to = 300

      const trackedTxResults = getMockTrackedTxResults()
      const trackedTxsClient = mockObject<TrackedTxsClient>({
        getData: async () => trackedTxResults,
      })
      const l2costsUpdater = mockObject<L2CostsUpdater>({
        update: mockFn(async () => {}),
      })
      const livenessUpdater = mockObject<LivenessUpdater>({
        update: mockFn(async () => {}),
      })

      const indexer = getMockTrackedTxsIndexer({
        updaters: {
          l2costs: l2costsUpdater,
          liveness: livenessUpdater,
        },
        trackedTxsClient,
      })

      const parameters: Partial<TrackedTxConfigEntry> = {
        projectId: ProjectId('test'),
      }

      const configurations: UpdateConfiguration<TrackedTxConfigEntry>[] = [
        update<TrackedTxConfigEntry>('a', 100, null, false, parameters),
        update<TrackedTxConfigEntry>('b', 100, null, false, parameters),
        update<TrackedTxConfigEntry>('c', 100, null, true, parameters),
      ]

      const safeHeight = await indexer.multiUpdate(
        from,
        to,
        configurations,
        mockDbMiddleware,
      )

      expect(trackedTxsClient.getData).toHaveBeenNthCalledWith(
        1,
        [configurations[0], configurations[1]],
        new UnixTime(from),
        new UnixTime(to),
      )
      expect(livenessUpdater.update).toHaveBeenNthCalledWith(
        1,
        trackedTxResults.filter((tx) => tx.type === 'liveness'),
        undefined,
      )
      expect(l2costsUpdater.update).toHaveBeenNthCalledWith(
        1,
        trackedTxResults.filter((tx) => tx.type === 'l2costs'),
        undefined,
      )
      expect(safeHeight).toEqual(to)
    })

    it('correctly clamps FROM and TO to day', async () => {
      const from = UnixTime.fromDate(new Date('2024-01-01T12:00:00Z'))
      const to = UnixTime.fromDate(new Date('2024-01-02T12:00:00Z'))
      const expected = UnixTime.fromDate(new Date('2024-01-02T00:00:00Z'))

      const trackedTxsClient = mockObject<TrackedTxsClient>({
        getData: async () => [],
      })

      const indexer = getMockTrackedTxsIndexer({
        trackedTxsClient,
      })

      const parameters: Partial<TrackedTxConfigEntry> = {
        projectId: ProjectId('test'),
      }

      const configurations: UpdateConfiguration<TrackedTxConfigEntry>[] = [
        update<TrackedTxConfigEntry>('a', 100, null, false, parameters),
      ]

      const safeHeight = await indexer.multiUpdate(
        from.toNumber(),
        to.toNumber(),
        configurations,
        mockDbMiddleware,
      )

      expect(trackedTxsClient.getData).toHaveBeenNthCalledWith(
        1,
        [configurations[0]],
        from,
        expected,
      )
      expect(safeHeight).toEqual(expected.toNumber())
    })

    it('calls getData with the lowest timestamp', async () => {
      const from = 100
      const to = 300

      const trackedTxsClient = mockObject<TrackedTxsClient>({
        getData: async () => [],
      })

      const indexer = getMockTrackedTxsIndexer({
        trackedTxsClient,
      })

      const parameters: Partial<TrackedTxConfigEntry> = {
        projectId: ProjectId('test'),
      }

      const LOWEST_TIMESTAMP = 200
      const configurations: UpdateConfiguration<TrackedTxConfigEntry>[] = [
        update<TrackedTxConfigEntry>('a', 100, null, false, parameters),
        update<TrackedTxConfigEntry>(
          'a',
          100,
          LOWEST_TIMESTAMP,
          false,
          parameters,
        ),
      ]

      const safeHeight = await indexer.multiUpdate(
        from,
        to,
        configurations,
        mockDbMiddleware,
      )

      expect(trackedTxsClient.getData).toHaveBeenNthCalledWith(
        1,
        [configurations[0], configurations[1]],
        new UnixTime(from),
        new UnixTime(LOWEST_TIMESTAMP),
      )
      expect(safeHeight).toEqual(LOWEST_TIMESTAMP)
    })

    it('returns to if no configurations to sync', async () => {
      const from = 100
      const to = 300

      const indexer = getMockTrackedTxsIndexer({})

      const parameters: Partial<TrackedTxConfigEntry> = {
        projectId: ProjectId('test'),
      }
      const configurations: UpdateConfiguration<TrackedTxConfigEntry>[] = [
        update<TrackedTxConfigEntry>('a', 100, null, true, parameters),
        update<TrackedTxConfigEntry>('c', 100, null, true, parameters),
      ]

      const safeHeight = await indexer.multiUpdate(
        from,
        to,
        configurations,
        mockDbMiddleware,
      )

      expect(safeHeight).toEqual(to)
    })
  })

  describe(TrackedTxsIndexer.prototype.removeData.name, () => {
    it('removes data for configurations', async () => {
      const l2CostsRepository = mockObject<L2CostsRepository>({
        deleteByConfigInTimeRange: async () => 1,
      })
      const livenessRepository = mockObject<LivenessRepository>({
        deleteByConfigInTimeRange: async () => 1,
      })

      const indexer = getMockTrackedTxsIndexer({
        l2CostsRepository,
        livenessRepository,
      })

      const configurations: RemovalConfiguration[] = [
        removal('a', 100, 200),
        removal('b', 200, 300),
      ]

      await indexer.removeData(configurations)

      expect(
        l2CostsRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(1, 'a', new UnixTime(100), new UnixTime(200))
      expect(
        livenessRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(1, 'a', new UnixTime(100), new UnixTime(200))

      expect(
        l2CostsRepository.deleteByConfigInTimeRange,
      ).toHaveBeenLastCalledWith('b', new UnixTime(200), new UnixTime(300))
      expect(
        livenessRepository.deleteByConfigInTimeRange,
      ).toHaveBeenLastCalledWith('b', new UnixTime(200), new UnixTime(300))
    })
  })
})

function getMockTrackedTxsIndexer(params: {
  indexerService?: IndexerService
  configurations?: UpdateConfiguration<TrackedTxConfigEntry>[]
  trackedTxsClient?: TrackedTxsClient
  updaters?: Record<TrackedTxsConfigType, TxUpdaterInterface>
  createDatabaseMiddleware?: () => Promise<DatabaseMiddleware>
  livenessRepository?: LivenessRepository
  l2CostsRepository?: L2CostsRepository
}) {
  const {
    indexerService,
    configurations,
    trackedTxsClient,
    updaters,
    createDatabaseMiddleware,
    l2CostsRepository,
    livenessRepository,
  } = params

  return new TrackedTxsIndexer({
    configurations: configurations ?? [],
    createDatabaseMiddleware:
      createDatabaseMiddleware ??
      (async () => mockObject<DatabaseMiddleware>({})),
    indexerService: indexerService ?? mockObject<IndexerService>({}),
    trackedTxsClient: trackedTxsClient ?? mockObject<TrackedTxsClient>({}),
    updaters: updaters ?? {
      liveness: mockObject<TxUpdaterInterface>({}),
      l2costs: mockObject<TxUpdaterInterface>({}),
    },
    l2CostsRepository: l2CostsRepository ?? mockObject<L2CostsRepository>({}),
    livenessRepository:
      livenessRepository ?? mockObject<LivenessRepository>({}),
    logger: Logger.SILENT,
    parents: [],
    serializeConfiguration: () => '',
  })
}

function getMockTrackedTxResults(): TrackedTxResult[] {
  return [
    {
      formula: 'functionCall',
      projectId: ProjectId('test'),
      blockNumber: 1,
      blockTimestamp: UnixTime.now(),
      toAddress: EthereumAddress.random(),
      input: '',
      hash: '',
      id: '1',
      type: 'liveness',
      subtype: 'batchSubmissions',
      gasPrice: 10n,
      receiptGasUsed: 100,
      calldataGasUsed: 10,
      dataLength: 5,
      receiptBlobGasPrice: null,
      receiptBlobGasUsed: null,
    },
    {
      formula: 'transfer',
      id: '2',
      type: 'liveness',
      subtype: 'stateUpdates',
      blockNumber: 1,
      blockTimestamp: UnixTime.now(),
      hash: '',
      fromAddress: EthereumAddress.random(),
      toAddress: EthereumAddress.random(),
      projectId: ProjectId('test2'),
      gasPrice: 20n,
      receiptGasUsed: 200,
      calldataGasUsed: 0,
      dataLength: 0,
      receiptBlobGasPrice: null,
      receiptBlobGasUsed: null,
    },
    {
      formula: 'transfer',
      id: '3',
      type: 'l2costs',
      subtype: 'stateUpdates',
      blockNumber: 1,
      blockTimestamp: UnixTime.now(),
      hash: '',
      fromAddress: EthereumAddress.random(),
      toAddress: EthereumAddress.random(),
      projectId: ProjectId('test2'),
      gasPrice: 20n,
      receiptGasUsed: 200,
      calldataGasUsed: 0,
      dataLength: 0,
      receiptBlobGasPrice: null,
      receiptBlobGasUsed: null,
    },
  ]
}
