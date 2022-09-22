import { Logger } from '@l2beat/common'

import { Config } from '../config'
import { Clock } from '../core/Clock'
import { StarkexTransactionCountUpdater } from '../core/transaction-count/StarkexTransactionCountUpdater'
import { StarkexTransactionCountRepository } from '../peripherals/database/StarkexTransactionCountRepository'
import { StarkexClient } from '../peripherals/starkex'

export function createStarkexTransactionUpdaters(
  config: Config,
  starkexTransactionCountRepository: StarkexTransactionCountRepository,
  starkexClient: StarkexClient,
  clock: Clock,
  logger: Logger,
) {
  const starkexUpdaters = []
  for (const project of config.projects) {
    if (project.transactionApi?.type === 'starkex') {
      const transactionUpdater = new StarkexTransactionCountUpdater(
        starkexTransactionCountRepository,
        starkexClient,
        clock,
        logger,
        project.transactionApi.product,
        project.projectId,
        project.transactionApi.sinceTimestamp,
      )

      starkexUpdaters.push(transactionUpdater)
    }
  }

  return starkexUpdaters
}
