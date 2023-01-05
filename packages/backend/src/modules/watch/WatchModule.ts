import { HttpClient, Logger, MainnetEtherscanClient } from '@l2beat/common'
import { providers } from 'ethers'

import { Config } from '../../config'
import { ConfigReader } from '../../core/discovery/ConfigReader'
import { discover } from '../../core/discovery/discover'
import { DiscoveryProvider } from '../../core/discovery/provider/DiscoveryProvider'
import { DiscordClient } from '../../peripherals/discord/DiscordClient'
import { ApplicationModule } from '../ApplicationModule'

export function createWatchModule(
  config: Config,
  logger: Logger,
  http: HttpClient,
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

  const start = async () => {
    logger = logger.for('WatchModule')
    logger.info('Starting')

    const blockNumber = await provider.getBlockNumber()

    const discoveryProvider = new DiscoveryProvider(
      provider,
      etherscanClient,
      blockNumber,
    )

    const configReader = new ConfigReader()

    const projectConfigs = configReader.readAllConfigs()

    for (const projectConfig of projectConfigs) {
      await discover(discoveryProvider, projectConfig)
    }

    if (discordClient) {
      await discordClient.sendMessage(
        `Run discovery for all projects | block_number = ${blockNumber}`,
      )
      logger.info('Notification to Discord has been sent')
    } else {
      logger.info(
        'DiscordClient not setup, notification has not been sent. Did you provide correct .env variables?',
      )
    }
  }

  return {
    routers: [],
    start,
  }
}
