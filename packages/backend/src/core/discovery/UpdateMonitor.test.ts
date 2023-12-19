import { Logger } from '@l2beat/backend-tools'
import { ConfigReader, DiscoveryConfig, DiscoveryDiff } from '@l2beat/discovery'
import type {
  ContractParameters,
  DiscoveryOutput,
} from '@l2beat/discovery-types'
import {
  ChainId,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import {
  UpdateMonitorRecord,
  UpdateMonitorRepository,
} from '../../peripherals/database/discovery/UpdateMonitorRepository'
import { Clock } from '../Clock'
import { DiscoveryRunner, DiscoveryRunnerOptions } from './DiscoveryRunner'
import { UpdateMonitor } from './UpdateMonitor'
import { UpdateMetadata, UpdateNotifier } from './UpdateNotifier'

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
  mockContract(NAME_B, ADDRESS_B),
]

const DISCOVERY_RESULT: DiscoveryOutput = {
  name: PROJECT_A,
  chain: ChainId.getName(ChainId.ETHEREUM),
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
  version: 0,
}

const DISCOVERY_RESULT_ETH_2: DiscoveryOutput = {
  name: PROJECT_B,
  chain: ChainId.getName(ChainId.ETHEREUM),
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
  version: 0,
}

const DISCOVERY_RESULT_ARB_2: DiscoveryOutput = {
  name: PROJECT_B,
  chain: ChainId.getName(ChainId.ARBITRUM),
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
  version: 0,
}

