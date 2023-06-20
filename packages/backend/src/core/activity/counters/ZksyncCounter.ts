import { ZksyncTransactionApi } from '@l2beat/config'
import { HttpClient, Logger } from '@l2beat/shared'
import { ProjectId } from '@l2beat/shared-pure'
import { range } from 'lodash'

import { ZksyncTransactionRepository } from '../../../peripherals/database/activity/ZksyncTransactionRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { ZksyncClient } from '../../../peripherals/zksync'
import { promiseAllPlus } from '../../queue/promiseAllPlus'
import { SequenceProcessor } from '../../SequenceProcessor'
import { TransactionCounter } from '../TransactionCounter'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export function createZksyncCounter(
  projectId: ProjectId,
  http: HttpClient,
  zksyncRepository: ZksyncTransactionRepository,
  sequenceProcessorRepository: SequenceProcessorRepository,
  logger: Logger,
  transactionApi: ZksyncTransactionApi,
): TransactionCounter {
  const batchSize = getBatchSizeFromCallsPerMinute(
    transactionApi.callsPerMinute,
  )
  const client = new ZksyncClient(http, logger, transactionApi.callsPerMinute)

  const processor = new SequenceProcessor(
    projectId.toString(),
    logger,
    sequenceProcessorRepository,
    {
      batchSize,
      startFrom: 1,
      getLatest: client.getLatestBlock.bind(client),
      processRange: async (from, to, trx, logger) => {
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

        const blockTransactions = await promiseAllPlus(queries, logger, {
          metricsId: 'ZksyncBlockCounter',
        })
        await zksyncRepository.addOrUpdateMany(blockTransactions.flat(), trx)
      },
    },
  )

  return new TransactionCounter(projectId, processor, () =>
    zksyncRepository.findLastTimestamp(),
  )
}
