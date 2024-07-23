import { Logger } from '@l2beat/backend-tools'
import { ScalingProjectTransactionApi } from '@l2beat/config'
import { ActivityRecord } from '@l2beat/database/src/activity/entity'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { Peripherals } from '../../../peripherals/Peripherals'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'

interface TxsCountProviderDeps {
  logger: Logger
  peripherals: Peripherals
  projectId: ProjectId
  projectConfig: ScalingProjectTransactionApi
}

export class TxsCountProvider {
  constructor(private readonly $: TxsCountProviderDeps) {
    this.$.logger = $.logger.for(this).tag($.projectId.toString())
  }

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    switch (this.$.projectConfig.type) {
      case 'rpc': {
        return await this.getRpcTxsCount(from, to)
      }
      default:
        throw new Error(`${this.$.projectConfig.type} type not implemented`)
    }
  }

  async getRpcTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    assert(
      this.$.projectConfig.type === 'rpc',
      'Method not supported for projects other than rpc',
    )
    const projectConfig = this.$.projectConfig

    const rpcClient = this.$.peripherals.getClient(RpcClient, {
      url: projectConfig.defaultUrl,
      callsPerMinute: projectConfig.defaultCallsPerMinute,
    })

    const queries = range(from, to + 1).map(async (blockNumber) => {
      const block = await rpcClient.getBlock(blockNumber)
      const timestamp = new UnixTime(block.timestamp)

      return {
        timestamp,
        count:
          projectConfig.assessCount?.(block.transactions.length, blockNumber) ??
          block.transactions.length,
      }
    })

    const blocks = await Promise.all(queries)

    const result: ActivityRecord[] = []

    for (const block of blocks) {
      const timestamp = block.timestamp.toStartOf('day')
      const currentCount = result.find(
        (r) => r.timestamp.toNumber() === timestamp.toNumber(),
      )

      if (currentCount) {
        currentCount.count += block.count
      } else {
        result.push({
          projectId: this.$.projectId,
          timestamp,
          count: block.count,
        })
      }
    }
    return result
  }
}
