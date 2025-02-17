import { Logger } from '@l2beat/backend-tools'
import {
  type ConfigReader,
  DiscoveryConfig,
  type DiscoveryDiff,
} from '@l2beat/discovery'
import type {
  ContractParameters,
  DiscoveryOutput,
} from '@l2beat/discovery-types'
import {
  ChainConverter,
  ChainId,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import type { Database, UpdateMonitorRecord } from '@l2beat/database'
import type { Clock } from '../../tools/Clock'
import type { DiscoveryRunner } from './DiscoveryRunner'
import { UpdateMonitor } from './UpdateMonitor'
import type { UpdateNotifier } from './UpdateNotifier'

const PROJECT_A = 'project-a'
const PROJECT_B = 'project-b'
const NAME_A = 'contract-a'
const ADDRESS_A = EthereumAddress.random()
const NAME_B = 'contract-b'
const ADDRESS_B = EthereumAddress.random()
const BLOCK_NUMBER = 1
const TIMESTAMP = new UnixTime(0)

const COMMITTED: ContractParameters[] = [
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
  blockNumber: BLOCK_NUMBER,
  configHash: Hash256.random(),
  contracts: [
    {
      ...mockContract(NAME_A, ADDRESS_A),
      values: { a: false },
    },
    mockContract(NAME_B, ADDRESS_B),
  ],
  eoas: [],
  abis: {},
  usedTemplates: {},
}

const DISCOVERY_RESULT_ETH_2: DiscoveryOutput = {
  name: PROJECT_B,
  chain: 'ethereum',
  blockNumber: BLOCK_NUMBER,
  configHash: Hash256.random(),
  contracts: [
    {
      ...mockContract(NAME_A, ADDRESS_A),
      values: { a: false },
      fieldMeta: { a: { severity: 'MEDIUM' } },
    },
    mockContract(NAME_B, ADDRESS_B),
  ],
  eoas: [],
  abis: {},
  usedTemplates: {},
}

const DISCOVERY_RESULT_ARB_2: DiscoveryOutput = {
  name: PROJECT_B,
  chain: 'arbitrum',
  blockNumber: BLOCK_NUMBER,
  configHash: Hash256.random(),
  contracts: [
    {
      ...mockContract(NAME_A, ADDRESS_A),
      values: { c: true, a: false },
    },
    mockContract(NAME_B, ADDRESS_B),
  ],
  eoas: [],
  abis: {},
  usedTemplates: {},
}

describe(UpdateMonitor.name, () => {
  let updateNotifier = mockObject<UpdateNotifier>({})
  let discoveryRunner = mockObject<DiscoveryRunner>({})
  const chainConverter = new ChainConverter([
    { name: 'ethereum', chainId: ChainId.ETHEREUM },
    { name: 'arbitrum', chainId: ChainId.ARBITRUM },
  ])

  beforeEach(() => {
    updateNotifier = mockObject<UpdateNotifier>({
      handleUpdate: async () => {},
      sendDailyReminder: async () => {},
    })
    discoveryRunner = mockObject<DiscoveryRunner>({
      discoverWithRetry: async () => ({
        discovery: DISCOVERY_RESULT,
        flatSources: {},
      }),
      chain: 'ethereum',
      getBlockNumber: async () => BLOCK_NUMBER,
    })
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
        getBlockNumber: async () => BLOCK_NUMBER,
      })

      const runners = [discoveryRunnerEth, discoveryRunnerArb]

      const configReader = mockObject<ConfigReader>({
        readDiscovery: () => ({
          ...mockProject,
          contracts: COMMITTED,
        }),

        readAllConfigsForChain: (chain: string) => {
          return [mockConfig(PROJECT_A, chain)]
        },
      })

      const repository = mockObject<Database['updateMonitor']>({
        findLatest: async () => undefined,
        upsert: async () => undefined,
      })
      const timestamp = new UnixTime(0)

      const updateMonitor = new UpdateMonitor(
        runners,
        updateNotifier,
        configReader,
        mockObject<Database>({ updateMonitor: repository }),
        mockObject<Clock>(),
        chainConverter,
        Logger.SILENT,
        false,
      )

      await updateMonitor.update(timestamp)

      // gets block number
      expect(discoveryRunnerEth.getBlockNumber).toHaveBeenCalledTimes(1)
      expect(discoveryRunnerArb.getBlockNumber).toHaveBeenCalledTimes(1)

      // reads all the configs
      expect(configReader.readAllConfigsForChain).toHaveBeenCalledTimes(4)
      expect(configReader.readAllConfigsForChain).toHaveBeenNthCalledWith(
        1,
        'ethereum',
      )

      expect(configReader.readAllConfigsForChain).toHaveBeenNthCalledWith(
        2,
        'arbitrum',
      )

      // runs discovery for every project
      expect(discoveryRunnerEth.discoverWithRetry).toHaveBeenCalledTimes(2)

      expect(updateNotifier.sendDailyReminder).toHaveBeenCalledTimes(1)
      expect(updateNotifier.sendDailyReminder).toHaveBeenCalledWith(
        {
          ['project-a']: [
            {
              chainName: 'ethereum',
              severityCounts: { low: 0, medium: 0, high: 0, unknown: 2 },
            },
            {
              chainName: 'arbitrum',
              severityCounts: { low: 0, medium: 0, high: 0, unknown: 2 },
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
          contracts: COMMITTED,
        }),
        readConfig: () => config,

        readAllConfigsForChain: () => [
          mockConfig(PROJECT_A),
          mockConfig(PROJECT_B),
        ],
      })

      const repository = mockObject<Database['updateMonitor']>({
        findLatest: async () => undefined,
        upsert: async () => undefined,
      })

      const discoveryA = { ...mockProject, contracts: COMMITTED }
      const discoveryB = DISCOVERY_RESULT

      const discoveryRunner = mockObject<DiscoveryRunner>({
        discoverWithRetry: mockFn()
          .resolvesToOnce({ discovery: discoveryA, flatSources: {} })
          .resolvesToOnce({ discovery: discoveryB, flatSources: {} })
          .resolvesToOnce({ discovery: discoveryA, flatSources: {} })
          .resolvesToOnce({ discovery: discoveryB, flatSources: {} }),
        chain: 'ethereum',
        getBlockNumber: async () => BLOCK_NUMBER,
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        updateNotifier,
        configReader,
        mockObject<Database>({ updateMonitor: repository }),
        mockObject<Clock>(),
        chainConverter,
        Logger.SILENT,
        false,
      )
      await updateMonitor.updateChain(discoveryRunner, TIMESTAMP)

      // gets block number
      expect(discoveryRunner.getBlockNumber).toHaveBeenCalledTimes(1)
      // reads all the configs
      expect(configReader.readAllConfigsForChain).toHaveBeenCalledTimes(1)
      // runs discovery for every project
      expect(discoveryRunner.discoverWithRetry).toHaveBeenCalledTimes(4)
      expect(discoveryRunner.discoverWithRetry).toHaveBeenNthCalledWith(
        1,
        mockConfig(PROJECT_A),
        BLOCK_NUMBER,
        LOGGER,
      )
      expect(discoveryRunner.discoverWithRetry).toHaveBeenNthCalledWith(
        2,
        mockConfig(PROJECT_A),
        BLOCK_NUMBER,
        LOGGER,
      )
      expect(discoveryRunner.discoverWithRetry).toHaveBeenNthCalledWith(
        3,
        mockConfig(PROJECT_B),
        BLOCK_NUMBER,
        LOGGER,
      )
      expect(discoveryRunner.discoverWithRetry).toHaveBeenNthCalledWith(
        4,
        mockConfig(PROJECT_B),
        BLOCK_NUMBER,
        LOGGER,
      )
      // calls repository (and gets undefined)
      expect(repository.findLatest).toHaveBeenCalledTimes(2)
      // reads committed discovery.json, 2 + 2 for findUnresolvedProjects() + 2 for findUnknown contracts()
      // and + 2 for finding unverifiedContracts
      expect(configReader.readDiscovery).toHaveBeenCalledTimes(3 * 2)
      // saves discovery result
      expect(repository.upsert).toHaveBeenCalledTimes(2)
      //sends notification
      expect(updateNotifier.handleUpdate).toHaveBeenCalledTimes(2)
      expect(updateNotifier.handleUpdate).toHaveBeenNthCalledWith(
        1,
        PROJECT_A,
        mockDiff,
        BLOCK_NUMBER,
        ChainId.ETHEREUM,
        [],
        [],
        TIMESTAMP,
      )
      expect(updateNotifier.handleUpdate).toHaveBeenNthCalledWith(
        2,
        PROJECT_B,
        mockDiff,
        BLOCK_NUMBER,
        ChainId.ETHEREUM,
        [],
        [],
        TIMESTAMP,
      )
    })

    it('does not send notification about the same change', async () => {
      const configReader = mockObject<ConfigReader>({
        readAllConfigsForChain: () => [mockConfig(PROJECT_A)],
        readDiscovery: () => ({ ...mockProject, contracts: [] }),
      })

      const repository = mockObject<Database['updateMonitor']>({
        findLatest: async () => ({
          ...mockRecord,
          discovery: DISCOVERY_RESULT,
          configHash: mockConfig(PROJECT_A).hash,
        }),
        upsert: async () => undefined,
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        updateNotifier,
        configReader,
        mockObject<Database>({ updateMonitor: repository }),
        mockObject<Clock>(),
        chainConverter,
        Logger.SILENT,
        false,
      )

      await updateMonitor.updateChain(discoveryRunner, new UnixTime(0))

      // gets block number
      expect(discoveryRunner.getBlockNumber).toHaveBeenCalledTimes(1)
      // reads all the configs
      expect(configReader.readAllConfigsForChain).toHaveBeenCalledTimes(1)
      // gets latest from database (with the same config hash)
      expect(repository.findLatest).toHaveBeenOnlyCalledWith(
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
        readAllConfigsForChain: () => [mockConfig(PROJECT_A)],
        readDiscovery: () => ({ ...mockProject, contracts: [] }),
      })

      const repository = mockObject<Database['updateMonitor']>({
        findLatest: async () => ({
          ...mockRecord,
          discovery: DISCOVERY_RESULT,
          configHash: mockConfig(PROJECT_A).hash,
        }),
        upsert: async () => undefined,
      })

      const discoveryRunner = mockObject<DiscoveryRunner>({
        discoverWithRetry: mockFn().throws('Error'),
        chain: 'ethereum',
        getBlockNumber: async () => BLOCK_NUMBER,
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        updateNotifier,
        configReader,
        mockObject<Database>({ updateMonitor: repository }),
        mockObject<Clock>(),
        chainConverter,
        Logger.SILENT,
        false,
      )

      await updateMonitor.updateChain(discoveryRunner, new UnixTime(0))

      // send notification about the error of discovery
      expect(updateNotifier.handleUpdate).toHaveBeenCalledTimes(0)
    })

    it('uses discovery on previous block number if version changes', async () => {
      const config = mockConfig(PROJECT_A)

      const configReader = mockObject<ConfigReader>({
        readAllConfigsForChain: () => [config],
        readConfig: () => config,
        readDiscovery: () => ({
          ...mockProject,
          blockNumber: BLOCK_NUMBER - 1,
          contracts: [],
        }),
      })

      const repository = mockObject<Database['updateMonitor']>({
        findLatest: async () => ({
          ...mockRecord,
          discovery: { ...DISCOVERY_RESULT, blockNumber: BLOCK_NUMBER - 1 },
          configHash: config.hash,
          blockNumber: BLOCK_NUMBER - 1,
        }),
        upsert: async () => undefined,
      })

      const discoveryRunner = mockObject<DiscoveryRunner>({
        discoverWithRetry: mockFn(),
        chain: 'ethereum',
        getBlockNumber: async () => BLOCK_NUMBER,
      })

      discoveryRunner.discoverWithRetry.resolvesToOnce({
        discovery: { ...DISCOVERY_RESULT },
        flatSources: {},
      })
      discoveryRunner.discoverWithRetry.resolvesToOnce({
        discovery: {
          ...DISCOVERY_RESULT,
          contracts: [],
        },
        flatSources: {},
      })
      discoveryRunner.discoverWithRetry.resolvesToOnce({
        discovery: {
          ...DISCOVERY_RESULT,
          contracts: [],
        },
        flatSources: {},
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        updateNotifier,
        configReader,
        mockObject<Database>({ updateMonitor: repository }),
        mockObject<Clock>(),
        chainConverter,
        Logger.SILENT,
        false,
      )

      await updateMonitor.updateChain(discoveryRunner, new UnixTime(0))

      expect(discoveryRunner.discoverWithRetry).toHaveBeenCalledTimes(2)
      expect(discoveryRunner.discoverWithRetry).toHaveBeenNthCalledWith(
        1,
        config,
        BLOCK_NUMBER - 1,
        LOGGER,
      )
      expect(discoveryRunner.discoverWithRetry).toHaveBeenNthCalledWith(
        2,
        config,
        BLOCK_NUMBER,
        LOGGER,
      )
      expect(updateNotifier.handleUpdate).toHaveBeenCalledTimes(1)
      expect(repository.upsert).toHaveBeenCalledTimes(1)
    })

    it('handles error', async () => {
      const configReader = mockObject<ConfigReader>({
        readAllConfigsForChain: () => [mockConfig(PROJECT_A)],
        readDiscovery: () => ({ ...mockProject, contracts: [] }),
      })

      const discoveryRunner = mockObject<DiscoveryRunner>({
        discoverWithRetry: async () => {
          throw new Error('error')
        },
        chain: 'ethereum',
        getBlockNumber: async () => BLOCK_NUMBER,
      })

      const repository = mockObject<Database['updateMonitor']>({
        findLatest: async () => undefined,
        upsert: async () => undefined,
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        updateNotifier,
        configReader,
        mockObject<Database>({ updateMonitor: repository }),
        mockObject<Clock>(),
        chainConverter,
        Logger.SILENT,
        false,
      )

      await updateMonitor.updateChain(discoveryRunner, new UnixTime(0))

      // gets block number
      expect(discoveryRunner.getBlockNumber).toHaveBeenCalledTimes(1)
      // reads all the configs
      expect(configReader.readAllConfigsForChain).toHaveBeenCalledTimes(1)
      // gets latest from database (with the same config hash)
      expect(repository.findLatest).toHaveBeenCalledTimes(1)
      // does not save changes to database
      expect(repository.upsert).toHaveBeenCalledTimes(0)
      // does not send a notification
      expect(updateNotifier.handleUpdate).toHaveBeenCalledTimes(0)
    })
  })

  describe(UpdateMonitor.prototype.getPreviousDiscovery.name, () => {
    it('gets committed file', async () => {
      const discoveryA = { ...mockProject, contracts: COMMITTED }
      const discoveryB: DiscoveryOutput = {
        ...mockProject,
        contracts: COMMITTED,
      }
      const configReader = mockObject<ConfigReader>({
        readDiscovery: () => discoveryB,
      })

      const discoveryRunner = mockObject<DiscoveryRunner>({
        discoverWithRetry: mockFn()
          .resolvesToOnce({ discovery: discoveryA, flatSources: {} })
          .resolvesToOnce({ discovery: discoveryB, flatSources: {} }),
        chain: 'ethereum',
        getBlockNumber: async () => BLOCK_NUMBER,
      })

      const repository = mockObject<Database['updateMonitor']>({
        findLatest: async () => undefined,
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        mockObject<UpdateNotifier>(),
        configReader,
        mockObject<Database>({ updateMonitor: repository }),
        mockObject<Clock>(),
        chainConverter,
        Logger.SILENT,
        false,
      )

      const result = await updateMonitor.getPreviousDiscovery(
        discoveryRunner,
        mockConfig(PROJECT_A),
      )

      // calls repository (and gets undefined)
      expect(repository.findLatest).toHaveBeenCalledTimes(1)
      // reads committed file
      expect(configReader.readDiscovery).toHaveBeenOnlyCalledWith(
        PROJECT_A,
        'ethereum',
      )
      expect(result).toEqual(discoveryB)
    })

    it('gets repository entry', async () => {
      const dbEntry = {
        ...mockRecord,
        discovery: { ...mockProject, contracts: COMMITTED },
        configHash: mockConfig(PROJECT_A).hash,
      }

      const discoveryRunner = mockObject<DiscoveryRunner>({
        discoverWithRetry: mockFn().resolvesToOnce({
          discovery: dbEntry.discovery,
          flatSources: {},
        }),
        chain: 'ethereum',
        getBlockNumber: async () => BLOCK_NUMBER,
      })

      const repository = mockObject<Database['updateMonitor']>({
        findLatest: async () => dbEntry,
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        mockObject<UpdateNotifier>(),
        mockObject<ConfigReader>(),
        mockObject<Database>({ updateMonitor: repository }),
        mockObject<Clock>(),
        chainConverter,
        Logger.SILENT,
        false,
      )

      const result = await updateMonitor.getPreviousDiscovery(
        discoveryRunner,
        mockConfig(PROJECT_A),
      )

      // calls repository
      expect(repository.findLatest).toHaveBeenCalledTimes(1)
      expect(result).toEqual(dbEntry.discovery)
    })

    it('takes config hash into consideration', async () => {
      const dbEntry = COMMITTED
      const committed = {
        ...mockProject,
        contracts: DISCOVERY_RESULT.contracts,
      }

      const discoveryRunner = mockObject<DiscoveryRunner>({
        discoverWithRetry: mockFn().resolvesToOnce({
          discovery: committed,
          flatSources: {},
        }),
        chain: 'ethereum',
        getBlockNumber: async () => BLOCK_NUMBER,
      })

      const configReader = mockObject<ConfigReader>({
        readDiscovery: () => committed,
      })

      const repository = mockObject<Database['updateMonitor']>({
        findLatest: async () => ({
          ...mockRecord,
          discovery: {
            ...mockProject,
            contracts: dbEntry,
          },
          configHash: mockConfig(PROJECT_A).hash,
        }),
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        mockObject<UpdateNotifier>(),
        configReader,
        mockObject<Database>({ updateMonitor: repository }),
        mockObject<Clock>(),
        chainConverter,
        Logger.SILENT,
        false,
      )

      const result = await updateMonitor.getPreviousDiscovery(
        discoveryRunner,
        // different config hash
        new DiscoveryConfig({
          name: PROJECT_A,
          chain: 'ethereum',
          initialAddresses: [EthereumAddress.ZERO],
        }),
      )

      expect(result).toEqual(committed)
    })

    it('with version mismatch runs discovery with previous block number', async () => {
      const dbEntry = COMMITTED

      const repository = mockObject<Database['updateMonitor']>({
        findLatest: async () => ({
          ...mockRecord,
          discovery: {
            ...mockProject,
            contracts: dbEntry,
            blockNumber: BLOCK_NUMBER - 1,
          },
          configHash: mockConfig(PROJECT_A).hash,
        }),
      })

      const discoveryRunner = mockObject<DiscoveryRunner>({
        discoverWithRetry: async () => ({
          discovery: mockProject,
          flatSources: {},
        }),
        chain: 'ethereum',
        getBlockNumber: async () => BLOCK_NUMBER,
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        mockObject<UpdateNotifier>(),
        mockObject<ConfigReader>(),
        mockObject<Database>({ updateMonitor: repository }),
        mockObject<Clock>(),
        chainConverter,
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
        BLOCK_NUMBER - 1,
        LOGGER,
      )
    })
  })

  describe(UpdateMonitor.prototype.generateDailyReminder.name, () => {
    it('does not cross-contaminate between chains', async () => {
      const discoveryRunnerEth = mockObject<DiscoveryRunner>({
        discoverWithRetry: async () => ({
          discovery: {
            ...DISCOVERY_RESULT,
            contracts: [
              {
                ...DISCOVERY_RESULT.contracts[0],
                fieldMeta: { a: { severity: 'MEDIUM' } },
              },
              ...DISCOVERY_RESULT.contracts.slice(1),
            ],
          },
          flatSources: {},
        }),
        chain: 'ethereum',
        getBlockNumber: async () => BLOCK_NUMBER,
      })
      const discoveryRunnerArb = mockObject<DiscoveryRunner>({
        discoverWithRetry: async () => ({
          discovery: DISCOVERY_RESULT_ARB_2,
          flatSources: {},
        }),
        chain: 'arbitrum',
        getBlockNumber: async () => BLOCK_NUMBER,
      })

      const runners = [discoveryRunnerEth, discoveryRunnerArb]

      const timestamp = new UnixTime(0)
      const repository = mockObject<Database['updateMonitor']>({
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
              contracts: COMMITTED,
            }
          }

          return {
            ...mockProject,
            contracts: [
              ...COMMITTED.slice(1),
              {
                ...mockContract(NAME_A, ADDRESS_A),
                values: { a: true },
                fieldMeta: { a: { severity: 'MEDIUM' } },
              },
            ],
          }
        },

        readAllConfigsForChain: (chain: string) => {
          if (chain === 'arbitrum') {
            return [mockConfig(PROJECT_B, chain)]
          }

          return [mockConfig(PROJECT_A, chain), mockConfig(PROJECT_B, chain)]
        },
      })

      const updateMonitor = new UpdateMonitor(
        runners,
        updateNotifier,
        configReader,
        mockObject<Database>({ updateMonitor: repository }),
        mockObject<Clock>(),
        chainConverter,
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
            severityCounts: { low: 0, medium: 1, high: 0, unknown: 1 },
          },
        ],
        [PROJECT_B]: [
          {
            chainName: 'arbitrum',
            severityCounts: { low: 0, medium: 0, high: 0, unknown: 3 },
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
        getBlockNumber: async () => BLOCK_NUMBER,
      })

      const runners = [discoveryRunnerEth, discoveryRunnerArb]

      const timestamp = new UnixTime(0)
      const repository = mockObject<Database['updateMonitor']>({
        findLatest: async () => undefined,
        upsert: async () => undefined,
      })
      const configReader = mockObject<ConfigReader>({
        readDiscovery: () => ({
          ...mockProject,
          contracts: COMMITTED,
        }),

        readAllConfigsForChain: (chain: string) => {
          return [mockConfig(PROJECT_A, chain)]
        },
      })
      const updateMonitor = new UpdateMonitor(
        runners,
        updateNotifier,
        configReader,
        mockObject<Database>({ updateMonitor: repository }),
        mockObject<Clock>(),
        chainConverter,
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
            severityCounts: { low: 0, medium: 0, high: 0, unknown: 2 },
          },
          {
            chainName: 'arbitrum',
            severityCounts: { low: 0, medium: 0, high: 0, unknown: 2 },
          },
        ],
      })
    })

    it('does nothing for an empty cache', async () => {
      const timestamp = new UnixTime(0)
      const repository = mockObject<Database['updateMonitor']>({
        findLatest: async () => undefined,
        upsert: async () => undefined,
      })
      const configReader = mockObject<ConfigReader>({
        readDiscovery: () => ({
          ...mockProject,
          contracts: COMMITTED,
        }),

        readAllConfigsForChain: (chain: string) => {
          return [mockConfig(PROJECT_A, chain)]
        },
      })

      const updateMonitor = new UpdateMonitor(
        [],
        updateNotifier,
        configReader,
        mockObject<Database>({ updateMonitor: repository }),
        mockObject<Clock>(),
        chainConverter,
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
  projectName: 'name',
  chainId: ChainId.ETHEREUM,
  blockNumber: 1,
  timestamp: UnixTime.now(),
  configHash: Hash256.random(),
  discovery: DISCOVERY_RESULT,
}

const mockProject: DiscoveryOutput = {
  name: PROJECT_A,
  chain: 'ethereum',
  blockNumber: BLOCK_NUMBER,
  configHash: Hash256.random(),
  contracts: COMMITTED,
  eoas: [],
  abis: {},
  usedTemplates: {},
}

function mockContract(
  name: string,
  address: EthereumAddress,
): ContractParameters {
  return {
    name,
    address,
    values: {
      $immutable: true,
    },
  }
}

function mockConfig(name: string, chain = 'ethereum'): DiscoveryConfig {
  return new DiscoveryConfig({
    name,
    chain,
    initialAddresses: [],
  })
}

const mockDiff: DiscoveryDiff[] = [
  {
    address: ADDRESS_A,
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
