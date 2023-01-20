import { Logger, mock } from '@l2beat/common'
import { EthereumAddress } from '@l2beat/types'
import { expect, mockFn } from 'earljs'
import { providers } from 'ethers'

import { DiscordClient } from '../peripherals/discord/DiscordClient'
import { Clock } from './Clock'
import { AnalyzedData } from './discovery/analyzeItem'
import { ConfigReader } from './discovery/ConfigReader'
import { DiscoveryEngine } from './discovery/DiscoveryEngine'
import {
  parseDiscoveryOutput, prepareDiscoveryFile,
} from './discovery/saveDiscoveryResult'
import { ContractParameters, ContractValue } from './discovery/types'
import { diffDiscovery } from './discovery/utils/diffDiscovery'
import { diffToMessages } from './discovery/utils/diffToMessages'
import { DiscoveryWatcher } from './DiscoveryWatcher'

const CONTRACT_NAME = 'contract'
const ADDRESS = EthereumAddress.random()
const name = 'project'

const mockContract: ContractParameters = {
  name: CONTRACT_NAME,
  address: ADDRESS,
  code: '',
  upgradeability: {
    type: 'immutable',
  },
}

const COMMITTED: ContractParameters = {
  ...mockContract,
  values: { a: true, b: true },
}
const DISCOVERED: AnalyzedData = {
  ...mockContract,
  values: { a: true, b: false },
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

const expectedMessage = diffToMessages(
  name,
  [
    {
      address: ADDRESS,
      name: CONTRACT_NAME,
      diff: [
        {
          key: 'values.b',
          before: 'true',
          after: 'false'
        }
      ]
    }
  ]
)

describe(DiscoveryWatcher.name, () => {
  describe(DiscoveryWatcher.prototype.update.name, () => {
    it('runs discovery and finds diff', async () => {
      const discordClient = mock<DiscordClient>({
        sendMessage: mockFn().resolvesTo({}),
      })

      const configReader = mock<ConfigReader>({
        readDiscovery: mockFn().resolvesTo({
          contracts: [COMMITTED],
        }),
        readAllConfigs: mockFn().resolvesTo([
          {
            name,
          },
        ]),
      })

      const discoveryEngine = mock<DiscoveryEngine>({
        run: mockFn().resolvesTo([DISCOVERED]),
      })

      const provider = mock<providers.AlchemyProvider>({
        getBlockNumber: mockFn().resolvesTo(1),
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

      expect(configReader.readAllConfigs).toHaveBeenCalledExactlyWith([[]])
      expect(configReader.readDiscovery).toHaveBeenCalledExactlyWith([[name]])

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
          contracts: [COMMITTED],
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

      await discoveryWatcher.compareWithCommitted(name, [DISCOVERED], {})

      expect(configReader.readDiscovery).toHaveBeenCalledExactlyWith([[name]])

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
        contracts: [COMMITTED],
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
