import { ActivityRecord } from '@l2beat/database'
import { ProjectId } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { DegateClient } from '../../../../peripherals/degate'
import { aggregatePerDay } from '../../utils/aggregatePerDay'

export class DegateTxsCountService {
  constructor(
    private readonly degateClient: DegateClient,
    private readonly projectId: ProjectId,
  ) {}

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    const queries = range(from, to + 1).map(async (blockNumber) => {
      const block = await this.degateClient.getBlock(blockNumber)
      return {
        txsCount: block.transactions,
        uopsCount: null,
        timestamp: block.createdAt,
        number: block.blockId,
      }
    })

    const blocks = await Promise.all(queries)

    return aggregatePerDay(this.projectId, blocks)
  }
}
