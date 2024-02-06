import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { providers } from 'ethers'
import { range } from 'lodash'

import { BlockTransactionCountRepository } from '../../../peripherals/database/activity/BlockTransactionCountRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { Clock } from '../../Clock'
import { promiseAllPlus } from '../../queue/promiseAllPlus'
import { RpcActivityTransactionConfig } from '../ActivityTransactionConfig'
import { SequenceProcessor } from '../SequenceProcessor'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export function createRpcCounter(
  projectId: ProjectId,
  blockRepository: BlockTransactionCountRepository,
  sequenceProcessorRepository: SequenceProcessorRepository,
  logger: Logger,
  clock: Clock,
  options: RpcActivityTransactionConfig,
): SequenceProcessor {
  const batchSize = getBatchSizeFromCallsPerMinute(options.callsPerMinute)
  const provider = new providers.StaticJsonRpcProvider({
    url: options.url,
    timeout: 15_000,
  })
  const client = new RpcClient(
    provider,
    logger.for(`RpcProcessor[${projectId.toString()}]`),
    options.callsPerMinute,
  )

  return new SequenceProcessor(projectId, logger, sequenceProcessorRepository, {
    batchSize,
    startFrom: options.startBlock ?? 0,
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
            options.assessCount?.(block.transactions.length, blockNumber) ??
            block.transactions.length,
        }
      })

      const blocks = await promiseAllPlus(queries, logger, {
        metricsId: `RpcBlockCounter_${projectId.toString()}`,
      })
      await blockRepository.addOrUpdateMany(blocks, trx)
    },
    getLastProcessedTimestamp: () =>
      blockRepository.findLastTimestampByProjectId(projectId),
  })
}
