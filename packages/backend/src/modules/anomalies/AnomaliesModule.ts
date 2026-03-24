import type { ApplicationModule, ModuleDependencies } from '../types'
import { AnomalyNotifier } from './AnomalyNotifier'
import { RealTimeLivenessProcessor } from './RealTimeLivenessProcessor'

export function createAnomaliesModule({
  config,
  clock,
  logger,
  db,
  providers,
  blockProcessors,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.anomalies) {
    logger.info('Anomalies module disabled')
    return
  }
  logger = logger.tag({ feature: 'anomalies', module: 'anomalies' })

  const anomaliesWebhookUrl =
    config.discord && config.discord.webhooks.anomalies
  const anomaliesNotifier =
    anomaliesWebhookUrl && config.trackedTxsConfig && providers.clients.discord
      ? new AnomalyNotifier(
          logger,
          clock,
          providers.clients.discord,
          db,
          config.anomalies.anomaliesMinDuration,
          config.trackedTxsConfig,
          anomaliesWebhookUrl,
        )
      : undefined

  const realTimeLivenessProcessor = config.trackedTxsConfig
    ? new RealTimeLivenessProcessor(
        config.trackedTxsConfig,
        logger,
        db,
        anomaliesNotifier,
      )
    : undefined

  const start = () => {
    logger = logger.for('AnomaliesModule')
    logger.info('Starting')
    anomaliesNotifier?.start()
    realTimeLivenessProcessor?.start()
    logger.info('Started')
  }

  if (realTimeLivenessProcessor) {
    blockProcessors.push(realTimeLivenessProcessor)
  }
  return { start }
}
