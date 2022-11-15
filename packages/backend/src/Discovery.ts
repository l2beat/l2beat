import {
  AddressAnalyzer,
  HttpClient,
  MainnetEtherscanClient,
} from '@l2beat/common'
import { providers } from 'ethers'

import { Config } from './config'
import { ConfigReader } from './core/discovery/ConfigReader'
import { DiscoveryEngine } from './core/discovery/DiscoveryEngine'
import { DiscoveryOptions } from './core/discovery/DiscoveryOptions'

export class Discovery {
  async discover(project: string, config: Config) {
    const provider = new providers.AlchemyProvider(
      'mainnet',
      config.alchemyApiKey,
    )
    const httpClient = new HttpClient()
    const etherscanClient = new MainnetEtherscanClient(
      httpClient,
      config.etherscanApiKey,
    )
    const addressAnalyzer = new AddressAnalyzer(provider, etherscanClient)
    const discoveryEngine = new DiscoveryEngine(provider, addressAnalyzer)

    const configReader = new ConfigReader()
    const projectConfig = await configReader.readConfig(project)
    const overrides = projectConfig.overrides ?? {}

    const blockNumber =
      config.discoveryBlockNumber ?? (await provider.getBlockNumber())
    // Temporary mapping from new config structure to the old one
    const discoveryOptions: DiscoveryOptions = {
      skipAddresses: [],
      skipMethods: {},
      addAbis: {},
      blockNumber,
    }
    Object.keys(overrides).forEach((address) => {
      const ignoreMethods = overrides[address].ignoreMethods
      if (ignoreMethods) {
        discoveryOptions.skipMethods[address] = ignoreMethods
      }
    })
    await discoveryEngine.discover(
      project,
      projectConfig.initialAddresses.map((x) => x.toString()),
      discoveryOptions,
    )
  }
}
