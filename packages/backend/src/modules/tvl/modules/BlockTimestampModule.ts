import { TvlConfig } from '../../../config/Config'
import { BlockTimestampIndexer } from '../indexers/BlockTimestampIndexer'
import { TvlDependencies } from './TvlDependencies'

interface BlockTimestampModule {
  start: () => Promise<void> | void
  blockTimestampIndexers: Map<string, BlockTimestampIndexer>
}

export function initBlockTimestampModule(
  config: TvlConfig,
  dependencies: TvlDependencies,
): BlockTimestampModule | undefined {
  const blockTimestampIndexers = createBlockTimestampIndexers(
    config.chains,
    dependencies,
  )
  if (blockTimestampIndexers.size === 0) return undefined

  return {
    start: async () => {
      for (const indexer of blockTimestampIndexers.values()) {
        await indexer.start()
      }
    },
    blockTimestampIndexers,
  }
}

function createBlockTimestampIndexers(
  chains: TvlConfig['chains'],
  dependencies: TvlDependencies,
) {
  const logger = dependencies.logger
  const hourlyIndexer = dependencies.getHourlyIndexer()
  const indexerService = dependencies.getIndexerService()
  const db = dependencies.database
  const syncOptimizer = dependencies.getSyncOptimizer()

  const blockTimestampIndexers = new Map<string, BlockTimestampIndexer>()

  for (const chainConfig of chains) {
    if (chainConfig.config === undefined) {
      continue
    }

    const blockTimestampProvider = dependencies.getBlockTimestampProvider(
      chainConfig.chain,
    )

    const indexer = new BlockTimestampIndexer({
      logger,
      parents: [hourlyIndexer],
      minHeight: chainConfig.config.minBlockTimestamp.toNumber(),
      indexerService,
      chain: chainConfig.chain,
      blockTimestampProvider,
      db,
      syncOptimizer,
    })

    blockTimestampIndexers.set(chainConfig.chain, indexer)
  }

  return blockTimestampIndexers
}
