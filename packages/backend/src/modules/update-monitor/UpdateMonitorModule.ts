import { Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { HttpClient } from '@l2beat/shared'
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
  db,
  clock,
  providers,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.updateMonitor) {
    logger.info('UpdateMonitor module disabled')
    return
  }

  logger = logger.tag({ feature: 'update_monitor', module: 'update_monitor' })

  const paths = config.updateMonitor.paths
  const configReader = config.updateMonitor.configReader

  const updateMessagesService = new UpdateMessagesService(
    db,
    config.updateMonitor.updateMessagesRetentionPeriodDays,
  )

  const discoveryOutputCache = new DiscoveryOutputCache()
  const projectService = new ProjectService()

  const updateNotifier = new UpdateNotifier(
    db,
    providers.clients.discord,
    logger,
    updateMessagesService,
    projectService,
  )
  const updateDiffer = config.updateMonitor.updateDifferEnabled
    ? new UpdateDiffer(configReader, db, discoveryOutputCache, logger)
    : undefined

  // TODO: get rid of that once we achieve full library separation
  const http = new HttpClient()

  const { chains, cacheEnabled, cacheUri } = config.updateMonitor
  const runner = createDiscoveryRunner(
    paths,
    http,
    db,
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
    db,
    clock,
    discoveryOutputCache,
    logger,
    !!config.updateMonitor.runOnStart,
    workerPool,
    config.updateMonitor.disabledProjects,
  )

  const updateMonitorController = new UpdateMonitorController(
    db,
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
