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
import { ActivityServices } from './services/ActivityServices'
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

  const services = new ActivityServices(config.activity, providers.block)

  const indexers = createActivityIndexers(
    config.activity,
    logger,
    clock,
    providers,
    services,
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
  services: ActivityServices,
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
          services,
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
          services,
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
  services: ActivityServices,
  indexerService: IndexerService,
  database: Database,
  logger: Logger,
): [BlockTargetIndexer, BlockActivityIndexer] {
  assert(project.config.type !== 'starkex')

  const blockTimestampProvider = providers.block.getBlockTimestampProvider(
    project.id,
  )
  const blockTargetIndexer = new BlockTargetIndexer(
    logger,
    clock,
    blockTimestampProvider,
    project.id,
  )

  const txsCountService = services.getTxsCountService(project.id)

  const activityIndexer = new BlockActivityIndexer({
    logger,
    projectId: project.id,
    batchSize: getBatchSizeFromCallsPerMinute(project.config.callsPerMinute),
    minHeight: 1,
    parents: [blockTargetIndexer],
    txsCountService,
    indexerService,
    db: database,
  })
  return [blockTargetIndexer, activityIndexer]
}

function createStarkexIndexer(
  dayTargetIndexer: DayTargetIndexer,
  project: { id: ProjectId; config: ActivityTransactionConfig },
  services: ActivityServices,
  indexerService: IndexerService,
  database: Database,
  logger: Logger,
) {
  assert(project.config.type === 'starkex')

  const txsCountService = services.getTxsCountService(project.id)

  const activityIndexer = new DayActivityIndexer({
    logger,
    projectId: project.id,
    batchSize: 10,
    minHeight: project.config.sinceTimestamp.toStartOf('day').toDays() ?? 0,
    uncertaintyBuffer: project.config.resyncLastDays,
    parents: [dayTargetIndexer],
    txsCountService,
    indexerService,
    db: database,
  })
  return activityIndexer
}
