import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { range } from 'lodash'

import { Clock } from '../../core/Clock'
import { StarknetClient } from '../../peripherals/starknet/StarknetClient'
import { promiseAllPlus } from '../../tools/queue/promiseAllPlus'
import { BlockTransactionCountRepository } from '../repositories/BlockTransactionCountRepository'
import { SequenceProcessorRepository } from '../repositories/SequenceProcessorRepository'
import { SequenceProcessor } from '../SequenceProcessor'

export class StarknetCounter extends SequenceProcessor {
  constructor(
    projectId: ProjectId,
    sequenceProcessorRepository: SequenceProcessorRepository,
    private readonly blockRepository: BlockTransactionCountRepository,
    private readonly starknetClient: StarknetClient,
    private readonly clock: Clock,
    logger: Logger,
    batchSize: number,
  ) {
    super(
      projectId,
      sequenceProcessorRepository,
      { batchSize, startFrom: 0 },
      logger,
    )
    this.logger = this.logger.for(this)
  }

  protected override async getLatest(current: number): Promise<number> {
    const blockNumber = await this.starknetClient.getBlockNumberAtOrBefore(
      this.clock.getLastHour(),
      current,
    )
    return blockNumber
  }

  protected override async processRange(
    from: number,
    to: number,
    trx: Knex.Transaction,
  ) {
    const queries = range(from, to + 1).map((blockNumber) => async () => {
      const block = await this.starknetClient.getBlock(blockNumber)

      return {
        projectId: this.projectId,
        blockNumber: block.number,
        count: block.transactions.length,
        timestamp: new UnixTime(block.timestamp),
      }
    })

    const blocks = await promiseAllPlus(queries, this.logger, {
      metricsId: 'StarknetBlockCounter',
    })
    await this.blockRepository.addOrUpdateMany(blocks, trx)
  }
}
