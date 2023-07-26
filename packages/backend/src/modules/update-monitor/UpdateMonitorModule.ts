import {
  ConfigReader,
  DISCOVERY_LOGIC_VERSION,
  DiscoveryLogger,
} from '@l2beat/discovery'
import { EtherscanClient, HttpClient, Logger } from '@l2beat/shared'
import { ChainId } from '@l2beat/shared-pure'

import { Config } from '../../config'
import { Clock } from '../../core/Clock'
import { UpdateMonitor } from '../../core/discovery/UpdateMonitor'
import { UpdateNotifier } from '../../core/discovery/UpdateNotifier'
import { UpdateMonitorRepository } from '../../peripherals/database/discovery/UpdateMonitorRepository'
import { UpdateNotifierRepository } from '../../peripherals/database/discovery/UpdateNotifierRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { DiscordClient } from '../../peripherals/discord/DiscordClient'
import { ApplicationModule } from '../ApplicationModule'
import { createDiscoveryRunner } from './createDiscoveryRunner'

export function createUpdateMonitorModule(
  config: Config,
  logger: Logger,
  http: HttpClient,
  database: Database,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.updateMonitor) {
    logger.info('UpdateMonitor module disabled')
    return
  }

  const configReader = new ConfigReader()

  const discoveryLogger = DiscoveryLogger.SERVER

  const discordClient = config.updateMonitor.discord
    ? new DiscordClient(
        http,
        config.updateMonitor.discord.token,
        config.updateMonitor.discord.publicChannelId,
        config.updateMonitor.discord.internalChannelId,
      )
    : undefined

  const updateNotifierRepository = new UpdateNotifierRepository(
    database,
    logger,
  )
  const updateMonitorRepository = new UpdateMonitorRepository(database, logger)

  const updateNotifier = new UpdateNotifier(
    updateNotifierRepository,
    discordClient,
    logger,
  )

  const runner = createDiscoveryRunner(
    {
      chainId: ChainId.ETHEREUM,
      etherscanLikeApiUrl: EtherscanClient.API_URL,
      etherscanLikeApiKey: config.updateMonitor.etherscanApiKey,
      rpcUrl: config.updateMonitor.ethereumRpcUrl,
      minBlockTimestamp: config.clock.minBlockTimestamp,
    },
    http,
    configReader,
    discoveryLogger,
  )

  const updateMonitor = new UpdateMonitor(
    [runner],
    updateNotifier,
    configReader,
    updateMonitorRepository,
    clock,
    logger,
    !!config.updateMonitor.runOnStart,
    DISCOVERY_LOGIC_VERSION,
  )

  const start = async () => {
    logger = logger.for('UpdateMonitorModule')
    logger.info('Starting')

    await updateMonitor.start()
  }

  return {
    routers: [],
    start,
  }
}
