import {
  EthereumAddress,
  Hash256,
  Logger,
  mock,
  UnixTime,
} from '@l2beat/shared'
import { expect } from 'earljs'
import { providers } from 'ethers'

import {
  DiscoveryWatcherRecord,
  DiscoveryWatcherRepository,
} from '../peripherals/database/discovery/DiscoveryWatcherRepository'
import { DiscordClient } from '../peripherals/discord/DiscordClient'
import { Clock } from './Clock'
import { ConfigReader } from './discovery/ConfigReader'
import { DiscoveryConfig } from './discovery/DiscoveryConfig'
import { DiscoveryEngine } from './discovery/DiscoveryEngine'
import { ContractParameters, ProjectParameters } from './discovery/types'
import { diffDiscovery } from './discovery/utils/diffDiscovery'
import { diffToMessages } from './discovery/utils/diffToMessages'
import { getDiscoveryConfigHash } from './discovery/utils/getDiscoveryConfigHash'
import { DiscoveryWatcher } from './DiscoveryWatcher'

const PROJECT_A = 'project-a'
const PROJECT_B = 'project-b'
const NAME_A = 'contract-a'
const ADDRESS_A = EthereumAddress.random()
const NAME_B = 'contract-b'
const ADDRESS_B = EthereumAddress.random()
const BLOCK_NUMBER = 1

const COMMITTED: ContractParameters[] = [
  {
    ...mockContract(NAME_A, ADDRESS_A),
    values: { a: true },
  },
  mockContract(NAME_B, ADDRESS_B),
]

