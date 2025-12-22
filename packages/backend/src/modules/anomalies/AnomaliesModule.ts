import type { ApplicationModule, ModuleDependencies } from '../types'
import { AnomalyNotifier } from './AnomalyNotifier'
import { RealTimeLivenessProcessor } from './RealTimeLivenessProcessor'

export function createAnomaliesModule({
  config,
  clock,
  logger,
  db,
  blockProcessors,
  providers,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.anomalies) {
    logger.info('Anomalies module disabled')
    return
  }
  logger = logger.tag({ feature: 'anomalies', module: 'anomalies' })

  const anomaliesNotifier = providers.clients.discordWebhook
    ? new AnomalyNotifier(
        logger,
        clock,
        providers.clients.discordWebhook,
        db,
        config.anomalies.anomaliesMinDuration,
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
