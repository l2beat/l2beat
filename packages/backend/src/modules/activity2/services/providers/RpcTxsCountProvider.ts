import { Logger } from '@l2beat/backend-tools'
import { ActivityRecord } from '@l2beat/database'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
import { ActivityTransactionConfig } from '../../../activity/ActivityTransactionConfig'
import { TxsCountProvider } from '../TxsCountProvider'

export class RpcTxsCountProvider extends TxsCountProvider {
  constructor(
    logger: Logger,
    projectId: ProjectId,
    private readonly rpcClient: RpcClient,
    private readonly projectConfig: ActivityTransactionConfig,
  ) {
    super({ logger, projectId })
  }

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    assert(
      this.projectConfig.type === 'rpc',
      'Method not supported for projects other than rpc',
    )
    const projectConfig = this.projectConfig

    const queries = range(from, to + 1).map(async (blockNumber) => {
      const block = await this.rpcClient.getBlock(blockNumber)
      const timestamp = new UnixTime(block.timestamp)

      return {
        timestamp,
        count:
          projectConfig.assessCount?.(block.transactions.length, blockNumber) ??
          block.transactions.length,
        number: block.number,
      }
    })

    const blocks = await Promise.all(queries)
    return this.aggregatePerDay(blocks)
  }
}
