import { HttpClient, Logger, promiseAllPlus } from '@l2beat/common'
import { ZksyncTransactionApi } from '@l2beat/config'
import { ProjectId } from '@l2beat/types'
import { range } from 'lodash'

import { ZksyncTransactionRepository } from '../../../peripherals/database/activity-v2/ZksyncTransactionRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { Database } from '../../../peripherals/database/shared/Database'
import { ZksyncClient } from '../../../peripherals/zksync'
import { SequenceProcessor } from '../../SequenceProcessor'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export function createZksyncProcessor({
  projectId,
  transactionApi,
  logger,
  sequenceProcessorRepository,
  http,
  database,
}: {
  projectId: ProjectId
  transactionApi: ZksyncTransactionApi
  logger: Logger
  http: HttpClient
  sequenceProcessorRepository: SequenceProcessorRepository
  database: Database
}): SequenceProcessor {
  const batchSize = getBatchSizeFromCallsPerMinute(
    transactionApi.callsPerMinute,
  )
  const client = new ZksyncClient(http, logger, transactionApi.callsPerMinute)
  const zksyncRepository = new ZksyncTransactionRepository(database, logger)

  return new SequenceProcessor({
    id: projectId.toString(),
    batchSize,
    logger,
    repository: sequenceProcessorRepository,
    startFrom: 1,
    getLast: client.getLatestBlock.bind(client),
    processRange: async (from, to, trx) => {
      const fns = range(from, to + 1).map((blockNumber) => async () => {
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

      const blockTransactions = await promiseAllPlus(fns, logger)

      await zksyncRepository.addMany(blockTransactions.flat(), trx)
    },
  })
}
