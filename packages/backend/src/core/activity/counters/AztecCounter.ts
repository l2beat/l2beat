import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import { ProjectId } from '@l2beat/shared-pure'
import { range } from 'lodash'

import { AztecClient } from '../../../peripherals/aztec'
import { BlockTransactionCountRepository } from '../../../peripherals/database/activity/BlockTransactionCountRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { promiseAllPlus } from '../../queue/promiseAllPlus'
import { SimpleActivityTransactionConfig } from '../ActivityTransactionConfig'
import { SequenceProcessor } from '../SequenceProcessor'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export function createAztecCounter(
  projectId: ProjectId,
  blockRepository: BlockTransactionCountRepository,
  http: HttpClient,
  sequenceProcessorRepository: SequenceProcessorRepository,
  logger: Logger,
  options: SimpleActivityTransactionConfig<'aztec'>,
): SequenceProcessor {
  const batchSize = getBatchSizeFromCallsPerMinute(options.callsPerMinute)
  const client = new AztecClient(http, options.url, options.callsPerMinute)

  return new SequenceProcessor(projectId, logger, sequenceProcessorRepository, {
    batchSize,
    startFrom: 0,
    getLatest: async () => {
      const block = await client.getLatestBlock()
      return block.number
    },
    processRange: async (from, to, trx, logger) => {
      const queries = range(from, to + 1).map((blockNumber) => async () => {
        const block = await client.getBlock(blockNumber)

        return {
          projectId,
          blockNumber: block.number,
          count: block.transactionCount,
          timestamp: block.timestamp,
        }
      })

      const blocks = await promiseAllPlus(queries, logger, {
        metricsId: 'AztecBlockCounter',
      })
      await blockRepository.addOrUpdateMany(blocks, trx)
    },
    getLastProcessedTimestamp: () =>
      blockRepository.findLastTimestampByProjectId(projectId),
  })
}
