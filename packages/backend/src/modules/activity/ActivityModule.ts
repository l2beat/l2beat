import { HttpClient, Logger } from '@l2beat/common'
import { ProjectId } from '@l2beat/types'

import { ActivityController } from '../../api/controllers/activity/ActivityController'
import { createActivityRouter } from '../../api/routers/ActivityRouter'
import { Config } from '../../config'
import { Clock } from '../../core/Clock'
import { LoopringTransactionUpdater } from '../../core/transaction-count/LoopringTransactionUpdater'
import { MaterializedViewRefresher } from '../../core/transaction-count/MaterializedViewRefresher'
import { ZksyncTransactionUpdater } from '../../core/transaction-count/ZksyncTransactionUpdater'
import { BlockTipRepository } from '../../peripherals/database/BlockTipRepository'
import { BlockTransactionCountRepository } from '../../peripherals/database/BlockTransactionCountRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { StarkexTransactionCountRepository } from '../../peripherals/database/StarkexTransactionCountRepository'
import { ZksyncTransactionRepository } from '../../peripherals/database/ZksyncTransactionRepository'
import { LoopringClient } from '../../peripherals/loopring'
import { StarkexClient } from '../../peripherals/starkex'
import { ZksyncClient } from '../../peripherals/zksync'
import { ApplicationModule } from '../ApplicationModule'
import { createAztecTransactionUpdaters } from './createAztecTransactionUpdaters'
import {
  createEthereumTransactionUpdater,
  createLayer2RpcTransactionUpdaters,
} from './createRpcTransactionUpdaters'
import { createStarkexTransactionUpdaters } from './createStarkexTransactionUpdaters'

export function createActivityModule(
  config: Config,
  logger: Logger,
  http: HttpClient,
  database: Database,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.activity) {
    return
  }

  const starkexClient = new StarkexClient(
    config.activity.starkexApiKey,
    http,
    logger,
    {
      callsPerMinute: config.activity.starkexCallsPerMinute,
    },
  )

  const zksyncClient = new ZksyncClient(http, logger, 3000)
  const loopringClient = new LoopringClient(http, logger, {
    callsPerMinute: config.activity.loopringCallsPerMinute,
  })

  const blockTipRepository = new BlockTipRepository(database, logger)
  const blockTransactionCountRepository = new BlockTransactionCountRepository(
    database,
    logger,
    blockTipRepository,
  )
  const starkexTransactionCountRepository =
    new StarkexTransactionCountRepository(database, logger)
  const zksyncTransactionRepository = new ZksyncTransactionRepository(
    database,
    logger,
    blockTipRepository,
  )

  const layer2RpcTransactionUpdaters = createLayer2RpcTransactionUpdaters(
    config,
    blockTransactionCountRepository,
    clock,
    http,
    logger,
  )

  const loopringTransactionUpdater = new LoopringTransactionUpdater(
    loopringClient,
    blockTransactionCountRepository,
    clock,
    logger,
    ProjectId.LOOPRING,
    { workQueueWorkers: config.activity.loopringWorkQueueWorkers },
  )

  const aztecTransactionUpdaters = createAztecTransactionUpdaters(
    http,
    blockTransactionCountRepository,
    clock,
    logger,
    config,
  )

  const ethereumTransactionUpdater = createEthereumTransactionUpdater(
    config.activity,
    blockTransactionCountRepository,
    clock,
    logger,
  )

  const starkexTransactionUpdaters = createStarkexTransactionUpdaters(
    config,
    starkexTransactionCountRepository,
    starkexClient,
    clock,
    logger,
  )

  const zksyncTransactionUpdater = new ZksyncTransactionUpdater(
    zksyncClient,
    zksyncTransactionRepository,
    clock,
    logger,
    { workQueueWorkers: config.activity.zkSyncWorkQueueWorkers },
  )

  const layer2BlockTransactionUpdaters = [
    ...layer2RpcTransactionUpdaters,
    ...aztecTransactionUpdaters,
    loopringTransactionUpdater,
  ]

  const materializedViewRefresher = new MaterializedViewRefresher(
    blockTransactionCountRepository,
    zksyncTransactionRepository,
    [...layer2BlockTransactionUpdaters, ethereumTransactionUpdater],
    [...starkexTransactionUpdaters, zksyncTransactionUpdater],
    clock,
    logger,
    config.activity.starkexApiDelayHours,
  )

  const activityController = new ActivityController(
    [
      ...layer2BlockTransactionUpdaters,
      ...starkexTransactionUpdaters,
      zksyncTransactionUpdater,
    ].filter((updater) =>
      config.projects.some(
        (p) =>
          p.projectId === updater.projectId &&
          !p.transactionApi?.excludeFromActivityApi,
      ),
    ),
    ethereumTransactionUpdater,
  )

  const activityRouter = createActivityRouter(activityController)

  const start = () => {
    if (!config.syncEnabled) {
      return
    }

    logger = logger.for('ActivityModule')
    logger.info('Starting')

    materializedViewRefresher.start()

    for (const updater of [
      ...layer2BlockTransactionUpdaters,
      ...starkexTransactionUpdaters,
      zksyncTransactionUpdater,
      ethereumTransactionUpdater,
    ]) {
      updater.start()
    }

    logger.info('Started')
  }

  return {
    routers: [activityRouter],
    start,
  }
}
