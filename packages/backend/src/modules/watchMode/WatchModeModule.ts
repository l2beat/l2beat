import { HttpClient, Logger, MainnetEtherscanClient } from '@l2beat/common'
import { providers } from 'ethers'

import { Config } from '../../config'
import { Clock } from '../../core/Clock'
import { WatchModeUpdater } from '../../core/WatchModeUpdater'
import { DiscordClient } from '../../peripherals/discord/DiscordClient'
import { ApplicationModule } from '../ApplicationModule'

export function createWatchModeModule(
  config: Config,
  logger: Logger,
  http: HttpClient,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.watchMode) {
    return
  }

  const provider = new providers.AlchemyProvider(
    'mainnet',
    config.watchMode.alchemyApiKey,
  )
  const etherscanClient = new MainnetEtherscanClient(
    http,
    config.watchMode.etherscanApiKey,
  )

  const discordClient =
    config.watchMode.discordToken && config.watchMode.discordChannelId
      ? new DiscordClient(
          http,
          config.watchMode.discordToken,
          config.watchMode.discordChannelId,
        )
      : undefined

  //implement readAllConfigs and add tests

  const watchModeUpdater = new WatchModeUpdater(
    provider,
    etherscanClient,
    discordClient,
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
