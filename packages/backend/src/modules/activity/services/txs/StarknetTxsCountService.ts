import { ActivityRecord } from '@l2beat/database'
import { Block, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { StarknetClient } from '../../../../peripherals/starknet/StarknetClient'
import { aggregatePerDay } from '../../utils/aggregatePerDay'
import { StarknetUopsAnalyzer } from '../uops/analyzers/StarknetUopsAnalyzer'

export class StarknetTxsCountService {
  constructor(
    private readonly starknetClient: StarknetClient,
    private readonly projectId: ProjectId,
    private readonly uopsAnalyzer: StarknetUopsAnalyzer,
  ) { }

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    const queries = range(from, to + 1).map(async (blockNumber) => {
      const blockResponse =
        await this.starknetClient.getBlockWithTransactions(blockNumber)

      // TODO: move to provider
      const block: Block = {
        number: blockResponse.block_number,
        hash: blockResponse.block_hash,
        transactions: blockResponse.transactions.map(t => ({
          hash: t.transaction_hash,
          from: t.sender_address,
          type: t.type,
          data: t.calldata,
          to: 'UNSUPPORTED'
        }))
      }

      const { uopsLength, transactionsLength } =
        this.uopsAnalyzer.analyzeBlock(block)

      return {
        txsCount: transactionsLength,
        uopsCount: uopsLength,
        timestamp: new UnixTime(blockResponse.timestamp),
        number: blockResponse.number,
      }
    })

    const blocks = await Promise.all(queries)

    return aggregatePerDay(this.projectId, blocks)
  }
}
