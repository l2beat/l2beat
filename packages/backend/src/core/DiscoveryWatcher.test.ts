import { Logger, mock } from '@l2beat/common'
import { EthereumAddress } from '@l2beat/types'
import { expect, mockFn } from 'earljs'
import { providers } from 'ethers'

import { DiscordClient } from '../peripherals/discord/DiscordClient'
import { Clock } from './Clock'
import { AnalyzedData } from './discovery/analyzeItem'
import { ConfigReader } from './discovery/ConfigReader'
import { DiscoveryEngine } from './discovery/DiscoveryEngine'
import { ContractParameters } from './discovery/types'
import { diffToMessages } from './discovery/utils/diffToMessages'
import { DiscoveryWatcher } from './DiscoveryWatcher'

const PROJECT_A = 'project-a'
const PROJECT_B = 'project-b'

const NAME_A = 'contract-a'
const ADDRESS_A = EthereumAddress.random()

const NAME_B = 'contract-b'
const ADDRESS_B = EthereumAddress.random()

const BLOCK_NUMBER = 1

const mockCommitted = (
  name: string,
  address: EthereumAddress,
): ContractParameters => {
  return {
    name,
    address,
    code: '',
    upgradeability: {
      type: 'immutable',
    },
  }
}

const mockDiscovered = (contract: ContractParameters): AnalyzedData => {
  return {
    ...contract,
    unverified: undefined,
    errors: undefined,
    meta: {
      isEOA: false,
      verified: true,
      implementationVerified: true,
      abi: [],
      abis: {},
    },
  }
}

const COMMITTED: ContractParameters[] = [
  {
    ...mockCommitted(NAME_A, ADDRESS_A),
    values: { a: true },
  },
  {
    ...mockCommitted(NAME_B, ADDRESS_B),
  },
]

const DISCOVERED: AnalyzedData[] = [
  {
    ...mockDiscovered(COMMITTED[0]),
    values: { a: false },
  },
  {
    ...mockDiscovered(COMMITTED[1]),
  },
]

const expectedMessage = diffToMessages(PROJECT_A, [
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
])

describe(DiscoveryWatcher.name, () => {
  describe(DiscoveryWatcher.prototype.update.name, () => {
    it('iterates over projects and finds diff', async () => {
      const discordClient = mock<DiscordClient>({
        sendMessage: mockFn().resolvesTo({}),
      })

      const configReader = mock<ConfigReader>({
        readDiscovery: mockFn()
          .resolvesToOnce({
            contracts: COMMITTED,
          })
          .resolvesToOnce({ contracts: [] }),
        readAllConfigs: mockFn().resolvesTo([
          {
            name: PROJECT_A,
            initialAddresses: [],
          },
          {
            name: PROJECT_B,
            initialAddresses: [],
          },
        ]),
      })

      const discoveryEngine = mock<DiscoveryEngine>({
        run: mockFn().resolvesToOnce(DISCOVERED).resolvesToOnce([]),
      })

      const provider = mock<providers.AlchemyProvider>({
        getBlockNumber: mockFn().resolvesTo(BLOCK_NUMBER),
      })

      const discoveryWatcher = new DiscoveryWatcher(
        provider,
        discoveryEngine,
        discordClient,
        configReader,
        mock<Clock>({}),
        Logger.SILENT,
      )

      await discoveryWatcher.update()

      //gets block number
      expect(provider.getBlockNumber.calls.length).toEqual(1)
      //reads all the configs
      expect(configReader.readAllConfigs.calls.length).toEqual(1)
      //iterates over projects
      expect(configReader.readDiscovery).toHaveBeenCalledExactlyWith([
        [PROJECT_A],
        [PROJECT_B],
      ])
      //iterates over projects
      expect(discoveryEngine.run).toHaveBeenCalledExactlyWith([
        [{ name: PROJECT_A, initialAddresses: [] }, BLOCK_NUMBER],
        [{ name: PROJECT_B, initialAddresses: [] }, BLOCK_NUMBER],
      ])
      //sends notification
      expect(discordClient.sendMessage).toHaveBeenCalledExactlyWith([
        [expectedMessage[0]],
      ])
    })
  })

  describe(DiscoveryWatcher.prototype.compareWithCommitted.name, () => {
    it('finds changes and sends discord notification', async () => {
      const discordClient = mock<DiscordClient>({
        sendMessage: mockFn().resolvesTo({}),
      })

      const configReader = mock<ConfigReader>({
        readDiscovery: mockFn().resolvesTo({
          contracts: COMMITTED,
        }),
      })

      const discoveryWatcher = new DiscoveryWatcher(
        mock<providers.AlchemyProvider>({}),
        mock<DiscoveryEngine>({}),
        discordClient,
        configReader,
        mock<Clock>({}),
        Logger.SILENT,
      )

      await discoveryWatcher.compareWithCommitted(PROJECT_A, DISCOVERED, {})

      expect(configReader.readDiscovery).toHaveBeenCalledExactlyWith([
        [PROJECT_A],
      ])

      expect(discordClient.sendMessage).toHaveBeenCalledExactlyWith([
        [expectedMessage[0]],
      ])
    })
  })

  describe(DiscoveryWatcher.prototype.notify.name, () => {
    const discordClient = mock<DiscordClient>({
      sendMessage: mockFn().resolvesTo({}),
    })

    const configReader = mock<ConfigReader>({
      readDiscovery: mockFn().resolvesTo({
        contracts: COMMITTED,
      }),
    })

    const discoveryWatcher = new DiscoveryWatcher(
      mock<providers.AlchemyProvider>({}),
      mock<DiscoveryEngine>({}),
      discordClient,
      configReader,
      mock<Clock>({}),
      Logger.SILENT,
    )

    it('sends discord messages', async () => {
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
