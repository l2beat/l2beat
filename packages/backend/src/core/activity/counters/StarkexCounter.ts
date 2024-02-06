import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'

import { StarkexTransactionCountRepository } from '../../../peripherals/database/activity/StarkexCountRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { StarkexClient } from '../../../peripherals/starkex'
import { Clock } from '../../Clock'
import { promiseAllPlus } from '../../queue/promiseAllPlus'
import { StarkexActivityTransactionConfig } from '../ActivityTransactionConfig'
import { SequenceProcessor } from '../SequenceProcessor'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export interface StarkexProcessorOptions
  extends StarkexActivityTransactionConfig {
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
): SequenceProcessor {
  const batchSize = getBatchSizeFromCallsPerMinute(options.singleStarkexCPM)
  const startDay = options.sinceTimestamp.toStartOf('day').toDays()

  return new SequenceProcessor(projectId, logger, sequenceProcessorRepository, {
    batchSize,
    startFrom: startDay,
    // starkex APIs are not stable and can change from the past. With this we make sure to scrape them again
    uncertaintyBuffer: options.resyncLastDays,
    getLatest: () => getStarkexLastDay(clock.getLastHour()),
    processRange: async (from, to, trx, logger) => {
      const queries = range(from, to + 1).map((day) => async () => {
        const counts = await Promise.all(
          options.product.map(
            async (product) => await starkexClient.getDailyCount(day, product),
          ),
        )

        return {
          count: counts.reduce((a, b) => a + b, 0),
          timestamp: UnixTime.fromDays(day),
          projectId: projectId,
        }
      })

      const counts = await promiseAllPlus(queries, logger, {
        metricsId: `StarkexBlockCounter_${projectId.toString()}`,
      })
      await starkexRepository.addOrUpdateMany(counts, trx)
    },
  })
}

/** @internal */
export function getStarkexLastDay(timestamp: UnixTime) {
  return timestamp.toStartOf('day').toDays()
}
