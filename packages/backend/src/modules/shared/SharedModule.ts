import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { Config } from '../../config'
import type { Providers } from '../../providers/Providers'
import { EventIndexer } from '../../tools/EventIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule } from '../ApplicationModule'
import { BlockIndexer } from './indexers/BlockIndexer'
import { RealTimeLivenessProcessor } from './processors/RealTimeLivenessProcessor'
export function createSharedModule(
  config: Config,
  logger: Logger,
  providers: Providers,
  db: Database,
): ApplicationModule | undefined {
  if (!config.shared) {
    logger.info('Shared module disabled')
    return
  }

  logger = logger.tag({ feature: 'shared', module: 'shared' })

  const indexerService = new IndexerService(db)

  const eventIndexer = new EventIndexer(
    config.shared.ethereumWsUrl,
    'ethereum',
    logger,
  )

  const processor = new RealTimeLivenessProcessor(config, logger, db)

  const blockIndexer = new BlockIndexer({
    logger,
    minHeight: 1,
    parents: [eventIndexer],
    processors: [processor],
    source: 'ethereum',
    mode: 'CONTINUOUS',
    blockProvider: providers.block.getBlockProvider('ethereum'),
    indexerService,
  })

  logger = logger.for('SharedModule')

  const start = () => {
    logger.info('Starting...')
    eventIndexer.start()
    blockIndexer.start()
  }

  return {
    start,
  }
}
