import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Config } from '../../config'
import { Peripherals } from '../../peripherals/Peripherals'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'
import { Clock } from '../../tools/Clock'
import { IndexerService } from '../../tools/uif/IndexerService'
import { ApplicationModule } from '../ApplicationModule'
import { BlockTimestampProvider } from '../tvl/services/BlockTimestampProvider'
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

  const activityRepository = db.activity
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
      case 'rpc': {
        const blockTimestampProvider = new BlockTimestampProvider({
          rpcClient: peripherals.getClient(RpcClient, {
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

        const activityIndexer = new BlockActivityIndexer({
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

        indexers.push(blockTargetIndexer, activityIndexer)
        break
      }
      case 'starkex': {
        const activityIndexer = new DayActivityIndexer({
          logger,
          projectId: project.id,
          batchSize: getBatchSizeFromCallsPerMinute(
            activityConfig.starkexCallsPerMinute,
          ),
          minHeight: UnixTime.now().toStartOf('day').add(-3, 'days').toDays(), //project.config.sinceTimestamp.toStartOf('day').toDays() ?? 0,
          parents: [dayTargetIndexer],
          txsCountProvider,
          indexerService,
          activityRepository,
        })

        indexers.push(activityIndexer)
        break
      }
    }
  })

  return indexers
}

function getBatchSizeFromCallsPerMinute(
  callsPerMinute: number,
  batchDurationSeconds = 60,
): number {
  assert(
    callsPerMinute >= batchDurationSeconds,
    `callsPerMinute=${callsPerMinute} must be greater or equal to batchDurationSeconds=${batchDurationSeconds}`,
  )
  return Math.floor(callsPerMinute / batchDurationSeconds)
}
