import { Logger } from '@l2beat/backend-tools'
import { ActivityRecord } from '@l2beat/database'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { ZksyncLiteClient } from '../../../../peripherals/zksynclite/ZksyncLiteClient'
import { ActivityTransactionConfig } from '../../../activity/ActivityTransactionConfig'
import { BaseTxsCountProvider } from '../BaseTxsCountProvider'

export class ZKsyncLiteTxsCountProvider extends BaseTxsCountProvider {
  constructor(
    logger: Logger,
    projectId: ProjectId,
    private readonly zkSyncClient: ZksyncLiteClient,
    private readonly projectConfig: ActivityTransactionConfig,
  ) {
    super({ logger, projectId })
  }

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    assert(
      this.projectConfig.type === 'zksync',
      'Method not supported for projects other than ZKsync Lite',
    )

    const queries = range(from, to + 1).map(async (blockNumber) => {
      const transactions =
        await this.zkSyncClient.getTransactionsInBlock(blockNumber)

      return transactions.map((t) => ({
        timestamp: t.createdAt,
        count: 1,
        number: blockNumber,
      }))
    })

    const blocks = await Promise.all(queries)
    return this.aggregatePerDay(blocks.flat())
  }
}
