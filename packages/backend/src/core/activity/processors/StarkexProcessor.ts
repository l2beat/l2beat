import { Logger, promiseAllPlus } from '@l2beat/common'
import { StarkexTransactionApi } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/types'
import { range } from 'lodash'

import { StarkexTransactionCountRepository } from '../../../peripherals/database/activity-v2/StarkexCountRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { StarkexClient } from '../../../peripherals/starkex'
import { Clock } from '../../Clock'
import { SequenceProcessor } from '../../SequenceProcessor'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export function createStarkexProcessor({
  projectId,
  transactionApi,
  starkexApiDelayHours,
  singleStarkexCPM,
  logger,
  sequenceProcessorRepository,
  clock,
  starkexRepository,
  starkexClient,
}: {
  projectId: ProjectId
  transactionApi: StarkexTransactionApi
  singleStarkexCPM: number
  starkexRepository: StarkexTransactionCountRepository
  starkexClient: StarkexClient
  starkexApiDelayHours: number
  logger: Logger
  clock: Clock
  sequenceProcessorRepository: SequenceProcessorRepository
}): SequenceProcessor {
  const batchSize = getBatchSizeFromCallsPerMinute(singleStarkexCPM)

  return new SequenceProcessor({
    id: projectId.toString(),
    batchSize,
    logger,
    repository: sequenceProcessorRepository,
    startFrom: transactionApi.sinceTimestamp.toStartOf('day').toDays(),
    // eslint-disable-next-line @typescript-eslint/require-await
    getLast: async () =>
      getStarkexLastDay(clock.getLastHour(), starkexApiDelayHours),
    processRange: async (from, to, trx) => {
      const fns = range(from, to + 1).map((day) => async () => {
        const count = await starkexClient.getDailyCount(
          day,
          transactionApi.product,
        )

        return { count, timestamp: UnixTime.fromDays(day), projectId }
      })
      const counts = await promiseAllPlus(fns, logger)

      await starkexRepository.addOrUpdateMany(counts, trx)
    },
  })
}
function getStarkexLastDay(timestamp: UnixTime, hoursDelay: number) {
  return timestamp
    .add(-hoursDelay, 'hours')
    .toStartOf('day')
    .add(-1, 'days')
    .toDays()
}
