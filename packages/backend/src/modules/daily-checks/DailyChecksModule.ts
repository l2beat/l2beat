import { DiscordClient } from '@l2beat/shared'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { DailyChecksNotifierIndexer } from './DailyChecksNotifierIndexer'

export function createDailyChecksModule({
  config,
  logger,
  clock,
  db,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.notifications || !config.notifications.dailyChecks) {
    logger.info('Daily checks module disabled')
    return
  }
  logger = logger.tag({ feature: 'dailyChecks', module: 'dailyChecks' })

  const { discordWebhookUrl, discordUserIds, timezone, hour } =
    config.notifications.dailyChecks

  if (discordUserIds.length === 0) {
    logger.warn('No Discord user IDs configured, daily checks disabled')
    return
  }

  const hourlyIndexer = new HourlyIndexer(logger, clock)
  const indexerService = new IndexerService(db)

  const dailyChecksNotifierIndexer = new DailyChecksNotifierIndexer(
    {
      parents: [hourlyIndexer],
      indexerService,
      minHeight: 0,
      discordClient: new DiscordClient(discordWebhookUrl),
      discordUserIds,
      timezone,
      hour,
    },
    logger,
  )

  const start = async () => {
    logger = logger.for('DailyChecksModule')
    logger.info('Starting')
    await hourlyIndexer.start()
    await dailyChecksNotifierIndexer.start()
    logger.info('Started')
  }

  return { start }
}
