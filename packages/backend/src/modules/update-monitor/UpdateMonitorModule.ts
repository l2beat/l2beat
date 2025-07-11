import { Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { HttpClient } from '@l2beat/shared'
import { ChainConverter } from '@l2beat/shared-pure'
import type { Config } from '../../config'
import { DiscordClient } from '../../peripherals/discord/DiscordClient'
import type { Peripherals } from '../../peripherals/Peripherals'
import type { Clock } from '../../tools/Clock'
import type { ApplicationModule } from '../ApplicationModule'
import { UpdateMonitorController } from './api/UpdateMonitorController'
import { createUpdateMonitorRouter } from './api/UpdateMonitorRouter'
import { createDiscoveryRunner } from './createDiscoveryRunner'
import { DiscoveryOutputCache } from './DiscoveryOutputCache'
import { UpdateDiffer } from './UpdateDiffer'
import { UpdateMessagesService } from './UpdateMessagesService'
import { UpdateMonitor } from './UpdateMonitor'
import { UpdateNotifier } from './UpdateNotifier'

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

  const paths = config.updateMonitor.paths
  const configReader = config.updateMonitor.configReader

  const discordClient = config.updateMonitor.discord
    ? peripherals.getClient(DiscordClient, config.updateMonitor.discord)
    : undefined

  const updateMessagesService = new UpdateMessagesService(
    peripherals.database,
    config.updateMonitor.updateMessagesRetentionPeriodDays,
  )

  const chainConverter = new ChainConverter(config.chains)
  const discoveryOutputCache = new DiscoveryOutputCache()
  const projectService = new ProjectService()

  const updateNotifier = new UpdateNotifier(
    peripherals.database,
    discordClient,
    chainConverter,
    logger,
    updateMessagesService,
    projectService,
    config.updateMonitor.disabledChains,
  )
  const updateDiffer = config.updateMonitor.updateDifferEnabled
    ? new UpdateDiffer(
        configReader,
        peripherals.database,
        discoveryOutputCache,
        logger,
      )
    : undefined

  // TODO: get rid of that once we achieve full library separation
  const http = new HttpClient()

  const { chains, cacheEnabled, cacheUri } = config.updateMonitor
  const runners = chains.map((chainConfig) =>
    createDiscoveryRunner(
      paths,
      http,
      peripherals,
      Logger.SILENT,
      chains,
      chainConfig.name,
      !!cacheEnabled,
      cacheUri,
    ),
  )

  const updateMonitor = new UpdateMonitor(
    runners,
    updateNotifier,
    updateDiffer,
    configReader,
    peripherals.database,
    clock,
    chainConverter,
    discoveryOutputCache,
    logger,
    !!config.updateMonitor.runOnStart,
  )

  const updateMonitorController = new UpdateMonitorController(
    peripherals.database,
    chains,
    configReader,
    chainConverter,
    projectService,
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
