import { DiscordClient, HttpClient } from '@l2beat/shared'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { createWorkerPool } from '../update-monitor/createWorkers'
import { WatchMonitor } from './WatchMonitor'
import { WatchNotifier } from './WatchNotifier'

export function createWatchMonitorModule({
  config,
  logger,
  db,
  clock,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.watchMonitor) {
    logger.info('WatchMonitor module disabled')
    return
  }

  logger = logger.tag({ feature: 'watch_monitor', module: 'watch_monitor' })

  const webhookUrl =
    config.watchMonitor.discordWebhookUrl ??
    (config.notifications && config.notifications.updateMonitor
      ? config.notifications.updateMonitor.discordWebhookUrl
      : undefined)
  const discordClient = webhookUrl ? new DiscordClient(webhookUrl) : undefined

  const watchNotifier = new WatchNotifier(discordClient, logger)
  const workerPool = createWorkerPool({
    workerCount: config.watchMonitor.workerPool.workerCount,
    timeoutPerTaskMs: config.watchMonitor.workerPool.timeoutPerTaskMs,
    timeoutPerRunMs: config.watchMonitor.workerPool.timeoutPerRunMs,
    logger: logger.for('WatchMonitor'),
  })

  const watchMonitor = new WatchMonitor(
    config.watchMonitor.watchReader,
    {
      http: new HttpClient(),
      githubToken: config.watchMonitor.githubToken,
    },
    watchNotifier,
    db,
    clock,
    logger,
    !!config.watchMonitor.runOnStart,
    workerPool,
    config.watchMonitor.disabledWatches,
  )

  const start = () => {
    logger = logger.for('WatchMonitorModule')
    logger.info('Starting')
    watchMonitor.start()
  }

  return {
    start,
  }
}
