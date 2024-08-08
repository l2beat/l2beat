import { ActivityRecord } from '@l2beat/database'
import { ProjectId } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { ZksyncLiteClient } from '../../../../peripherals/zksynclite/ZksyncLiteClient'
import { TxsCountProvider } from '../TxsCountProvider'

export class ZKsyncLiteTxsCountProvider extends TxsCountProvider {
  constructor(
    private readonly zkSyncClient: ZksyncLiteClient,
    projectId: ProjectId,
  ) {
    super(projectId)
  }

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

    return this.aggregatePerDay(blocks.flat())
  }
}
