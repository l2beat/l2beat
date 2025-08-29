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
  ChainConverter,
  ChainId,
  ChainSpecificAddress,
  EthereumAddress,
  Hash256,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { Clock } from '../../tools/Clock'
import { DiscoveryOutputCache } from './DiscoveryOutputCache'
import type { DiscoveryRunner } from './DiscoveryRunner'
import type { UpdateDiffer } from './UpdateDiffer'
import { UpdateMonitor } from './UpdateMonitor'
import type { UpdateNotifier } from './UpdateNotifier'

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
  chain: 'ethereum',
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
  chain: 'ethereum',
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
  chain: 'arbitrum',
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
  const chainConverter = new ChainConverter([
    { name: 'ethereum', chainId: ChainId.ETHEREUM },
    { name: 'arbitrum', chainId: ChainId.ARBITRUM },
  ])

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
        discoverWithRetry: mockFn().resolvesTo({
          ethereum: { discovery: DISCOVERY_RESULT, flatSources: {} },
          arbitrum: { discovery: DISCOVERY_RESULT, flatSources: {} },
        }),
      })
      const chains = ['ethereum', 'arbitrum']
      const configReader = mockObject<ConfigReader>({
        readDiscovery: () => ({
          ...mockProject,
          entries: COMMITTED,
        }),

        readAllDiscoveredConfigsForChain: () => [mockConfig(PROJECT_A)],
        readAllDiscoveredProjects: () => [{ project: PROJECT_A, chains }],
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
        chainConverter,
        discoveryOutputCache,
        Logger.SILENT,
        false,
        chains,
      )

      await updateMonitor.update(timestamp)

      // reads all the configs
      expect(
        configReader.readAllDiscoveredConfigsForChain,
      ).toHaveBeenCalledTimes(2)
      expect(
        configReader.readAllDiscoveredConfigsForChain,
      ).toHaveBeenNthCalledWith(1, 'ethereum')

      expect(
        configReader.readAllDiscoveredConfigsForChain,
      ).toHaveBeenNthCalledWith(2, 'arbitrum')

      // runs discovery for every project
      expect(discoveryRunner.discoverWithRetry).toHaveBeenCalledTimes(3)

      expect(updateDiffer.runForProject).toHaveBeenCalledTimes(1)

      expect(updateNotifier.sendDailyReminder).toHaveBeenCalledTimes(1)
      expect(updateNotifier.sendDailyReminder).toHaveBeenCalledWith(
        {
          ['project-a']: [
            {
              chainName: 'ethereum',
              severityCounts: { low: 0, high: 0, unknown: 2 },
            },
            {
              chainName: 'arbitrum',
              severityCounts: { low: 0, high: 0, unknown: 2 },
            },
          ],
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
        discoverWithRetry: mockFn()
          .resolvesToOnce({
            ethereum: { discovery: discoveryA, flatSources: {} },
          })
          .resolvesToOnce({
            ethereum: { discovery: discoveryB, flatSources: {} },
          }),
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
        chainConverter,
        discoveryOutputCache,
        Logger.SILENT,
        false,
        ['ethereum'],
      )

      const result = await updateMonitor.getPreviousDiscovery(
        discoveryRunner,
        'ethereum',
        mockConfig(PROJECT_A),
      )

      // calls repository (and gets undefined)
      expect(updateMonitorRepository.findLatest).toHaveBeenCalledTimes(1)
      // reads committed file
      expect(configReader.readDiscovery).toHaveBeenOnlyCalledWith(
        PROJECT_A,
        'ethereum',
      )
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
        discoverWithRetry: mockFn().resolvesToOnce({
          ethereum: {
            discovery: dbEntry.discovery,
            flatSources: {},
          },
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
        chainConverter,
        discoveryOutputCache,
        Logger.SILENT,
        false,
        ['ethereum'],
      )

      const result = await updateMonitor.getPreviousDiscovery(
        discoveryRunner,
        'ethereum',
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
        discoverWithRetry: mockFn().resolvesToOnce({
          ethereum: {
            discovery: committed,
            flatSources: {},
          },
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
        chainConverter,
        discoveryOutputCache,
        Logger.SILENT,
        false,
        ['ethereum'],
      )

      const chain = 'ethereum'
      const result = await updateMonitor.getPreviousDiscovery(
        discoveryRunner,
        'ethereum',
        // different config hash
        new ConfigRegistry({
          name: PROJECT_A,
          chain,
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
        discoverWithRetry: async () => ({
          ethereum: {
            discovery: mockProject,
            flatSources: {},
          },
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
        chainConverter,
        discoveryOutputCache,
        Logger.SILENT,
        false,
        ['ethereum'],
      )

      await updateMonitor.getPreviousDiscovery(
        discoveryRunner,
        'ethereum',
        mockConfig(PROJECT_A),
      )

      expect(discoveryRunner.discoverWithRetry).toHaveBeenCalledTimes(1)
      expect(discoveryRunner.discoverWithRetry).toHaveBeenCalledWith(
        mockConfig(PROJECT_A),
        committed.timestamp,
        LOGGER,
        undefined,
        undefined,
        undefined,
      )
    })
  })

  describe(UpdateMonitor.prototype.generateDailyReminder.name, () => {
    it('does not cross-contaminate between chains', async () => {
      const runner = mockObject<DiscoveryRunner>({
        discoverWithRetry: async () => {
          return {
            arbitrum: {
              discovery: DISCOVERY_RESULT_ARB_2,
              flatSources: {},
            },
            ethereum: {
              discovery: {
                ...DISCOVERY_RESULT,
                entries: [
                  {
                    ...DISCOVERY_RESULT.entries[0],
                    fieldMeta: { a: { severity: 'LOW' } },
                  },
                  ...DISCOVERY_RESULT.entries.slice(1),
                ],
              },
              flatSources: {},
            },
          }
        },
      })

      const timestamp = 0
      const updateMonitorRepository = mockObject<Database['updateMonitor']>({
        findLatest: async () => undefined,
        upsert: async () => undefined,
      })
      const configReader = mockObject<ConfigReader>({
        readDiscovery: (name: string, chain: string) => {
          if (name === PROJECT_B && chain === 'ethereum') {
            return DISCOVERY_RESULT_ETH_2
          }
          if (name === PROJECT_A && chain === 'arbitrum') {
            return DISCOVERY_RESULT
          }
          if (name === PROJECT_B && chain === 'arbitrum') {
            return {
              ...mockProject,
              entries: COMMITTED,
            }
          }

          return {
            ...mockProject,
            entries: [
              ...COMMITTED.slice(1),
              {
                ...mockContract(NAME_A, ADDRESS_A),
                values: { a: true },
                fieldMeta: { a: { severity: 'LOW' } },
              },
            ],
          }
        },

        readConfig: (name: string) => mockConfig(name),
        readAllDiscoveredProjects: () => [
          { project: PROJECT_A, chains: ['ethereum'] },
          { project: PROJECT_B, chains: ['ethereum', 'arbitrum'] },
        ],
        readAllDiscoveredConfigsForChain: (chain: string) => {
          if (chain === 'arbitrum') {
            return [mockConfig(PROJECT_B)]
          }

          return [mockConfig(PROJECT_A), mockConfig(PROJECT_B)]
        },
      })
      const updateDiffRepository = mockObject<Database['updateDiff']>({
        deleteAll: async () => 0,
      })

      const chains = ['ethereum', 'arbitrum']
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
        chainConverter,
        discoveryOutputCache,
        Logger.SILENT,
        false,
        chains,
      )

      await updateMonitor.update(timestamp)
      const result = updateMonitor.generateDailyReminder()

      expect(Object.entries(result).length).toEqual(chains.length)
      expect(result).toEqual({
        [PROJECT_A]: [
          {
            chainName: 'ethereum',
            severityCounts: { low: 1, high: 0, unknown: 1 },
          },
        ],
        [PROJECT_B]: [
          {
            chainName: 'arbitrum',
            severityCounts: { low: 0, high: 0, unknown: 3 },
          },
        ],
      })
    })

    it('generates the daily reminder for two different chains', async () => {
      const discoveryRunner = mockObject<DiscoveryRunner>({
        discoverWithRetry: mockFn().resolvesTo({
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

        readAllDiscoveredConfigsForChain: () => [mockConfig(PROJECT_A)],
        readConfig: (name: string) => mockConfig(name),
        readAllDiscoveredProjects: () => [
          { project: PROJECT_A, chains: ['ethereum', 'arbitrum'] },
        ],
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
        chainConverter,
        discoveryOutputCache,
        Logger.SILENT,
        false,
        ['ethereum', 'arbitrum'],
      )

      await updateMonitor.update(timestamp)
      const result = updateMonitor.generateDailyReminder()

      expect(Object.entries(result).length).toEqual(1)
      expect(result[PROJECT_A].length).toEqual(2)
      expect(result).toEqual({
        [PROJECT_A]: [
          {
            chainName: 'ethereum',
            severityCounts: { low: 0, high: 0, unknown: 2 },
          },
          {
            chainName: 'arbitrum',
            severityCounts: { low: 0, high: 0, unknown: 2 },
          },
        ],
      })
    })

    it('does nothing for an empty cache', async () => {
      const discoveryRunner = mockObject<DiscoveryRunner>({
        discoverWithRetry: mockFn().resolvesTo({
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

        readAllDiscoveredConfigsForChain: () => {
          return [mockConfig(PROJECT_A)]
        },
        readConfig: (name: string) => mockConfig(name),
        readAllDiscoveredProjects: () => [
          { project: PROJECT_A, chains: ['ethereum', 'arbitrum'] },
        ],
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
        chainConverter,
        discoveryOutputCache,
        Logger.SILENT,
        false,
        [],
      )

      await updateMonitor.update(timestamp)
      const result = updateMonitor.generateDailyReminder()

      expect(Object.entries(result).length).toEqual(0)
    })
  })
})

const mockRecord: UpdateMonitorRecord = {
  projectId: 'name',
  chainId: ChainId.ETHEREUM,
  timestamp: 1,
  blockNumber: 0,
  configHash: Hash256.random(),
  discovery: DISCOVERY_RESULT,
}

const mockProject: DiscoveryOutput = {
  name: PROJECT_A,
  chain: 'ethereum',
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

const LOGGER = Logger.SILENT.for('UpdateMonitor')
