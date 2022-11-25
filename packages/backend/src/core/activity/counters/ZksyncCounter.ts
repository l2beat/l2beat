import { HttpClient, Logger, promiseAllPlus } from '@l2beat/common'
import { ZksyncTransactionApiV2 } from '@l2beat/config'
import { ProjectId } from '@l2beat/types'
import { range } from 'lodash'

import { ZksyncTransactionRepository } from '../../../peripherals/database/activity-v2/ZksyncTransactionRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { Database } from '../../../peripherals/database/shared/Database'
import { ZksyncClient } from '../../../peripherals/zksync'
import { SequenceProcessor } from '../../SequenceProcessor'
import { TransactionCounter } from '../TransactionCounter'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export function createZksyncCounter(
  projectId: ProjectId,
  http: HttpClient,
  database: Database,
  sequenceProcessorRepository: SequenceProcessorRepository,
  logger: Logger,
  transactionApi: ZksyncTransactionApiV2,
): TransactionCounter {
  const batchSize = getBatchSizeFromCallsPerMinute(
    transactionApi.callsPerMinute,
  )
  const client = new ZksyncClient(http, logger, transactionApi.callsPerMinute)
  const zksyncRepository = new ZksyncTransactionRepository(database, logger)

  const processor = new SequenceProcessor(
    projectId.toString(),
    logger,
    sequenceProcessorRepository,
    {
      batchSize,
      startFrom: 1,
      getLatest: client.getLatestBlock.bind(client),
      processRange: async (from, to, trx) => {
        const queries = range(from, to + 1).map((blockNumber) => async () => {
          const transactions = await client.getTransactionsInBlock(blockNumber)

          return transactions.map((t, i) => {
            // Block 427 has a duplicated blockIndex
            const blockIndex =
              blockNumber === 427 && i === 1 ? t.blockIndex + 1 : t.blockIndex
            return {
              blockNumber,
              blockIndex,
              timestamp: t.createdAt,
            }
          })
        })

        const blockTransactions = await promiseAllPlus(queries, logger)
        await zksyncRepository.addMany(blockTransactions.flat(), trx)
      },
    },
  )

  return new TransactionCounter(projectId, processor, () =>
    zksyncRepository.getLastTimestamp(),
  )
}
