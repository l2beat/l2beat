import { Logger } from '@l2beat/common'
import { StarkexTransactionApi } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/types'

import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { StarkexRepository } from '../../../peripherals/database/transactions/StarkexRepository'
import { StarkexClient } from '../../../peripherals/starkex'
import { BatchDownloader } from '../../BatchDownloader'
import { Clock } from '../../Clock'
import { SequenceProcessor } from '../../SequenceProcessor'

// ---- STARKEX ----
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
  starkexRepository: StarkexRepository
  starkexClient: StarkexClient
  starkexApiDelayHours: number
  logger: Logger
  clock: Clock
  sequenceProcessorRepository: SequenceProcessorRepository
}): SequenceProcessor {
  const batchSize = singleStarkexCPM * 60
  const batchDownloader = new BatchDownloader(
    batchSize,
    async (day) => {
      const count = await starkexClient.getDailyCount(
        day,
        transactionApi.product,
      )
      return { count, timestamp: UnixTime.fromDays(day), projectId }
    },
    logger,
  )
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
      const counts = await batchDownloader.download(from, to)
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
