import { AssessCount } from '@l2beat/config'
import { ActivityRecord } from '@l2beat/database'
import { BlockProvider } from '@l2beat/shared'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { aggregatePerDay } from '../../utils/aggregatePerDay'
import { RpcUopsAnalyzer } from '../uops/analyzers/RpcUopsAnalyzer'

interface Dependencies {
  provider: BlockProvider
  projectId: ProjectId
  type: 'rpc' | 'zksync' | 'fuel' | 'degate'
  rpcUopsAnalyzer: RpcUopsAnalyzer
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
      if (this.$.type === 'rpc') {
        assert(this.$.rpcUopsAnalyzer)
        const uops = this.$.rpcUopsAnalyzer.calculateUops(block)
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
