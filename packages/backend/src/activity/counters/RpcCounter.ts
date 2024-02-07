import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { range } from 'lodash'

import { Clock } from '../../core/Clock'
import { promiseAllPlus } from '../../core/queue/promiseAllPlus'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'
import { BlockTransactionCountRepository } from '../repositories/BlockTransactionCountRepository'
import { SequenceProcessorRepository } from '../repositories/SequenceProcessorRepository'
import { SequenceProcessor } from '../SequenceProcessor'

export class RpcCounter extends SequenceProcessor {
  constructor(
    projectId: ProjectId,
    sequenceProcessorRepository: SequenceProcessorRepository,
    private readonly blockRepository: BlockTransactionCountRepository,
    private readonly rpcClient: RpcClient,
    private readonly clock: Clock,
    logger: Logger,
    private readonly assessCount:
      | ((count: number, blockNumber: number) => number)
      | undefined,
    batchSize: number,
    startFrom = 0,
  ) {
    super(
      projectId,
      sequenceProcessorRepository,
      { batchSize, startFrom },
      logger,
    )
    this.logger = this.logger.for(this)
  }

  protected override async getLatest(current: number): Promise<number> {
    return this.rpcClient.getBlockNumberAtOrBefore(
      this.clock.getLastHour(),
      current,
    )
  }

  protected override async processRange(
    from: number,
    to: number,
    trx: Knex.Transaction,
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
    await this.blockRepository.addOrUpdateMany(blocks, trx)
  }
}
