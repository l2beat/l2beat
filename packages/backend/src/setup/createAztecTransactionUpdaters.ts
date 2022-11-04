import { HttpClient, Logger } from '@l2beat/common'
import { ProjectId } from '@l2beat/types'

import { Clock } from '../core/Clock'
import { AztecTransactionUpdater } from '../core/transaction-count/AztecTransactionUpdater'
import { AztecClient } from '../peripherals/aztec'
import { BlockTransactionCountRepository } from '../peripherals/database/BlockTransactionCountRepository'

export function createAztecTransactionUpdaters(
  httpClient: HttpClient,
  blockTransactionCountRepository: BlockTransactionCountRepository,
  clock: Clock,
  logger: Logger,
  workQueueWorkers: number,
) {
  const aztecClient = new AztecClient(httpClient, 'aztec')
  const aztecConnectClient = new AztecClient(httpClient, 'aztecconnect')
  const aztecTransactionUpdaters = [
    new AztecTransactionUpdater(
      aztecClient,
      blockTransactionCountRepository,
      clock,
      logger,
      ProjectId('aztec'),
      { workQueueWorkers },
    ),
    new AztecTransactionUpdater(
      aztecConnectClient,
      blockTransactionCountRepository,
      clock,
      logger,
      ProjectId('aztecconnect'),
      { workQueueWorkers },
    ),
  ]

  return aztecTransactionUpdaters
}
