import { AssessCount } from '@l2beat/config'
import { ActivityRecord } from '@l2beat/database'
import { BlockProvider } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { aggregatePerDay } from '../../utils/aggregatePerDay'
import { RpcUopsAnalyzer } from '../uops/analyzers/RpcUopsAnalyzer'

interface Dependencies {
  provider: BlockProvider
  projectId: ProjectId
  assessCount?: AssessCount
}

export class BlockTxsCountService {
  rpcUopsAnalyzer: RpcUopsAnalyzer

  constructor(private readonly $: Dependencies) {
    this.rpcUopsAnalyzer = new RpcUopsAnalyzer()
  }

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    const queries = range(from, to + 1).map(async (blockNumber) => {
      const block = await this.$.provider.getBlockWithTransactions(blockNumber)

      const transactionsLength = block.transactions.length
      const txsCount =
        this.$.assessCount?.(transactionsLength, blockNumber) ??
        transactionsLength

      let uopsCount: number | null = null
      if (this.$.projectId !== ProjectId('zksync')) {
        const { uopsLength } = this.rpcUopsAnalyzer.analyzeBlock(block)
        uopsCount = this.$.assessCount?.(uopsLength, blockNumber) ?? uopsLength
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
