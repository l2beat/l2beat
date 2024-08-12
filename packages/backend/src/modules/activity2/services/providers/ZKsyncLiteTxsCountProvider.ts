import { ActivityRecord } from '@l2beat/database'
import { ProjectId } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { ZksyncLiteClient } from '../../../../peripherals/zksynclite/ZksyncLiteClient'
import { aggregatePerDay } from '../../utils/aggregatePerDay'

export class ZKsyncLiteTxsCountProvider {
  constructor(
    private readonly zkSyncClient: ZksyncLiteClient,
    private readonly projectId: ProjectId,
  ) {}

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    const queries = range(from, to + 1).map(async (blockNumber) => {
      const transactions =
        await this.zkSyncClient.getTransactionsInBlock(blockNumber)

      return transactions.map((t) => ({
        txsCount: 1,
        timestamp: t.createdAt,
        number: blockNumber,
      }))
    })

    const blocks = await Promise.all(queries)

    return aggregatePerDay(this.projectId, blocks.flat())
  }
}
