import { HttpClient, Logger, promiseAllPlus } from '@l2beat/common'
import { AztecTransactionApiV2 } from '@l2beat/config'
import { ProjectId } from '@l2beat/types'
import { range } from 'lodash'

import { AztecClient, AztecConnectClient } from '../../../peripherals/aztec'
import { BlockTransactionCountRepository } from '../../../peripherals/database/activity-v2/BlockTransactionCountRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { SequenceProcessor } from '../../SequenceProcessor'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

function getClient(
  type: AztecTransactionApiV2['type'],
): typeof AztecClient | typeof AztecConnectClient {
  return type === 'aztec' ? AztecClient : AztecConnectClient
}

export function createAztecProcessor(
  projectId: ProjectId,
  blockRepository: BlockTransactionCountRepository,
  http: HttpClient,
  sequenceProcessorRepository: SequenceProcessorRepository,
  logger: Logger,
  options: AztecTransactionApiV2,
): SequenceProcessor {
  const callsPerMinute = options.callsPerMinute ?? 60
  const batchSize = getBatchSizeFromCallsPerMinute(callsPerMinute)
  const Client = getClient(options.type)
  const client = new Client(http, options.url, callsPerMinute)

  return new SequenceProcessor(
    projectId.toString(),
    logger,
    sequenceProcessorRepository,
    {
      batchSize,
      startFrom: 0,
      getLatest: async () => {
        const block = await client.getLatestBlock()
        return block.number
      },
      processRange: async (from, to, trx) => {
        const queries = range(from, to + 1).map((blockNumber) => async () => {
          const block = await client.getBlock(blockNumber)

          return {
            projectId,
            blockNumber: block.number,
            count: block.transactionCount,
            timestamp: block.timestamp,
          }
        })

        const blocks = await promiseAllPlus(queries, logger)
        await blockRepository.addMany(blocks, trx)
      },
    },
  )
}
