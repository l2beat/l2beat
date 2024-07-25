import { Logger } from '@l2beat/backend-tools'
import { ProjectId } from '@l2beat/shared-pure'
import { range } from 'lodash'

import { Database } from '@l2beat/database'
import { LoopringClient } from '../../../peripherals/loopring/LoopringClient'
import { promiseAllPlus } from '../../../tools/queue/promiseAllPlus'
import { SequenceProcessor } from '../SequenceProcessor'

export class LoopringCounter extends SequenceProcessor {
  constructor(
    projectId: ProjectId,
    db: Database,
    private readonly loopringClient: LoopringClient,
    logger: Logger,
    batchSize: number,
  ) {
    super(projectId, db, { batchSize, startFrom: 1 }, logger)
    this.logger = this.logger.for(this)
  }

  protected override async getLatest(): Promise<number> {
    return await this.loopringClient.getFinalizedBlockNumber()
  }

  protected override async processRange(from: number, to: number) {
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
    await this.db.blockTransactionCount.addOrUpdateMany(blocks)
  }
}
