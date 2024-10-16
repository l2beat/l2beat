import { AssessCount } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
import { ActivityRecordWithoutRatio } from '../../types'
import { aggregatePerDay } from '../../utils/aggregatePerDay'
import { RpcUopsAnalyzer } from '../uops/analyzers/RpcUopsAnalyzer'

export class RpcTxsCountProvider {
  constructor(
    private readonly rpcClient: RpcClient,
    private readonly projectId: ProjectId,
    private readonly uopsAnalyzer: RpcUopsAnalyzer,
    private readonly assessCount?: AssessCount,
  ) {}

  async getTxsCount(
    from: number,
    to: number,
  ): Promise<ActivityRecordWithoutRatio[]> {
    const queries = range(from, to + 1).map(async (blockNumber) => {
      const block = await this.rpcClient.getBlockWithTransactions(blockNumber)
      const { transactionsLength, uopsLength } =
        this.uopsAnalyzer.analyzeBlock(block)
      const timestamp = new UnixTime(block.timestamp)

      const txsCount =
        this.assessCount?.(transactionsLength, blockNumber) ??
        transactionsLength
      const uopsCount =
        this.assessCount?.(uopsLength, blockNumber) ?? uopsLength

      const ratio = uopsCount / txsCount

      return {
        txsCount,
        uopsCount,
        ratio,
        timestamp,
        number: block.number,
      }
    })

    const blocks = await Promise.all(queries)

    return aggregatePerDay(this.projectId, blocks)
  }
}
