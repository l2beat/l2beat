import { Logger } from '@l2beat/backend-tools'
import { ProjectId } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { range } from 'lodash'

import { promiseAllPlus } from '../../core/queue/promiseAllPlus'
import { ZksyncClient } from '../../peripherals/zksync'
import { SequenceProcessorRepository } from '../repositories/SequenceProcessorRepository'
import { ZksyncTransactionRepository } from '../repositories/ZksyncTransactionRepository'
import { SequenceProcessor } from '../SequenceProcessor'

export class ZksyncCounter extends SequenceProcessor {
  constructor(
    projectId: ProjectId,
    sequenceProcessorRepository: SequenceProcessorRepository,
    private readonly zksyncRepository: ZksyncTransactionRepository,
    private readonly zksyncClient: ZksyncClient,
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
    return this.zksyncClient.getLatestBlock()
  }

  protected override async processRange(
    from: number,
    to: number,
    trx: Knex.Transaction,
  ) {
    const queries = range(from, to + 1).map((blockNumber) => async () => {
      const transactions = await this.zksyncClient.getTransactionsInBlock(
        blockNumber,
      )

      return transactions.map((t, i) => {
        // Block 427 has a duplicated blockIndex
        const blockIndex =
          blockNumber === 427 && i === 1 ? t.blockIndex + 1 : t.blockIndex
        return {
          blockNumber,
          blockIndex,
          timestamp: t.createdAt,
        }
      })
    })

    const blockTransactions = await promiseAllPlus(queries, this.logger, {
      metricsId: 'ZksyncBlockCounter',
    })
    await this.zksyncRepository.addOrUpdateMany(blockTransactions.flat(), trx)
  }
}
