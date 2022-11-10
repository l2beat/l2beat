import { Logger } from '@l2beat/common'
import { RpcTransactionApi } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/types'
import { providers } from 'ethers'

import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { BlockRepository } from '../../../peripherals/database/transactions/BlockRepository'
import { EthereumClient } from '../../../peripherals/ethereum/EthereumClient'
import { assert } from '../../../tools/assert'
import { BatchDownloader } from '../../BatchDownloader'
import { Clock } from '../../Clock'
import { SequenceProcessor } from '../../SequenceProcessor'

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
  blockRepository: BlockRepository
  logger: Logger
  sequenceProcessorRepository: SequenceProcessorRepository
  clock: Clock
}): SequenceProcessor {
  const callsPerMinute = transactionApi.callsPerMinute ?? 60
  const batchSize = callsPerMinute * 60
  const url = transactionApi.url
  console.log(projectId, url)
  assert(url, 'Url for rpc client must be defined')
  const provider = new providers.JsonRpcProvider({
    url,
    timeout: 15_000,
  })
  const client = new EthereumClient(provider, logger, callsPerMinute)
  const batchDownloader = new BatchDownloader(
    batchSize,
    async (blockNumber) => {
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
    },
    logger,
  )

  return new SequenceProcessor({
    id: projectId.toString(),
    batchSize,
    logger,
    repository: sequenceProcessorRepository,
    startFrom: transactionApi.startBlock ?? 0,
    getLast: (prevLast) =>
      client.getBlockNumberAtOrBefore(clock.getLastHour(), prevLast),
    processRange: async (from, to, trx) => {
      const blocks = await batchDownloader.download(from, to)
      await blockRepository.addOrUpdateMany(blocks, trx)
    },
  })
}
