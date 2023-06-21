import { RpcTransactionApi } from '@l2beat/config'
import { Logger } from '@l2beat/shared'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { providers } from 'ethers'
import { range } from 'lodash'

import { BlockTransactionCountRepository } from '../../../peripherals/database/activity/BlockTransactionCountRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { EthereumClient } from '../../../peripherals/ethereum/EthereumClient'
import { Clock } from '../../Clock'
import { promiseAllPlus } from '../../queue/promiseAllPlus'
import { SequenceProcessor } from '../../SequenceProcessor'
import { TransactionCounter } from '../TransactionCounter'
import { createBlockTransactionCounter } from './BlockTransactionCounter'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export function createRpcCounter(
  projectId: ProjectId,
  blockRepository: BlockTransactionCountRepository,
  sequenceProcessorRepository: SequenceProcessorRepository,
  logger: Logger,
  clock: Clock,
  transactionApi: RpcTransactionApi,
): TransactionCounter {
  const callsPerMinute = transactionApi.callsPerMinute ?? 60
  const timeout = transactionApi.timeout ?? 15_000
  const batchSize = getBatchSizeFromCallsPerMinute(callsPerMinute)
  const url = transactionApi.url
  assert(url, `Url for rpc client must be defined for ${projectId.toString()}`)
  const provider = new providers.StaticJsonRpcProvider({
    url,
    timeout,
  })
  const client = new EthereumClient(
    provider,
    logger.for(`RpcProcessor[${projectId.toString()}]`),
    callsPerMinute,
  )

  const processor = new SequenceProcessor(
    projectId.toString(),
    logger,
    sequenceProcessorRepository,
    {
      batchSize,
      startFrom: transactionApi.startBlock ?? 0,
      getLatest: (previousLatest) =>
        client.getBlockNumberAtOrBefore(clock.getLastHour(), previousLatest),
      processRange: async (from, to, trx, logger) => {
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

        const blocks = await promiseAllPlus(queries, logger, {
          metricsId: `RpcBlockCounter_${projectId.toString()}`,
        })
        await blockRepository.addOrUpdateMany(blocks, trx)
      },
    },
  )

  return createBlockTransactionCounter(projectId, processor, blockRepository)
}
