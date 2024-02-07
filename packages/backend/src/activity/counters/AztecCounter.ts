import { Logger } from '@l2beat/backend-tools'
import { ProjectId } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { range } from 'lodash'

import { promiseAllPlus } from '../../core/queue/promiseAllPlus'
import { AztecClient } from '../../peripherals/aztec'
import { BlockTransactionCountRepository } from '../repositories/BlockTransactionCountRepository'
import { SequenceProcessorRepository } from '../repositories/SequenceProcessorRepository'
import { SequenceProcessor } from '../SequenceProcessor'

export class AztecCounter extends SequenceProcessor {
  constructor(
    projectId: ProjectId,
    sequenceProcessorRepository: SequenceProcessorRepository,
    private readonly blockRepository: BlockTransactionCountRepository,
    private readonly aztecClient: AztecClient,
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

  protected override async getLatest(): Promise<number> {
    const block = await this.aztecClient.getLatestBlock()
    return block.number
  }

  protected override async processRange(
    from: number,
    to: number,
    trx: Knex.Transaction,
  ) {
    const queries = range(from, to + 1).map((blockNumber) => async () => {
      const block = await this.aztecClient.getBlock(blockNumber)

      return {
        projectId: this.projectId,
        blockNumber: block.number,
        count: block.transactionCount,
        timestamp: block.timestamp,
      }
    })

    const blocks = await promiseAllPlus(queries, this.logger, {
      metricsId: 'AztecBlockCounter',
    })
    await this.blockRepository.addOrUpdateMany(blocks, trx)
  }
}
