import { HttpClient, Logger, MainnetEtherscanClient } from '@l2beat/common'
import { providers } from 'ethers'

import { Config } from '../../config'
import { ConfigReader } from '../../core/discovery/ConfigReader'
import { DiscoveryEngine } from '../../core/discovery/DiscoveryEngine'
import { DiscoveryOptions } from '../../core/discovery/DiscoveryOptions'
import { DiscoveryProvider } from '../../core/discovery/provider/DiscoveryProvider'
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
  const discoveryEngine = new DiscoveryEngine()

  const configReader = new ConfigReader()

  // we alias to prevent typescript from thinking it can change
  const safeConfig = config.discovery

  const start = async () => {
    logger = logger.for('DiscoveryModule')
    logger.info('Starting')
    const projectConfig = await configReader.readConfig(safeConfig.project)
    const overrides = projectConfig.overrides ?? {}
    // Temporary mapping from new config structure to the old one
    const discoveryOptions: DiscoveryOptions = {
      skipAddresses: [],
      skipMethods: {},
      addAbis: {},
    }
    Object.keys(overrides).forEach((address) => {
      const ignoreMethods = overrides[address].ignoreMethods
      if (ignoreMethods) {
        discoveryOptions.skipMethods[address] = ignoreMethods
      }
    })

    const blockNumber =
      safeConfig.blockNumber ?? (await provider.getBlockNumber())

    const discoveryProvider = new DiscoveryProvider(
      provider,
      etherscanClient,
      blockNumber,
    )
    await discoveryEngine.discover(
      discoveryProvider,
      safeConfig.project,
      projectConfig.initialAddresses,
      discoveryOptions,
    )
  }

  return {
    routers: [],
    start,
  }
}
