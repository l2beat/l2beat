import { assert, Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { BlockExplorerClient } from '@l2beat/shared'
import { ProjectId } from '@l2beat/shared-pure'
import { Config } from '../../config'
import {
  BlockscoutChainConfig,
  EtherscanChainConfig,
} from '../../config/Config'
import { Peripherals } from '../../peripherals/Peripherals'
import { DegateClient } from '../../peripherals/degate'
import { LoopringClient } from '../../peripherals/loopring/LoopringClient'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'
import { StarkexClient } from '../../peripherals/starkex/StarkexClient'
import { StarknetClient } from '../../peripherals/starknet/StarknetClient'
import { ZksyncLiteClient } from '../../peripherals/zksynclite/ZksyncLiteClient'
import { Clock } from '../../tools/Clock'
import { IndexerService } from '../../tools/uif/IndexerService'
import { ApplicationModule } from '../ApplicationModule'
import { ActivityTransactionConfig } from '../activity/ActivityTransactionConfig'
import {
  BaseClient,
  BlockTimestampProvider,
} from '../tvl/services/BlockTimestampProvider'
import { BlockActivityIndexer } from './indexers/BlockActivityIndexer'
import { BlockTargetIndexer } from './indexers/BlockTargetIndexer'
import { DayActivityIndexer } from './indexers/DayActivityIndexer'
import { DayTargetIndexer } from './indexers/DayTargetIndexer'
import { ActivityIndexer, TxsCountProvider } from './indexers/types'
import { DegateTxsCountProvider } from './services/providers/DegateTxsCountProvider'
import { LoopringTxsCountProvider } from './services/providers/LoopringTxsCountProvider'
import { RpcTxsCountProvider } from './services/providers/RpcTxsCountProvider'
import { StarkexTxsCountProvider } from './services/providers/StarkexTxsCountProvider'
import { StarknetTxsCountProvider } from './services/providers/StarknetTxsCountProvider'
import { ZKsyncLiteTxsCountProvider } from './services/providers/ZKsyncLiteTxsCountProvider'

export function createActivity2Module(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  db: Database,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.activity2) {
    logger.info('Activity2 module disabled')
    return
  }

  const indexers = createActivityIndexers(
    config.activity2,
    peripherals,
    logger,
    clock,
    db,
  )

  const start = async () => {
    await Promise.all(
      indexers.map(async (indexer) => {
        await indexer.start()
      }),
    )
  }

  return {
    routers: [],
    start,
  }
}

