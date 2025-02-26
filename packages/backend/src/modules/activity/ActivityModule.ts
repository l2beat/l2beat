import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { assert } from '@l2beat/shared-pure'
import type { Config } from '../../config'
import type { ActivityConfig, ActivityConfigProject } from '../../config/Config'
import type { Providers } from '../../providers/Providers'
import type { Clock } from '../../tools/Clock'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule } from '../ApplicationModule'
import { ActivityDependencies } from './ActivityDependencies'
import { BlockActivityIndexer } from './indexers/BlockActivityIndexer'
import { BlockTargetIndexer } from './indexers/BlockTargetIndexer'
import { DayActivityIndexer } from './indexers/DayActivityIndexer'
import { DayTargetIndexer } from './indexers/DayTargetIndexer'
import type { ActivityIndexer } from './indexers/types'

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
    switch (project.activityConfig.type) {
      case 'block': {
        const { blockTargetIndexer, activityIndexer } =
          createBlockBasedIndexers(
            clock,
            project,
            dependencies,
            indexerService,
            logger,
          )

        indexers.push(blockTargetIndexer, activityIndexer)
        break
      }
      case 'day': {
        const activityIndexer = createDayActivityIndexer(
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
  project: ActivityConfigProject,
  dependencies: ActivityDependencies,
  indexerService: IndexerService,
  logger: Logger,
) {
  assert(project.activityConfig.type === 'block')

  const blockTimestampProvider = dependencies.getBlockTimestampProvider(
    project.id,
  )
  const blockTargetIndexer = new BlockTargetIndexer(
    logger,
    clock,
    blockTimestampProvider,
    dependencies.database,
    project.id,
  )

  const txsCountService = dependencies.getTxsCountService(project.id)

  const activityIndexer = new BlockActivityIndexer({
    logger,
    projectId: project.id,
    batchSize: project.batchSize,
    minHeight: 1,
    parents: [blockTargetIndexer],
    txsCountService,
    indexerService,
    db: dependencies.database,
  })
  return { blockTargetIndexer, activityIndexer }
}

function createDayActivityIndexer(
  dayTargetIndexer: DayTargetIndexer,
  project: ActivityConfigProject,
  dependencies: ActivityDependencies,
  indexerService: IndexerService,
  logger: Logger,
) {
  assert(project.activityConfig.type === 'day')

  const txsCountService = dependencies.getTxsCountService(project.id)

  const activityIndexer = new DayActivityIndexer({
    logger,
    projectId: project.id,
    batchSize: 10,
    minHeight:
      project.activityConfig.sinceTimestamp.toStartOf('day').toDays() ?? 0,
    uncertaintyBuffer: project.activityConfig.resyncLastDays ?? 0,
    parents: [dayTargetIndexer],
    txsCountService,
    indexerService,
    db: dependencies.database,
  })
  return activityIndexer
}
