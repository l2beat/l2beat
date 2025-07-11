import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { TrackedTxConfigEntry } from '@l2beat/shared'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../test/database'
import type { IndexerService } from '../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../tools/uif/ids'
import { actual, removal } from '../../tools/uif/multi/test/mockConfigurations'
import type {
  Configuration,
  RemovalConfiguration,
} from '../../tools/uif/multi/types'
import type { L2CostsUpdater } from './modules/l2-costs/L2CostsUpdater'
import type { LivenessUpdater } from './modules/liveness/LivenessUpdater'
import type { TrackedTxsClient } from './TrackedTxsClient'
import { TrackedTxsIndexer } from './TrackedTxsIndexer'
import type { TrackedTxResult } from './types/model'
import type { TxUpdaterInterface } from './types/TxUpdaterInterface'

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
        type: 'l2costs',
        update: mockFn(async () => {}),
      })
      const livenessUpdater = mockObject<LivenessUpdater>({
        type: 'liveness',
        update: mockFn(async () => {}),
      })

      const indexer = getMockTrackedTxsIndexer({
        updaters: [livenessUpdater, l2costsUpdater],
        trackedTxsClient,
      })

      const parameters: Partial<TrackedTxConfigEntry> = {
        projectId: ProjectId('test'),
      }

      const configurations: Configuration<TrackedTxConfigEntry>[] = [
        actual<TrackedTxConfigEntry>('a', 100, null, parameters),
        actual<TrackedTxConfigEntry>('b', 100, null, parameters),
        actual<TrackedTxConfigEntry>('c', 100, null, parameters),
      ]

      const saveData = await indexer.multiUpdate(from, to, configurations)
      const safeHeight = await saveData()

      expect(trackedTxsClient.getData).toHaveBeenNthCalledWith(
        1,
        configurations,
        UnixTime(from),
        UnixTime(to),
      )
      expect(livenessUpdater.update).toHaveBeenNthCalledWith(
        1,
        trackedTxResults.filter((tx) => tx.type === 'liveness'),
      )
      expect(l2costsUpdater.update).toHaveBeenNthCalledWith(
        1,
        trackedTxResults.filter((tx) => tx.type === 'l2costs'),
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

      const configurations: Configuration<TrackedTxConfigEntry>[] = [
        actual<TrackedTxConfigEntry>('a', 100, null, parameters),
      ]

      const saveData = await indexer.multiUpdate(from, to, configurations)
      const safeHeight = await saveData()

      expect(trackedTxsClient.getData).toHaveBeenNthCalledWith(
        1,
        [configurations[0]],
        from,
        expected,
      )
      expect(safeHeight).toEqual(expected)
    })
  })

  describe(TrackedTxsIndexer.prototype.removeData.name, () => {
    it('removes data for configurations', async () => {
      const l2CostRepository = mockObject<Database['l2Cost']>({
        deleteByConfigInTimeRange: async () => 1,
      })
      const livenessRepository = mockObject<Database['liveness']>({
        deleteByConfigInTimeRange: async () => 1,
      })

      const indexer = getMockTrackedTxsIndexer({
        l2CostRepository,
        livenessRepository,
      })

      const configurations: RemovalConfiguration[] = [
        removal('a', 100, 200),
        removal('b', 200, 300),
      ]

      await indexer.removeData(configurations)

      expect(
        l2CostRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(1, 'a', UnixTime(100), UnixTime(200))
      expect(
        livenessRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(1, 'a', UnixTime(100), UnixTime(200))

      expect(
        l2CostRepository.deleteByConfigInTimeRange,
      ).toHaveBeenLastCalledWith('b', UnixTime(200), UnixTime(300))
      expect(
        livenessRepository.deleteByConfigInTimeRange,
      ).toHaveBeenLastCalledWith('b', UnixTime(200), UnixTime(300))
    })
  })
})

function getMockTrackedTxsIndexer(params: {
  indexerService?: IndexerService
  configurations?: Configuration<TrackedTxConfigEntry>[]
  trackedTxsClient?: TrackedTxsClient
  updaters?: TxUpdaterInterface[]
  livenessRepository?: Database['liveness']
  l2CostRepository?: Database['l2Cost']
}) {
  const {
    indexerService,
    configurations,
    trackedTxsClient,
    updaters,
    l2CostRepository,
    livenessRepository,
  } = params

  return new TrackedTxsIndexer({
    configurations: configurations ?? [
      mockObject<Configuration<TrackedTxConfigEntry>>({ id: 'a' }),
    ],
    db: mockDatabase({
      l2Cost: l2CostRepository ?? mockObject<Database['l2Cost']>(),
      liveness: livenessRepository ?? mockObject<Database['liveness']>(),
    }),
    indexerService: indexerService ?? mockObject<IndexerService>({}),
    trackedTxsClient: trackedTxsClient ?? mockObject<TrackedTxsClient>({}),
    updaters: updaters ?? [
      mockObject<TxUpdaterInterface>({
        type: 'liveness',
        update: async () => {},
      }),
      mockObject<TxUpdaterInterface>({
        type: 'l2costs',
        update: async () => {},
      }),
    ],
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
