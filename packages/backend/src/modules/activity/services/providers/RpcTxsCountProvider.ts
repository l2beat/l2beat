import { AssessCount } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
import { ActivityRecordWithoutRatio } from '../../types'
import { aggregatePerDay } from '../../utils/aggregatePerDay'

export class RpcTxsCountProvider {
  constructor(
    private readonly rpcClient: RpcClient,
    private readonly projectId: ProjectId,
    private readonly assessCount?: AssessCount,
  ) {}

  async getTxsCount(
    from: number,
    to: number,
  ): Promise<ActivityRecordWithoutRatio[]> {
    const queries = range(from, to + 1).map(async (blockNumber) => {
      const block = await this.rpcClient.getBlock(blockNumber)
      const timestamp = new UnixTime(block.timestamp)

      return {
        txsCount:
          this.assessCount?.(block.transactions.length, blockNumber) ??
          block.transactions.length,
        timestamp,
        uopsCount: null,
        number: block.number,
      }
    })

    const blocks = await Promise.all(queries)

    return aggregatePerDay(this.projectId, blocks)
  }
}