function createActivityIndexers(
  activityConfig: Config['activity2'],
  peripherals: Peripherals,
  logger: Logger,
  clock: Clock,
  db: Database,
): ActivityIndexer[] {
  assert(activityConfig, 'Config should be defined there')

  const indexerService = new IndexerService(db)

  const dayTargetIndexer = new DayTargetIndexer(logger, clock)

  const indexers: ActivityIndexer[] = [dayTargetIndexer]

  activityConfig.projects.forEach((project) => {
    switch (project.config.type) {
      case 'rpc': {
        const rpcClient = peripherals.getClient(RpcClient, {
          url: project.config.url,
          callsPerMinute: project.config.callsPerMinute,
        })
        const txsCountProvider = new RpcTxsCountProvider(
          rpcClient,
          project.id,
          project.config.assessCount,
        )

        const [blockTargetIndexer, activityIndexer] = createBlockBasedIndexers(
          clock,
          logger,
          rpcClient,
          txsCountProvider,
          project,
          indexerService,
          db,
          peripherals,
        )

        indexers.push(blockTargetIndexer, activityIndexer)
        break
      }
      case 'zksync': {
        const zksyncClient = peripherals.getClient(ZksyncLiteClient, {
          url: project.config.url,
          callsPerMinute: project.config.callsPerMinute,
        })
        const txsCountProvider = new ZKsyncLiteTxsCountProvider(
          zksyncClient,
          project.id,
        )

        const [blockTargetIndexer, activityIndexer] = createBlockBasedIndexers(
          clock,
          logger,
          zksyncClient,
          txsCountProvider,
          project,
          indexerService,
          db,
          peripherals,
        )

        indexers.push(blockTargetIndexer, activityIndexer)
        break
      }
      case 'starknet': {
        const starknetClient = peripherals.getClient(StarknetClient, {
          url: project.config.url,
          callsPerMinute: project.config.callsPerMinute,
        })
        const txsCountProvider = new StarknetTxsCountProvider(
          starknetClient,
          project.id,
        )

        const [blockTargetIndexer, activityIndexer] = createBlockBasedIndexers(
          clock,
          logger,
          starknetClient,
          txsCountProvider,
          project,
          indexerService,
          db,
          peripherals,
        )

        indexers.push(blockTargetIndexer, activityIndexer)
        break
      }
      case 'loopring': {
        const loopringClient = peripherals.getClient(LoopringClient, {
          url: project.config.url,
          callsPerMinute: project.config.callsPerMinute,
        })
        const txsCountProvider = new LoopringTxsCountProvider(
          loopringClient,
          project.id,
        )

        const [blockTargetIndexer, activityIndexer] = createBlockBasedIndexers(
          clock,
          logger,
          loopringClient,
          txsCountProvider,
          project,
          indexerService,
          db,
          peripherals,
        )

        indexers.push(blockTargetIndexer, activityIndexer)
        break
      }
      case 'degate': {
        const degateClient = peripherals.getClient(DegateClient, {
          url: project.config.url,
          callsPerMinute: project.config.callsPerMinute,
        })
        const txsCountProvider = new DegateTxsCountProvider(
          degateClient,
          project.id,
        )

        const [blockTargetIndexer, activityIndexer] = createBlockBasedIndexers(
          clock,
          logger,
          degateClient,
          txsCountProvider,
          project,
          indexerService,
          db,
          peripherals,
        )

        indexers.push(blockTargetIndexer, activityIndexer)
        break
      }
      case 'starkex': {
        const starkexClient = peripherals.getClient(StarkexClient, {
          apiKey: activityConfig.starkexApiKey,
          callsPerMinute: activityConfig.starkexCallsPerMinute,
          timeout: undefined,
        })
        const txsCountProvider = new StarkexTxsCountProvider(
          starkexClient,
          project.id,
          project.config.product,
        )
        const activityIndexer = new DayActivityIndexer({
          logger,
          projectId: project.id,
          batchSize: 10,
          minHeight:
            project.config.sinceTimestamp.toStartOf('day').toDays() ?? 0,
          uncertaintyBuffer: project.config.resyncLastDays,
          parents: [dayTargetIndexer],
          txsCountProvider,
          indexerService,
          db,
        })

        indexers.push(activityIndexer)
        break
      }
    }
  })
  return indexers
}

function createBlockBasedIndexers(
  clock: Clock,
  logger: Logger,
  client: BaseClient,
  txsCountProvider: TxsCountProvider,
  project: {
    id: ProjectId
    config: ActivityTransactionConfig
    blockExplorerConfig:
      | EtherscanChainConfig
      | BlockscoutChainConfig
      | undefined
  },
  indexerService: IndexerService,
  db: Database,
  peripherals: Peripherals,
): [BlockTargetIndexer, BlockActivityIndexer] {
  let blockExplorerClient: BlockExplorerClient | undefined

  if (project.blockExplorerConfig) {
    const options =
      project.blockExplorerConfig === undefined
        ? undefined
        : project.blockExplorerConfig.type === 'etherscan'
          ? {
              type: 'Etherscan' as const,
              apiKey: project.blockExplorerConfig.etherscanApiKey,
              url: project.blockExplorerConfig.etherscanApiUrl,
              maximumCallsForBlockTimestamp: 3,
            }
          : {
              type: 'Blockscout' as const,
              url: project.blockExplorerConfig.blockscoutApiUrl,
              maximumCallsForBlockTimestamp: 10,
            }

    blockExplorerClient = peripherals.getClient(BlockExplorerClient, options)
  }
  const blockTimestampProvider = new BlockTimestampProvider({
    client,
    logger: logger.tag(`activity_${project.id}`),
    blockExplorerClient,
  })
  const blockTargetIndexer = new BlockTargetIndexer(
    logger,
    clock,
    blockTimestampProvider,
    project.id,
  )

  const activityIndexer = new BlockActivityIndexer({
    logger,
    projectId: project.id,
    // TODO: add batchSize to config
    batchSize: 100,
    minHeight: 1,
    parents: [blockTargetIndexer],
    txsCountProvider,
    indexerService,
    db,
  })
  return [blockTargetIndexer, activityIndexer]
}
