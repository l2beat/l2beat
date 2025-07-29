import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { Config } from '../../config'
import { DiscordWebhookClient } from '../../peripherals/discord/DiscordWebhookClient'
import type { Providers } from '../../providers/Providers'
import type { Clock } from '../../tools/Clock'
import { EventIndexer } from '../../tools/EventIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule } from '../ApplicationModule'
import { BlockIndexer } from './indexers/BlockIndexer'
import { AnomalyNotifier } from './notifiers/AnomalyNotifier'
import { RealTimeLivenessProcessor } from './processors/RealTimeLivenessProcessor'

export function createSharedModule(
  config: Config,
  logger: Logger,
  clock: Clock,
  providers: Providers,
  db: Database,
): ApplicationModule | undefined {
  if (!config.shared) {
    logger.info('Shared module disabled')
    return
  }

  const anomaliesNotifier = config.discord.anomaliesWebhookUrl
    ? new AnomalyNotifier(
        logger,
        clock,
        new DiscordWebhookClient(config.discord.anomaliesWebhookUrl),
        db,
        config.discord.anomaliesMinDuration,
      )
    : undefined

  logger = logger.tag({ feature: 'shared', module: 'shared' })

  const indexerService = new IndexerService(db)

  const eventIndexer = new EventIndexer(
    config.shared.ethereumWsUrl,
    'ethereum',
    logger,
  )

  const realTimeLivenessProcessor = new RealTimeLivenessProcessor(
    config,
    logger,
    db,
    anomaliesNotifier,
  )
  const processors = [realTimeLivenessProcessor]

  const blockIndexer = new BlockIndexer({
    logger,
    minHeight: 1,
    parents: [eventIndexer],
    processors,
    source: 'ethereum',
    mode: 'CONTINUOUS',
    blockProvider: providers.block.getBlockProvider('ethereum'),
    logsProvider: providers.logs.getLogsProvider('ethereum'),
    indexerService,
  })

  logger = logger.for('SharedModule')

  const start = async () => {
    logger.info('Starting...')

    const stats = await db.stats()
    for (const stat of stats) {
      logger.metric('Database table size', {
        table: stat.tableName,
        sizeInBytes: stat.sizeInBytes,
      })
    }

    eventIndexer.start()
    blockIndexer.start()
    anomaliesNotifier?.start()

    for (const processor of processors) {
      processor.init()
    }
  }

  return {
    start,
  }
}
