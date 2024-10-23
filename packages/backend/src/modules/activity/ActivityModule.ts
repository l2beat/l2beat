import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { Config } from '../../config'
import {
  BlockscoutChainConfig,
  EtherscanChainConfig,
} from '../../config/Config'
import { Clock } from '../../tools/Clock'
import { IndexerService } from '../../tools/uif/IndexerService'
import { ApplicationModule } from '../ApplicationModule'
import { ActivityTransactionConfig } from '../activity/ActivityTransactionConfig'
import { Providers } from '../providers/Providers'
import { BlockActivityIndexer } from './indexers/BlockActivityIndexer'
import { BlockTargetIndexer } from './indexers/BlockTargetIndexer'
import { DayActivityIndexer } from './indexers/DayActivityIndexer'
import { DayTargetIndexer } from './indexers/DayTargetIndexer'
import { ActivityIndexer } from './indexers/types'
import { getBatchSizeFromCallsPerMinute } from './utils/getBatchSizeFromCallsPerMinute'

export function createActivityModule(
  config: Config,
  logger: Logger,
  clock: Clock,
  providers: Providers,
  database: Database,
): ApplicationModule | undefined {
  if (!config.activity) {
    logger.info('Activity module disabled')
    return
  }

  const indexers = createActivityIndexers(
    config.activity,
    logger,
    clock,
    providers,
    database,
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
  logger: Logger,
  clock: Clock,
  providers: Providers,
  database: Database,
): ActivityIndexer[] {
  assert(activityConfig, 'Config should be defined there')

  const indexerService = new IndexerService(database)

  const dayTargetIndexer = new DayTargetIndexer(logger, clock)

  const indexers: ActivityIndexer[] = [dayTargetIndexer]

  activityConfig.projects.forEach((project) => {
    switch (project.config.type) {
      case 'rpc':
      case 'zksync':
      case 'starknet':
      case 'loopring':
      case 'degate': {
        const [blockTargetIndexer, activityIndexer] = createBlockBasedIndexers(
          clock,
          logger,
          project,
          indexerService,
          providers,
          database,
        )

        indexers.push(blockTargetIndexer, activityIndexer)
        break
      }

      case 'starkex': {
        const txsCountProvider = providers.getTxsCountProvider(project.id)

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
          db: database,
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
  project: {
    id: ProjectId
    config: ActivityTransactionConfig
    blockExplorerConfig:
      | EtherscanChainConfig
      | BlockscoutChainConfig
      | undefined
  },
  indexerService: IndexerService,
  providers: Providers,
  database: Database,
): [BlockTargetIndexer, BlockActivityIndexer] {
  assert(project.config.type !== 'starkex')

  const blockTimestampProvider = providers.getBlockTimestampProvider(project.id)
  const blockTargetIndexer = new BlockTargetIndexer(
    logger,
    clock,
    blockTimestampProvider,
    project.id,
  )

  const txsCountProvider = providers.getTxsCountProvider(project.id)

  const activityIndexer = new BlockActivityIndexer({
    logger,
    projectId: project.id,
    batchSize: getBatchSizeFromCallsPerMinute(project.config.callsPerMinute),
    minHeight: 1,
    parents: [blockTargetIndexer],
    txsCountProvider,
    indexerService,
    db: database,
  })
  return [blockTargetIndexer, activityIndexer]
}
