import {
  AddressAnalyzer,
  HttpClient,
  MainnetEtherscanClient,
} from '@l2beat/common'
import { providers } from 'ethers'

import { Config } from '../../config'
import { ConfigReader } from '../../core/discovery/ConfigReader'
import { DiscoveryEngine } from '../../core/discovery/DiscoveryEngine'
import { DiscoveryOptions } from '../../core/discovery/DiscoveryOptions'
import { ApplicationModule } from '../ApplicationModule'

export function createDiscoveryModule(
  config: Config,
  project: string,
): ApplicationModule | undefined {
  if (!config.discovery) {
    return
  }

  const provider = new providers.AlchemyProvider(
    'mainnet',
    config.discovery.alchemyApiKey,
  )
  const httpClient = new HttpClient()
  const etherscanClient = new MainnetEtherscanClient(
    httpClient,
    config.discovery.etherscanApiKey,
  )
  const addressAnalyzer = new AddressAnalyzer(provider, etherscanClient)
  const discoveryEngine = new DiscoveryEngine(provider, addressAnalyzer)

  const configReader = new ConfigReader()
  const configBlockNumber = config.discovery.blockNumber

  const start = async () => {
    const projectConfig = await configReader.readConfig(project)
    const overrides = projectConfig.overrides ?? {}
    const blockNumber = configBlockNumber ?? (await provider.getBlockNumber())
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

  return {
    routers: [],
    start,
  }
}
