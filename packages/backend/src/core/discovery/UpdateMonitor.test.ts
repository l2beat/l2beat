import {
  ContractParameters,
  DiscoveryOutput,
  EthereumAddress,
  Hash256,
  Logger,
  UnixTime,
} from '@l2beat/shared'
import { expect, mockFn, mockObject } from 'earl'
import { providers } from 'ethers'

import {
  UpdateMonitorRecord,
  UpdateMonitorRepository,
} from '../../peripherals/database/discovery/UpdateMonitorRepository'
import { Clock } from '../Clock'
import { ConfigReader } from './config/ConfigReader'
import { DiscoveryConfig } from './config/DiscoveryConfig'
import { DiscoveryRunner } from './DiscoveryRunner'
import { NotificationManager } from './NotificationManager'
import { diffDiscovery, DiscoveryDiff } from './output/diffDiscovery'
import { UpdateMonitor } from './UpdateMonitor'

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
}

describe(UpdateMonitor.name, () => {
  let notificationManager = mockObject<NotificationManager>({})
  let discoveryRunner = mockObject<DiscoveryRunner>({})
  let provider = mockObject<providers.AlchemyProvider>({})

  beforeEach(() => {
    notificationManager = mockObject<NotificationManager>({
      handleDiff: async () => {},
      handleUnresolved: async () => {},
    })
    discoveryRunner = mockObject<DiscoveryRunner>({
      run: async () => DISCOVERY_RESULT,
    })
    provider = mockObject<providers.AlchemyProvider>({
      getBlockNumber: async () => BLOCK_NUMBER,
    })
  })

  describe(UpdateMonitor.prototype.update.name, () => {
    it('iterates over projects and finds diff', async () => {
      const configReader = mockObject<ConfigReader>({
        readDiscovery: async () => ({
          ...mockProject,
          contracts: COMMITTED,
        }),

        readAllConfigs: async () => [
          mockConfig(PROJECT_A),
          mockConfig(PROJECT_B),
        ],
      })

      const repository = mockObject<UpdateMonitorRepository>({
        findLatest: async () => undefined,
        addOrUpdate: async () => '',
      })

      const updateMonitor = new UpdateMonitor(
        provider,
        discoveryRunner,
        notificationManager,
        configReader,
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
      )
      await updateMonitor.update(TIMESTAMP)

      // gets block number
      expect(provider.getBlockNumber).toHaveBeenCalledTimes(1)
      // reads all the configs
      expect(configReader.readAllConfigs).toHaveBeenCalledTimes(1)
      // runs discovery for every project + sanity check
      expect(discoveryRunner.run).toHaveBeenCalledTimes(2 * 2)
      expect(discoveryRunner.run).toHaveBeenNthCalledWith(
        1,
        mockConfig(PROJECT_A),
        BLOCK_NUMBER,
      )
      expect(discoveryRunner.run).toHaveBeenNthCalledWith(
        3,
        mockConfig(PROJECT_B),
        BLOCK_NUMBER,
      )
      // calls repository (and gets undefined)
      expect(repository.findLatest).toHaveBeenCalledTimes(2)
      // reads committed discovery.json, 2 + 2 for findUnresolvedProjects()
      expect(configReader.readDiscovery).toHaveBeenCalledTimes(2 * 2)
      expect(configReader.readDiscovery).toHaveBeenNthCalledWith(1, PROJECT_A)
      expect(configReader.readDiscovery).toHaveBeenNthCalledWith(2, PROJECT_B)
      expect(configReader.readDiscovery).toHaveBeenNthCalledWith(1, PROJECT_A)
      expect(configReader.readDiscovery).toHaveBeenNthCalledWith(2, PROJECT_B)
      // saves discovery result
      expect(repository.addOrUpdate).toHaveBeenCalledTimes(2)
      //sends notification
      expect(notificationManager.handleDiff).toHaveBeenCalledTimes(2)
      expect(notificationManager.handleDiff).toHaveBeenNthCalledWith(
        1,
        PROJECT_A,
        [],
        mockDiff,
      )
      expect(notificationManager.handleDiff).toHaveBeenNthCalledWith(
        2,
        PROJECT_B,
        [],
        mockDiff,
      )
      expect(notificationManager.handleUnresolved).toHaveBeenCalledTimes(1)
      expect(notificationManager.handleUnresolved).toHaveBeenNthCalledWith(
        1,
        [PROJECT_A, PROJECT_B],
        TIMESTAMP,
      )
    })

    it('does not send notification about the same change', async () => {
      const configReader = mockObject<ConfigReader>({
        readAllConfigs: async () => [mockConfig(PROJECT_A)],
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
        provider,
        discoveryRunner,
        notificationManager,
        configReader,
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
      )

      await updateMonitor.update(new UnixTime(0))

      // gets block number
      expect(provider.getBlockNumber).toHaveBeenCalledTimes(1)
      // reads all the configs
      expect(configReader.readAllConfigs).toHaveBeenCalledTimes(1)
      // gets latest from database (with the same config hash)
      expect(repository.findLatest).toHaveBeenOnlyCalledWith(PROJECT_A)
      // runs discovery
      expect(discoveryRunner.run).toHaveBeenCalledTimes(1)
      // does not send a notification
      expect(notificationManager.handleDiff).toHaveBeenCalledTimes(0)
      expect(notificationManager.handleUnresolved).toHaveBeenCalledTimes(1)
      expect(notificationManager.handleUnresolved).toHaveBeenNthCalledWith(
        1,
        [PROJECT_A],
        TIMESTAMP,
      )
    })

    it('does not send notification if sanity check failed', async () => {
      const configReader = mockObject<ConfigReader>({
        readAllConfigs: async () => [mockConfig(PROJECT_A)],
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
        run: mockFn(),
      })

      discoveryRunner.run.resolvesToOnce({ ...DISCOVERY_RESULT, contracts: [] })
      discoveryRunner.run.resolvesToOnce({ ...DISCOVERY_RESULT })

      const updateMonitor = new UpdateMonitor(
        provider,
        discoveryRunner,
        notificationManager,
        configReader,
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
      )

      await updateMonitor.update(new UnixTime(0))

      // send notification about the error of 3rd party API
      expect(notificationManager.handleDiff).toHaveBeenCalledTimes(0)
      expect(notificationManager.handleUnresolved).toHaveBeenCalledTimes(1)
      expect(notificationManager.handleUnresolved).toHaveBeenNthCalledWith(
        1,
        [],
        TIMESTAMP,
      )
    })

    it('handles error', async () => {
      const configReader = mockObject<ConfigReader>({
        readAllConfigs: async () => [mockConfig(PROJECT_A)],
        readDiscovery: async () => ({ ...mockProject, contracts: [] }),
      })

      const discoveryRunner = mockObject<DiscoveryRunner>({
        run: async () => {
          throw new Error('error')
        },
      })

      const repository = mockObject<UpdateMonitorRepository>({
        findLatest: async () => undefined,
        addOrUpdate: async () => '',
      })

      const updateMonitor = new UpdateMonitor(
        provider,
        discoveryRunner,
        notificationManager,
        configReader,
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
      )

      await updateMonitor.update(new UnixTime(0))

      // gets block number
      expect(provider.getBlockNumber).toHaveBeenCalledTimes(1)
      // reads all the configs
      expect(configReader.readAllConfigs).toHaveBeenCalledTimes(1)
      // gets latest from database (with the same config hash)
      expect(repository.findLatest).toHaveBeenCalledTimes(0)
      // does not save changes to database
      expect(repository.addOrUpdate).toHaveBeenCalledTimes(0)
      // does not send a notification
      expect(notificationManager.handleDiff).toHaveBeenCalledTimes(0)
      expect(notificationManager.handleUnresolved).toHaveBeenCalledTimes(1)
      expect(notificationManager.handleUnresolved).toHaveBeenNthCalledWith(
        1,
        [],
        TIMESTAMP,
      )
    })
  })

  describe(UpdateMonitor.prototype.findChanges.name, () => {
    it('finds difference from committed file', async () => {
      const configReader = mockObject<ConfigReader>({
        readDiscovery: async () => ({
          ...mockProject,
          contracts: COMMITTED,
        }),
      })

      const repository = mockObject<UpdateMonitorRepository>({
        findLatest: async () => undefined,
      })

      const updateMonitor = new UpdateMonitor(
        mockObject<providers.AlchemyProvider>(),
        mockObject<DiscoveryRunner>(),
        mockObject<NotificationManager>(),
        configReader,
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
      )

      const result = await updateMonitor.findChanges(
        PROJECT_A,
        DISCOVERY_RESULT,
        // repository returns undefined, so config hash does not matter
        Hash256.random(),
        mockConfig(PROJECT_A),
      )

      // calls repository (and gets undefined)
      expect(repository.findLatest).toHaveBeenCalledTimes(1)
      // reads committed file
      expect(configReader.readDiscovery).toHaveBeenOnlyCalledWith(PROJECT_A)
      // finds difference between committed and discovery result
      expect(result).toEqual(
        diffDiscovery(
          COMMITTED,
          DISCOVERY_RESULT.contracts,
          mockConfig(PROJECT_A),
        ),
      )
    })

    it('finds difference from repository entry', async () => {
      // for the sake of simplicity we reuse the same values
      const dbEntry = COMMITTED

      const configReader = mockObject<ConfigReader>({
        readDiscovery: async () => ({ ...mockProject }),
      })

      const repository = mockObject<UpdateMonitorRepository>({
        findLatest: async () => ({
          ...mockRecord,
          discovery: { ...mockProject, contracts: dbEntry },
          configHash: mockConfig(PROJECT_A).hash,
        }),
      })

      const updateMonitor = new UpdateMonitor(
        mockObject<providers.AlchemyProvider>(),
        mockObject<DiscoveryRunner>(),
        mockObject<NotificationManager>(),
        configReader,
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
      )

      const result = await updateMonitor.findChanges(
        PROJECT_A,
        DISCOVERY_RESULT,
        mockConfig(PROJECT_A).hash,
        mockConfig(PROJECT_A),
      )

      // calls repository
      expect(repository.findLatest).toHaveBeenCalledTimes(1)
      // finds difference between repository and discovery result
      expect(result).toEqual(
        diffDiscovery(
          dbEntry,
          DISCOVERY_RESULT.contracts,
          mockConfig(PROJECT_A),
        ),
      )
    })

    it('takes config hash into consideration', async () => {
      const dbEntry = COMMITTED

      const configReader = mockObject<ConfigReader>({
        readDiscovery: async () => ({
          ...mockProject,
          contracts: DISCOVERY_RESULT.contracts,
        }),
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
        addOrUpdate: async () => '',
      })

      const updateMonitor = new UpdateMonitor(
        mockObject<providers.AlchemyProvider>(),
        mockObject<DiscoveryRunner>(),
        mockObject<NotificationManager>(),
        configReader,
        repository,
        mockObject<Clock>(),
        Logger.SILENT,
        false,
      )

      const result = await updateMonitor.findChanges(
        PROJECT_A,
        {
          ...mockProject,
          contracts: DISCOVERY_RESULT.contracts,
        },
        mockConfig('new-name').hash,
        mockConfig(PROJECT_A),
      )

      expect(result).toEqual([])

      expect(configReader.readDiscovery).toHaveBeenOnlyCalledWith(PROJECT_A)
      expect(repository.findLatest).toHaveBeenCalledTimes(1)
    })
  })
})

const mockRecord: UpdateMonitorRecord = {
  projectName: 'name',
  blockNumber: 1,
  timestamp: UnixTime.now(),
  configHash: Hash256.random(),
  discovery: DISCOVERY_RESULT,
}

const mockProject: DiscoveryOutput = {
  name: PROJECT_A,
  blockNumber: BLOCK_NUMBER,
  configHash: Hash256.random(),
  contracts: COMMITTED,
  eoas: [],
  abis: {},
}

function mockContract(
  name: string,
  address: EthereumAddress,
): ContractParameters {
  return {
    name,
    address,
    code: '',
    upgradeability: {
      type: 'immutable',
    },
  }
}

function mockConfig(name: string): DiscoveryConfig {
  return new DiscoveryConfig({
    name,
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