describe(UpdateMonitor.name, () => {
  let updateNotifier = mockObject<UpdateNotifier>({})
  let discoveryRunner = mockObject<DiscoveryRunner>({})

  beforeEach(() => {
    updateNotifier = mockObject<UpdateNotifier>({
      handleUpdate: async () => {},
      sendDailyReminder: async () => {},
    })
    discoveryRunner = mockObject<DiscoveryRunner>({
      run: async () => DISCOVERY_RESULT,
      getChainId: () => ChainId.ETHEREUM,
      getBlockNumber: async () => BLOCK_NUMBER,
    })
  })

  describe(UpdateMonitor.prototype.update.name, () => {
    it('iterates over runners and dispatches updates', async () => {
      const discoveryRunnerEth = discoveryRunner
      const discoveryRunnerArb = mockObject<DiscoveryRunner>({
        run: async () => DISCOVERY_RESULT,
        getChainId: () => ChainId.ARBITRUM,
        getBlockNumber: async () => BLOCK_NUMBER,
      })

      const runners = [discoveryRunnerEth, discoveryRunnerArb]

      const configReader = mockObject<ConfigReader>({
        readDiscovery: async () => ({
          ...mockProject,
          contracts: COMMITTED,
        }),

        readAllConfigsForChain: async (chainId: ChainId) => {
          return [mockConfig(PROJECT_A, chainId)]
        },
      })

      const repository = mockObject<UpdateMonitorRepository>({
        findLatest: async () => undefined,
        addOrUpdate: async () => '',
      })
      const timestamp = new UnixTime(0)

      const updateMonitor = new UpdateMonitor(
        runners,
        updateNotifier,
        configReader,
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
        0,
      )

      await updateMonitor.update(timestamp)

      // gets block number
      expect(discoveryRunnerEth.getBlockNumber).toHaveBeenCalledTimes(1)
      expect(discoveryRunnerArb.getBlockNumber).toHaveBeenCalledTimes(1)

      // reads all the configs
      expect(configReader.readAllConfigsForChain).toHaveBeenCalledTimes(4)
      expect(configReader.readAllConfigsForChain).toHaveBeenNthCalledWith(
        1,
        ChainId.ETHEREUM,
      )

      expect(configReader.readAllConfigsForChain).toHaveBeenNthCalledWith(
        2,
        ChainId.ARBITRUM,
      )

      // runs discovery for every project
      expect(discoveryRunnerEth.run).toHaveBeenCalledTimes(1)
      expect(discoveryRunnerEth.run).toHaveBeenCalledTimes(1)

      expect(updateNotifier.sendDailyReminder).toHaveBeenCalledTimes(1)
      expect(updateNotifier.sendDailyReminder).toHaveBeenCalledWith(
        {
          ['project-a']: [ChainId.ETHEREUM, ChainId.ARBITRUM],
        },
        timestamp,
      )
    })
  })

  describe(UpdateMonitor.prototype.updateChain.name, () => {
    it('iterates over projects and finds diff', async () => {
      const configReader = mockObject<ConfigReader>({
        readDiscovery: async () => ({
          ...mockProject,
          contracts: COMMITTED,
        }),

        readAllConfigsForChain: async () => [
          mockConfig(PROJECT_A),
          mockConfig(PROJECT_B),
        ],
      })

      const repository = mockObject<UpdateMonitorRepository>({
        findLatest: async () => undefined,
        addOrUpdate: async () => '',
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        updateNotifier,
        configReader,
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
        0,
      )
      await updateMonitor.updateChain(discoveryRunner, TIMESTAMP)

      // gets block number
      expect(discoveryRunner.getBlockNumber).toHaveBeenCalledTimes(1)
      // reads all the configs
      expect(configReader.readAllConfigsForChain).toHaveBeenCalledTimes(1)
      // runs discovery for every project
      expect(discoveryRunner.run).toHaveBeenCalledTimes(2)
      expect(discoveryRunner.run).toHaveBeenNthCalledWith(
        1,
        mockConfig(PROJECT_A),
        BLOCK_NUMBER,
        OPTIONS,
      )
      expect(discoveryRunner.run).toHaveBeenNthCalledWith(
        2,
        mockConfig(PROJECT_B),
        BLOCK_NUMBER,
        OPTIONS,
      )
      // calls repository (and gets undefined)
      expect(repository.findLatest).toHaveBeenCalledTimes(2)
      // reads committed discovery.json, 2 + 2 for findUnresolvedProjects() + 2 for findUnknown contracts()
      // and + 2 for finding unverifiedContracts
      expect(configReader.readDiscovery).toHaveBeenCalledTimes(3 * 2)
      // saves discovery result
      expect(repository.addOrUpdate).toHaveBeenCalledTimes(2)
      //sends notification
      expect(updateNotifier.handleUpdate).toHaveBeenCalledTimes(2)
      expect(updateNotifier.handleUpdate).toHaveBeenNthCalledWith(
        1,
        PROJECT_A,
        mockDiff,
        UPDATE_METADATA,
      )
      expect(updateNotifier.handleUpdate).toHaveBeenNthCalledWith(
        2,
        PROJECT_B,
        mockDiff,
        UPDATE_METADATA,
      )
    })

    it('does not send notification about the same change', async () => {
      const configReader = mockObject<ConfigReader>({
        readAllConfigsForChain: async () => [mockConfig(PROJECT_A)],
        readDiscovery: async () => ({ ...mockProject, contracts: [] }),
      })

      const repository = mockObject<UpdateMonitorRepository>({
        findLatest: async () => ({
          ...mockRecord,
          discovery: DISCOVERY_RESULT,
          configHash: mockConfig(PROJECT_A).hash,
        }),
        addOrUpdate: async () => '',
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        updateNotifier,
        configReader,
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
        0,
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
      expect(discoveryRunner.run).toHaveBeenCalledTimes(1)
      // does not send a notification
      expect(updateNotifier.handleUpdate).toHaveBeenCalledTimes(0)
    })

    it('does not send notification if discovery throws', async () => {
      const configReader = mockObject<ConfigReader>({
        readAllConfigsForChain: async () => [mockConfig(PROJECT_A)],
        readDiscovery: async () => ({ ...mockProject, contracts: [] }),
      })

      const repository = mockObject<UpdateMonitorRepository>({
        findLatest: async () => ({
          ...mockRecord,
          discovery: DISCOVERY_RESULT,
          configHash: mockConfig(PROJECT_A).hash,
        }),
        addOrUpdate: async () => '',
      })

      const discoveryRunner = mockObject<DiscoveryRunner>({
        run: mockFn().throws('Error'),
        getChainId: () => ChainId.ETHEREUM,
        getBlockNumber: async () => BLOCK_NUMBER,
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        updateNotifier,
        configReader,
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
        0,
      )

      await updateMonitor.updateChain(discoveryRunner, new UnixTime(0))

      // send notification about the error of discovery
      expect(updateNotifier.handleUpdate).toHaveBeenCalledTimes(0)
    })

    it('uses discovery on previous block number if version changes', async () => {
      const config = mockConfig(PROJECT_A)

      const configReader = mockObject<ConfigReader>({
        readAllConfigsForChain: async () => [config],
        readDiscovery: async () => ({
          ...mockProject,
          blockNumber: BLOCK_NUMBER - 1,
          contracts: [],
          version: 0,
        }),
      })

      const repository = mockObject<UpdateMonitorRepository>({
        findLatest: async () => ({
          ...mockRecord,
          discovery: { ...DISCOVERY_RESULT, blockNumber: BLOCK_NUMBER - 1 },
          configHash: config.hash,
          blockNumber: BLOCK_NUMBER - 1,
        }),
        addOrUpdate: async () => '',
      })

      const discoveryRunner = mockObject<DiscoveryRunner>({
        run: mockFn(),
        getChainId: () => ChainId.ETHEREUM,
        getBlockNumber: async () => BLOCK_NUMBER,
      })

      discoveryRunner.run.resolvesToOnce({ ...DISCOVERY_RESULT, version: 1 })
      discoveryRunner.run.resolvesToOnce({
        ...DISCOVERY_RESULT,
        contracts: [],
        version: 1,
      })
      discoveryRunner.run.resolvesToOnce({
        ...DISCOVERY_RESULT,
        contracts: [],
        version: 1,
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        updateNotifier,
        configReader,
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
        1,
      )

      await updateMonitor.updateChain(discoveryRunner, new UnixTime(0))

      expect(discoveryRunner.run).toHaveBeenCalledTimes(2)
      expect(discoveryRunner.run).toHaveBeenNthCalledWith(
        1,
        config,
        BLOCK_NUMBER - 1,
        OPTIONS,
      )
      expect(discoveryRunner.run).toHaveBeenNthCalledWith(
        2,
        config,
        BLOCK_NUMBER,
        OPTIONS,
      )
      expect(updateNotifier.handleUpdate).toHaveBeenCalledTimes(1)
      expect(repository.addOrUpdate).toHaveBeenCalledTimes(1)
    })

    it('handles error', async () => {
      const configReader = mockObject<ConfigReader>({
        readAllConfigsForChain: async () => [mockConfig(PROJECT_A)],
        readDiscovery: async () => ({ ...mockProject, contracts: [] }),
      })

      const discoveryRunner = mockObject<DiscoveryRunner>({
        run: async () => {
          throw new Error('error')
        },
        getChainId: () => ChainId.ETHEREUM,
        getBlockNumber: async () => BLOCK_NUMBER,
      })

      const repository = mockObject<UpdateMonitorRepository>({
        findLatest: async () => undefined,
        addOrUpdate: async () => '',
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        updateNotifier,
        configReader,
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
        0,
      )

      await updateMonitor.updateChain(discoveryRunner, new UnixTime(0))

      // gets block number
      expect(discoveryRunner.getBlockNumber).toHaveBeenCalledTimes(1)
      // reads all the configs
      expect(configReader.readAllConfigsForChain).toHaveBeenCalledTimes(1)
      // gets latest from database (with the same config hash)
      expect(repository.findLatest).toHaveBeenCalledTimes(1)
      // does not save changes to database
      expect(repository.addOrUpdate).toHaveBeenCalledTimes(0)
      // does not send a notification
      expect(updateNotifier.handleUpdate).toHaveBeenCalledTimes(0)
    })
  })

  describe(UpdateMonitor.prototype.getPreviousDiscovery.name, () => {
    it('gets committed file', async () => {
      const committed: DiscoveryOutput = {
        ...mockProject,
        contracts: COMMITTED,
      }
      const configReader = mockObject<ConfigReader>({
        readDiscovery: async () => committed,
      })

      const repository = mockObject<UpdateMonitorRepository>({
        findLatest: async () => undefined,
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        mockObject<UpdateNotifier>(),
        configReader,
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
        0,
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
        ChainId.ETHEREUM,
      )
      expect(result).toEqual(committed)
    })

    it('gets repository entry', async () => {
      const dbEntry = {
        ...mockRecord,
        discovery: { ...mockProject, contracts: COMMITTED },
        configHash: mockConfig(PROJECT_A).hash,
      }

      const repository = mockObject<UpdateMonitorRepository>({
        findLatest: async () => dbEntry,
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        mockObject<UpdateNotifier>(),
        mockObject<ConfigReader>(),
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
        0,
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

      const configReader = mockObject<ConfigReader>({
        readDiscovery: async () => committed,
      })

      const repository = mockObject<UpdateMonitorRepository>({
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
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
        0,
      )

      const result = await updateMonitor.getPreviousDiscovery(
        discoveryRunner,
        // different config hash
        new DiscoveryConfig({
          name: PROJECT_A,
          chain: ChainId.ETHEREUM,
          initialAddresses: [EthereumAddress.ZERO],
        }),
      )

      expect(result).toEqual(committed)
    })

    it('with version mismatch runs discovery with previous block number', async () => {
      const dbEntry = COMMITTED

      const repository = mockObject<UpdateMonitorRepository>({
        findLatest: async () => ({
          ...mockRecord,
          discovery: {
            ...mockProject,
            contracts: dbEntry,
            blockNumber: BLOCK_NUMBER - 1,
          },
          configHash: mockConfig(PROJECT_A).hash,
          version: 0,
        }),
      })

      const discoveryRunner = mockObject<DiscoveryRunner>({
        run: async () => mockProject,
        getChainId: () => ChainId.ETHEREUM,
        getBlockNumber: async () => BLOCK_NUMBER,
      })

      const updateMonitor = new UpdateMonitor(
        [discoveryRunner],
        mockObject<UpdateNotifier>(),
        mockObject<ConfigReader>(),
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
        1,
      )

      await updateMonitor.getPreviousDiscovery(
        discoveryRunner,
        mockConfig(PROJECT_A),
      )

      expect(discoveryRunner.run).toHaveBeenCalledTimes(1)
      expect(discoveryRunner.run).toHaveBeenCalledWith(
        mockConfig(PROJECT_A),
        BLOCK_NUMBER - 1,
        OPTIONS,
      )
    })
  })

  describe(UpdateMonitor.prototype.generateDailyReminder.name, () => {
    it('does not cross-contaminate between chains', async () => {
      const discoveryRunnerEth = discoveryRunner
      const discoveryRunnerArb = mockObject<DiscoveryRunner>({
        run: async () => DISCOVERY_RESULT_ARB_2,
        getChainId: () => ChainId.ARBITRUM,
        getBlockNumber: async () => BLOCK_NUMBER,
      })

      const runners = [discoveryRunnerEth, discoveryRunnerArb]

      const timestamp = new UnixTime(0)
      const repository = mockObject<UpdateMonitorRepository>({
        findLatest: async () => undefined,
        addOrUpdate: async () => '',
      })
      const configReader = mockObject<ConfigReader>({
        readDiscovery: async (name: string, chainId: ChainId) => {
          if (name === PROJECT_B && chainId === ChainId.ETHEREUM) {
            return DISCOVERY_RESULT_ETH_2
          }
          if (name === PROJECT_A && chainId === ChainId.ARBITRUM) {
            return DISCOVERY_RESULT
          }

          return {
            ...mockProject,
            contracts: COMMITTED,
          }
        },

        readAllConfigsForChain: async (chainId: ChainId) => {
          if (chainId === ChainId.ARBITRUM) {
            return [mockConfig(PROJECT_B, chainId)]
          }

          return [
            mockConfig(PROJECT_A, chainId),
            mockConfig(PROJECT_B, chainId),
          ]
        },
      })
      const updateMonitor = new UpdateMonitor(
        runners,
        updateNotifier,
        configReader,
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
        0,
      )

      await updateMonitor.update(timestamp)
      const result = await updateMonitor.generateDailyReminder()

      expect(Object.entries(result).length).toEqual(runners.length)
      expect(result).toEqual({
        [PROJECT_A]: [ChainId.ETHEREUM],
        [PROJECT_B]: [ChainId.ARBITRUM],
      })
    })

    it('generates the daily reminder for two different chains', async () => {
      const discoveryRunnerEth = discoveryRunner
      const discoveryRunnerArb = mockObject<DiscoveryRunner>({
        run: async () => DISCOVERY_RESULT,
        getChainId: () => ChainId.ARBITRUM,
        getBlockNumber: async () => BLOCK_NUMBER,
      })

      const runners = [discoveryRunnerEth, discoveryRunnerArb]

      const timestamp = new UnixTime(0)
      const repository = mockObject<UpdateMonitorRepository>({
        findLatest: async () => undefined,
        addOrUpdate: async () => '',
      })
      const configReader = mockObject<ConfigReader>({
        readDiscovery: async () => ({
          ...mockProject,
          contracts: COMMITTED,
        }),

        readAllConfigsForChain: async (chainId: ChainId) => {
          return [mockConfig(PROJECT_A, chainId)]
        },
      })
      const updateMonitor = new UpdateMonitor(
        runners,
        updateNotifier,
        configReader,
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
        0,
      )

      await updateMonitor.update(timestamp)
      const result = await updateMonitor.generateDailyReminder()

      expect(Object.entries(result).length).toEqual(1)
      expect(result[PROJECT_A].length).toEqual(2)
      expect(result).toEqual({
        [PROJECT_A]: [ChainId.ETHEREUM, ChainId.ARBITRUM],
      })
    })

    it('does nothing for an empty cache', async () => {
      const timestamp = new UnixTime(0)
      const repository = mockObject<UpdateMonitorRepository>({
        findLatest: async () => undefined,
        addOrUpdate: async () => '',
      })
      const configReader = mockObject<ConfigReader>({
        readDiscovery: async () => ({
          ...mockProject,
          contracts: COMMITTED,
        }),

        readAllConfigsForChain: async (chainId: ChainId) => {
          return [mockConfig(PROJECT_A, chainId)]
        },
      })

      const updateMonitor = new UpdateMonitor(
        [],
        updateNotifier,
        configReader,
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
        0,
      )

      await updateMonitor.update(timestamp)
      const result = await updateMonitor.generateDailyReminder()

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
  version: 0,
}

const mockProject: DiscoveryOutput = {
  name: PROJECT_A,
  chain: ChainId.getName(ChainId.ETHEREUM),
  blockNumber: BLOCK_NUMBER,
  configHash: Hash256.random(),
  contracts: COMMITTED,
  eoas: [],
  abis: {},
  version: 0,
}

function mockContract(
  name: string,
  address: EthereumAddress,
): ContractParameters {
  return {
    name,
    address,
    upgradeability: {
      type: 'immutable',
    },
  }
}

function mockConfig(name: string, chainId = ChainId.ETHEREUM): DiscoveryConfig {
  return new DiscoveryConfig({
    name,
    chain: chainId,
    initialAddresses: [],
  })
}

const mockDiff: DiscoveryDiff[] = [
  {
    address: ADDRESS_A,
    name: NAME_A,
    diff: [
      {
        key: 'values.a',
        before: 'true',
        after: 'false',
      },
    ],
  },
]

const OPTIONS: DiscoveryRunnerOptions = {
  logger: Logger.SILENT.for('UpdateMonitor'),
  runSanityCheck: true,
  injectInitialAddresses: true,
}

const UPDATE_METADATA: UpdateMetadata = {
  unknownContracts: [],
  blockNumber: BLOCK_NUMBER,
  dependents: [],
  chainId: ChainId.ETHEREUM,
}
