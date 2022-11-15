import {
  AddressAnalyzer,
  HttpClient,
  Logger,
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
  logger: Logger,
  http: HttpClient,
): ApplicationModule | undefined {
  if (!config.discovery) {
    return
  }

  const provider = new providers.AlchemyProvider(
    'mainnet',
    config.discovery.alchemyApiKey,
  )
  const etherscanClient = new MainnetEtherscanClient(
    http,
    config.discovery.etherscanApiKey,
  )
  const addressAnalyzer = new AddressAnalyzer(provider, etherscanClient)
  const discoveryEngine = new DiscoveryEngine(provider, addressAnalyzer)

  const configReader = new ConfigReader()

  // we alias to prevent typescript from thinking it can change
  const safeConfig = config.discovery

  const start = async () => {
    logger = logger.for('DiscoveryModule')
    logger.info('Starting')
    const projectConfig = await configReader.readConfig(safeConfig.project)
    const overrides = projectConfig.overrides ?? {}
    const blockNumber =
      safeConfig.blockNumber ?? (await provider.getBlockNumber())
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
      safeConfig.project,
      projectConfig.initialAddresses.map((x) => x.toString()),
      discoveryOptions,
    )
  }

  return {
    routers: [],
    start,
  }
}
