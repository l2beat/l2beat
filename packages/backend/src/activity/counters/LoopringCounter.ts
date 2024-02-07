import { Logger } from '@l2beat/backend-tools'
import { ProjectId } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { range } from 'lodash'

import { promiseAllPlus } from '../../core/queue/promiseAllPlus'
import { LoopringClient } from '../../peripherals/loopring'
import { BlockTransactionCountRepository } from '../repositories/BlockTransactionCountRepository'
import { SequenceProcessorRepository } from '../repositories/SequenceProcessorRepository'
import { SequenceProcessor } from '../SequenceProcessor'

export class LoopringCounter extends SequenceProcessor {
  constructor(
    projectId: ProjectId,
    sequenceProcessorRepository: SequenceProcessorRepository,
    private readonly blockRepository: BlockTransactionCountRepository,
    private readonly loopringClient: LoopringClient,
    logger: Logger,
    batchSize: number,
  ) {
    super(
      projectId,
      sequenceProcessorRepository,
      { batchSize, startFrom: 1 },
      logger,
    )
    this.logger = this.logger.for(this)
  }

  protected override async getLatest(): Promise<number> {
    return this.loopringClient.getFinalizedBlockNumber()
  }

  protected override async processRange(
    from: number,
    to: number,
    trx: Knex.Transaction,
  ) {
    const queries = range(from, to + 1).map((blockNumber) => async () => {
      const block = await this.loopringClient.getBlock(blockNumber)
      return {
        projectId: this.projectId,
        blockNumber,
        count: block.transactions,
        timestamp: block.createdAt,
      }
    })

    const blocks = await promiseAllPlus(queries, this.logger, {
      metricsId: 'LoopringBlockCounter',
    })
    await this.blockRepository.addOrUpdateMany(blocks, trx)
  }
}
