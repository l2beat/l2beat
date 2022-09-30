import { HttpClient, Logger } from '@l2beat/common'

import { ActivityController } from '../api/controllers/ActivityController'
import { createActivityRouter } from '../api/routers/ActivityRouter'
import { Config } from '../config'
import { Clock } from '../core/Clock'
import { ZksyncTransactionUpdater } from '../core/transaction-count/ZksyncTransactionUpdater'
import { RpcTransactionCountRepository } from '../peripherals/database/RpcTransactionCountRepository'
import { Database } from '../peripherals/database/shared/Database'
import { StarkexTransactionCountRepository } from '../peripherals/database/StarkexTransactionCountRepository'
import { ZksyncTransactionRepository } from '../peripherals/database/ZksyncTransactionRepository'
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
    config.transactionCountSync.starkexApiUrl,
    config.transactionCountSync.starkexApiKey,
    http,
    logger,
  )

  const zksyncClient = new ZksyncClient(http, logger)

  const rpcTransactionCountRepository = new RpcTransactionCountRepository(
    database,
    logger,
  )
  const starkexTransactionCountRepository =
    new StarkexTransactionCountRepository(database, logger)
  const zksyncTransactionRepository = new ZksyncTransactionRepository(
    database,
    logger,
  )

  const layer2RpcTransactionUpdaters = createLayer2RpcTransactionUpdaters(
    config,
    rpcTransactionCountRepository,
    clock,
    logger,
  )

  const ethereumTransactionUpdater = createEthereumTransactionUpdater(
    rpcTransactionCountRepository,
    clock,
    logger,
    config.transactionCountSync.ethereumAlchemyApiKey,
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

  const activityController = new ActivityController(
    [
      ...layer2RpcTransactionUpdaters,
      ...starkexTransactionUpdaters,
      zksyncTransactionUpdater,
    ],
    ethereumTransactionUpdater,
  )

  const router = createActivityRouter(activityController)

  const start = () => {
    logger.info('Starting Activity Module')

    for (const updater of layer2RpcTransactionUpdaters) {
      updater.start()
    }
    for (const updater of starkexTransactionUpdaters) {
      updater.start()
    }
    zksyncTransactionUpdater.start()
    ethereumTransactionUpdater.start()
  }

  return {
    router,
    start,
  }
}
