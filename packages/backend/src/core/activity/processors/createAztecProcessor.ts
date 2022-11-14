import { HttpClient, Logger, promiseAllThrottled } from '@l2beat/common'
import { AztecTransactionApi } from '@l2beat/config'
import { ProjectId } from '@l2beat/types'
import { range } from 'lodash'

import { AztecClient } from '../../../peripherals/aztec'
import { BlockTransactionCountRepository } from '../../../peripherals/database/activity-v2/BlockTransactionCountRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { SequenceProcessor } from '../../SequenceProcessor'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export function createAztecProcessor({
  projectId,
  transactionApi,
  logger,
  sequenceProcessorRepository,
  http,
  blockRepository,
}: {
  projectId: ProjectId
  transactionApi: AztecTransactionApi
  blockRepository: BlockTransactionCountRepository
  logger: Logger
  http: HttpClient
  sequenceProcessorRepository: SequenceProcessorRepository
}): SequenceProcessor {
  const callsPerMinute = transactionApi.callsPerMinute ?? 60
  const batchSize = getBatchSizeFromCallsPerMinute(callsPerMinute)
  const client = new AztecClient(
    http,
    transactionApi.url,
    transactionApi.callsPerMinute,
  )

  return new SequenceProcessor({
    id: projectId.toString(),
    batchSize,
    logger,
    repository: sequenceProcessorRepository,
    startFrom: 0,
    getLast: async () => {
      const block = await client.getLatestBlock()
      return block.number
    },
    processRange: async (from, to, trx) => {
      const fns = range(from, to + 1).map((blockNumber) => async () => {
        const block = await client.getBlock(blockNumber)

        return {
          projectId,
          blockNumber: block.number,
          count: block.transactionCount,
          timestamp: block.timestamp,
        }
      })
      const blocks = await promiseAllThrottled(fns, logger)

      await blockRepository.addMany(blocks, trx)
    },
  })
}
