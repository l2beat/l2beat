import { ActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { aggregatePerDay } from '../../utils/aggregatePerDay'
import { BlockProvider } from '@l2beat/shared'

export class ZKsyncLiteTxsCountService {
  constructor(
    private readonly blockProvider: BlockProvider,
    private readonly projectId: ProjectId,
  ) { }

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    const queries = range(from, to + 1).map(async (blockNumber) => {
      const block =
        await this.blockProvider.getBlockWithTransactions(blockNumber)

      return block.transactions.map((t) => ({
        txsCount: 1,
        uopsCount: null,
        timestamp: new UnixTime(block.timestamp),
        number: blockNumber,
      }))
    })

    const blocks = await Promise.all(queries)

    return aggregatePerDay(this.projectId, blocks.flat())
  }
}
