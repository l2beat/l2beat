import { StarkexTransactionApi } from '@l2beat/config'
import { Logger } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'

import { StarkexTransactionCountRepository } from '../../../peripherals/database/activity/StarkexCountRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { StarkexClient } from '../../../peripherals/starkex'
import { Clock } from '../../Clock'
import { promiseAllPlus } from '../../queue/promiseAllPlus'
import { SequenceProcessor } from '../../SequenceProcessor'
import { TransactionCounter } from '../TransactionCounter'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export interface StarkexProcessorOptions extends StarkexTransactionApi {
  singleStarkexCPM: number
}

export function createStarkexCounter(
  projectId: ProjectId,
  starkexRepository: StarkexTransactionCountRepository,
  starkexClient: StarkexClient,
  sequenceProcessorRepository: SequenceProcessorRepository,
  logger: Logger,
  clock: Clock,
  options: StarkexProcessorOptions,
): TransactionCounter {
  const batchSize = getBatchSizeFromCallsPerMinute(options.singleStarkexCPM)
  const startDay = options.sinceTimestamp.toStartOf('day').toDays()

  const processor = new SequenceProcessor(
    projectId.toString(),
    logger,
    sequenceProcessorRepository,
    {
      batchSize,
      startFrom: startDay,
      uncertaintyBuffer: options.resyncLastDays, // starkex APIs are not stable and can change from the past. With this we make sure to scrape them again
      getLatest: () => getStarkexLastDay(clock.getLastHour()),
      processRange: async (from, to, trx, logger) => {
        const queries = range(from, to + 1).map((day) => async () => {
          const count = await starkexClient.getDailyCount(day, options.product)

          return {
            count,
            timestamp: UnixTime.fromDays(day),
            projectId: projectId,
          }
        })

        const counts = await promiseAllPlus(queries, logger, {
          metricsId: `StarkexBlockCounter_${projectId.toString()}`,
        })
        await starkexRepository.addOrUpdateMany(counts, trx)
      },
    },
  )

  return new TransactionCounter(projectId, processor, () =>
    starkexRepository.findLastTimestampByProjectId(projectId),
  )
}

/** @internal */
export function getStarkexLastDay(timestamp: UnixTime) {
  return timestamp.toStartOf('day').toDays()
}
