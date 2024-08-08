import { Logger } from '@l2beat/backend-tools'
import { ActivityRecord } from '@l2beat/database'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { DegateClient } from '../../../../peripherals/degate'
import { ActivityTransactionConfig } from '../../../activity/ActivityTransactionConfig'
import { TxsCountProvider } from '../TxsCountProvider'

export class DegateTxsCountProvider extends TxsCountProvider {
  constructor(
    logger: Logger,
    projectId: ProjectId,
    private readonly degateClient: DegateClient,
    private readonly projectConfig: ActivityTransactionConfig,
  ) {
    super({ logger, projectId })
  }

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    assert(
      this.projectConfig.type === 'degate',
      'Method not supported for projects other than Degate',
    )

    const queries = range(from, to + 1).map(async (blockNumber) => {
      const block = await this.degateClient.getBlock(blockNumber)
      return {
        count: block.transactions,
        timestamp: block.createdAt,
        number: block.blockId,
      }
    })

    const blocks = await Promise.all(queries)
    return this.aggregatePerDay(blocks)
  }
}
