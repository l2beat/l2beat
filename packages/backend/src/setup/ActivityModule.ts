import { HttpClient, Logger } from '@l2beat/common'
import { ProjectId } from '@l2beat/types'

import { ActivityController } from '../api/controllers/ActivityController'
import { createActivityRouter } from '../api/routers/ActivityRouter'
import { Config } from '../config'
import { Clock } from '../core/Clock'
import { LoopringTransactionUpdater } from '../core/transaction-count/LoopringTransactionUpdater'
import { MaterializedViewRefresher } from '../core/transaction-count/MaterializedViewRefresher'
import { ZksyncTransactionUpdater } from '../core/transaction-count/ZksyncTransactionUpdater'
import { BlockTransactionCountRepository } from '../peripherals/database/BlockTransactionCountRepository'
import { Database } from '../peripherals/database/shared/Database'
import { StarkexTransactionCountRepository } from '../peripherals/database/StarkexTransactionCountRepository'
import { ZksyncTransactionRepository } from '../peripherals/database/ZksyncTransactionRepository'
import { LoopringClient } from '../peripherals/loopring'
import { StarkexClient } from '../peripherals/starkex'
import { ZksyncClient } from '../peripherals/zksync'
import {
  createEthereumTransactionUpdater,
  createLayer2RpcTransactionUpdaters,
} from './createRpcTransactionUpdaters'
import { createStarkexTransactionUpdaters } from './createStarkexTransactionUpdaters'

export function getActivityModule(
  config: Config,
  logger: Logger,
  http: HttpClient,
  database: Database,
  clock: Clock,
) {
  if (!config.transactionCountSync) {
    return undefined
  }

  const starkexClient = new StarkexClient(
    config.transactionCountSync.starkexApiKey,
    http,
    logger,
    {
      callsPerMinute: config.transactionCountSync.starkexCallsPerMinute,
    },
  )

  const zksyncClient = new ZksyncClient(http, logger)
  const loopringClient = new LoopringClient(http, logger, {
    callsPerMinute: config.transactionCountSync.loopringCallsPerMinute,
  })

  const blockTransactionCountRepository = new BlockTransactionCountRepository(
    database,
    logger,
  )
  const starkexTransactionCountRepository =
    new StarkexTransactionCountRepository(database, logger)
  const zksyncTransactionRepository = new ZksyncTransactionRepository(
    database,
    logger,
  )

  const materializedViewRefresher = new MaterializedViewRefresher(
    blockTransactionCountRepository,
    zksyncTransactionRepository,
    clock,
    logger,
  )

  const layer2RpcTransactionUpdaters = createLayer2RpcTransactionUpdaters(
    config,
    blockTransactionCountRepository,
    clock,
    http,
    logger,
  )

  const ethereumTransactionUpdater = createEthereumTransactionUpdater(
    config.transactionCountSync,
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
    { workQueueWorkers: config.transactionCountSync.zkSyncWorkQueueWorkers },
  )

  const loopringTransactionUpdater = new LoopringTransactionUpdater(
    loopringClient,
    blockTransactionCountRepository,
    clock,
    logger,
    ProjectId.LOOPRING,
    { workQueueWorkers: config.transactionCountSync.loopringWorkQueueWorkers },
  )

  const activityController = new ActivityController(
    [
      ...layer2RpcTransactionUpdaters,
      ...starkexTransactionUpdaters,
      zksyncTransactionUpdater,
      loopringTransactionUpdater,
    ],
    ethereumTransactionUpdater,
  )

  const router = createActivityRouter(activityController)

  const start = () => {
    logger.info('Starting Activity Module')

    materializedViewRefresher.start()

    for (const updater of layer2RpcTransactionUpdaters) {
      updater.start()
    }
    for (const updater of starkexTransactionUpdaters) {
      updater.start()
    }
    zksyncTransactionUpdater.start()
    loopringTransactionUpdater.start()
    ethereumTransactionUpdater.start()
  }

  return {
    router,
    start,
  }
}
