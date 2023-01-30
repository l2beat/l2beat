import { providers } from 'ethers'

import { DiscoveryController } from '../../api/controllers/DiscoveryController'
import { createDiscoveryRouter } from '../../api/routers/DiscoveryRouter'
import { Config } from '../../config'
import { ConfigReader } from '../../core/discovery/ConfigReader'
import { DiscoveryLogger } from '../../core/discovery/DiscoveryLogger'
import { MainnetEtherscanClient } from '../../peripherals/etherscan/MainnetEtherscanClient'
import { HttpClient } from '../../peripherals/HttpClient'
import { Logger } from '../../tools/Logger'
import { ApplicationModule } from '../ApplicationModule'

export function createDiscoveryApiModule(
  config: Config,
  logger: Logger,
  http: HttpClient,
): ApplicationModule | undefined {
  if (!config.discoveryApi) {
    return
  }

  const ethereumProvider = new providers.AlchemyProvider(
    'mainnet',
    config.discoveryApi.alchemyApiKey,
  )
  const etherscanClient = new MainnetEtherscanClient(
    http,
    config.discoveryApi.etherscanApiKey,
  )
  const discoveryLogger = new DiscoveryLogger({ enabled: true })

  const configReader = new ConfigReader()

  const discoveryController = new DiscoveryController(
    logger,
    ethereumProvider,
    etherscanClient,
    discoveryLogger,
    configReader,
  )
  const discoveryRouter = createDiscoveryRouter(discoveryController)

  const start = () => {
    logger = logger.for('DiscoveryModule')
    logger.info('Starting')
  }

  return {
    routers: [discoveryRouter],
    start,
  }
}
