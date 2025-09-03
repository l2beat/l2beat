import { EventIndexer } from '../../tools/EventIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { BlockIndexer } from './BlockIndexer'

export function createBlockSyncModule({
  config,
  logger,
  db,
  providers,
  blockProcessors,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.blockSync) {
    logger.info('BlockSync module disabled')
    return
  }

  logger = logger.tag({ feature: 'blockSync', module: 'blockSync' })

  const indexerService = new IndexerService(db)

  const eventIndexer = new EventIndexer(
    config.blockSync.ethereumWsUrl,
    'ethereum',
    logger,
  )

  const blockIndexer = new BlockIndexer({
    logger,
    minHeight: 1,
    parents: [eventIndexer],
    blockProcessors,
    source: 'ethereum',
    mode: 'CONTINUOUS',
    blockProvider: providers.block.getBlockProvider('ethereum'),
    logsProvider: providers.logs.getLogsProvider('ethereum'),
    indexerService,
  })

  logger = logger.for('BlockSyncModule')

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
  }

  return { start }
}
