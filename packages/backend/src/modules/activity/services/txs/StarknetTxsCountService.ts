import { ActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { StarknetClient } from '../../../../peripherals/starknet/StarknetClient'
import { aggregatePerDay } from '../../utils/aggregatePerDay'
import { StarknetUopsAnalyzer } from '../uops/analyzers/StarknetUopsAnalyzer'

export class StarknetTxsCountService {
  constructor(
    private readonly starknetClient: StarknetClient,
    private readonly projectId: ProjectId,
    private readonly uopsAnalyzer: StarknetUopsAnalyzer,
  ) {}

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    const queries = range(from, to + 1).map(async (blockNumber) => {
      const block =
        await this.starknetClient.getBlockWithTransactions(blockNumber)

      const txsCount = block.transactions.length
      const uopsCount = this.uopsAnalyzer.calculateUops(block)

      return {
        txsCount: txsCount,
        uopsCount: uopsCount,
        timestamp: new UnixTime(block.timestamp),
        number: block.number,
      }
    })

    const blocks = await Promise.all(queries)

    return aggregatePerDay(this.projectId, blocks)
  }
}
