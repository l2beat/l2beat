import type { ActivityRecord } from '@l2beat/database'
import type { BlockProvider } from '@l2beat/shared'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { aggregatePerDay } from '../../utils/aggregatePerDay'
import type { RpcUopsAnalyzer } from '../uops/analyzers/RpcUopsAnalyzer'
import type { StarknetUopsAnalyzer } from '../uops/analyzers/StarknetUopsAnalyzer'

interface Dependencies {
  provider: BlockProvider
  projectId: ProjectId
  uopsAnalyzer?: RpcUopsAnalyzer | StarknetUopsAnalyzer
  assessCount: (count: number, blockNumber: number) => number
}

export class BlockTxsCountService {
  constructor(private readonly $: Dependencies) {}

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    const queries = range(from, to + 1).map(async (blockNumber) => {
      const block = await this.$.provider.getBlockWithTransactions(blockNumber)

      const txs = block.transactions.length
      const txsCount = this.$.assessCount(txs, blockNumber)

      let uopsCount: number | null = null
      if (this.$.uopsAnalyzer) {
        const uops = this.$.uopsAnalyzer.calculateUops(block)
        uopsCount = this.$.assessCount(uops, blockNumber)
      }

      return {
        txsCount,
        uopsCount,
        timestamp: new UnixTime(block.timestamp),
        number: block.number,
      }
    })

    const blocks = await Promise.all(queries)

    return aggregatePerDay(this.$.projectId, blocks)
  }
}
