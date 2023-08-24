import {
  ConfigReader,
  DISCOVERY_LOGIC_VERSION,
  DiscoveryLogger,
} from '@l2beat/discovery'
import { HttpClient, Logger } from '@l2beat/shared'

import { Config } from '../../config'
import { Clock } from '../../core/Clock'
import { createDiscoveryRunner } from '../../core/discovery/createDiscoveryRunner'
import { UpdateMonitor } from '../../core/discovery/UpdateMonitor'
import { UpdateNotifier } from '../../core/discovery/UpdateNotifier'
import { UpdateMonitorRepository } from '../../peripherals/database/discovery/UpdateMonitorRepository'
import { UpdateNotifierRepository } from '../../peripherals/database/discovery/UpdateNotifierRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { DiscordClient } from '../../peripherals/discord/DiscordClient'
import { ApplicationModule } from '../ApplicationModule'

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
    ? new DiscordClient(http, config.updateMonitor.discord)
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

  const runners = config.updateMonitor.chains.map((chainConfig) =>
    createDiscoveryRunner(http, configReader, discoveryLogger, chainConfig),
  )

  const updateMonitor = new UpdateMonitor(
    runners,
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
