import { HttpClient, Logger, promiseAllPlus } from '@l2beat/common'
import { LoopringTransactionApiV2 } from '@l2beat/config'
import { ProjectId } from '@l2beat/types'
import { range } from 'lodash'

import { BlockTransactionCountRepository } from '../../../peripherals/database/activity-v2/BlockTransactionCountRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { LoopringClient } from '../../../peripherals/loopring'
import { SequenceProcessor } from '../../SequenceProcessor'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export function createLoopringProcessor(
  projectId: ProjectId,
  http: HttpClient,
  blockRepository: BlockTransactionCountRepository,
  sequenceProcessorRepository: SequenceProcessorRepository,
  logger: Logger,
  transactionApi: LoopringTransactionApiV2,
): SequenceProcessor {
  const callsPerMinute = transactionApi.callsPerMinute
  const batchSize = getBatchSizeFromCallsPerMinute(callsPerMinute)
  const client = new LoopringClient(http, logger, { callsPerMinute })

  return new SequenceProcessor(
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
}
