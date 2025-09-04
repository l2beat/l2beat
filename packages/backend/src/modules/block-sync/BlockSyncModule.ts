import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { BlockIndexer } from './BlockIndexer'
import { BlockNumberIndexer } from './BlockNumberIndexer'
import { WsBlockNumberIndexer } from './WsBlockNumberIndexer'

export function createBlockSyncModule({
  config,
  logger,
  db,
  providers,
  blockProcessors,
}: ModuleDependencies): ApplicationModule | undefined {
  if (blockProcessors.length === 0) {
    // This module is special in that it is only created if other modules
    // create some blockProcessors. Otherwise we don't need to initialize
    // anything.
    return
  }

  logger = logger.tag({ feature: 'blockSync', module: 'blockSync' })

  const indexerService = new IndexerService(db)

  const blockNumberIndexer = config.blockSync.ethereumWsUrl
    ? new WsBlockNumberIndexer(
        config.blockSync.ethereumWsUrl,
        'ethereum',
        logger,
      )
    : new BlockNumberIndexer(
        providers.block.getBlockProvider('ethereum'),
        'ethereum',
        logger,
      )

  const blockIndexer = new BlockIndexer({
    logger,
    minHeight: 1,
    parents: [blockNumberIndexer],
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

    blockNumberIndexer.start()
    blockIndexer.start()
  }

  return { start }
}
