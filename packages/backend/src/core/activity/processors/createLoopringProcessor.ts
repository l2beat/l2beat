import { HttpClient, Logger } from '@l2beat/common'
import { LoopringTransactionApi } from '@l2beat/config'
import { ProjectId } from '@l2beat/types'

import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { BlockRepository } from '../../../peripherals/database/transactions/BlockRepository'
import { LoopringClient } from '../../../peripherals/loopring'
import { BatchDownloader } from '../../BatchDownloader'
import { SequenceProcessor } from '../../SequenceProcessor'

// ---- LOOPRING ----
export function createLoopringProcessor({
  projectId,
  transactionApi,
  logger,
  sequenceProcessorRepository,
  http,
  blockRepository,
}: {
  projectId: ProjectId
  transactionApi: LoopringTransactionApi
  blockRepository: BlockRepository
  logger: Logger
  http: HttpClient
  sequenceProcessorRepository: SequenceProcessorRepository
}): SequenceProcessor {
  const callsPerMinute = transactionApi.callsPerMinute
  const batchSize = callsPerMinute * 60
  const client = new LoopringClient(http, logger, { callsPerMinute })
  const batchDownloader = new BatchDownloader(
    batchSize,
    async (blockNumber) => {
      const block = await client.getBlock(blockNumber)
      return {
        projectId,
        blockNumber,
        count: block.transactions,
        timestamp: block.createdAt,
      }
    },
    logger,
  )
  return new SequenceProcessor({
    id: projectId.toString(),
    batchSize,
    logger,
    repository: sequenceProcessorRepository,
    startFrom: 1,
    getLast: client.getFinalizedBlockNumber.bind(client),
    processRange: async (from, to, trx) => {
      const blocks = await batchDownloader.download(from, to)
      await blockRepository.addOrUpdateMany(blocks, trx)
    },
  })
}
