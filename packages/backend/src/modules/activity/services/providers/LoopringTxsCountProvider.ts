import { ProjectId } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { LoopringClient } from '../../../../peripherals/loopring/LoopringClient'
import { ActivityRecordWithoutRatio } from '../../types'
import { aggregatePerDay } from '../../utils/aggregatePerDay'

export class LoopringTxsCountProvider {
  constructor(
    private readonly loopringClient: LoopringClient,
    private readonly projectId: ProjectId,
  ) {}

  async getTxsCount(
    from: number,
    to: number,
  ): Promise<ActivityRecordWithoutRatio[]> {
    const queries = range(from, to + 1).map(async (blockNumber) => {
      const block = await this.loopringClient.getBlock(blockNumber)
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
