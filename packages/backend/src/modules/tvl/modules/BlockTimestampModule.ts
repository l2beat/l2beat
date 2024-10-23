import { Logger } from '@l2beat/backend-tools'
import { BlockExplorerClient } from '@l2beat/shared'
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

    const options =
      chainConfig.config.blockExplorerConfig === undefined
        ? undefined
        : chainConfig.config.blockExplorerConfig.type === 'etherscan'
          ? {
              type: 'Etherscan' as const,
              apiKey: chainConfig.config.blockExplorerConfig.etherscanApiKey,
              url: chainConfig.config.blockExplorerConfig.etherscanApiUrl,
              maximumCallsForBlockTimestamp: 3,
              chain: chainConfig.chain,
            }
          : {
              type: 'Blockscout' as const,
              url: chainConfig.config.blockExplorerConfig.blockscoutApiUrl,
              maximumCallsForBlockTimestamp: 10,
              chain: chainConfig.chain,
            }

    const blockExplorerClient = options
      ? peripherals.getClient(BlockExplorerClient, options)
      : undefined

    const blockTimestampProvider = new BlockTimestampProvider({
      blockExplorerClient,
      client: rpcClient,
      logger,
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
