import { Env, getEnv } from '@l2beat/backend-tools'
import type { Indexer } from '@l2beat/uif'
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

  const env = getEnv()
  logger = logger.tag({ feature: 'blockSync', module: 'blockSync' })

  const indexerService = new IndexerService(db)

  const chains = blockProcessors
    .map((x) => x.chain)
    .filter((x, i, a) => a.indexOf(x) === i)

  const indexers: Indexer[] = []
  for (const chain of chains) {
    const blockNumberIndexer =
      chain === 'ethereum' && config.blockSync.ethereumWsUrl
        ? new WsBlockNumberIndexer(
            config.blockSync.ethereumWsUrl,
            chain,
            logger,
          )
        : new BlockNumberIndexer(
            providers.block.getBlockProvider(chain),
            chain,
            logger,
            config.blockSync.delayFromTipInSeconds,
          )

    const blockIndexer = new BlockIndexer({
      logger,
      minHeight: 1,
      parents: [blockNumberIndexer],
      blockProcessors: blockProcessors.filter((x) => x.chain === chain),
      source: chain,
      blockProvider: providers.block.getBlockProvider(chain),
      logsProvider: providers.logs.getLogsProvider(chain),
      indexerService,
      batchSize:
        env.optionalInteger(Env.key(chain, 'BLOCKSYNC_BATCH_SIZE')) ?? 50,
    })

    indexers.push(blockNumberIndexer)
    indexers.push(blockIndexer)
  }

  logger = logger.for('BlockSyncModule')
  const start = async () => {
    logger.info('Starting...')

    const stats = await db.stats()
    for (const stat of stats) {
      logger.info('Database table size', {
        table: stat.tableName,
        sizeInBytes: stat.sizeInBytes,
      })
    }

    for (const indexer of indexers) {
      await indexer.start()
    }
  }

  return { start }
}
