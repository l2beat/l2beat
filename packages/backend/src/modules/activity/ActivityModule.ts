import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { Config } from '../../config'
import { ActivityConfig } from '../../config/Config'
import { Providers } from '../../providers/Providers'
import { Clock } from '../../tools/Clock'
import { IndexerService } from '../../tools/uif/IndexerService'
import { ApplicationModule } from '../ApplicationModule'
import { ActivityTransactionConfig } from '../activity/ActivityTransactionConfig'
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

  return {
    start: async () => {
      await Promise.all(
        indexers.map(async (indexer) => {
          await indexer.start()
        }),
      )
    },
  }
}

function createActivityIndexers(
  activityConfig: ActivityConfig,
  logger: Logger,
  clock: Clock,
  providers: Providers,
  database: Database,
): ActivityIndexer[] {
  const dayTargetIndexer = new DayTargetIndexer(logger, clock)
  const indexers: ActivityIndexer[] = [dayTargetIndexer]

  const indexerService = new IndexerService(database)

  activityConfig.projects.forEach((project) => {
    switch (project.config.type) {
      case 'rpc':
      case 'zksync':
      case 'starknet':
      case 'loopring':
      case 'degate': {
        const [blockTargetIndexer, activityIndexer] = createBlockBasedIndexer(
          clock,
          project,
          providers,
          indexerService,
          database,
          logger,
        )

        indexers.push(blockTargetIndexer, activityIndexer)
        break
      }

      case 'starkex': {
        const activityIndexer = createStarkexIndexer(
          dayTargetIndexer,
          project,
          providers,
          indexerService,
          database,
          logger,
        )

        indexers.push(activityIndexer)
        break
      }
    }
  })
  return indexers
}

function createBlockBasedIndexer(
  clock: Clock,
  project: { id: ProjectId; config: ActivityTransactionConfig },
  providers: Providers,
  indexerService: IndexerService,
  database: Database,
  logger: Logger,
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

function createStarkexIndexer(
  dayTargetIndexer: DayTargetIndexer,
  project: { id: ProjectId; config: ActivityTransactionConfig },
  providers: Providers,
  indexerService: IndexerService,
  database: Database,
  logger: Logger,
) {
  assert(project.config.type === 'starkex')

  const txsCountProvider = providers.getTxsCountProvider(project.id)

  const activityIndexer = new DayActivityIndexer({
    logger,
    projectId: project.id,
    batchSize: 10,
    minHeight: project.config.sinceTimestamp.toStartOf('day').toDays() ?? 0,
    uncertaintyBuffer: project.config.resyncLastDays,
    parents: [dayTargetIndexer],
    txsCountProvider,
    indexerService,
    db: database,
  })
  return activityIndexer
}
