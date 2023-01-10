import { HttpClient, Logger, MainnetEtherscanClient } from '@l2beat/common'
import { providers } from 'ethers'

import { Config } from '../../config'
import { Clock } from '../../core/Clock'
import { ConfigReader } from '../../core/discovery/ConfigReader'
import { DiscoveryLogger } from '../../core/discovery/DiscoveryLogger'
import { DiscoveryWatcher } from '../../core/DiscoveryWatcher'
import { DiscordClient } from '../../peripherals/discord/DiscordClient'
import { ApplicationModule } from '../ApplicationModule'

export function createDiscoveryWatcherModule(
  config: Config,
  logger: Logger,
  http: HttpClient,
  clock: Clock,
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

  const discoveryLogger = DiscoveryLogger.SILENT

  const discoveryWatcher = new DiscoveryWatcher(
    provider,
    etherscanClient,
    discordClient,
    configReader,
    clock,
    logger,
    discoveryLogger,
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
