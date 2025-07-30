import { Logger } from '@l2beat/backend-tools'
import type { Database, UpdateMonitorRecord } from '@l2beat/database'
import {
  type ConfigReader,
  ConfigRegistry,
  type DiscoveryDiff,
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
  let discoveryRunner = mockObject<DiscoveryRunner>({})
  let discoveryOutputCache = new DiscoveryOutputCache()
  const chainConverter = new ChainConverter([
    { name: 'ethereum', chainId: ChainId.ETHEREUM },
    { name: 'arbitrum', chainId: ChainId.ARBITRUM },
  ])

  beforeEach(() => {
    updateNotifier = mockObject<UpdateNotifier>({
      handleUpdate: async () => {},
      sendDailyReminder: async () => {},
    })
    updateDiffer = mockObject<UpdateDiffer>({
      runForChain: async () => undefined,
    })
    discoveryRunner = mockObject<DiscoveryRunner>({
      discoverWithRetry: async () => ({
        discovery: DISCOVERY_RESULT,
        flatSources: {},
      }),
      chain: 'ethereum',
    })
    discoveryOutputCache = new DiscoveryOutputCache()
  })

  describe(UpdateMonitor.prototype.update.name, () => {
    it('iterates over runners and dispatches updates', async () => {
      const discoveryRunnerEth = discoveryRunner
      const discoveryRunnerArb = mockObject<DiscoveryRunner>({
        discoverWithRetry: async () => ({
          discovery: DISCOVERY_RESULT,
          flatSources: {},
        }),
        chain: 'arbitrum',
      })

      const runners = [discoveryRunnerEth, discoveryRunnerArb]

      const configReader = mockObject<ConfigReader>({
        readDiscovery: () => ({
          ...mockProject,
          entries: COMMITTED,
        }),

        readAllDiscoveredConfigsForChain: (chain: string) => {
          return [mockConfig(PROJECT_A, chain)]
        },
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
        runners,
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
      )

      await updateMonitor.update(timestamp)

      // reads all the configs
      expect(
        configReader.readAllDiscoveredConfigsForChain,
      ).toHaveBeenCalledTimes(4)
      expect(
        configReader.readAllDiscoveredConfigsForChain,
      ).toHaveBeenNthCalledWith(1, 'ethereum')

      expect(
        configReader.readAllDiscoveredConfigsForChain,
      ).toHaveBeenNthCalledWith(2, 'arbitrum')

      // runs discovery for every project
      expect(discoveryRunnerEth.discoverWithRetry).toHaveBeenCalledTimes(2)

      expect(updateDiffer.runForChain).toHaveBeenCalledTimes(2)

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

  describe(UpdateMonitor.prototype.updateChain.name, () => {
    it('iterates over projects and finds diff', async () => {
      const config = mockConfig(PROJECT_A)
      const configReader = mockObject<ConfigReader>({
        readDiscovery: () => ({
          ...mockProject,
          entries: COMMITTED,
        }),
        readConfig: () => config,

        readAllDiscoveredConfigsForChain: () => [
          mockConfig(PROJECT_A),
          mockConfig(PROJECT_B),
        ],
      })

      const updateMonitorRepository = mockObject<Database['updateMonitor']>({
        findLatest: async () => undefined,
        upsert: async () => undefined,
      })

      const discoveryA = { ...mockProject, entries: COMMITTED }
      const discoveryB = DISCOVERY_RESULT

      const discoveryRunner = mockObject<DiscoveryRunner>({
        discoverWithRetry: mockFn()
          .resolvesToOnce({ discovery: discoveryA, flatSources: {} })
          .resolvesToOnce({ discovery: discoveryB, flatSources: {} })
          .resolvesToOnce({ discovery: discoveryA, flatSources: {} })
          .resolvesToOnce({ discovery: discoveryB, flatSources: {} }),
        chain: 'ethereum',
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        updateNotifier,
        updateDiffer,
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
      )
      await updateMonitor.updateChain(discoveryRunner, TIMESTAMP)

      // reads all the configs
      expect(
        configReader.readAllDiscoveredConfigsForChain,
      ).toHaveBeenCalledTimes(1)
      // runs discovery for every project
      expect(discoveryRunner.discoverWithRetry).toHaveBeenCalledTimes(4)
      expect(discoveryRunner.discoverWithRetry).toHaveBeenNthCalledWith(
        1,
        mockConfig(PROJECT_A),
        TIMESTAMP,
        LOGGER,
        undefined,
        undefined,
        undefined,
      )
      expect(discoveryRunner.discoverWithRetry).toHaveBeenNthCalledWith(
        2,
        mockConfig(PROJECT_A),
        TIMESTAMP,
        LOGGER,
        undefined,
        undefined,
        'useCurrentTimestamp',
      )
      expect(discoveryRunner.discoverWithRetry).toHaveBeenNthCalledWith(
        3,
        mockConfig(PROJECT_B),
        TIMESTAMP,
        LOGGER,
        undefined,
        undefined,
        undefined,
      )
      expect(discoveryRunner.discoverWithRetry).toHaveBeenNthCalledWith(
        4,
        mockConfig(PROJECT_B),
        TIMESTAMP,
        LOGGER,
        undefined,
        undefined,
        'useCurrentTimestamp',
      )
      // calls repository (and gets undefined)
      expect(updateMonitorRepository.findLatest).toHaveBeenCalledTimes(2)
      // reads committed discovery.json, 2 + 2 for findUnresolvedProjects() + 2 for findUnknown entries()
      // and + 2 for finding unverifiedContracts
      expect(configReader.readDiscovery).toHaveBeenCalledTimes(3 * 2)
      // saves discovery result
      expect(updateMonitorRepository.upsert).toHaveBeenCalledTimes(2)
      //sends notification
      expect(updateNotifier.handleUpdate).toHaveBeenCalledTimes(2)
      expect(updateNotifier.handleUpdate).toHaveBeenNthCalledWith(
        1,
        PROJECT_A,
        mockDiff,
        ChainId.ETHEREUM,
        [],
        [],
        TIMESTAMP,
      )
      expect(updateNotifier.handleUpdate).toHaveBeenNthCalledWith(
        2,
        PROJECT_B,
        mockDiff,
        ChainId.ETHEREUM,
        [],
        [],
        TIMESTAMP,
      )
    })

    it('does not send notification about the same change', async () => {
      const configReader = mockObject<ConfigReader>({
        readAllDiscoveredConfigsForChain: () => [mockConfig(PROJECT_A)],
        readDiscovery: () => ({ ...mockProject, entries: [] }),
      })

      const updateMonitorRepository = mockObject<Database['updateMonitor']>({
        findLatest: async () => ({
          ...mockRecord,
          discovery: DISCOVERY_RESULT,
          configHash: hashJsonStable(mockConfig(PROJECT_A).structure),
        }),
        upsert: async () => undefined,
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        updateNotifier,
        updateDiffer,
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
      )

      await updateMonitor.updateChain(discoveryRunner, 0)

      // reads all the configs
      expect(
        configReader.readAllDiscoveredConfigsForChain,
      ).toHaveBeenCalledTimes(1)
      // gets latest from database (with the same config hash)
      expect(updateMonitorRepository.findLatest).toHaveBeenOnlyCalledWith(
        PROJECT_A,
        ChainId.ETHEREUM,
      )
      // runs discovery
      expect(discoveryRunner.discoverWithRetry).toHaveBeenCalledTimes(2)
      // does not send a notification
      expect(updateNotifier.handleUpdate).toHaveBeenCalledTimes(0)
    })

    it('does not send notification if discovery throws', async () => {
      const configReader = mockObject<ConfigReader>({
        readAllDiscoveredConfigsForChain: () => [mockConfig(PROJECT_A)],
        readDiscovery: () => ({ ...mockProject, entries: [] }),
      })

      const updateMonitorRepository = mockObject<Database['updateMonitor']>({
        findLatest: async () => ({
          ...mockRecord,
          discovery: DISCOVERY_RESULT,
          configHash: hashJsonStable(mockConfig(PROJECT_A).structure),
        }),
        upsert: async () => undefined,
      })

      const discoveryRunner = mockObject<DiscoveryRunner>({
        discoverWithRetry: mockFn().throws('Error'),
        chain: 'ethereum',
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        updateNotifier,
        updateDiffer,
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
      )

      await updateMonitor.updateChain(discoveryRunner, 0)

      // send notification about the error of discovery
      expect(updateNotifier.handleUpdate).toHaveBeenCalledTimes(0)
    })

    it('uses discovery on previous block number if version changes', async () => {
      const config = mockConfig(PROJECT_A)

      const configReader = mockObject<ConfigReader>({
        readAllDiscoveredConfigsForChain: () => [config],
        readConfig: () => config,
        readDiscovery: () => ({
          ...mockProject,
          timestamp: TIMESTAMP - 1,
          entries: [],
        }),
      })

      const updateMonitorRepository = mockObject<Database['updateMonitor']>({
        findLatest: async () => ({
          ...mockRecord,
          discovery: { ...DISCOVERY_RESULT, timestamp: TIMESTAMP - 1 },
          configHash: hashJsonStable(config.structure),
          timestamp: TIMESTAMP - 1,
        }),
        upsert: async () => undefined,
      })

      const discoveryRunner = mockObject<DiscoveryRunner>({
        discoverWithRetry: mockFn(),
        chain: 'ethereum',
      })

      discoveryRunner.discoverWithRetry.resolvesToOnce({
        discovery: { ...DISCOVERY_RESULT },
        flatSources: {},
      })
      discoveryRunner.discoverWithRetry.resolvesToOnce({
        discovery: {
          ...DISCOVERY_RESULT,
          entries: [],
        },
        flatSources: {},
      })
      discoveryRunner.discoverWithRetry.resolvesToOnce({
        discovery: {
          ...DISCOVERY_RESULT,
          entries: [],
        },
        flatSources: {},
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        updateNotifier,
        updateDiffer,
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
      )

      await updateMonitor.updateChain(discoveryRunner, TIMESTAMP)

      expect(discoveryRunner.discoverWithRetry).toHaveBeenCalledTimes(2)
      expect(discoveryRunner.discoverWithRetry).toHaveBeenNthCalledWith(
        1,
        config,
        TIMESTAMP - 1,
        LOGGER,
        undefined,
        undefined,
        undefined,
      )
      expect(discoveryRunner.discoverWithRetry).toHaveBeenNthCalledWith(
        2,
        config,
        TIMESTAMP,
        LOGGER,
        undefined,
        undefined,
        'useCurrentTimestamp',
      )
      expect(updateNotifier.handleUpdate).toHaveBeenCalledTimes(1)
      expect(updateMonitorRepository.upsert).toHaveBeenCalledTimes(1)
    })

    it('handles error', async () => {
      const configReader = mockObject<ConfigReader>({
        readAllDiscoveredConfigsForChain: () => [mockConfig(PROJECT_A)],
        readDiscovery: () => ({ ...mockProject, entries: [] }),
      })

      const discoveryRunner = mockObject<DiscoveryRunner>({
        discoverWithRetry: async () => {
          throw new Error('error')
        },
        chain: 'ethereum',
      })

      const updateMonitorRepository = mockObject<Database['updateMonitor']>({
        findLatest: async () => undefined,
        upsert: async () => undefined,
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        updateNotifier,
        updateDiffer,
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
      )

      await updateMonitor.updateChain(discoveryRunner, 0)

      // reads all the configs
      expect(
        configReader.readAllDiscoveredConfigsForChain,
      ).toHaveBeenCalledTimes(1)
      // gets latest from database (with the same config hash)
      expect(updateMonitorRepository.findLatest).toHaveBeenCalledTimes(1)
      // does not run update differ
      expect(updateDiffer.runForChain).toHaveBeenCalledTimes(0)
      // does not save changes to database
      expect(updateMonitorRepository.upsert).toHaveBeenCalledTimes(0)
      // does not send a notification
      expect(updateNotifier.handleUpdate).toHaveBeenCalledTimes(0)
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
          .resolvesToOnce({ discovery: discoveryA, flatSources: {} })
          .resolvesToOnce({ discovery: discoveryB, flatSources: {} }),
        chain: 'ethereum',
      })

      const updateMonitorRepository = mockObject<Database['updateMonitor']>({
        findLatest: async () => undefined,
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
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
      )

      const result = await updateMonitor.getPreviousDiscovery(
        discoveryRunner,
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
          discovery: dbEntry.discovery,
          flatSources: {},
        }),
        chain: 'ethereum',
      })

      const updateMonitorRepository = mockObject<Database['updateMonitor']>({
        findLatest: async () => dbEntry,
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
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
        discoverWithRetry: mockFn().resolvesToOnce({
          discovery: committed,
          flatSources: {},
        }),
        chain: 'ethereum',
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
        [discoveryRunner],
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
      )

      const chain = 'ethereum'
      const result = await updateMonitor.getPreviousDiscovery(
        discoveryRunner,
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
          discovery: mockProject,
          flatSources: {},
        }),
        chain: 'ethereum',
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
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
      )

      await updateMonitor.getPreviousDiscovery(
        discoveryRunner,
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
      const discoveryRunnerEth = mockObject<DiscoveryRunner>({
        discoverWithRetry: async () => ({
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
        }),
        chain: 'ethereum',
      })
      const discoveryRunnerArb = mockObject<DiscoveryRunner>({
        discoverWithRetry: async () => ({
          discovery: DISCOVERY_RESULT_ARB_2,
          flatSources: {},
        }),
        chain: 'arbitrum',
      })

      const runners = [discoveryRunnerEth, discoveryRunnerArb]

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

        readAllDiscoveredConfigsForChain: (chain: string) => {
          if (chain === 'arbitrum') {
            return [mockConfig(PROJECT_B, chain)]
          }

          return [mockConfig(PROJECT_A, chain), mockConfig(PROJECT_B, chain)]
        },
      })
      const updateDiffRepository = mockObject<Database['updateDiff']>({
        deleteAll: async () => 0,
      })

      const updateMonitor = new UpdateMonitor(
        runners,
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
      )

      await updateMonitor.update(timestamp)
      const result = updateMonitor.generateDailyReminder()

      expect(Object.entries(result).length).toEqual(runners.length)
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
      const discoveryRunnerEth = discoveryRunner
      const discoveryRunnerArb = mockObject<DiscoveryRunner>({
        discoverWithRetry: async () => ({
          discovery: DISCOVERY_RESULT,
          flatSources: {},
        }),
        chain: 'arbitrum',
      })

      const runners = [discoveryRunnerEth, discoveryRunnerArb]

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

        readAllDiscoveredConfigsForChain: (chain: string) => {
          return [mockConfig(PROJECT_A, chain)]
        },
      })
      const updateDiffRepository = mockObject<Database['updateDiff']>({
        deleteAll: async () => 0,
      })

      const updateMonitor = new UpdateMonitor(
        runners,
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

        readAllDiscoveredConfigsForChain: (chain: string) => {
          return [mockConfig(PROJECT_A, chain)]
        },
      })
      const updateDiffRepository = mockObject<Database['updateDiff']>({
        deleteAll: async () => 0,
      })

      const updateMonitor = new UpdateMonitor(
        [],
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

function mockConfig(name: string, chain = 'ethereum'): ConfigRegistry {
  return new ConfigRegistry({
    name,
    chain,
    initialAddresses: [],
  })
}

const mockDiff: DiscoveryDiff[] = [
  {
    address: ADDRESS_A,
    addressType: 'Contract',
    name: NAME_A,
    description: undefined,
    diff: [
      {
        key: 'values.a',
        before: 'true',
        after: 'false',
        description: undefined,
        severity: undefined,
        type: undefined,
      },
    ],
  },
  {
    address: ADDRESS_B,
    addressType: 'Contract',
    name: NAME_B,
    description: undefined,
    diff: [
      {
        before:
          '{"nonce":"Processing error occurred.","totalLiquidity":"Processing error occurred."}',
        key: 'errors',
        description: undefined,
        severity: undefined,
        type: undefined,
      },
    ],
  },
]

const LOGGER = Logger.SILENT.for('UpdateMonitor')
