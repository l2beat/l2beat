import type { ApplicationModule, ModuleDependencies } from '../types'
import { AnomalyNotifier } from './AnomalyNotifier'
import { DiscordWebhookClient } from './clients/DiscordWebhookClient'
import { RealTimeLivenessProcessor } from './RealTimeLivenessProcessor'

export function createAnomaliesModule({
  config,
  clock,
  logger,
  db,
  blockProcessors,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.anomalies) {
    logger.info('Anomalies module disabled')
    return
  }
  logger = logger.tag({ feature: 'anomalies', module: 'anomalies' })

  const anomaliesNotifier =
    config.anomalies.anomaliesWebhookUrl && config.trackedTxsConfig
      ? new AnomalyNotifier(
          logger,
          clock,
          new DiscordWebhookClient(config.anomalies.anomaliesWebhookUrl),
          db,
          config.anomalies.anomaliesMinDuration,
          config.trackedTxsConfig,
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
