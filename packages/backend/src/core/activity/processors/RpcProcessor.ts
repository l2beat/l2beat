import { assert, Logger, promiseAllPlus } from '@l2beat/common'
import { RpcTransactionApiV2 } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/types'
import { providers } from 'ethers'
import { range } from 'lodash'

import { BlockTransactionCountRepository } from '../../../peripherals/database/activity-v2/BlockTransactionCountRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { EthereumClient } from '../../../peripherals/ethereum/EthereumClient'
import { Clock } from '../../Clock'
import { SequenceProcessor } from '../../SequenceProcessor'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export function createRpcProcessor(
  projectId: ProjectId,
  blockRepository: BlockTransactionCountRepository,
  sequenceProcessorRepository: SequenceProcessorRepository,
  logger: Logger,
  clock: Clock,
  transactionApi: RpcTransactionApiV2,
): SequenceProcessor {
  const callsPerMinute = transactionApi.callsPerMinute ?? 60
  const timeout = transactionApi.timeout ?? 15_000
  const batchSize = getBatchSizeFromCallsPerMinute(callsPerMinute)
  const url = transactionApi.url
  assert(url, 'Url for rpc client must be defined')
  const provider = new providers.StaticJsonRpcProvider({
    url,
    timeout,
  })
  const client = new EthereumClient(
    provider,
    logger.for(`RpcProcessor[${projectId.toString()}]`),
    callsPerMinute,
  )

  return new SequenceProcessor(
    projectId.toString(),
    logger,
    sequenceProcessorRepository,
    {
      batchSize,
      startFrom: transactionApi.startBlock ?? 0,
      getLatest: (previousLatest) =>
        client.getBlockNumberAtOrBefore(clock.getLastHour(), previousLatest),
      processRange: async (from, to, trx) => {
        const queries = range(from, to + 1).map((blockNumber) => async () => {
          const block = await client.getBlock(blockNumber)
          const timestamp = new UnixTime(block.timestamp)

          return {
            projectId,
            blockNumber,
            timestamp,
            count:
              transactionApi.assessCount?.(
                block.transactions.length,
                blockNumber,
              ) ?? block.transactions.length,
          }
        })

        const blocks = await promiseAllPlus(queries, logger)
        await blockRepository.addMany(blocks, trx)
      },
    },
  )
}
