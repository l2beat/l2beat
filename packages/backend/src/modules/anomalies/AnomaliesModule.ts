import { DiscordWebhookClient } from '../../peripherals/discord/DiscordWebhookClient'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { AnomalyNotifier } from './AnomalyNotifier'
import { RealTimeLivenessProcessor } from './RealTimeLivenessProcessor'

export function createAnomaliesModule({
  config,
  clock,
  logger,
  db,
  processors,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.shared) {
    logger.info('Anomalies module disabled')
    return
  }
  logger = logger.tag({ feature: 'anomalies', module: 'anomalies' })

  const anomaliesNotifier = config.discord.anomaliesWebhookUrl
    ? new AnomalyNotifier(
        logger,
        clock,
        new DiscordWebhookClient(config.discord.anomaliesWebhookUrl),
        db,
        config.discord.anomaliesMinDuration,
      )
    : undefined

  const realTimeLivenessProcessor = new RealTimeLivenessProcessor(
    config,
    logger,
    db,
    anomaliesNotifier,
  )

  const start = () => {
    anomaliesNotifier?.start()
    realTimeLivenessProcessor.init()
  }

  processors.push(realTimeLivenessProcessor)
  return { start }
}
