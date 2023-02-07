import { StarknetTransactionApi } from '@l2beat/config'
import { HttpClient, Logger, ProjectId, UnixTime } from '@l2beat/shared'
import { range } from 'lodash'

import { Metrics } from '../../../Metrics'
import { BlockTransactionCountRepository } from '../../../peripherals/database/activity/BlockTransactionCountRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { StarkNetClient } from '../../../peripherals/starknet/StarkNetClient'
import { Clock } from '../../Clock'
import { promiseAllPlus } from '../../queue/promiseAllPlus'
import { SequenceProcessor } from '../../SequenceProcessor'
import { TransactionCounter } from '../TransactionCounter'
import { createBlockTransactionCounter } from './BlockTransactionCounter'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export function createStarknetCounter(
  projectId: ProjectId,
  blockRepository: BlockTransactionCountRepository,
  http: HttpClient,
  sequenceProcessorRepository: SequenceProcessorRepository,
  logger: Logger,
  metrics: Metrics,
  clock: Clock,
  transactionApi: StarknetTransactionApi,
): TransactionCounter {
  const callsPerMinute = transactionApi.callsPerMinute ?? 60
  const batchSize = getBatchSizeFromCallsPerMinute(callsPerMinute)
  const client = new StarkNetClient(transactionApi.url, http, {
    callsPerMinute,
  })

  const processor = new SequenceProcessor(
    projectId.toString(),
    logger,
    metrics,
    sequenceProcessorRepository,
    {
      batchSize,
      startFrom: 0,
      getLatest: async (previousLatest) => {
        const blockNumber = await client.getBlockNumberAtOrBefore(
          clock.getLastHour(),
          previousLatest,
        )
        return blockNumber
      },
      processRange: async (from, to, trx, logger) => {
        const queries = range(from, to + 1).map((blockNumber) => async () => {
          const block = await client.getBlock(blockNumber)

          return {
            projectId,
            blockNumber: block.number,
            count: block.transactions.length,
            timestamp: new UnixTime(block.timestamp),
          }
        })

        const blocks = await promiseAllPlus(queries, logger)
        await blockRepository.addMany(blocks, trx)
      },
    },
  )

  return createBlockTransactionCounter(projectId, processor, blockRepository)
}
