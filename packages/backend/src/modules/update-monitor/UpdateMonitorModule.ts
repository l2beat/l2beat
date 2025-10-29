import { Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { HttpClient } from '@l2beat/shared'
import { DiscordClient } from '../../peripherals/discord/DiscordClient'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { UpdateMonitorController } from './api/UpdateMonitorController'
import { createUpdateMonitorRouter } from './api/UpdateMonitorRouter'
import { createDiscoveryRunner } from './createDiscoveryRunner'
import { createWorkerPool } from './createWorkers'
import { DiscoveryOutputCache } from './DiscoveryOutputCache'
import { UpdateDiffer } from './UpdateDiffer'
import { UpdateMessagesService } from './UpdateMessagesService'
import { UpdateMonitor } from './UpdateMonitor'
import { UpdateNotifier } from './UpdateNotifier'

export function createUpdateMonitorModule({
  config,
  logger,
  peripherals,
  clock,
}: ModuleDependencies): ApplicationModule | undefined {
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

  const discoveryOutputCache = new DiscoveryOutputCache()
  const projectService = new ProjectService()

  const updateNotifier = new UpdateNotifier(
    peripherals.database,
    discordClient,
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
  const runner = createDiscoveryRunner(
    paths,
    http,
    peripherals,
    Logger.SILENT,
    chains,
    !!cacheEnabled,
    cacheUri,
  )

  const workerPool = createWorkerPool({
    workerCount: config.updateMonitor.workerPool.workerCount,
    timeoutPerTaskMs: config.updateMonitor.workerPool.timeoutPerTaskMs,
    timeoutPerRunMs: config.updateMonitor.workerPool.timeoutPerRunMs,
    logger: logger.for('UpdateMonitor'),
  })

  const updateMonitor = new UpdateMonitor(
    runner,
    updateNotifier,
    updateDiffer,
    configReader,
    peripherals.database,
    clock,
    discoveryOutputCache,
    logger,
    !!config.updateMonitor.runOnStart,
    workerPool,
    config.updateMonitor.disabledProjects,
  )

  const updateMonitorController = new UpdateMonitorController(
    peripherals.database,
    configReader,
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
