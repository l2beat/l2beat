import { Logger } from '@l2beat/backend-tools'
import {
  ConfigReader,
  DISCOVERY_LOGIC_VERSION,
  DiscoveryLogger,
  HttpClient as DiscoveryHttpClient,
} from '@l2beat/discovery'
import { HttpClient } from '@l2beat/shared'

import { Config } from '../../config'
import { Database } from '../../peripherals/database/Database'
import { DiscordClient } from '../../peripherals/discord/DiscordClient'
import { ChainConverter } from '../../tools/ChainConverter'
import { Clock } from '../../tools/Clock'
import { ApplicationModule } from '../ApplicationModule'
import { UpdateMonitorController } from './api/UpdateMonitorController'
import { createUpdateMonitorRouter } from './api/UpdateMonitorRouter'
import { createDiscoveryRunner } from './createDiscoveryRunner'
import { DiscoveryCacheRepository } from './repositories/DiscoveryCacheRepository'
import { UpdateMonitorRepository } from './repositories/UpdateMonitorRepository'
import { UpdateNotifierRepository } from './repositories/UpdateNotifierRepository'
import { UpdateMonitor } from './UpdateMonitor'
import { UpdateNotifier } from './UpdateNotifier'

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

  const discoveryLogger =
    config.name === 'Backend/Local'
      ? DiscoveryLogger.CLI
      : DiscoveryLogger.SERVER

  const discordClient = config.updateMonitor.discord
    ? new DiscordClient(http, config.updateMonitor.discord)
    : undefined

  const updateNotifierRepository = new UpdateNotifierRepository(
    database,
    logger,
  )
  const updateMonitorRepository = new UpdateMonitorRepository(database, logger)

  const discoveryCacheRepository = new DiscoveryCacheRepository(
    database,
    logger,
  )

  const chainConverter = new ChainConverter(config.chains)
  const updateNotifier = new UpdateNotifier(
    updateNotifierRepository,
    discordClient,
    chainConverter,
    logger,
  )

  // TODO: get rid of that once we achieve full library separation
  const discoveryHttpClient = new DiscoveryHttpClient()

  const runners = config.updateMonitor.chains.map((chainConfig) =>
    createDiscoveryRunner(
      discoveryHttpClient,
      configReader,
      discoveryCacheRepository,
      discoveryLogger,
      chainConfig,
    ),
  )

  const updateMonitor = new UpdateMonitor(
    runners,
    updateNotifier,
    configReader,
    updateMonitorRepository,
    clock,
    chainConverter,
    logger,
    !!config.updateMonitor.runOnStart,
    DISCOVERY_LOGIC_VERSION,
  )

  const updateMonitorController = new UpdateMonitorController(
    updateMonitorRepository,
    config.projects,
    configReader,
    chainConverter,
  )
  const updateMonitorRouter = createUpdateMonitorRouter(updateMonitorController)

  const start = async () => {
    logger = logger.for('UpdateMonitorModule')
    logger.info('Starting')

    await updateMonitor.start()
  }

  return {
    routers: [updateMonitorRouter],
    start,
  }
}
