import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import { ProjectId } from '@l2beat/shared-pure'
import { range } from 'lodash'

import { BlockTransactionCountRepository } from '../../../peripherals/database/activity/BlockTransactionCountRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { LoopringClient } from '../../../peripherals/loopring'
import { promiseAllPlus } from '../../queue/promiseAllPlus'
import { SimpleActivityTransactionConfig } from '../ActivityTransactionConfig'
import { SequenceProcessor } from '../SequenceProcessor'
import { TransactionCounter } from '../TransactionCounter'
import { createBlockTransactionCounter } from './BlockTransactionCounter'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export function createLoopringCounter(
  projectId: ProjectId,
  http: HttpClient,
  blockRepository: BlockTransactionCountRepository,
  sequenceProcessorRepository: SequenceProcessorRepository,
  logger: Logger,
  options: SimpleActivityTransactionConfig<'loopring'>,
): TransactionCounter {
  const batchSize = getBatchSizeFromCallsPerMinute(options.callsPerMinute)
  const client = new LoopringClient(http, logger, options.url, {
    callsPerMinute: options.callsPerMinute,
  })

  const processor = new SequenceProcessor(
    projectId.toString(),
    logger,
    sequenceProcessorRepository,
    {
      batchSize,
      startFrom: 1,
      getLatest: client.getFinalizedBlockNumber.bind(client),
      processRange: async (from, to, trx, logger) => {
        const queries = range(from, to + 1).map((blockNumber) => async () => {
          const block = await client.getBlock(blockNumber)

          return {
            projectId,
            blockNumber,
            count: block.transactions,
            timestamp: block.createdAt,
          }
        })

        const blocks = await promiseAllPlus(queries, logger, {
          metricsId: 'LoopringBlockCounter',
        })
        await blockRepository.addOrUpdateMany(blocks, trx)
      },
    },
  )

  return createBlockTransactionCounter(projectId, processor, blockRepository)
}
