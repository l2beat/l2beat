import { Logger, promiseAllThrottled } from '@l2beat/common'
import { assert } from '@l2beat/common/src/tools/assert'
import { RpcTransactionApi } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/types'
import { providers } from 'ethers'
import { range } from 'lodash'

import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { BlockCountRepository } from '../../../peripherals/database/transactions/BlockCountRepository'
import { EthereumClient } from '../../../peripherals/ethereum/EthereumClient'
import { Clock } from '../../Clock'
import { SequenceProcessor } from '../../SequenceProcessor'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export function createRpcProcessor({
  projectId,
  transactionApi,
  logger,
  sequenceProcessorRepository,
  blockRepository,
  clock,
}: {
  projectId: ProjectId
  transactionApi: RpcTransactionApi
  blockRepository: BlockCountRepository
  logger: Logger
  sequenceProcessorRepository: SequenceProcessorRepository
  clock: Clock
}): SequenceProcessor {
  logger = logger.for(`rpcProcessor.${projectId.toString()}`)
  const callsPerMinute = transactionApi.callsPerMinute ?? 60
  const batchSize = getBatchSizeFromCallsPerMinute(callsPerMinute)
  const url = transactionApi.url
  assert(url, 'Url for rpc client must be defined')
  const provider = new providers.JsonRpcProvider({
    url,
    timeout: 15_000,
  })
  const client = new EthereumClient(provider, logger, callsPerMinute)

  return new SequenceProcessor({
    id: projectId.toString(),
    batchSize,
    logger,
    repository: sequenceProcessorRepository,
    startFrom: transactionApi.startBlock ?? 0,

    getLast: (prevLast) =>
      client.getBlockNumberAtOrBefore(clock.getLastHour(), prevLast),

    processRange: async (from, to, trx) => {
      const fns = range(from, to + 1).map((blockNumber) => async () => {
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

      const blocks = await promiseAllThrottled(fns, logger)

      await blockRepository.addMany(blocks, trx)
    },
  })
}
