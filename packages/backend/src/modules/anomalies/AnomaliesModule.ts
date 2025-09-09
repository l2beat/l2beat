import { DiscordWebhookClient } from '../../peripherals/discord/DiscordWebhookClient'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { AnomalyNotifier } from './AnomalyNotifier'
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

  const anomaliesNotifier = config.anomalies.anomaliesWebhookUrl
    ? new AnomalyNotifier(
        logger,
        clock,
        new DiscordWebhookClient(config.anomalies.anomaliesWebhookUrl),
        db,
        config.anomalies.anomaliesMinDuration,
      )
    : undefined

  const realTimeLivenessProcessor = new RealTimeLivenessProcessor(
    config,
    logger,
    db,
    anomaliesNotifier,
  )

  const start = () => {
    logger = logger.for('AnomaliesModule')
    logger.info('Starting')
    anomaliesNotifier?.start()
    realTimeLivenessProcessor.start()
    logger.info('Started')
  }

  blockProcessors.push(realTimeLivenessProcessor)
  return { start }
}
