import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'

import { Database } from '@l2beat/database'
import { StarknetClient } from '../../../peripherals/starknet/StarknetClient'
import { Clock } from '../../../tools/Clock'
import { promiseAllPlus } from '../../../tools/queue/promiseAllPlus'
import { SequenceProcessor } from '../SequenceProcessor'

export class StarknetCounter extends SequenceProcessor {
  constructor(
    projectId: ProjectId,
    db: Database,
    private readonly starknetClient: StarknetClient,
    private readonly clock: Clock,
    logger: Logger,
    batchSize: number,
  ) {
    super(projectId, db, { batchSize, startFrom: 0 }, logger)
    this.logger = this.logger.for(this)
  }

  protected override async getLatest(current: number): Promise<number> {
    const blockNumber = await this.starknetClient.getBlockNumberAtOrBefore(
      this.clock.getLastHour(),
      current,
    )
    return blockNumber
  }

  protected override async processRange(from: number, to: number) {
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
    await this.db.blockTransactionCount.addOrUpdateMany(blocks)
  }
}
