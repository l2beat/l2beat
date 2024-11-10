import { AssessCount } from '@l2beat/config'
import { ActivityRecord } from '@l2beat/database'
import { BlockProvider } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { aggregatePerDay } from '../../utils/aggregatePerDay'
import { RpcUopsAnalyzer } from '../uops/analyzers/RpcUopsAnalyzer'
import { StarknetUopsAnalyzer } from '../uops/analyzers/StarknetUopsAnalyzer'

interface Dependencies {
  provider: BlockProvider
  projectId: ProjectId
  uopsAnalyzer?: RpcUopsAnalyzer | StarknetUopsAnalyzer
  assessCount?: AssessCount
}

export class BlockTxsCountService {
  constructor(private readonly $: Dependencies) {}

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    const queries = range(from, to + 1).map(async (blockNumber) => {
      const block = await this.$.provider.getBlockWithTransactions(blockNumber)

      const txs = block.transactions.length
      const txsCount = this.$.assessCount?.(txs, blockNumber) ?? txs

      let uopsCount: number | null = null
      if (this.$.uopsAnalyzer) {
        const uops = this.$.uopsAnalyzer.calculateUops(block)
        uopsCount = this.$.assessCount?.(uops, blockNumber) ?? uops
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
