import { Logger } from '@l2beat/backend-tools'
import type { Database, UpdateMonitorRecord } from '@l2beat/database'
import {
  type ConfigReader,
  ConfigRegistry,
  type DiscoveryOutput,
  type EntryParameters,
  hashJsonStable,
} from '@l2beat/discovery'
import {
  ChainSpecificAddress,
  EthereumAddress,
  Hash256,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { Clock } from '../../tools/Clock'
import type { WorkerPool } from './createWorkers'
import { DiscoveryOutputCache } from './DiscoveryOutputCache'
import type { DiscoveryRunner } from './DiscoveryRunner'
import type { UpdateDiffer } from './UpdateDiffer'
import { UpdateMonitor } from './UpdateMonitor'
import type { UpdateNotifier } from './UpdateNotifier'

const instantWorkerPool = mockObject<WorkerPool>({
  runInPool: mockFn(async (tasks) => {
    const results = []
    const errors = []

    for (const task of tasks) {
      try {
        const result = await task.job()
        results.push({
          identity: task.identity,
          result,
        })
      } catch (error) {
        errors.push({
          identity: task.identity,
          error: error instanceof Error ? error : new Error(String(error)),
        })
      }
    }

    return {
      results,
      errors,
      timedOut: false,
    }
  }),
})

const PROJECT_A = 'project-a'
const PROJECT_B = 'project-b'
const NAME_A = 'contract-a'
const ADDRESS_A = EthereumAddress.random()
const NAME_B = 'contract-b'
const ADDRESS_B = EthereumAddress.random()
const TIMESTAMP = 1

const COMMITTED: EntryParameters[] = [
  {
    ...mockContract(NAME_A, ADDRESS_A),
    values: { a: true },
  },
  {
    ...mockContract(NAME_B, ADDRESS_B),
    errors: {
      nonce: 'https://endpoint.com/potential-api-key',
      totalLiquidity: 'https://endpoint.com/potential-api-key2',
    },
  },
]

const DISCOVERY_RESULT: DiscoveryOutput = {
  name: PROJECT_A,
  timestamp: TIMESTAMP,
  configHash: Hash256.random(),
  entries: [
    {
      ...mockContract(NAME_A, ADDRESS_A),
      values: { a: false },
    },
    mockContract(NAME_B, ADDRESS_B),
  ],
  abis: {},
  usedTemplates: {},
  usedBlockNumbers: {},
}

const DISCOVERY_RESULT_ETH_2: DiscoveryOutput = {
  name: PROJECT_B,
  timestamp: TIMESTAMP,
  configHash: Hash256.random(),
  entries: [
    {
      ...mockContract(NAME_A, ADDRESS_A),
      values: { a: false },
      fieldMeta: { a: { severity: 'LOW' } },
    },
    mockContract(NAME_B, ADDRESS_B),
  ],
  abis: {},
  usedTemplates: {},
  usedBlockNumbers: {},
}

const DISCOVERY_RESULT_ARB_2: DiscoveryOutput = {
  name: PROJECT_B,
  timestamp: TIMESTAMP,
  configHash: Hash256.random(),
  entries: [
    {
      ...mockContract(NAME_A, ADDRESS_A),
      values: { c: true, a: false },
    },
    mockContract(NAME_B, ADDRESS_B),
  ],
  abis: {},
  usedTemplates: {},
  usedBlockNumbers: {},
}

const flatSourcesRepository = mockObject<Database['flatSources']>({
  upsert: async () => undefined,
  get: async () => undefined,
})

describe(UpdateMonitor.name, () => {
  let updateNotifier = mockObject<UpdateNotifier>({})
  let updateDiffer = mockObject<UpdateDiffer>({})
  const discoveryOutputCache = new DiscoveryOutputCache()

  beforeEach(() => {
    updateNotifier = mockObject<UpdateNotifier>({
      handleUpdate: mockFn().resolvesTo(undefined),
      sendDailyReminder: mockFn().resolvesTo(undefined),
    })
    updateDiffer = mockObject<UpdateDiffer>({
      runForProject: mockFn().resolvesTo(undefined),
    })
  })

  describe(UpdateMonitor.prototype.update.name, () => {
    it('iterates over runners and dispatches updates', async () => {
      const discoveryRunner = mockObject<DiscoveryRunner>({
        run: mockFn().resolvesTo({
          discovery: DISCOVERY_RESULT,
          flatSources: {},
        }),
      })
      const configReader = mockObject<ConfigReader>({
        readDiscovery: () => ({
          ...mockProject,
          entries: COMMITTED,
        }),

        readAllDiscoveredProjects: () => [PROJECT_A],
        readConfig: mockFn().returns(mockConfig(PROJECT_A)),
      })

      const updateMonitorRepository = mockObject<Database['updateMonitor']>({
        findLatest: async () => undefined,
        upsert: async () => undefined,
      })
      const updateDiffRepository = mockObject<Database['updateDiff']>({
        deleteAll: async () => 0,
      })
      const timestamp = 0

      const updateMonitor = new UpdateMonitor(
        discoveryRunner,
        updateNotifier,
        updateDiffer,
        configReader,
        mockObject<Database>({
          updateMonitor: updateMonitorRepository,
          flatSources: flatSourcesRepository,
          updateDiff: updateDiffRepository,
        }),
        mockObject<Clock>(),
        discoveryOutputCache,
        Logger.SILENT,
        false,
        instantWorkerPool,
      )

      await updateMonitor.update(timestamp)

      // runs discovery for every project
      expect(discoveryRunner.run).toHaveBeenCalledTimes(2)

      expect(updateDiffer.runForProject).toHaveBeenCalledTimes(1)

      expect(updateNotifier.sendDailyReminder).toHaveBeenCalledTimes(1)
      expect(updateNotifier.sendDailyReminder).toHaveBeenCalledWith(
        {
          ['project-a']: { severityCounts: { low: 0, high: 0, unknown: 2 } },
        },
        timestamp,
      )
    })
  })

  describe(UpdateMonitor.prototype.getPreviousDiscovery.name, () => {
    it('gets committed file', async () => {
      const discoveryA = { ...mockProject, entries: COMMITTED }
      const discoveryB: DiscoveryOutput = {
        ...mockProject,
        entries: COMMITTED,
      }
      const configReader = mockObject<ConfigReader>({
        readDiscovery: () => discoveryB,
      })

      const discoveryRunner = mockObject<DiscoveryRunner>({
        run: mockFn()
          .resolvesToOnce({ discovery: discoveryA, flatSources: {} })
          .resolvesToOnce({ discovery: discoveryB, flatSources: {} }),
      })

      const updateMonitorRepository = mockObject<Database['updateMonitor']>({
        findLatest: async () => undefined,
      })

      const updateMonitor = new UpdateMonitor(
        discoveryRunner,
        mockObject<UpdateNotifier>(),
        mockObject<UpdateDiffer>(),
        configReader,
        mockObject<Database>({
          updateMonitor: updateMonitorRepository,
          flatSources: flatSourcesRepository,
        }),
        mockObject<Clock>(),
        discoveryOutputCache,
        Logger.SILENT,
        false,
        instantWorkerPool,
      )

      const result = await updateMonitor.getPreviousDiscovery(
        discoveryRunner,
        mockConfig(PROJECT_A),
      )

      // calls repository (and gets undefined)
      expect(updateMonitorRepository.findLatest).toHaveBeenCalledTimes(1)
      // reads committed file
      expect(configReader.readDiscovery).toHaveBeenOnlyCalledWith(PROJECT_A)
      expect(result).toEqual(discoveryB)
    })

    it('gets repository entry', async () => {
      const committed = {
        ...mockProject,
        entries: DISCOVERY_RESULT.entries,
      }
      const dbEntry = {
        ...mockRecord,
        discovery: { ...mockProject, entries: COMMITTED },
        configHash: hashJsonStable(mockConfig(PROJECT_A).structure),
      }

      const discoveryRunner = mockObject<DiscoveryRunner>({
        run: mockFn().resolvesToOnce({
          discovery: dbEntry.discovery,
          flatSources: {},
        }),
      })

      const updateMonitorRepository = mockObject<Database['updateMonitor']>({
        findLatest: async () => dbEntry,
      })

      const updateMonitor = new UpdateMonitor(
        discoveryRunner,
        mockObject<UpdateNotifier>(),
        mockObject<UpdateDiffer>(),
        mockObject<ConfigReader>({ readDiscovery: () => committed }),
        mockObject<Database>({
          updateMonitor: updateMonitorRepository,
          flatSources: flatSourcesRepository,
        }),
        mockObject<Clock>(),
        discoveryOutputCache,
        Logger.SILENT,
        false,
        instantWorkerPool,
      )

      const result = await updateMonitor.getPreviousDiscovery(
        discoveryRunner,
        mockConfig(PROJECT_A),
      )

      // calls repository
      expect(updateMonitorRepository.findLatest).toHaveBeenCalledTimes(1)
      expect(result).toEqual(dbEntry.discovery)
    })

    it('takes config hash into consideration', async () => {
      const dbEntry = COMMITTED
      const committed = {
        ...mockProject,
        entries: DISCOVERY_RESULT.entries,
      }

      const discoveryRunner = mockObject<DiscoveryRunner>({
        run: mockFn().resolvesToOnce({
          discovery: committed,
          flatSources: {},
        }),
      })

      const configReader = mockObject<ConfigReader>({
        readDiscovery: () => committed,
      })

      const updateMonitorRepository = mockObject<Database['updateMonitor']>({
        findLatest: async () => ({
          ...mockRecord,
          discovery: {
            ...mockProject,
            entries: dbEntry,
          },
          configHash: hashJsonStable(mockConfig(PROJECT_A).structure),
        }),
      })

      const updateMonitor = new UpdateMonitor(
        discoveryRunner,
        mockObject<UpdateNotifier>(),
        mockObject<UpdateDiffer>(),
        configReader,
        mockObject<Database>({
          updateMonitor: updateMonitorRepository,
          flatSources: flatSourcesRepository,
        }),
        mockObject<Clock>(),
        discoveryOutputCache,
        Logger.SILENT,
        false,
        instantWorkerPool,
      )

      const chain = 'ethereum'
      const result = await updateMonitor.getPreviousDiscovery(
        discoveryRunner,
        // different config hash
        new ConfigRegistry({
          name: PROJECT_A,
          initialAddresses: [ChainSpecificAddress.ZERO(chain)],
        }),
      )

      expect(result).toEqual(committed)
    })

    it('with version mismatch runs discovery with previous block number', async () => {
      const committed = {
        ...mockProject,
        entries: DISCOVERY_RESULT.entries,
      }
      const dbEntry = COMMITTED

      const updateMonitorRepository = mockObject<Database['updateMonitor']>({
        findLatest: async () => ({
          ...mockRecord,
          discovery: {
            ...mockProject,
            entries: dbEntry,
            timestamp: TIMESTAMP - 1,
          },
          configHash: hashJsonStable(mockConfig(PROJECT_A).structure),
        }),
      })

      const discoveryRunner = mockObject<DiscoveryRunner>({
        run: async () => ({
          discovery: mockProject,
          flatSources: {},
        }),
      })

      const updateMonitor = new UpdateMonitor(
        discoveryRunner,
        mockObject<UpdateNotifier>(),
        mockObject<UpdateDiffer>(),
        mockObject<ConfigReader>({ readDiscovery: () => committed }),
        mockObject<Database>({
          updateMonitor: updateMonitorRepository,
          flatSources: flatSourcesRepository,
        }),
        mockObject<Clock>(),
        discoveryOutputCache,
        Logger.INFO,
        false,
        instantWorkerPool,
      )

      await updateMonitor.getPreviousDiscovery(
        discoveryRunner,
        mockConfig(PROJECT_A),
      )

      expect(discoveryRunner.run).toHaveBeenCalledTimes(1)
      expect(discoveryRunner.run).toHaveBeenNthCalledWith(
        1,
        mockConfig(PROJECT_A),
        committed.timestamp,
        expect.anything(),
        undefined,
      )
    })
  })

  describe(UpdateMonitor.prototype.generateDailyReminder.name, () => {
    it('does not cross-contaminate between chains', async () => {
      const runner = mockObject<DiscoveryRunner>({
        run: async () => {
          return { discovery: DISCOVERY_RESULT_ARB_2, flatSources: {} }
        },
      })

      const timestamp = 0
      const updateMonitorRepository = mockObject<Database['updateMonitor']>({
        findLatest: async () => undefined,
        upsert: async () => undefined,
      })
      const configReader = mockObject<ConfigReader>({
        readDiscovery: (name: string) => {
          if (name === PROJECT_B) {
            return DISCOVERY_RESULT_ETH_2
          }
          return DISCOVERY_RESULT
        },

        readConfig: (name: string) => mockConfig(name),
        readAllDiscoveredProjects: () => [PROJECT_A, PROJECT_B],
      })
      const updateDiffRepository = mockObject<Database['updateDiff']>({
        deleteAll: async () => 0,
      })

      const updateMonitor = new UpdateMonitor(
        runner,
        updateNotifier,
        updateDiffer,
        configReader,
        mockObject<Database>({
          updateMonitor: updateMonitorRepository,
          flatSources: flatSourcesRepository,
          updateDiff: updateDiffRepository,
        }),
        mockObject<Clock>(),
        discoveryOutputCache,
        Logger.SILENT,
        false,
        instantWorkerPool,
      )

      await updateMonitor.update(timestamp)
      const result = updateMonitor.generateDailyReminder()

      expect(result).toEqual({
        [PROJECT_A]: { severityCounts: { low: 0, high: 0, unknown: 1 } },
        [PROJECT_B]: { severityCounts: { low: 0, high: 0, unknown: 2 } },
      })
    })

    it('generates the daily reminder for two different chains', async () => {
      const discoveryRunner = mockObject<DiscoveryRunner>({
        run: mockFn().resolvesTo({
          ethereum: {
            discovery: DISCOVERY_RESULT,
            flatSources: {},
          },
        }),
      })

      const timestamp = 0
      const updateMonitorRepository = mockObject<Database['updateMonitor']>({
        findLatest: async () => undefined,
        upsert: async () => undefined,
      })
      const configReader = mockObject<ConfigReader>({
        readDiscovery: () => ({
          ...mockProject,
          entries: COMMITTED,
        }),

        readConfig: (name: string) => mockConfig(name),
        readAllDiscoveredProjects: () => [PROJECT_A],
      })
      const updateDiffRepository = mockObject<Database['updateDiff']>({
        deleteAll: async () => 0,
      })

      const updateMonitor = new UpdateMonitor(
        discoveryRunner,
        updateNotifier,
        updateDiffer,
        configReader,
        mockObject<Database>({
          updateMonitor: updateMonitorRepository,
          flatSources: flatSourcesRepository,
          updateDiff: updateDiffRepository,
        }),
        mockObject<Clock>(),
        discoveryOutputCache,
        Logger.SILENT,
        false,
        instantWorkerPool,
      )

      await updateMonitor.update(timestamp)
      const result = updateMonitor.generateDailyReminder()

      expect(Object.entries(result).length).toEqual(1)
      expect(result).toEqual({
        [PROJECT_A]: { severityCounts: { low: 0, high: 0, unknown: 3 } },
      })
    })

    it('does nothing for an empty cache', async () => {
      const discoveryRunner = mockObject<DiscoveryRunner>({
        run: mockFn().resolvesTo({
          ethereum: {
            discovery: DISCOVERY_RESULT,
            flatSources: {},
          },
        }),
      })

      const timestamp = 0
      const updateMonitorRepository = mockObject<Database['updateMonitor']>({
        findLatest: async () => undefined,
        upsert: async () => undefined,
      })
      const configReader = mockObject<ConfigReader>({
        readDiscovery: () => ({
          ...mockProject,
          entries: COMMITTED,
        }),

        readConfig: (name: string) => mockConfig(name),
        readAllDiscoveredProjects: () => [PROJECT_A],
      })
      const updateDiffRepository = mockObject<Database['updateDiff']>({
        deleteAll: async () => 0,
      })

      const updateMonitor = new UpdateMonitor(
        discoveryRunner,
        updateNotifier,
        updateDiffer,
        configReader,
        mockObject<Database>({
          updateMonitor: updateMonitorRepository,
          flatSources: flatSourcesRepository,
          updateDiff: updateDiffRepository,
        }),
        mockObject<Clock>(),
        discoveryOutputCache,
        Logger.SILENT,
        false,
        instantWorkerPool,
      )

      await updateMonitor.update(timestamp)
      const result = updateMonitor.generateDailyReminder()

      expect(Object.entries(result).length).toEqual(1)
    })
  })
})

const mockRecord: UpdateMonitorRecord = {
  projectId: 'name',
  timestamp: 1,
  blockNumber: 0,
  configHash: Hash256.random(),
  discovery: DISCOVERY_RESULT,
}

const mockProject: DiscoveryOutput = {
  name: PROJECT_A,
  timestamp: 1,
  configHash: Hash256.random(),
  entries: COMMITTED,
  abis: {},
  usedTemplates: {},
  usedBlockNumbers: {},
}

function mockContract(name: string, address: EthereumAddress): EntryParameters {
  return {
    type: 'Contract',
    name,
    address: ChainSpecificAddress.from('eth', address),
    values: {
      $immutable: true,
    },
  }
}

function mockConfig(name: string): ConfigRegistry {
  return new ConfigRegistry({ name, initialAddresses: [] })
}
