import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { Config } from '../../config'
import { ClientClass, Peripherals } from '../../peripherals/Peripherals'
import { DegateClient } from '../../peripherals/degate'
import { LoopringClient } from '../../peripherals/loopring/LoopringClient'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'
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
import { TxsCountProvider } from './services/TxsCountProvider'

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
    const txsCountProvider = new TxsCountProvider({
      logger,
      peripherals,
      projectId: project.id,
      projectConfig: project.config,
      activityConfig,
    })

    switch (project.config.type) {
      case 'rpc':
      case 'zksync':
      case 'starknet':
      case 'loopring':
      case 'degate': {
        const client = getProjectClient(project.config.type)
        const blockTargetIndexer = createBlockTargetIndexer(
          clock,
          peripherals,
          logger,
          client,
          project,
        )

        const activityIndexer = new BlockActivityIndexer({
          logger,
          projectId: project.id,
          // TODO: add batchSize to config
          batchSize: 100,
          minHeight:
            project.config.type === 'rpc' ? project.config.startBlock ?? 1 : 1,
          parents: [blockTargetIndexer],
          txsCountProvider,
          indexerService,
          db,
        })

        indexers.push(blockTargetIndexer, activityIndexer)
        break
      }
      case 'starkex': {
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

function getProjectClient(
  type: ActivityTransactionConfig['type'],
): ClientClass<BaseClient, { url: string; callsPerMinute: number }> {
  switch (type) {
    case 'rpc':
      return RpcClient
    case 'zksync':
      return ZksyncLiteClient
    case 'starknet':
      return StarknetClient
    case 'loopring':
      return LoopringClient
    case 'degate':
      return DegateClient
    default:
      throw new Error(`${type} type not supported`)
  }
}

function createBlockTargetIndexer<
  T extends ClientClass<BaseClient, { url: string; callsPerMinute: number }>,
>(
  clock: Clock,
  peripherals: Peripherals,
  logger: Logger,
  client: T,
  project: {
    id: ProjectId
    config: ActivityTransactionConfig
  },
): BlockTargetIndexer {
  assert(
    project.config.type === 'rpc' ||
      project.config.type === 'zksync' ||
      project.config.type === 'starknet' ||
      project.config.type === 'loopring' ||
      project.config.type === 'degate',
  )
  const blockTimestampProvider = new BlockTimestampProvider({
    client: peripherals.getClient(client, {
      url: project.config.url,
      callsPerMinute: project.config.callsPerMinute,
    }),
    logger,
  })
  return new BlockTargetIndexer(
    logger,
    clock,
    blockTimestampProvider,
    project.id,
  )
}