const DISCOVERY_RESULT: ProjectParameters = {
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

describe(DiscoveryWatcher.name, () => {
  let discordClient = mock<DiscordClient>({})
  let discoveryEngine = mock<DiscoveryEngine>({})
  let provider = mock<providers.AlchemyProvider>({})

  beforeEach(() => {
    discordClient = mock<DiscordClient>({
      sendMessage: async () => {},
    })
    discoveryEngine = mock<DiscoveryEngine>({
      run: async () => DISCOVERY_RESULT,
    })
    provider = mock<providers.AlchemyProvider>({
      getBlockNumber: async () => BLOCK_NUMBER,
    })
  })

  describe(DiscoveryWatcher.prototype.update.name, () => {
    it('iterates over projects and finds diff', async () => {
      const configReader = mock<ConfigReader>({
        readDiscovery: async () => ({
          ...mockProject,
          contracts: COMMITTED,
        }),

        readAllConfigs: async () => [
          mockConfig(PROJECT_A),
          mockConfig(PROJECT_B),
        ],
      })

      const repository = mock<DiscoveryWatcherRepository>({
        findLatest: async () => undefined,
        addOrUpdate: async () => '',
      })

      const discoveryWatcher = new DiscoveryWatcher(
        provider,
        discoveryEngine,
        discordClient,
        configReader,
        repository,
        mock<Clock>(),
        Logger.SILENT,
      )
      await discoveryWatcher.update()

      // gets block number
      expect(provider.getBlockNumber.calls.length).toEqual(1)
      // reads all the configs
      expect(configReader.readAllConfigs.calls.length).toEqual(1)
      // runs discovery for every project
      expect(discoveryEngine.run).toHaveBeenCalledExactlyWith([
        [{ name: PROJECT_A, initialAddresses: [] }, BLOCK_NUMBER],
        [{ name: PROJECT_B, initialAddresses: [] }, BLOCK_NUMBER],
      ])
      // calls repository (and gets undefined)
      expect(repository.findLatest.calls.length).toEqual(2)
      // reads commited discovery.json
      expect(configReader.readDiscovery).toHaveBeenCalledExactlyWith([
        [PROJECT_A],
        [PROJECT_B],
      ])
      // saves discovery result
      expect(repository.addOrUpdate.calls.length).toEqual(2)
      //sends notification
      expect(discordClient.sendMessage).toHaveBeenCalledExactlyWith([
        [mockMessage(PROJECT_A)],
        [mockMessage(PROJECT_B)],
      ])
    })

    it('does not send notification about the same change', async () => {
      const configReader = mock<ConfigReader>({
        readAllConfigs: async () => [mockConfig(PROJECT_A)],
        readDiscovery: async () => ({ ...mockProject, contracts: [] }),
      })

      const discoveryWatcherRepository = mock<DiscoveryWatcherRepository>({
        findLatest: async () => ({
          ...mockRecord,
          discovery: DISCOVERY_RESULT,
          configHash: getDiscoveryConfigHash(mockConfig(PROJECT_A)),
        }),
        addOrUpdate: async () => '',
      })

      const discoveryWatcher = new DiscoveryWatcher(
        provider,
        discoveryEngine,
        discordClient,
        configReader,
        discoveryWatcherRepository,
        mock<Clock>(),
        Logger.SILENT,
      )

      await discoveryWatcher.update()

      // gets block number
      expect(provider.getBlockNumber.calls.length).toEqual(1)
      // reads all the configs
      expect(configReader.readAllConfigs.calls.length).toEqual(1)
      // gets latest from database (with the same config hash)
      expect(discoveryWatcherRepository.findLatest).toHaveBeenCalledExactlyWith(
        [[PROJECT_A]],
      )
      // skips reading committed file
      expect(configReader.readDiscovery.calls.length).toEqual(0)
      // does not send a notification
      expect(discordClient.sendMessage.calls.length).toEqual(0)
    })
  })

  describe(DiscoveryWatcher.prototype.findChanges.name, () => {
    it('finds difference from committed file', async () => {
      const configReader = mock<ConfigReader>({
        readDiscovery: async () => ({
          ...mockProject,
          contracts: COMMITTED,
        }),
      })

      const repository = mock<DiscoveryWatcherRepository>({
        findLatest: async () => undefined,
      })

      const discoveryWatcher = new DiscoveryWatcher(
        mock<providers.AlchemyProvider>(),
        mock<DiscoveryEngine>(),
        mock<DiscordClient>(),
        configReader,
        repository,
        mock<Clock>(),
        Logger.SILENT,
      )

      const result = await discoveryWatcher.findChanges(
        PROJECT_A,
        DISCOVERY_RESULT,
        // repository returns undefined, so config hash does not matter
        Hash256.random(),
        {},
      )

      // calls repository (and gets undefined)
      expect(repository.findLatest.calls.length).toEqual(1)
      // reads committed file
      expect(configReader.readDiscovery).toHaveBeenCalledExactlyWith([
        [PROJECT_A],
      ])
      // finds difference between committed and discovery result
      expect(result).toEqual(
        diffDiscovery(COMMITTED, DISCOVERY_RESULT.contracts, {}),
      )
    })

    it('finds difference from repository entry', async () => {
      // for the sake of simplicity we reuse the same values
      const dbEntry = COMMITTED

      const configReader = mock<ConfigReader>({
        readDiscovery: async () => ({ ...mockProject }),
      })

      const repository = mock<DiscoveryWatcherRepository>({
        findLatest: async () => ({
          ...mockRecord,
          discovery: { ...mockProject, contracts: dbEntry },
          configHash: getDiscoveryConfigHash(mockConfig(PROJECT_A)),
        }),
      })

      const discoveryWatcher = new DiscoveryWatcher(
        mock<providers.AlchemyProvider>(),
        mock<DiscoveryEngine>(),
        mock<DiscordClient>(),
        configReader,
        repository,
        mock<Clock>(),
        Logger.SILENT,
      )

      const result = await discoveryWatcher.findChanges(
        PROJECT_A,
        DISCOVERY_RESULT,
        getDiscoveryConfigHash(mockConfig(PROJECT_A)),
        {},
      )

      // calls repository
      expect(repository.findLatest.calls.length).toEqual(1)
      // skips reading committed file
      expect(configReader.readDiscovery.calls.length).toEqual(0)
      // finds difference between repository and discovery result
      expect(result).toEqual(
        diffDiscovery(dbEntry, DISCOVERY_RESULT.contracts, {}),
      )
    })

    it('takes config hash into consideration', async () => {
      const configReader = mock<ConfigReader>({
        readDiscovery: async () => ({
          ...mockProject,
          contracts: DISCOVERY_RESULT.contracts,
        }),
      })

      const repository = mock<DiscoveryWatcherRepository>({
        findLatest: async () => ({
          ...mockRecord,
          discovery: {
            ...mockProject,
            contracts: COMMITTED,
          },
          configHash: getDiscoveryConfigHash(mockConfig(PROJECT_A)),
        }),
        addOrUpdate: async () => '',
      })

      const discoveryWatcher = new DiscoveryWatcher(
        mock<providers.AlchemyProvider>(),
        mock<DiscoveryEngine>(),
        mock<DiscordClient>(),
        configReader,
        repository,
        mock<Clock>(),
        Logger.SILENT,
      )

      const result = await discoveryWatcher.findChanges(
        PROJECT_A,
        {
          ...mockProject,
          contracts: DISCOVERY_RESULT.contracts,
        },
        getDiscoveryConfigHash({ ...mockConfig(PROJECT_A), name: 'new-name' }),
        {},
      )

      expect(result).toEqual([])

      expect(configReader.readDiscovery).toHaveBeenCalledExactlyWith([
        [PROJECT_A],
      ])
      expect(repository.findLatest.calls.length).toEqual(1)
    })
  })

  describe(DiscoveryWatcher.prototype.notify.name, () => {
    it('sends discord messages', async () => {
      const discoveryWatcher = new DiscoveryWatcher(
        mock<providers.AlchemyProvider>(),
        mock<DiscoveryEngine>(),
        discordClient,
        mock<ConfigReader>(),
        mock<DiscoveryWatcherRepository>({}),
        mock<Clock>(),
        Logger.SILENT,
      )

      const messages = ['a', 'b', 'c']

      await discoveryWatcher.notify(messages)

      expect(discordClient.sendMessage).toHaveBeenCalledExactlyWith([
        ['a'],
        ['b'],
        ['c'],
      ])
    })
  })
})

const mockRecord: DiscoveryWatcherRecord = {
  projectName: 'name',
  blockNumber: 1,
  timestamp: UnixTime.now(),
  configHash: Hash256.random(),
  discovery: DISCOVERY_RESULT,
}

const mockProject: ProjectParameters = {
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
  return {
    name,
    initialAddresses: [],
  }
}

const mockMessage = (project: string): string => {
  return diffToMessages(project, [
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
  ])[0]
}
