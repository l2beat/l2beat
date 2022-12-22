import { HttpClient, Logger, MainnetEtherscanClient } from '@l2beat/common'
import { providers } from 'ethers'

import { Config } from '../../config'
import { ConfigReader } from '../../core/discovery/ConfigReader'
import { runDiscovery } from '../../core/discovery/runDiscovery'
import { runWatchMode } from '../../core/discovery/runWatchMode'
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

  const configReader = new ConfigReader()

  // we alias to prevent typescript from thinking it can change
  const discoveryConfig = config.discovery

  const start = async () => {
    logger = logger.for('DiscoveryModule')
    logger.info('Starting', {
      mode: discoveryConfig.watchMode ? 'watchmode' : 'discovery',
    })

    if (!discoveryConfig.watchMode) {
      await runDiscovery(
        provider,
        etherscanClient,
        configReader,
        discoveryConfig,
      )
    } else {
      await runWatchMode(
        provider,
        etherscanClient,
        configReader,
        discoveryConfig,
      )
    }
  }

  return {
    routers: [],
    start,
  }
}
