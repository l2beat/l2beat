import { Logger } from '@l2beat/backend-tools'
import { BlockExplorerClient, HttpClient2, RpcClient2 } from '@l2beat/shared'
import { assert, ProjectId } from '@l2beat/shared-pure'
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
import { getBatchSizeFromCallsPerMinute } from './utils/getBatchSizeFromCallsPerMinute'

export function createActivityModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.activity) {
    logger.info('Activity module disabled')
    return
  }

  const indexers = createActivityIndexers(
    config.activity,
    peripherals,
    logger,
    clock,
  )

  const start = async () => {
    await Promise.all(
      indexers.map(async (indexer) => {
        await indexer.start()
      }),
    )
  }

  return {
    start,
  }
}

function createActivityIndexers(
  activityConfig: Config['activity'],
  peripherals: Peripherals,
  logger: Logger,
  clock: Clock,
): ActivityIndexer[] {
  assert(activityConfig, 'Config should be defined there')

  const indexerService = new IndexerService(peripherals.database)

  const starkexClient = peripherals.getClient(StarkexClient, {
    apiKey: activityConfig.starkexApiKey,
    callsPerMinute: activityConfig.starkexCallsPerMinute,
    timeout: undefined,
  })
  const dayTargetIndexer = new DayTargetIndexer(logger, clock)

  const indexers: ActivityIndexer[] = [dayTargetIndexer]

  activityConfig.projects.forEach((project) => {
    switch (project.config.type) {
      case 'rpc': {
        const rpcClient =
          project.id !== ProjectId('zkfair')
            ? peripherals.getClient(RpcClient, {
                url: project.config.url,
                callsPerMinute: project.config.callsPerMinute,
                chain: project.id,
              })
            : new RpcClient2({
                logger: logger.tag('zkfair'),
                http: new HttpClient2({ logger: logger.tag('zkfair') }),
                callsPerMinute: 10_000,
                url: project.config.url,
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
          peripherals,
        )

        indexers.push(blockTargetIndexer, activityIndexer)
        break
      }
      case 'starkex': {
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
          db: peripherals.database,
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
  peripherals: Peripherals,
): [BlockTargetIndexer, BlockActivityIndexer] {
  assert(project.config.type !== 'starkex')

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
    batchSize: getBatchSizeFromCallsPerMinute(project.config.callsPerMinute),
    minHeight: 1,
    parents: [blockTargetIndexer],
    txsCountProvider,
    indexerService,
    db: peripherals.database,
  })
  return [blockTargetIndexer, activityIndexer]
}
