import { Logger } from '@l2beat/backend-tools'
import { ActivityRecord } from '@l2beat/database/src/activity/entity'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { ActivityConfig } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { StarkexClient } from '../../../peripherals/starkex/StarkexClient'
import { ActivityTransactionConfig } from '../../activity/ActivityTransactionConfig'

interface TxsCountProviderDeps {
  logger: Logger
  peripherals: Peripherals
  projectId: ProjectId
  projectConfig: ActivityTransactionConfig
  activityConfig: ActivityConfig
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
      case 'starkex': {
        return await this.getStarkexTxsCount(from, to)
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
      url: projectConfig.url,
      callsPerMinute: projectConfig.callsPerMinute,
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

  async getStarkexTxsCount(
    from: number,
    to: number,
  ): Promise<ActivityRecord[]> {
    assert(
      this.$.projectConfig.type === 'starkex',
      'Method not supported for projects other than starkex',
    )

    const projectConfig = this.$.projectConfig

    const starkexClient = this.$.peripherals.getClient(StarkexClient, {
      apiKey: this.$.activityConfig.starkexApiKey,
      callsPerMinute: this.$.activityConfig.starkexCallsPerMinute,
      timeout: undefined,
    })

    const queries = range(from, to + 1).map(async (day) => {
      const productCounts = await Promise.all(
        projectConfig.product.map(
          async (instance) => await starkexClient.getDailyCount(day, instance),
        ),
      )

      return {
        count: productCounts.reduce((a, b) => a + b, 0),
        timestamp: UnixTime.fromDays(day),
      }
    })

    const counts = await Promise.all(queries)

    return counts.map((c) => ({
      projectId: this.$.projectId,
      timestamp: c.timestamp,
      count: c.count,
    }))
  }
}
