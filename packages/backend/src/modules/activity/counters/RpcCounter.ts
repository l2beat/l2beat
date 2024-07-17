import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'

import { Database, Transaction } from '@l2beat/database'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { Clock } from '../../../tools/Clock'
import { promiseAllPlus } from '../../../tools/queue/promiseAllPlus'
import { SequenceProcessor } from '../SequenceProcessor'

export class RpcCounter extends SequenceProcessor {
  constructor(
    projectId: ProjectId,
    db: Database,
    private readonly rpcClient: RpcClient,
    private readonly clock: Clock,
    logger: Logger,
    private readonly assessCount:
      | ((count: number, blockNumber: number) => number)
      | undefined,
    batchSize: number,
    startFrom = 0,
  ) {
    super(projectId, db, { batchSize, startFrom }, logger)
    this.logger = this.logger.for(this)
  }

  protected override async getLatest(current: number): Promise<number> {
    return await this.rpcClient.getBlockNumberAtOrBefore(
      this.clock.getLastHour(),
      current,
    )
  }

  protected override async processRange(
    from: number,
    to: number,
    trx: Transaction,
  ) {
    const queries = range(from, to + 1).map((blockNumber) => async () => {
      const block = await this.rpcClient.getBlock(blockNumber)
      const timestamp = new UnixTime(block.timestamp)

      return {
        projectId: this.projectId,
        blockNumber,
        timestamp,
        count:
          this.assessCount?.(block.transactions.length, blockNumber) ??
          block.transactions.length,
      }
    })

    const blocks = await promiseAllPlus(queries, this.logger, {
      metricsId: `RpcBlockCounter_${this.projectId.toString()}`,
    })
    await this.db.blockTransactionCount.addOrUpdateMany(blocks, trx)
  }
}
