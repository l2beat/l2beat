import { HttpClient, Logger } from '@l2beat/common'
import { ProjectId } from '@l2beat/types'

import { ActivityController } from '../api/controllers/ActivityController'
import { createActivityRouter } from '../api/routers/ActivityRouter'
import { Config } from '../config'
import { Clock } from '../core/Clock'
import { LoopringTransactionUpdater } from '../core/transaction-count/LoopringTransactionUpdater'
import { ZksyncTransactionUpdater } from '../core/transaction-count/ZksyncTransactionUpdater'
import { BlockTransactionRepository } from '../peripherals/database/BlockTransactionRepository'
import { Database } from '../peripherals/database/shared/Database'
import { StarkexTransactionCountRepository } from '../peripherals/database/StarkexTransactionCountRepository'
import { ZksyncTransactionRepository } from '../peripherals/database/ZksyncTransactionRepository'
import { LoopringClient } from '../peripherals/loopring'
import { StarkexClient } from '../peripherals/starkex'
import { ZksyncClient } from '../peripherals/zksync'
import { createRpcTransactionUpdaters } from './createRpcTransactionUpdaters'
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
    config.transactionCountSync.starkexApiUrl,
    config.transactionCountSync.starkexApiKey,
    http,
    logger,
  )

  const zksyncClient = new ZksyncClient(http, logger)

  const loopringClient = new LoopringClient(http, logger)

  const blockTransactionRepository = new BlockTransactionRepository(
    database,
    logger,
  )
  const starkexTransactionCountRepository =
    new StarkexTransactionCountRepository(database, logger)
  const zksyncTransactionRepository = new ZksyncTransactionRepository(
    database,
    logger,
  )

  const rpcTransactionUpdaters = createRpcTransactionUpdaters(
    config,
    blockTransactionRepository,
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
  )

  const loopringTransactionUpdater = new LoopringTransactionUpdater(
    loopringClient,
    blockTransactionRepository,
    clock,
    logger,
    ProjectId('loopring'),
  )

  const activityController = new ActivityController([
    ...rpcTransactionUpdaters,
    ...starkexTransactionUpdaters,
    zksyncTransactionUpdater,
    loopringTransactionUpdater,
  ])

  const router = createActivityRouter(activityController)

  const start = () => {
    logger.info('Starting Activity Module')

    for (const updater of rpcTransactionUpdaters) {
      updater.start()
    }
    for (const updater of starkexTransactionUpdaters) {
      updater.start()
    }
    zksyncTransactionUpdater.start()
    loopringTransactionUpdater.start()
  }

  return {
    router,
    start,
  }
}
