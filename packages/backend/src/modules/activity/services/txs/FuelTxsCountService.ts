import { ActivityRecord } from '@l2beat/database'
import { FuelClient } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { aggregatePerDay } from '../../utils/aggregatePerDay'

export class FuelTxsCountService {
  constructor(
    private readonly fuelClient: FuelClient,
    private readonly projectId: ProjectId,
  ) {}

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    const queries = range(from, to + 1).map(async (blockNumber) => {
      const block = await this.fuelClient.getBlock(blockNumber)
      return {
        txsCount: block.transactionsCount,
        uopsCount: null,
        timestamp: new UnixTime(block.timestamp),
        number: block.height,
      }
    })

    const blocks = await Promise.all(queries)

    return aggregatePerDay(this.projectId, blocks)
  }
}
