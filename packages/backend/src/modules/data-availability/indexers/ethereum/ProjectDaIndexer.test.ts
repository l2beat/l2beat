import { Logger } from '@l2beat/backend-tools'
import type { DataAvailabilityRecord, Database } from '@l2beat/database'
import type { BlockProvider, DaProvider } from '@l2beat/shared'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../../test/database'
import type { IndexerService } from '../../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../../tools/uif/ids'
import { ProjectDaIndexer, type ProjectDaIndexerDeps } from './ProjectDaIndexer'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(ProjectDaIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(ProjectDaIndexer.prototype.update.name, () => {
    it('processes each project separately', async () => {
      const arbitrumConfig = {
        id: ProjectId('arbitrum'),
        config: {
          type: 'ethereum' as const,
          inbox: EthereumAddress.random(),
          sequencers: [EthereumAddress.random()],
        },
      }

      const optimismConfig = {
        id: ProjectId('optimism'),
        config: {
          type: 'ethereum' as const,
          inbox: EthereumAddress.random(),
          sequencers: [EthereumAddress.random()],
        },
      }

      const configs = [arbitrumConfig, optimismConfig]

      const daProvider = mockObject<DaProvider>({
        getBlobs: mockFn().resolvesTo([
          {
            size: 100n,
            transaction: {
              blockTimestamp: START,
              to: arbitrumConfig.config.inbox,
              from: arbitrumConfig.config.sequencers[0],
            },
          },
          {
            size: 200n,
            transaction: {
              blockTimestamp: START,
              to: optimismConfig.config.inbox,
              from: optimismConfig.config.sequencers[0],
            },
          },
          // Next day
          {
            size: 10000n,
            transaction: {
              blockTimestamp: START.add(1, 'days'),
              to: arbitrumConfig.config.inbox,
              from: arbitrumConfig.config.sequencers[0],
            },
          },
          {
            size: 20000n,
            transaction: {
              blockTimestamp: START.add(1, 'days'),
              to: optimismConfig.config.inbox,
              from: optimismConfig.config.sequencers[0],
            },
          },
        ]),
      })

      // aggregated data from previous bucket
      const arbitrumPastBuckets: DataAvailabilityRecord[] = [
        {
          projectId: arbitrumConfig.id,
          timestamp: START.toStartOf('day'),
          totalSize: 1000n,
        },
      ]

      const optimismPastBuckets: DataAvailabilityRecord[] = [
        {
          projectId: optimismConfig.id,
          timestamp: START.toStartOf('day'),
          totalSize: 1000n,
        },
      ]

      const repository = mockObject<Database['dataAvailability']>({
        getByProjectIdAndFrom: mockFn()
          .resolvesToOnce(arbitrumPastBuckets)
          .resolvesToOnce(optimismPastBuckets),
        upsertMany: mockFn().resolvesTo(undefined),
      })

      const db = mockObject<Database>({
        dataAvailability: repository,
      })

      const indexer = createIndexer({
        batchSize: 50,
        daProvider,
        projectConfigs: configs,
        db,
      })

      const newSafeHeight = await indexer.update(0, 100)

      expect(newSafeHeight).toEqual(50)
      expect(daProvider.getBlobs).toHaveBeenCalledWith(0, 50)
      expect(daProvider.getBlobs).toHaveBeenCalledTimes(1)
      expect(repository.upsertMany).toHaveBeenCalledWith([
        {
          projectId: arbitrumConfig.id,
          timestamp: START.toStartOf('day'),
          totalSize: 1100n, // 100 + past bucket (1000)
        },
        {
          projectId: arbitrumConfig.id,
          timestamp: START.add(1, 'days').toStartOf('day'),
          totalSize: 10000n, // next day - 10000
        },
      ])
      expect(repository.upsertMany).toHaveBeenCalledWith([
        {
          projectId: optimismConfig.id,
          timestamp: START.toStartOf('day'),
          totalSize: 1200n, // 200 + past bucket (1000)
        },
        {
          projectId: optimismConfig.id,
          timestamp: START.add(1, 'days').toStartOf('day'),
          totalSize: 20000n, // next day - 20000
        },
      ])
    })
  })
})

function createIndexer(deps?: Partial<ProjectDaIndexerDeps>): ProjectDaIndexer {
  return new ProjectDaIndexer({
    name: 'test-project-da-indexer',
    logger: Logger.SILENT,
    parents: [],
    daProvider:
      deps?.daProvider ??
      mockObject<DaProvider>({
        getBlobs: mockFn().resolvesTo([]),
      }),
    blockProvider:
      deps?.blockProvider ??
      mockObject<BlockProvider>({
        getBlockWithTransactions: mockFn().resolvesTo({
          timestamp: START.toNumber(),
        }),
      }),
    db: mockDatabase({
      dataAvailability: mockObject<Database['dataAvailability']>({
        getByProjectIdAndFrom: mockFn().resolvesTo([]),
        upsertMany: mockFn().resolvesTo(undefined),
      }),
    }),
    projectConfigs: deps?.projectConfigs ?? [],
    indexerService: mockObject<IndexerService>({}),
    minHeight: 0,
    batchSize: 1,
    ...deps,
  })
}
