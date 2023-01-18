import { Logger, MainnetEtherscanClient, mock } from '@l2beat/common'
import { EthereumAddress } from '@l2beat/types'
import { expect, mockFn } from 'earljs'
import { providers } from 'ethers'

import { DiscordClient } from '../peripherals/discord/DiscordClient'
import { Clock } from './Clock'
import { ConfigReader } from './discovery/ConfigReader'
import { DiscoveryLogger } from './discovery/DiscoveryLogger'
import { prepareDiscoveryFile } from './discovery/saveDiscoveryResult'
import { ContractParameters, ContractValue } from './discovery/types'
import { diffDiscovery } from './discovery/utils/diffDiscovery'
import { diffToMessage } from './discovery/utils/diffToMessage'
import { DiscoveryWatcher } from './DiscoveryWatcher'

const CONTRACT_NAME = 'contract'
const ADDRESS = EthereumAddress.random()

const mockContract = (
  values: Record<string, ContractValue>,
): ContractParameters => {
  return {
    name: CONTRACT_NAME,
    address: ADDRESS,
    upgradeability: {
      type: 'immutable',
    },
    values,
  }
}

const COMMITTED = mockContract({ a: true, b: true })
const DISCOVERED = {
  ...mockContract({ a: true, b: false }),
  meta: {
    isEOA: false,
    verified: true,
    implementationVerified: true,
    abi: [],
    abis: {},
  },
}

describe(DiscoveryWatcher.name, () => {
  const discordClient = mock<DiscordClient>({
    sendMessage: mockFn().resolvesTo({}),
  })
  const configReader = mock<ConfigReader>({
    readDiscovery: mockFn().resolvesTo({
      contracts: [COMMITTED],
    }),
  })

  describe(DiscoveryWatcher.prototype.compareWithCommitted.name, () => {
    it('works', async () => {
      const discoveryWatcher = new DiscoveryWatcher(
        mock<providers.AlchemyProvider>({}),
        mock<MainnetEtherscanClient>({}),
        discordClient,
        configReader,
        mock<Clock>({}),
        Logger.SILENT,
        DiscoveryLogger.SILENT,
      )

      const name = 'project'

      await discoveryWatcher.compareWithCommitted(name, [DISCOVERED], {})

      expect(configReader.readDiscovery).toHaveBeenCalledExactlyWith([[name]])

      const expectedMessage = diffToMessage(
        name,
        diffDiscovery(
          [COMMITTED],
          [prepareDiscoveryFile([DISCOVERED]).contracts[0]],
          {},
        ),
      )
      expect(discordClient.sendMessage).toHaveBeenCalledExactlyWith([
        [expectedMessage[0]],
      ])
    })
  })
})
