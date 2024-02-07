import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { range } from 'lodash'

import { StarkexClient } from '../../peripherals/starkex'
import { Clock } from '../../tools/Clock'
import { promiseAllPlus } from '../../tools/queue/promiseAllPlus'
import { SequenceProcessorRepository } from '../repositories/SequenceProcessorRepository'
import { StarkexTransactionCountRepository } from '../repositories/StarkexCountRepository'
import { SequenceProcessor } from '../SequenceProcessor'

export class StarkexCounter extends SequenceProcessor {
  constructor(
    projectId: ProjectId,
    private readonly starkexInstances: string[],
    sequenceProcessorRepository: SequenceProcessorRepository,
    private readonly starkexRepository: StarkexTransactionCountRepository,
    private readonly starkexClient: StarkexClient,
    private readonly clock: Clock,
    logger: Logger,
    batchSize: number,
    sinceTimestamp: UnixTime,
    resyncLastDays: number,
  ) {
    super(
      projectId,
      sequenceProcessorRepository,
      {
        batchSize,
        startFrom: sinceTimestamp.toStartOf('day').toDays(),
        // starkex APIs are not stable and can change from the past. With this we make sure to scrape them again
        uncertaintyBuffer: resyncLastDays,
      },
      logger,
    )
    this.logger = this.logger.for(this)
  }

  protected override async getLatest(): Promise<number> {
    const day = this.clock.getLastHour().toStartOf('day').toDays()
    return Promise.resolve(day)
  }

  protected override async processRange(
    from: number,
    to: number,
    trx: Knex.Transaction,
  ) {
    const queries = range(from, to + 1).map((day) => async () => {
      const counts = await Promise.all(
        this.starkexInstances.map(
          async (instance) =>
            await this.starkexClient.getDailyCount(day, instance),
        ),
      )

      return {
        count: counts.reduce((a, b) => a + b, 0),
        timestamp: UnixTime.fromDays(day),
        projectId: this.projectId,
      }
    })

    const counts = await promiseAllPlus(queries, this.logger, {
      metricsId: `StarkexBlockCounter_${this.projectId.toString()}`,
    })
    await this.starkexRepository.addOrUpdateMany(counts, trx)
  }
}
