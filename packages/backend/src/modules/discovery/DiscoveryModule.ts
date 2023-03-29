import { HttpClient, Logger, MainnetEtherscanClient } from '@l2beat/shared'
import { providers } from 'ethers'

import { DiscoveryModuleConfig } from '../../config/Config'
import { ConfigReader } from '../../core/discovery/ConfigReader'
import { runDiscovery } from '../../core/discovery/runDiscovery'
import { ApplicationModule } from '../ApplicationModule'

export function createDiscoveryModule(
  config: DiscoveryModuleConfig,
  logger: Logger,
  http: HttpClient,
): ApplicationModule | undefined {
  if (!config) {
    logger.info('Discovery module disabled')
    return
  }

  const provider = new providers.AlchemyProvider(
    'mainnet',
    config.alchemyApiKey,
  )
  const etherscanClient = new MainnetEtherscanClient(
    http,
    config.etherscanApiKey,
  )

  const configReader = new ConfigReader()

  const start = async () => {
    logger = logger.for('DiscoveryModule')
    logger.info('Starting')

    await runDiscovery(provider, etherscanClient, configReader, config)
  }

  return {
    routers: [],
    start,
  }
}
