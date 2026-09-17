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
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Clock } from '../../tools/Clock'
import type { WorkerPool } from './createWorkers'
import { DiscoveryOutputCache } from './DiscoveryOutputCache'
import type { DiscoveryRunner } from './DiscoveryRunner'
import type { UpdateDiffer } from './UpdateDiffer'
import { UpdateMonitor } from './UpdateMonitor'
import type { UpdateNotifier } from './UpdateNotifier'

const instantWorkerPool = {
  runInPool: vi.fn(async (tasks) => {
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
} as unknown as WorkerPool

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
  modelledAgainst: {},
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
  modelledAgainst: {},
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
  modelledAgainst: {},
  usedBlockNumbers: {},
}

const flatSourcesRepository = {
  upsert: vi.fn(async () => undefined),
  get: vi.fn(async () => undefined),
} as unknown as Database['flatSources']

describe(UpdateMonitor.name, () => {
  let updateNotifier = {} as unknown as UpdateNotifier
  let updateDiffer = {} as unknown as UpdateDiffer
  const discoveryOutputCache = new DiscoveryOutputCache()

  beforeEach(() => {
    updateNotifier = {
      handleUpdate: vi.fn().mockResolvedValue(undefined),
      sendDailyReminder: vi.fn().mockResolvedValue(undefined),
    } as unknown as UpdateNotifier
    updateDiffer = {
      run: vi.fn().mockResolvedValue(undefined),
    } as unknown as UpdateDiffer
  })

  describe(UpdateMonitor.prototype.update.name, () => {
    it('iterates over runners and dispatches updates', async () => {
      const discoveryRunner = {
        run: vi.fn().mockResolvedValue({
          discovery: DISCOVERY_RESULT,
          flatSources: {},
        }),
      } as unknown as DiscoveryRunner
      const configReader = {
        readDiscovery: vi.fn(() => ({
          ...mockProject,
          entries: COMMITTED,
        })),

        readAllDiscoveredProjects: vi.fn(() => [PROJECT_A]),
        readConfig: vi.fn().mockReturnValue(mockConfig(PROJECT_A)),
      } as unknown as ConfigReader

      const updateMonitorRepository = {
        findLatest: vi.fn(async () => undefined),
        upsert: vi.fn(async () => undefined),
      } as unknown as Database['updateMonitor']
      const updateDiffRepository = {
        deleteAll: vi.fn(async () => 0),
      } as unknown as Database['updateDiff']
      const timestamp = 0

      const updateMonitor = new UpdateMonitor(
        discoveryRunner,
        updateNotifier,
        updateDiffer,
        configReader,
        {
          updateMonitor: updateMonitorRepository,
          flatSources: flatSourcesRepository,
          updateDiff: updateDiffRepository,
        } as unknown as Database,
        {} as unknown as Clock,
        discoveryOutputCache,
        Logger.SILENT,
        false,
        instantWorkerPool,
      )

      await updateMonitor.update(timestamp)

      // runs discovery for every project
      expect(discoveryRunner.run).toHaveBeenCalledTimes(2)

      expect(updateDiffer.run).toHaveBeenCalledWith([PROJECT_A], timestamp)

      expect(updateNotifier.sendDailyReminder).toHaveBeenCalledTimes(1)
      expect(updateNotifier.sendDailyReminder).toHaveBeenCalledWith(
        {
          ['project-a']: {
            severityCounts: { low: 0, medium: 0, high: 0, unknown: 2 },
          },
        },
        timestamp,
        [],
        [],
      )
    })

    it('does not process archived projects', async () => {
      const processedProjects: string[] = []
      const discoveryRunner = {
        run: vi.fn(async (config: ConfigRegistry) => {
          processedProjects.push(config.name)
          return {
            discovery: DISCOVERY_RESULT,
            flatSources: {},
          }
        }),
      } as unknown as DiscoveryRunner
      const archivedConfig = new ConfigRegistry({
        name: PROJECT_B,
        initialAddresses: [],
        archived: true,
      })
      const configReader = {
        readDiscovery: vi.fn(() => ({
          ...mockProject,
          entries: COMMITTED,
        })),
        readAllDiscoveredProjects: vi.fn(() => [PROJECT_A, PROJECT_B]),
        readConfig: vi.fn((name: string) =>
          name === PROJECT_B ? archivedConfig : mockConfig(name),
        ),
      } as unknown as ConfigReader
      const timestamp = 0

      const updateMonitor = new UpdateMonitor(
        discoveryRunner,
        updateNotifier,
        updateDiffer,
        configReader,
        {
          updateMonitor: {
            findLatest: vi.fn(async () => undefined),
            upsert: vi.fn(async () => undefined),
          } as unknown as Database['updateMonitor'],
          flatSources: flatSourcesRepository,
          updateDiff: {
            deleteAll: vi.fn(async () => 0),
          } as unknown as Database['updateDiff'],
        } as unknown as Database,
        {} as unknown as Clock,
        discoveryOutputCache,
        Logger.SILENT,
        false,
        instantWorkerPool,
      )

      await updateMonitor.update(timestamp)

      expect(processedProjects).toStrictEqual([PROJECT_A, PROJECT_A])
      expect(updateDiffer.run).toHaveBeenCalledWith([PROJECT_A], timestamp)
    })

    // Diffs are written as one snapshot, so they run once every discovery lands.
    it('discovers every project before diffing any of them', async () => {
      const calls: string[] = []
      const discoveryRunner = {
        run: vi.fn(async () => {
          calls.push('discover')
          return { discovery: DISCOVERY_RESULT, flatSources: {} }
        }),
      } as unknown as DiscoveryRunner
      updateDiffer = {
        run: vi.fn(async () => {
          calls.push('diff')
        }),
      } as unknown as UpdateDiffer

      const updateMonitor = new UpdateMonitor(
        discoveryRunner,
        updateNotifier,
        updateDiffer,
        {
          readDiscovery: vi.fn(() => ({ ...mockProject, entries: COMMITTED })),
          readAllDiscoveredProjects: vi.fn(() => [PROJECT_A, PROJECT_B]),
          readConfig: vi.fn((name: string) => mockConfig(name)),
        } as unknown as ConfigReader,
        {
          updateMonitor: {
            findLatest: vi.fn(async () => undefined),
            upsert: vi.fn(async () => undefined),
          } as unknown as Database['updateMonitor'],
          flatSources: flatSourcesRepository,
          updateDiff: {
            deleteAll: vi.fn(async () => 0),
          } as unknown as Database['updateDiff'],
        } as unknown as Database,
        {} as unknown as Clock,
        discoveryOutputCache,
        Logger.SILENT,
        false,
        instantWorkerPool,
      )

      await updateMonitor.update(0)

      expect(calls.lastIndexOf('discover')).toBeLessThan(calls.indexOf('diff'))
      expect(calls.filter((c) => c === 'diff').length).toStrictEqual(1)
    })
  })

  describe(UpdateMonitor.prototype.getPreviousDiscovery.name, () => {
    it('gets committed file', async () => {
      const discoveryA = { ...mockProject, entries: COMMITTED }
      const discoveryB: DiscoveryOutput = {
        ...mockProject,
        entries: COMMITTED,
      }
      const configReader = {
        readDiscovery: vi.fn(() => discoveryB),
      } as unknown as ConfigReader

      const discoveryRunner = {
        run: vi
          .fn()
          .mockResolvedValueOnce({ discovery: discoveryA, flatSources: {} })
          .mockResolvedValueOnce({ discovery: discoveryB, flatSources: {} }),
      } as unknown as DiscoveryRunner

      const updateMonitorRepository = {
        findLatest: vi.fn(async () => undefined),
      } as unknown as Database['updateMonitor']

      const updateMonitor = new UpdateMonitor(
        discoveryRunner,
        {} as unknown as UpdateNotifier,
        {} as unknown as UpdateDiffer,
        configReader,
        {
          updateMonitor: updateMonitorRepository,
          flatSources: flatSourcesRepository,
        } as unknown as Database,
        {} as unknown as Clock,
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
      expect(configReader.readDiscovery).toHaveBeenCalledExactlyOnceWith(
        PROJECT_A,
      )
      expect(result).toStrictEqual(discoveryB)
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

      const discoveryRunner = {
        run: vi.fn().mockResolvedValueOnce({
          discovery: dbEntry.discovery,
          flatSources: {},
        }),
      } as unknown as DiscoveryRunner

      const updateMonitorRepository = {
        findLatest: vi.fn(async () => dbEntry),
      } as unknown as Database['updateMonitor']

      const updateMonitor = new UpdateMonitor(
        discoveryRunner,
        {} as unknown as UpdateNotifier,
        {} as unknown as UpdateDiffer,
        { readDiscovery: vi.fn(() => committed) } as unknown as ConfigReader,
        {
          updateMonitor: updateMonitorRepository,
          flatSources: flatSourcesRepository,
        } as unknown as Database,
        {} as unknown as Clock,
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
      expect(result).toStrictEqual(dbEntry.discovery)
    })

    it('takes config hash into consideration', async () => {
      const dbEntry = COMMITTED
      const committed = {
        ...mockProject,
        entries: DISCOVERY_RESULT.entries,
      }

      const discoveryRunner = {
        run: vi.fn().mockResolvedValueOnce({
          discovery: committed,
          flatSources: {},
        }),
      } as unknown as DiscoveryRunner

      const configReader = {
        readDiscovery: vi.fn(() => committed),
      } as unknown as ConfigReader

      const updateMonitorRepository = {
        findLatest: vi.fn(async () => ({
          ...mockRecord,
          discovery: {
            ...mockProject,
            entries: dbEntry,
          },
          configHash: hashJsonStable(mockConfig(PROJECT_A).structure),
        })),
      } as unknown as Database['updateMonitor']

      const updateMonitor = new UpdateMonitor(
        discoveryRunner,
        {} as unknown as UpdateNotifier,
        {} as unknown as UpdateDiffer,
        configReader,
        {
          updateMonitor: updateMonitorRepository,
          flatSources: flatSourcesRepository,
        } as unknown as Database,
        {} as unknown as Clock,
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

      expect(result).toStrictEqual(committed)
    })

    it('with version mismatch runs discovery with previous block number', async () => {
      const committed = {
        ...mockProject,
        entries: DISCOVERY_RESULT.entries,
      }
      const dbEntry = COMMITTED

      const updateMonitorRepository = {
        findLatest: vi.fn(async () => ({
          ...mockRecord,
          discovery: {
            ...mockProject,
            entries: dbEntry,
            timestamp: TIMESTAMP - 1,
          },
          configHash: hashJsonStable(mockConfig(PROJECT_A).structure),
        })),
      } as unknown as Database['updateMonitor']

      const discoveryRunner = {
        run: vi.fn(async () => ({
          discovery: mockProject,
          flatSources: {},
        })),
      } as unknown as DiscoveryRunner

      const updateMonitor = new UpdateMonitor(
        discoveryRunner,
        {} as unknown as UpdateNotifier,
        {} as unknown as UpdateDiffer,
        { readDiscovery: vi.fn(() => committed) } as unknown as ConfigReader,
        {
          updateMonitor: updateMonitorRepository,
          flatSources: flatSourcesRepository,
        } as unknown as Database,
        {} as unknown as Clock,
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
      )
    })
  })

  describe(UpdateMonitor.prototype.generateDailyReminder.name, () => {
    it('does not cross-contaminate between chains', async () => {
      const runner = {
        run: vi.fn(async () => {
          return { discovery: DISCOVERY_RESULT_ARB_2, flatSources: {} }
        }),
      } as unknown as DiscoveryRunner

      const timestamp = 0
      const updateMonitorRepository = {
        findLatest: vi.fn(async () => undefined),
        upsert: vi.fn(async () => undefined),
      } as unknown as Database['updateMonitor']
      const configReader = {
        readDiscovery: vi.fn((name: string) => {
          if (name === PROJECT_B) {
            return DISCOVERY_RESULT_ETH_2
          }
          return DISCOVERY_RESULT
        }),

        readConfig: vi.fn((name: string) => mockConfig(name)),
        readAllDiscoveredProjects: vi.fn(() => [PROJECT_A, PROJECT_B]),
      } as unknown as ConfigReader
      const updateDiffRepository = {
        deleteAll: vi.fn(async () => 0),
      } as unknown as Database['updateDiff']

      const updateMonitor = new UpdateMonitor(
        runner,
        updateNotifier,
        updateDiffer,
        configReader,
        {
          updateMonitor: updateMonitorRepository,
          flatSources: flatSourcesRepository,
          updateDiff: updateDiffRepository,
        } as unknown as Database,
        {} as unknown as Clock,
        discoveryOutputCache,
        Logger.SILENT,
        false,
        instantWorkerPool,
      )

      await updateMonitor.update(timestamp)
      const result = updateMonitor.generateDailyReminder()

      expect(result).toStrictEqual({
        [PROJECT_A]: {
          severityCounts: { low: 0, medium: 0, high: 0, unknown: 1 },
        },
        [PROJECT_B]: {
          severityCounts: { low: 0, medium: 0, high: 0, unknown: 2 },
        },
      })
    })

    it('generates the daily reminder for two different chains', async () => {
      const discoveryRunner = {
        run: vi.fn().mockResolvedValue({
          ethereum: {
            discovery: DISCOVERY_RESULT,
            flatSources: {},
          },
        }),
      } as unknown as DiscoveryRunner

      const timestamp = 0
      const updateMonitorRepository = {
        findLatest: vi.fn(async () => undefined),
        upsert: vi.fn(async () => undefined),
      } as unknown as Database['updateMonitor']
      const configReader = {
        readDiscovery: vi.fn(() => ({
          ...mockProject,
          entries: COMMITTED,
        })),

        readConfig: vi.fn((name: string) => mockConfig(name)),
        readAllDiscoveredProjects: vi.fn(() => [PROJECT_A]),
      } as unknown as ConfigReader
      const updateDiffRepository = {
        deleteAll: vi.fn(async () => 0),
      } as unknown as Database['updateDiff']

      const updateMonitor = new UpdateMonitor(
        discoveryRunner,
        updateNotifier,
        updateDiffer,
        configReader,
        {
          updateMonitor: updateMonitorRepository,
          flatSources: flatSourcesRepository,
          updateDiff: updateDiffRepository,
        } as unknown as Database,
        {} as unknown as Clock,
        discoveryOutputCache,
        Logger.SILENT,
        false,
        instantWorkerPool,
      )

      await updateMonitor.update(timestamp)
      const result = updateMonitor.generateDailyReminder()

      expect(Object.entries(result).length).toStrictEqual(1)
      expect(result).toStrictEqual({
        [PROJECT_A]: {
          severityCounts: { low: 0, medium: 0, high: 0, unknown: 3 },
        },
      })
    })

    it('does nothing for an empty cache', async () => {
      const discoveryRunner = {
        run: vi.fn().mockResolvedValue({
          ethereum: {
            discovery: DISCOVERY_RESULT,
            flatSources: {},
          },
        }),
      } as unknown as DiscoveryRunner

      const timestamp = 0
      const updateMonitorRepository = {
        findLatest: vi.fn(async () => undefined),
        upsert: vi.fn(async () => undefined),
      } as unknown as Database['updateMonitor']
      const configReader = {
        readDiscovery: vi.fn(() => ({
          ...mockProject,
          entries: COMMITTED,
        })),

        readConfig: vi.fn((name: string) => mockConfig(name)),
        readAllDiscoveredProjects: vi.fn(() => [PROJECT_A]),
      } as unknown as ConfigReader
      const updateDiffRepository = {
        deleteAll: vi.fn(async () => 0),
      } as unknown as Database['updateDiff']

      const updateMonitor = new UpdateMonitor(
        discoveryRunner,
        updateNotifier,
        updateDiffer,
        configReader,
        {
          updateMonitor: updateMonitorRepository,
          flatSources: flatSourcesRepository,
          updateDiff: updateDiffRepository,
        } as unknown as Database,
        {} as unknown as Clock,
        discoveryOutputCache,
        Logger.SILENT,
        false,
        instantWorkerPool,
      )

      await updateMonitor.update(timestamp)
      const result = updateMonitor.generateDailyReminder()

      expect(Object.entries(result).length).toStrictEqual(1)
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
  modelledAgainst: {},
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
