import type { Logger } from '@l2beat/backend-tools'
import { ConfigReader, DiscoveryLogger } from '@l2beat/discovery'
import { ChainConverter } from '@l2beat/shared-pure'

import { join } from 'path'
import { HttpClient } from '@l2beat/shared'
import type { Config } from '../../config'
import type { Peripherals } from '../../peripherals/Peripherals'
import { DiscordClient } from '../../peripherals/discord/DiscordClient'
import type { Clock } from '../../tools/Clock'
import type { ApplicationModule } from '../ApplicationModule'
import { UpdateMessagesService } from './UpdateMessagesService'
import { UpdateMonitor } from './UpdateMonitor'
import { UpdateNotifier } from './UpdateNotifier'
import { UpdateMonitorController } from './api/UpdateMonitorController'
import { createUpdateMonitorRouter } from './api/UpdateMonitorRouter'
import { createDiscoveryRunner } from './createDiscoveryRunner'

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

  logger = logger.tag({ feature: 'update_monitor', module: 'update_monitor' })

  const configReader = new ConfigReader(join(process.cwd(), '../config'))

  const discordClient = config.updateMonitor.discord
    ? peripherals.getClient(DiscordClient, config.updateMonitor.discord)
    : undefined

  const updateMessagesService = new UpdateMessagesService(
    peripherals.database,
    config.updateMonitor.updateMessagesRetentionPeriodDays,
  )

  const chainConverter = new ChainConverter(config.chains)
  const updateNotifier = new UpdateNotifier(
    peripherals.database,
    discordClient,
    chainConverter,
    logger,
    updateMessagesService,
  )

  // TODO: get rid of that once we achieve full library separation
  const http = new HttpClient()

  const { chains, cacheEnabled, cacheUri } = config.updateMonitor
  const runners = chains.map((chainConfig) =>
    createDiscoveryRunner(
      configReader.rootPath,
      http,
      peripherals,
      DiscoveryLogger.SILENT,
      chains,
      chainConfig.name,
      !!cacheEnabled,
      cacheUri,
    ),
  )

  const updateMonitor = new UpdateMonitor(
    runners,
    updateNotifier,
    configReader,
    peripherals.database,
    clock,
    chainConverter,
    logger,
    !!config.updateMonitor.runOnStart,
  )

  const updateMonitorController = new UpdateMonitorController(
    peripherals.database,
    config.projects,
    chains,
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
