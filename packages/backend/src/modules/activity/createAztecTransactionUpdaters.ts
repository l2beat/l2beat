import { HttpClient, Logger } from '@l2beat/common'

import { Config } from '../../config/Config'
import { Clock } from '../../core/Clock'
import { AztecTransactionUpdater } from '../../core/transaction-count/AztecTransactionUpdater'
import { AztecClient } from '../../peripherals/aztec'
import { BlockTransactionCountRepository } from '../../peripherals/database/BlockTransactionCountRepository'

export function createAztecTransactionUpdaters(
  httpClient: HttpClient,
  blockTransactionCountRepository: BlockTransactionCountRepository,
  clock: Clock,
  logger: Logger,
  config: Config,
) {
  const workQueueWorkers = config.activity
    ? config.activity.aztecWorkQueueWorkers
    : 1
  const updaters = []

  for (const { transactionApi, projectId } of config.projects) {
    if (transactionApi?.type !== 'aztec') continue
    const aztecClient = new AztecClient(
      httpClient,
      transactionApi.url,
      transactionApi.callsPerMinute,
    )
    const updater = new AztecTransactionUpdater(
      aztecClient,
      blockTransactionCountRepository,
      clock,
      logger,
      projectId,
      {
        workQueueWorkers,
      },
    )
    updaters.push(updater)
  }

  return updaters
}
