import { Logger } from '@l2beat/backend-tools'
import { ProjectId } from '@l2beat/shared-pure'
import { range } from 'lodash'

import { Database, Transaction } from '@l2beat/database'
import { DegateClient } from '../../../peripherals/degate/DegateClient'
import { promiseAllPlus } from '../../../tools/queue/promiseAllPlus'
import { SequenceProcessor } from '../SequenceProcessor'

export class DegateCounter extends SequenceProcessor {
  constructor(
    projectId: ProjectId,
    db: Database,
    private readonly degateClient: DegateClient,
    logger: Logger,
    batchSize: number,
  ) {
    super(projectId, db, { batchSize, startFrom: 1 }, logger)
    this.logger = this.logger.for(this)
  }

  protected override async getLatest(): Promise<number> {
    return await this.degateClient.getLatestBlockNumber()
  }

  protected override async processRange(
    from: number,
    to: number,
    trx: Transaction,
  ) {
    const queries = range(from, to + 1).map((blockNumber) => async () => {
      const block = await this.degateClient.getBlock(blockNumber)
      return {
        projectId: this.projectId,
        blockNumber,
        count: block.transactions,
        timestamp: block.createdAt,
      }
    })

    const blocks = await promiseAllPlus(queries, this.logger, {
      metricsId: 'DegateBlockCounter',
    })
    await this.db.blockTransactionCount.addOrUpdateMany(blocks, trx)
  }
}
