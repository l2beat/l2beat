import { HttpClient, Logger, promiseAllPlus } from '@l2beat/common'
import { LoopringTransactionApi } from '@l2beat/config'
import { ProjectId } from '@l2beat/types'
import { range } from 'lodash'

import { BlockTransactionCountRepository } from '../../../peripherals/database/activity-v2/BlockTransactionCountRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { LoopringClient } from '../../../peripherals/loopring'
import { SequenceProcessor } from '../../SequenceProcessor'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

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
  blockRepository: BlockTransactionCountRepository
  logger: Logger
  http: HttpClient
  sequenceProcessorRepository: SequenceProcessorRepository
}): SequenceProcessor {
  const callsPerMinute = transactionApi.callsPerMinute
  const batchSize = getBatchSizeFromCallsPerMinute(callsPerMinute)
  const client = new LoopringClient(http, logger, { callsPerMinute })

  return new SequenceProcessor({
    id: projectId.toString(),
    batchSize,
    logger,
    repository: sequenceProcessorRepository,
    startFrom: 1,
    getLast: client.getFinalizedBlockNumber.bind(client),
    processRange: async (from, to, trx) => {
      const fns = range(from, to + 1).map((blockNumber) => async () => {
        const block = await client.getBlock(blockNumber)

        return {
          projectId,
          blockNumber,
          count: block.transactions,
          timestamp: block.createdAt,
        }
      })

      const blocks = await promiseAllPlus(fns, logger)
      await blockRepository.addMany(blocks, trx)
    },
  })
}
