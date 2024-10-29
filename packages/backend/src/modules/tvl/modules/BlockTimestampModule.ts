import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { BlockIndexerClient } from '@l2beat/shared'
import { TvlConfig } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { BlockTimestampIndexer } from '../indexers/BlockTimestampIndexer'
import { HourlyIndexer } from '../indexers/HourlyIndexer'
import { BlockTimestampProvider } from '../services/BlockTimestampProvider'
import { SyncOptimizer } from '../utils/SyncOptimizer'

interface BlockTimestampModule {
  start: () => Promise<void> | void
  blockTimestampIndexers: Map<string, BlockTimestampIndexer>
}

export function initBlockTimestampModule(
  config: TvlConfig,
  logger: Logger,
  peripherals: Peripherals,
  syncOptimizer: SyncOptimizer,
  indexerService: IndexerService,
  hourlyIndexer: HourlyIndexer,
): BlockTimestampModule | undefined {
  const blockTimestampIndexers = new Map<string, BlockTimestampIndexer>()

  for (const chainConfig of config.chains) {
    if (chainConfig.config === undefined) {
      continue
    }

    const rpcClient = peripherals.getClient(RpcClient, {
      url: chainConfig.config.providerUrl,
      callsPerMinute: chainConfig.config.providerCallsPerMinute,
      chain: chainConfig.chain,
    })

    const blockExplorerClient = chainConfig.config.blockExplorerConfig
      ? new BlockIndexerClient(
          peripherals.httpClient,
          new RateLimiter({ callsPerMinute: 120 }),
          {
            ...chainConfig.config.blockExplorerConfig,
            chain: chainConfig.chain,
          },
        )
      : undefined

    const blockTimestampProvider = new BlockTimestampProvider({
      indexerClients: blockExplorerClient ? [blockExplorerClient] : [],
      blockClients: [rpcClient],
    })

    const indexer = new BlockTimestampIndexer({
      logger,
      parents: [hourlyIndexer],
      minHeight: chainConfig.config.minBlockTimestamp.toNumber(),
      indexerService,
      chain: chainConfig.chain,
      blockTimestampProvider,
      db: peripherals.database,
      syncOptimizer,
    })

    blockTimestampIndexers.set(chainConfig.chain, indexer)
  }

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
