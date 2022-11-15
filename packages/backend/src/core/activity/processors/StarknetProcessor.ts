import { HttpClient, Logger, promiseAllPlus } from '@l2beat/common'
import { StarknetTransactionApiV2 } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/types'
import { range } from 'lodash'

import { BlockTransactionCountRepository } from '../../../peripherals/database/activity-v2/BlockTransactionCountRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { StarkNetClient } from '../../../peripherals/starknet/StarkNetClient'
import { Clock } from '../../Clock'
import { SequenceProcessor } from '../../SequenceProcessor'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export function createStarknetProcessor(
  projectId: ProjectId,
  blockRepository: BlockTransactionCountRepository,
  http: HttpClient,
  sequenceProcessorRepository: SequenceProcessorRepository,
  logger: Logger,
  clock: Clock,
  transactionApi: StarknetTransactionApiV2,
): SequenceProcessor {
  const callsPerMinute = transactionApi.callsPerMinute ?? 60
  const batchSize = getBatchSizeFromCallsPerMinute(callsPerMinute)
  const client = new StarkNetClient(transactionApi.url, http, {
    callsPerMinute,
  })

  return new SequenceProcessor({
    id: projectId.toString(),
    batchSize,
    logger,
    repository: sequenceProcessorRepository,
    startFrom: 0,
    getLast: async (prevLast) => {
      const blockNumber = await client.getBlockNumberAtOrBefore(
        clock.getLastHour(),
        prevLast,
      )
      return blockNumber
    },
    processRange: async (from, to, trx) => {
      const fns = range(from, to + 1).map((blockNumber) => async () => {
        const block = await client.getBlock(blockNumber)

        return {
          projectId,
          blockNumber: block.number,
          count: block.transactions.length,
          timestamp: new UnixTime(block.timestamp),
        }
      })

      const blocks = await promiseAllPlus(fns, logger)

      await blockRepository.addMany(blocks, trx)
    },
  })
}
