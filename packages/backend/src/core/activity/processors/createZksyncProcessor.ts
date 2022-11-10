import { HttpClient, Logger } from '@l2beat/common'
import { ZksyncTransactionApi } from '@l2beat/config'
import { ProjectId } from '@l2beat/types'

import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { Database } from '../../../peripherals/database/shared/Database'
import { ZksyncTransactionRepository } from '../../../peripherals/database/transactions/ZksyncTransactionRepository'
import { ZksyncClient } from '../../../peripherals/zksync'
import { BatchDownloader } from '../../BatchDownloader'
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
  const batchDownloader = new BatchDownloader(
    batchSize,
    async (blockNumber) => {
      const transactions = await client.getTransactionsInBlock(blockNumber)
      return transactions.map((t) => {
        // Block 427 has a duplicated blockIndex
        const blockIndex = blockNumber === 427 ? t.blockIndex + 1 : t.blockIndex
        return {
          blockNumber,
          blockIndex,
          timestamp: t.createdAt,
        }
      })
    },
    logger,
  )
  const zksyncRepository = new ZksyncTransactionRepository(database, logger)
  return new SequenceProcessor({
    id: projectId.toString(),
    batchSize,
    logger,
    repository: sequenceProcessorRepository,
    startFrom: 1,
    getLast: client.getLatestBlock.bind(client),
    processRange: async (from, to, trx) => {
      const blockTransactions = await batchDownloader.download(from, to)
      await zksyncRepository.addOrUpdateMany(blockTransactions.flat(), trx)
    },
  })
}
