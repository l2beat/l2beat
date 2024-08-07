import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { Config } from '../../config'
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
import { ActivityIndexer } from './indexers/types'
import { BaseTxsCountProvider } from './services/BaseTxsCountProvider'
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
    logger = logger.for('Activity2Module')
    logger.info('Starting')
    await Promise.all(
      indexers.map(async (indexer) => {
        await indexer.start()
      }),
    )
    logger.info('Started')
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
  if (!activityConfig) {
    return []
  }

  const indexers: ActivityIndexer[] = []

  const indexerService = new IndexerService(db)

  const dayTargetIndexer = new DayTargetIndexer(logger, clock)
  indexers.push(dayTargetIndexer)

  activityConfig.projects.forEach((project) => {
    switch (project.config.type) {
      case 'rpc': {
        const rpcClient = peripherals.getClient(RpcClient, {
          url: project.config.url,
          callsPerMinute: project.config.callsPerMinute,
        })
        const txsCountProvider = new RpcTxsCountProvider(
          logger,
          project.id,
          rpcClient,
          project.config,
        )

        const [blockTargetIndexer, activityIndexer] = createIndexers(
          clock,
          logger,
          rpcClient,
          txsCountProvider,
          project,
          indexerService,
          db,
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
          logger,
          project.id,
          zksyncClient,
          project.config,
        )

        const [blockTargetIndexer, activityIndexer] = createIndexers(
          clock,
          logger,
          zksyncClient,
          txsCountProvider,
          project,
          indexerService,
          db,
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
          logger,
          project.id,
          starknetClient,
          project.config,
        )

        const [blockTargetIndexer, activityIndexer] = createIndexers(
          clock,
          logger,
          starknetClient,
          txsCountProvider,
          project,
          indexerService,
          db,
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
          logger,
          project.id,
          loopringClient,
          project.config,
        )

        const [blockTargetIndexer, activityIndexer] = createIndexers(
          clock,
          logger,
          loopringClient,
          txsCountProvider,
          project,
          indexerService,
          db,
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
          logger,
          project.id,
          degateClient,
          project.config,
        )

        const [blockTargetIndexer, activityIndexer] = createIndexers(
          clock,
          logger,
          degateClient,
          txsCountProvider,
          project,
          indexerService,
          db,
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
          logger,
          project.id,
          starkexClient,
          project.config,
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

function createIndexers(
  clock: Clock,
  logger: Logger,
  client: BaseClient,
  txsCountProvider: BaseTxsCountProvider,
  project: { id: ProjectId; config: ActivityTransactionConfig },
  indexerService: IndexerService,
  db: Database,
): [BlockTargetIndexer, BlockActivityIndexer] {
  assert(
    project.config.type === 'rpc' ||
      project.config.type === 'zksync' ||
      project.config.type === 'starknet' ||
      project.config.type === 'loopring' ||
      project.config.type === 'degate',
  )
  const blockTimestampProvider = new BlockTimestampProvider({
    client,
    logger,
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
