import { Logger } from '@l2beat/backend-tools'
import {
  ConfigReader,
  DISCOVERY_LOGIC_VERSION,
  HttpClient as DiscoveryHttpClient,
  DiscoveryLogger,
} from '@l2beat/discovery'

import { Config } from '../../config'
import { Peripherals } from '../../peripherals/Peripherals'
import { DiscordClient } from '../../peripherals/discord/DiscordClient'
import { ChainConverter } from '../../tools/ChainConverter'
import { Clock } from '../../tools/Clock'
import { ApplicationModule } from '../ApplicationModule'
import { UpdateMonitor } from './UpdateMonitor'
import { UpdateNotifier } from './UpdateNotifier'
import { UpdateMonitorController } from './api/UpdateMonitorController'
import { createUpdateMonitorRouter } from './api/UpdateMonitorRouter'
import { createDiscoveryRunner } from './createDiscoveryRunner'
import { UpdateMonitorRepository } from './repositories/UpdateMonitorRepository'
import { UpdateNotifierRepository } from './repositories/UpdateNotifierRepository'

export function createUpdateMonitorModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.updateMonitor) {
    logger.info('UpdateMonitor module disabled')
    return
  }

  const configReader = new ConfigReader()

  const discordClient = config.updateMonitor.discord
    ? peripherals.getClient(DiscordClient, config.updateMonitor.discord)
    : undefined

  const chainConverter = new ChainConverter(config.chains)
  const updateNotifier = new UpdateNotifier(
    peripherals.getRepository(UpdateNotifierRepository),
    discordClient,
    chainConverter,
    logger,
  )

  // TODO: get rid of that once we achieve full library separation
  const discoveryHttpClient = new DiscoveryHttpClient()

  const { chains, enableCache } = config.updateMonitor
  const runners = chains.map((chainConfig) =>
    createDiscoveryRunner(
      discoveryHttpClient,
      configReader,
      peripherals,
      DiscoveryLogger.SILENT,
      chains,
      chainConfig.name,
      !!enableCache,
    ),
  )

  const updateMonitor = new UpdateMonitor(
    runners,
    updateNotifier,
    configReader,
    peripherals.getRepository(UpdateMonitorRepository),
    clock,
    chainConverter,
    logger,
    !!config.updateMonitor.runOnStart,
    DISCOVERY_LOGIC_VERSION,
  )

  const updateMonitorController = new UpdateMonitorController(
    peripherals.getRepository(UpdateMonitorRepository),
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
