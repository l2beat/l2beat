import { ActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { StarknetClient } from '../../../../peripherals/starknet/StarknetClient'
import { TxsCountProvider } from '../TxsCountProvider'

export class StarknetTxsCountProvider extends TxsCountProvider {
  constructor(
    private readonly starknetClient: StarknetClient,
    projectId: ProjectId,
  ) {
    super(projectId)
  }

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    const queries = range(from, to + 1).map(async (blockNumber) => {
      const block = await this.starknetClient.getBlock(blockNumber)

      return {
        txsCount: block.transactions.length,
        timestamp: new UnixTime(block.timestamp),
        number: block.number,
      }
    })

    const blocks = await Promise.all(queries)

    return this.aggregatePerDay(blocks)
  }
}
