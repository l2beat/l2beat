import { HttpClient, Logger, MainnetEtherscanClient } from '@l2beat/common'
import { providers } from 'ethers'

import { Config } from '../../config'
import { Clock } from '../../core/Clock'
import { ConfigReader } from '../../core/discovery/ConfigReader'
import { WatchModeUpdater } from '../../core/WatchModeUpdater'
import { DiscordClient } from '../../peripherals/discord/DiscordClient'
import { ApplicationModule } from '../ApplicationModule'

export function createWatchModeModule(
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

  const watchModeUpdater = new WatchModeUpdater(
    provider,
    etherscanClient,
    discordClient,
    configReader,
    clock,
    logger,
  )

  const start = () => {
    logger = logger.for('WatchModeModule')
    logger.info('Starting')

    watchModeUpdater.start()
  }

  return {
    routers: [],
    start,
  }
}
