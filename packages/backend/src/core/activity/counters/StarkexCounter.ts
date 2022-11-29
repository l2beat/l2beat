import { assert, Logger, promiseAllPlus } from '@l2beat/common'
import { StarkexTransactionApi } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/types'
import { Knex } from 'knex'
import { range } from 'lodash'

import { StarkexTransactionCountRepository } from '../../../peripherals/database/activity/StarkexCountRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { StarkexClient } from '../../../peripherals/starkex'
import { Clock } from '../../Clock'
import { ALL_PROCESSED_EVENT, SequenceProcessor } from '../../SequenceProcessor'
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
  const processRange = async (
    from: number,
    to: number,
    trx?: Knex.Transaction,
  ) => {
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
  }

  const processor = new SequenceProcessor(
    projectId.toString(),
    logger,
    sequenceProcessorRepository,
    {
      batchSize,
      startFrom: startDay,
      getLatest: () => getStarkexLastDay(clock.getLastHour()),
      processRange,
    },
  )

  const handleAllProcessedEvent = async () => {
    const state = await sequenceProcessorRepository.getById(processor.id)
    assert(state)
    await processRange(
      state.lastProcessed - options.resyncLastDays,
      state.lastProcessed,
    )
  }

  processor.on(ALL_PROCESSED_EVENT, () => {
    handleAllProcessedEvent().catch(logger.error.bind(logger))
  })

  return new TransactionCounter(projectId, processor, () =>
    starkexRepository.getLastTimestampByProjectId(projectId),
  )
}

function getStarkexLastDay(timestamp: UnixTime) {
  return timestamp.toStartOf('day').add(-1, 'days').toDays()
}
