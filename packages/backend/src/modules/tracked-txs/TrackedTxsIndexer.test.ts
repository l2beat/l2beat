import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { TrackedTxConfigEntry } from '@l2beat/shared'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { TrackedTxProject } from '../../config/Config'
import { mockDatabase } from '../../test/database'
import type { IndexerService } from '../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../tools/uif/ids'
import {
  actual,
  trimRemoval,
} from '../../tools/uif/multi/test/mockConfigurations'
import type {
  Configuration,
  TrimRemovalConfiguration,
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
    it('fetches txs, calls updaters and syncs metadata', async () => {
      const from = 100
      const to = 300

      const trackedTxResults = getMockTrackedTxResults()
      const trackedTxsClient = {
        getData: vi.fn(async () => trackedTxResults),
      } as unknown as TrackedTxsClient
      const l2costsUpdater = {
        type: 'l2costs',
        update: vi.fn(async () => {}),
      } as unknown as L2CostsUpdater
      const livenessUpdater = {
        type: 'liveness',
        update: vi.fn(async () => {}),
      } as unknown as LivenessUpdater

      const syncMetadataRepository = {
        updateSyncedUntil: vi.fn(async () => {}),
      } as unknown as Database['syncMetadata']

      const indexer = getMockTrackedTxsIndexer({
        updaters: [livenessUpdater, l2costsUpdater],
        syncMetadataRepository,
        trackedTxsClient,
        projects: [
          {
            id: ProjectId('test1'),
            isArchived: false,
          } as unknown as TrackedTxProject,
          {
            id: ProjectId('test2'),
            isArchived: false,
          } as unknown as TrackedTxProject,
          {
            id: ProjectId('test3'),
            isArchived: false,
          } as unknown as TrackedTxProject,
        ],
      })

      const configurations: Configuration<TrackedTxConfigEntry>[] = [
        actual<TrackedTxConfigEntry>('a', 100, null, {
          projectId: ProjectId('test1'),
          type: 'liveness',
        }),
        actual<TrackedTxConfigEntry>('b', 100, null, {
          projectId: ProjectId('test2'),
          type: 'l2costs',
        }),
        actual<TrackedTxConfigEntry>('c', 100, null, {
          projectId: ProjectId('test3'),
          type: 'liveness',
        }),
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
      expect(syncMetadataRepository.updateSyncedUntil).toHaveBeenNthCalledWith(
        1,
        'liveness',
        ['test1', 'test3'],
        UnixTime(to),
      )
      expect(syncMetadataRepository.updateSyncedUntil).toHaveBeenNthCalledWith(
        2,
        'l2costs',
        ['test2'],
        UnixTime(to),
      )
      expect(safeHeight).toEqual(to)
    })

    it('deduplicates l2costs per transaction but passes all liveness results', async () => {
      const [liveness, , l2costs] = getMockTrackedTxResults()
      const trackedTxsClient = {
        getData: vi.fn(async () => [
          liveness,
          { ...liveness, gasUsed: 111 },
          l2costs,
          { ...l2costs, gasUsed: 999 },
        ]),
      } as unknown as TrackedTxsClient
      const l2costsUpdater = {
        type: 'l2costs',
        update: vi.fn(async () => {}),
      } as unknown as L2CostsUpdater
      const livenessUpdater = {
        type: 'liveness',
        update: vi.fn(async () => {}),
      } as unknown as LivenessUpdater

      const indexer = getMockTrackedTxsIndexer({
        updaters: [livenessUpdater, l2costsUpdater],
        trackedTxsClient,
        projects: [
          {
            id: ProjectId('test'),
            isArchived: false,
          } as unknown as TrackedTxProject,
        ],
      })

      const configurations: Configuration<TrackedTxConfigEntry>[] = [
        actual<TrackedTxConfigEntry>('a', 100, null, {
          projectId: ProjectId('test'),
          type: 'liveness',
        }),
      ]

      const saveData = await indexer.multiUpdate(100, 300, configurations)
      await saveData()

      expect(livenessUpdater.update).toHaveBeenNthCalledWith(1, [
        liveness,
        { ...liveness, gasUsed: 111 },
      ])
      expect(l2costsUpdater.update).toHaveBeenNthCalledWith(1, [l2costs])
    })

    it('correctly clamps FROM and TO to day', async () => {
      const from = UnixTime.fromDate(new Date('2024-01-01T12:00:00Z'))
      const to = UnixTime.fromDate(new Date('2024-01-02T12:00:00Z'))
      const expected = UnixTime.fromDate(new Date('2024-01-02T00:00:00Z'))

      const trackedTxsClient = {
        getData: vi.fn(async () => []),
      } as unknown as TrackedTxsClient

      const indexer = getMockTrackedTxsIndexer({
        trackedTxsClient,
        projects: [
          {
            id: ProjectId('test'),
            isArchived: false,
          } as unknown as TrackedTxProject,
        ],
      })

      const parameters: Partial<TrackedTxConfigEntry> = {
        projectId: ProjectId('test'),
        type: 'liveness',
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

    it('filters out archived projects', async () => {
      const from = 100
      const to = 300

      const trackedTxResults = getMockTrackedTxResults()
      const trackedTxsClient = {
        getData: vi.fn(async () => trackedTxResults),
      } as unknown as TrackedTxsClient
      const l2costsUpdater = {
        type: 'l2costs',
        update: vi.fn(async () => {}),
      } as unknown as L2CostsUpdater
      const livenessUpdater = {
        type: 'liveness',
        update: vi.fn(async () => {}),
      } as unknown as LivenessUpdater

      const indexer = getMockTrackedTxsIndexer({
        updaters: [livenessUpdater, l2costsUpdater],
        trackedTxsClient,
        projects: [
          {
            id: ProjectId('test'),
            isArchived: false,
          } as unknown as TrackedTxProject,
          {
            id: ProjectId('archived'),
            isArchived: true,
          } as unknown as TrackedTxProject,
        ],
      })

      const parameters: Partial<TrackedTxConfigEntry> = {
        projectId: ProjectId('test'),
      }

      const configurations: Configuration<TrackedTxConfigEntry>[] = [
        actual<TrackedTxConfigEntry>('a', 100, null, parameters),
        actual<TrackedTxConfigEntry>('b', 100, null, parameters),
        actual<TrackedTxConfigEntry>('c', 100, null, parameters),
        actual<TrackedTxConfigEntry>('d', 100, null, {
          projectId: ProjectId('archived'),
        }),
      ]

      await indexer.multiUpdate(from, to, configurations)

      expect(trackedTxsClient.getData).toHaveBeenNthCalledWith(
        1,
        [configurations[0], configurations[1], configurations[2]],
        UnixTime(from),
        UnixTime(to),
      )
    })
  })

  describe(TrackedTxsIndexer.prototype.trimData.name, () => {
    it('removes data for configurations', async () => {
      const l2CostRepository = {
        deleteByConfigIds: vi.fn(async () => 0),
        deleteByConfigInTimeRange: vi.fn(async () => 1),
      } as unknown as Database['l2Cost']
      const livenessRepository = {
        deleteByConfigIds: vi.fn(async () => 0),
        deleteByConfigInTimeRange: vi.fn(async () => 1),
      } as unknown as Database['liveness']

      const indexer = getMockTrackedTxsIndexer({
        l2CostRepository,
        livenessRepository,
        projects: [
          {
            id: ProjectId('test'),
            isArchived: false,
          } as unknown as TrackedTxProject,
        ],
      })

      const configurations: TrimRemovalConfiguration[] = [
        trimRemoval('a', 100, 200),
        trimRemoval('b', 200, 300),
      ]

      await indexer.trimData(configurations)

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
  updaters?: TxUpdaterInterface<'liveness' | 'l2costs'>[]
  livenessRepository?: Database['liveness']
  l2CostRepository?: Database['l2Cost']
  syncMetadataRepository?: Database['syncMetadata']
  projects: TrackedTxProject[]
}) {
  const {
    indexerService,
    configurations,
    trackedTxsClient,
    updaters,
    l2CostRepository,
    livenessRepository,
    syncMetadataRepository,
    projects,
  } = params

  return new TrackedTxsIndexer(
    {
      configurations: configurations ?? [
        { id: 'a' } as unknown as Configuration<TrackedTxConfigEntry>,
      ],
      db: mockDatabase({
        l2Cost: l2CostRepository ?? ({} as unknown as Database['l2Cost']),
        liveness: livenessRepository ?? ({} as unknown as Database['liveness']),
        syncMetadata:
          syncMetadataRepository ??
          ({
            updateSyncedUntil: vi.fn(async () => {}),
          } as unknown as Database['syncMetadata']),
      }),
      indexerService: indexerService ?? ({} as unknown as IndexerService),
      trackedTxsClient: trackedTxsClient ?? ({} as unknown as TrackedTxsClient),
      updaters: updaters ?? [
        {
          type: 'liveness',
          update: vi.fn(async () => {}),
        } as unknown as TxUpdaterInterface<'liveness'>,
        {
          type: 'l2costs',
          update: vi.fn(async () => {}),
        } as unknown as TxUpdaterInterface<'l2costs'>,
      ],
      parents: [],
      serializeConfiguration: () => '',
      projects,
    },
    Logger.SILENT,
  )
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
      gasUsed: 100,
      calldataGasUsed: 10,
      dataLength: 5,
      blobVersionedHashes: null,
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
      gasUsed: 200,
      calldataGasUsed: 0,
      dataLength: 0,
      blobVersionedHashes: null,
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
      gasUsed: 200,
      calldataGasUsed: 0,
      dataLength: 0,
      blobVersionedHashes: null,
    },
  ]
}
