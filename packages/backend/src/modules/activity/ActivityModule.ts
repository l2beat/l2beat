import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { assert, type ProjectId } from '@l2beat/shared-pure'
import type { Config } from '../../config'
import type { ActivityConfig } from '../../config/Config'
import type { Providers } from '../../providers/Providers'
import type { Clock } from '../../tools/Clock'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule } from '../ApplicationModule'
import { ActivityDependencies } from './ActivityDependencies'
import type { ActivityTransactionConfig } from './ActivityTransactionConfig'
import { BlockActivityIndexer } from './indexers/BlockActivityIndexer'
import { BlockTargetIndexer } from './indexers/BlockTargetIndexer'
import { DayActivityIndexer } from './indexers/DayActivityIndexer'
import { DayTargetIndexer } from './indexers/DayTargetIndexer'
import type { ActivityIndexer } from './indexers/types'
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
        const [blockTargetIndexer, activityIndexer] = createBlockBasedIndexer(
          clock,
          project,
          dependencies,
          indexerService,
          logger,
        )

        indexers.push(blockTargetIndexer, activityIndexer)
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

function createBlockBasedIndexer(
  clock: Clock,
  project: { id: ProjectId; config: ActivityTransactionConfig },
  dependencies: ActivityDependencies,
  indexerService: IndexerService,
  logger: Logger,
): [BlockTargetIndexer, BlockActivityIndexer] {
  assert(project.config.type !== 'starkex')

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
    batchSize: getBatchSizeFromCallsPerMinute(project.config.callsPerMinute),
    minHeight: 1,
    parents: [blockTargetIndexer],
    txsCountService,
    indexerService,
    db: dependencies.database,
  })
  return [blockTargetIndexer, activityIndexer]
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
