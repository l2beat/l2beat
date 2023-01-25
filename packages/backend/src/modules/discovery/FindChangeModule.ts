import { HttpClient, Logger, MainnetEtherscanClient } from '@l2beat/common'
import { providers } from 'ethers'

import { Config } from '../../config'
import { ConfigReader } from '../../core/discovery/ConfigReader'
import { findChange } from '../../core/discovery/findChange'
import { ApplicationModule } from '../ApplicationModule'

export function createDiscoveryFindChangeModule(
  config: Config,
  logger: Logger,
  http: HttpClient,
): ApplicationModule | undefined {
  if (!config.discoveryFindChange) {
    return
  }

  const provider = new providers.AlchemyProvider(
    'mainnet',
    config.discoveryFindChange.alchemyApiKey,
  )
  const etherscanClient = new MainnetEtherscanClient(
    http,
    config.discoveryFindChange.etherscanApiKey,
  )

  const configReader = new ConfigReader()

  // we alias to prevent typescript from thinking it can change
  const safeConfig = config.discoveryFindChange

  const start = async () => {
    logger = logger.for('DiscoveryDetectChangeModule')
    logger.info('Starting')

    await findChange(provider, etherscanClient, configReader, safeConfig)
  }

  return {
    routers: [],
    start,
  }
}
