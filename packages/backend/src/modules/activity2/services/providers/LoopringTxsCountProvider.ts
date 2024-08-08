import { ActivityRecord } from '@l2beat/database'
import { ProjectId } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { LoopringClient } from '../../../../peripherals/loopring/LoopringClient'
import { TxsCountProvider } from '../TxsCountProvider'

export class LoopringTxsCountProvider extends TxsCountProvider {
  constructor(
    private readonly loopringClient: LoopringClient,
    projectId: ProjectId,
  ) {
    super(projectId)
  }

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    const queries = range(from, to + 1).map(async (blockNumber) => {
      const block = await this.loopringClient.getBlock(blockNumber)
      return {
        txsCount: block.transactions,
        timestamp: block.createdAt,
        number: block.blockId,
      }
    })

    const blocks = await Promise.all(queries)

    return this.aggregatePerDay(blocks)
  }
}
