import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { Config } from '../../config'
import { ActivityConfig } from '../../config/Config'
import { Providers } from '../../providers/Providers'
import { Clock } from '../../tools/Clock'
import { IndexerService } from '../../tools/uif/IndexerService'
import { ApplicationModule } from '../ApplicationModule'
import { ActivityDependencies } from './ActivityDependencies'
import { ActivityTransactionConfig } from './ActivityTransactionConfig'
import { BlockActivityIndexer } from './indexers/BlockActivityIndexer'
import { BlockBackfillIndexer } from './indexers/BlockBackfillIndexer'
import { BlockTargetIndexer } from './indexers/BlockTargetIndexer'
import { DayActivityIndexer } from './indexers/DayActivityIndexer'
import { DayTargetIndexer } from './indexers/DayTargetIndexer'
import { ActivityIndexer } from './indexers/types'
import { getBatchSizeFromCallsPerMinute } from './utils/getBatchSizeFromCallsPerMinute'

export function initActivityModule(
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

  logger = logger.tag({
    feature: 'activity',
    module: 'activity',
  })

  const dependencies = new ActivityDependencies(
    config.activity,
    database,
    providers,
  )

  const indexers = createActivityIndexers(
    config.activity,
    logger,
    clock,
    dependencies,
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
  dependencies: ActivityDependencies,
): ActivityIndexer[] {
  const dayTargetIndexer = new DayTargetIndexer(logger, clock)
  const indexers: ActivityIndexer[] = [dayTargetIndexer]

  const indexerService = new IndexerService(dependencies.database)

  activityConfig.projects.forEach((project) => {
    switch (project.config.type) {
      case 'rpc':
      case 'zksync':
      case 'starknet':
      case 'loopring':
      case 'degate3':
      case 'fuel': {
        const [blockTargetIndexer, activityIndexer, backfillIndexer] =
          createBlockBasedIndexers(
            clock,
            project,
            dependencies,
            indexerService,
            logger,
          )

        indexers.push(blockTargetIndexer, activityIndexer)
        if (backfillIndexer) {
          indexers.push(backfillIndexer)
        }
        break
      }

      case 'starkex': {
        const activityIndexer = createStarkexIndexer(
          dayTargetIndexer,
          project,
          dependencies,
          indexerService,
          logger,
        )

        indexers.push(activityIndexer)
        break
      }
    }
  })
  return indexers
}

function createBlockBasedIndexers(
  clock: Clock,
  project: { id: ProjectId; config: ActivityTransactionConfig },
  dependencies: ActivityDependencies,
  indexerService: IndexerService,
  logger: Logger,
): [
  BlockTargetIndexer,
  BlockActivityIndexer,
  BlockBackfillIndexer | undefined,
] {
  assert(project.config.type !== 'starkex')

  const blockTimestampProvider = dependencies.getBlockTimestampProvider(
    project.id,
  )
  const blockTargetIndexer = new BlockTargetIndexer(
    logger,
    clock,
    blockTimestampProvider,
    project.id,
  )

  const txsCountService = dependencies.getTxsCountService(project.id)

  const activityIndexer = new BlockActivityIndexer({
    logger,
    projectId: project.id,
    batchSize: getBatchSizeFromCallsPerMinute(project.config.callsPerMinute),
    minHeight: project.config.startBlock ?? 1,
    cutOffPoint: project.config.cutOffPoint,
    parents: [blockTargetIndexer],
    txsCountService,
    indexerService,
    db: dependencies.database,
  })

  const backfillIndexer = project.config.cutOffPoint
    ? new BlockBackfillIndexer({
        logger,
        projectId: project.id,
        batchSize: getBatchSizeFromCallsPerMinute(
          project.config.callsPerMinute,
        ),
        minHeight: project.config.startBlock ?? 1,
        cutOffPoint: project.config.cutOffPoint,
        parents: [blockTargetIndexer],
        txsCountService,
        indexerService,
        db: dependencies.database,
      })
    : undefined

  return [blockTargetIndexer, activityIndexer, backfillIndexer]
}

function createStarkexIndexer(
  dayTargetIndexer: DayTargetIndexer,
  project: { id: ProjectId; config: ActivityTransactionConfig },
  dependencies: ActivityDependencies,
  indexerService: IndexerService,
  logger: Logger,
) {
  assert(project.config.type === 'starkex')

  const txsCountService = dependencies.getTxsCountService(project.id)

  const activityIndexer = new DayActivityIndexer({
    logger,
    projectId: project.id,
    batchSize: 10,
    minHeight: project.config.sinceTimestamp.toStartOf('day').toDays() ?? 0,
    uncertaintyBuffer: project.config.resyncLastDays,
    parents: [dayTargetIndexer],
    txsCountService,
    indexerService,
    db: dependencies.database,
  })
  return activityIndexer
}
