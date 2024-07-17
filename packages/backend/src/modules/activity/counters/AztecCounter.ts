import { Logger } from '@l2beat/backend-tools'
import { ProjectId } from '@l2beat/shared-pure'
import { range } from 'lodash'

import { Database, Transaction } from '@l2beat/database'
import { AztecClient } from '../../../peripherals/aztec/AztecClient'
import { promiseAllPlus } from '../../../tools/queue/promiseAllPlus'
import { SequenceProcessor } from '../SequenceProcessor'

export class AztecCounter extends SequenceProcessor {
  constructor(
    projectId: ProjectId,
    db: Database,
    private readonly aztecClient: AztecClient,
    logger: Logger,
    batchSize: number,
  ) {
    super(projectId, db, { batchSize, startFrom: 0 }, logger)
    this.logger = this.logger.for(this)
  }

  protected override async getLatest(): Promise<number> {
    const block = await this.aztecClient.getLatestBlock()
    return block.number
  }

  protected override async processRange(
    from: number,
    to: number,
    trx: Transaction,
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
    await this.db.blockTransactionCount.addOrUpdateMany(blocks, trx)
  }
}
