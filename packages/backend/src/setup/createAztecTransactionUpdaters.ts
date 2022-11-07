import { HttpClient, Logger } from '@l2beat/common'
import { ProjectId } from '@l2beat/types'

import { Config } from '../config/Config'
import { Clock } from '../core/Clock'
import { AztecTransactionUpdater } from '../core/transaction-count/AztecTransactionUpdater'
import { AztecClient } from '../peripherals/aztec'
import { BlockTransactionCountRepository } from '../peripherals/database/BlockTransactionCountRepository'
import { assert } from '../tools/assert'

export function createAztecTransactionUpdaters(
  httpClient: HttpClient,
  blockTransactionCountRepository: BlockTransactionCountRepository,
  clock: Clock,
  logger: Logger,
  config: Config,
) {
  const workQueueWorkers = config.transactionCountSync
    ? config.transactionCountSync.aztecWorkQueueWorkers
    : 1
  return config.projects
    .filter(
      ({ projectId }) =>
        projectId === ProjectId.AZTEC || projectId === ProjectId.AZTEC_CONNECT,
    )
    .map(({ transactionApi }) => {
      assert(transactionApi?.type === 'rpc' && transactionApi.url)
      const aztecClient = new AztecClient(
        httpClient,
        transactionApi.url,
        transactionApi.callsPerMinute,
      )
      return new AztecTransactionUpdater(
        aztecClient,
        blockTransactionCountRepository,
        clock,
        logger,
        ProjectId('aztec'),
        {
          workQueueWorkers,
        },
      )
    })
}
