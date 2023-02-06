import { HttpClient, Logger, MainnetEtherscanClient } from '@l2beat/shared'
import { providers } from 'ethers'

import { Config } from '../../config'
import { Clock } from '../../core/Clock'
import { ConfigReader } from '../../core/discovery/ConfigReader'
import { DiscoveryEngine } from '../../core/discovery/DiscoveryEngine'
import { DiscoveryLogger } from '../../core/discovery/DiscoveryLogger'
import { DiscoveryWatcher } from '../../core/DiscoveryWatcher'
import { Metrics } from '../../Metrics'
import { DiscoveryWatcherRepository } from '../../peripherals/database/discovery/DiscoveryWatcherRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { DiscordClient } from '../../peripherals/discord/DiscordClient'
import { ApplicationModule } from '../ApplicationModule'

export function createDiscoveryWatcherModule(
  config: Config,
  logger: Logger,
  http: HttpClient,
  database: Database,
  clock: Clock,
  metrics: Metrics,
): ApplicationModule | undefined {
  if (!config.discoveryWatcher) {
    return
  }

  const provider = new providers.AlchemyProvider(
    'mainnet',
    config.discoveryWatcher.alchemyApiKey,
  )
  const etherscanClient = new MainnetEtherscanClient(
    http,
    config.discoveryWatcher.etherscanApiKey,
  )

  const discordClient = config.discoveryWatcher.discord
    ? new DiscordClient(
        http,
        config.discoveryWatcher.discord.token,
        config.discoveryWatcher.discord.channelId,
      )
    : undefined

  const configReader = new ConfigReader()

  const discoveryWatcherRepository = new DiscoveryWatcherRepository(
    database,
    logger,
    metrics,
  )

  const discoveryLogger = DiscoveryLogger.SILENT

  const discoveryEngine = new DiscoveryEngine(
    provider,
    etherscanClient,
    discoveryLogger,
  )

  const discoveryWatcher = new DiscoveryWatcher(
    provider,
    discoveryEngine,
    discordClient,
    configReader,
    discoveryWatcherRepository,
    clock,
    logger,
  )

  const start = () => {
    logger = logger.for('DiscoveryWatcherModule')
    logger.info('Starting')

    discoveryWatcher.start()
  }

  return {
    routers: [],
    start,
  }
}
