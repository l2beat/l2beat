import { HttpClient, Logger, promiseAllPlus } from '@l2beat/common'
import { LoopringTransactionApi } from '@l2beat/config'
import { ProjectId } from '@l2beat/types'
import { range } from 'lodash'

import { BlockTransactionCountRepository } from '../../../peripherals/database/activity/BlockTransactionCountRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { LoopringClient } from '../../../peripherals/loopring'
import { SequenceProcessor } from '../../SequenceProcessor'
import { TransactionCounter } from '../TransactionCounter'
import { createBlockTransactionCounter } from './BlockTransactionCounter'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export function createLoopringCounter(
  projectId: ProjectId,
  http: HttpClient,
  blockRepository: BlockTransactionCountRepository,
  sequenceProcessorRepository: SequenceProcessorRepository,
  logger: Logger,
  transactionApi: LoopringTransactionApi,
): TransactionCounter {
  const callsPerMinute = transactionApi.callsPerMinute
  const batchSize = getBatchSizeFromCallsPerMinute(callsPerMinute)
  const client = new LoopringClient(http, logger, { callsPerMinute })

  const processor = new SequenceProcessor(
    projectId.toString(),
    logger,
    sequenceProcessorRepository,
    {
      batchSize,
      startFrom: 1,
      getLatest: client.getFinalizedBlockNumber.bind(client),
      processRange: async (from, to, trx) => {
        const queries = range(from, to + 1).map((blockNumber) => async () => {
          const block = await client.getBlock(blockNumber)

          return {
            projectId,
            blockNumber,
            count: block.transactions,
            timestamp: block.createdAt,
          }
        })

        const blocks = await promiseAllPlus(queries, logger)
        await blockRepository.addMany(blocks, trx)
      },
    },
  )

  return createBlockTransactionCounter(projectId, processor, blockRepository)
}
