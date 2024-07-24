import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { ProjectId, notUndefined } from '@l2beat/shared-pure'
import { Config } from '../../config'
import { Peripherals } from '../../peripherals/Peripherals'
import { AztecClient } from '../../peripherals/aztec/AztecClient'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'
import { Clock } from '../../tools/Clock'
import { IndexerConfigurationRepository } from '../../tools/uif/IndexerConfigurationRepository'
import { IndexerService } from '../../tools/uif/IndexerService'
import { IndexerStateRepository } from '../../tools/uif/IndexerStateRepository'
import { ApplicationModule } from '../ApplicationModule'
import { BlockTimestampProvider } from '../tvl/services/BlockTimestampProvider'
import { ActivityIndexer } from './indexers/ActivityIndexer'
import { BlockTargetIndexer } from './indexers/BlockTargetIndexer'
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
      indexers.map(async (p) => {
        await p.blockTargetIndexer.start()
        await p.activityIndexer.start()
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
): {
  blockTargetIndexer: BlockTargetIndexer
  activityIndexer: ActivityIndexer
}[] {
  if (!activityConfig) {
    return []
  }
  const activityRepository = db.activity
  const indexerService = new IndexerService(
    peripherals.getRepository(IndexerStateRepository),
    peripherals.getRepository(IndexerConfigurationRepository),
  )
  console.log(activityConfig.projects)
  return activityConfig.projects
    .filter((p) => p.id === ProjectId('aztec'))
    .flatMap((project) => {
      const txsCountProvider = new TxsCountProvider({
        logger,
        peripherals,
        projectId: project.id,
        projectConfig: project.config,
        activityConfig,
      })

      switch (project.config.type) {
        case 'rpc': {
          const blockTimestampProvider = new BlockTimestampProvider({
            client: peripherals.getClient(RpcClient, {
              url: project.config.url,
              callsPerMinute: project.config.callsPerMinute,
            }),
            logger,
          })
          const blockTargetIndexer = new BlockTargetIndexer(
            logger,
            clock,
            blockTimestampProvider,
          )

          const activityIndexer = new ActivityIndexer({
            logger,
            projectId: project.id,
            // TODO: add batchSize to config
            batchSize: 100,
            minHeight: project.config.startBlock ?? 0,
            parents: [blockTargetIndexer],
            txsCountProvider,
            indexerService,
            activityRepository,
          })

          return { blockTargetIndexer, activityIndexer }
        }
        case 'aztec': {
          const blockTimestampProvider = new BlockTimestampProvider({
            client: peripherals.getClient(AztecClient, {
              url: project.config.url,
              callsPerMinute: project.config.callsPerMinute,
            }),
            logger,
          })
          const blockTargetIndexer = new BlockTargetIndexer(
            logger,
            clock,
            blockTimestampProvider,
          )

          const activityIndexer = new ActivityIndexer({
            logger,
            projectId: project.id,
            // TODO: add batchSize to config
            batchSize: 100,
            minHeight: 0,
            parents: [blockTargetIndexer],
            txsCountProvider,
            indexerService,
            activityRepository,
          })

          return { blockTargetIndexer, activityIndexer }
        }
      }
    })
    .filter(notUndefined)
}
