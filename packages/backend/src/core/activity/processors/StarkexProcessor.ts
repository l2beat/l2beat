import { Logger, promiseAllPlus } from '@l2beat/common'
import { StarkexTransactionApiV2 } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/types'
import { range } from 'lodash'

import { StarkexTransactionCountRepository } from '../../../peripherals/database/activity-v2/StarkexCountRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { StarkexClient } from '../../../peripherals/starkex'
import { Clock } from '../../Clock'
import { SequenceProcessor } from '../../SequenceProcessor'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export interface StarkexProcessorOptions extends StarkexTransactionApiV2 {
  singleStarkexCPM: number
  starkexApiDelayHours: number
}

export function createStarkexProcessor(
  projectId: ProjectId,
  starkexRepository: StarkexTransactionCountRepository,
  starkexClient: StarkexClient,
  sequenceProcessorRepository: SequenceProcessorRepository,
  logger: Logger,
  clock: Clock,
  options: StarkexProcessorOptions,
): SequenceProcessor {
  const batchSize = getBatchSizeFromCallsPerMinute(options.singleStarkexCPM)

  return new SequenceProcessor(
    projectId.toString(),
    logger,
    sequenceProcessorRepository,
    {
      batchSize,
      startFrom: options.sinceTimestamp.toStartOf('day').toDays(),
      // eslint-disable-next-line @typescript-eslint/require-await
      getLatest: async () =>
        getStarkexLastDay(clock.getLastHour(), options.starkexApiDelayHours),
      processRange: async (from, to, trx) => {
        const queries = range(from, to + 1).map((day) => async () => {
          const count = await starkexClient.getDailyCount(day, options.product)

          return {
            count,
            timestamp: UnixTime.fromDays(day),
            projectId: projectId,
          }
        })

        const counts = await promiseAllPlus(queries, logger)
        await starkexRepository.addOrUpdateMany(counts, trx)
      },
    },
  )
}
function getStarkexLastDay(timestamp: UnixTime, hoursDelay: number) {
  return timestamp
    .add(-hoursDelay, 'hours')
    .toStartOf('day')
    .add(-1, 'days')
    .toDays()
}
