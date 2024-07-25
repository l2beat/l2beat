import { Logger } from '@l2beat/backend-tools'
import { ActivityRecord } from '@l2beat/database'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { ActivityConfig } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { LoopringClient } from '../../../peripherals/loopring/LoopringClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { StarkexClient } from '../../../peripherals/starkex/StarkexClient'
import { StarknetClient } from '../../../peripherals/starknet/StarknetClient'
import { ZksyncLiteClient } from '../../../peripherals/zksynclite/ZksyncLiteClient'
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
      case 'zksync': {
        return await this.getZksyncTxsCount(from, to)
      }
      case 'starknet': {
        return await this.getStarknetTxsCount(from, to)
      }
      case 'loopring': {
        return await this.getLoopringTxsCount(from, to)
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
    return this.sumCountsPerDay(blocks)
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

  async getZksyncTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    assert(
      this.$.projectConfig.type === 'zksync',
      'Method not supported for projects other than zksync',
    )
    const projectConfig = this.$.projectConfig

    const zksyncClient = this.$.peripherals.getClient(ZksyncLiteClient, {
      url: projectConfig.url,
      callsPerMinute: projectConfig.callsPerMinute,
    })

    const queries = range(from, to + 1).map(async (blockNumber) => {
      const transactions =
        await zksyncClient.getTransactionsInBlock(blockNumber)

      return transactions.map((t) => ({ timestamp: t.createdAt, count: 1 }))
    })

    const blocks = await Promise.all(queries)
    return this.sumCountsPerDay(blocks.flat())
  }

  async getStarknetTxsCount(
    from: number,
    to: number,
  ): Promise<ActivityRecord[]> {
    assert(
      this.$.projectConfig.type === 'starknet',
      'Method not supported for projects other than Starknet',
    )
    const projectConfig = this.$.projectConfig

    const starknetClient = this.$.peripherals.getClient(StarknetClient, {
      url: projectConfig.url,
      callsPerMinute: projectConfig.callsPerMinute,
    })

    const queries = range(from, to + 1).map(async (blockNumber) => {
      const block = await starknetClient.getBlock(blockNumber)

      return {
        count: block.transactions.length,
        timestamp: new UnixTime(block.timestamp),
      }
    })

    const blocks = await Promise.all(queries)
    return this.sumCountsPerDay(blocks)
  }

  async getLoopringTxsCount(
    from: number,
    to: number,
  ): Promise<ActivityRecord[]> {
    assert(
      this.$.projectConfig.type === 'loopring',
      'Method not supported for projects other than Loopring',
    )
    const projectConfig = this.$.projectConfig

    const loopringClient = this.$.peripherals.getClient(LoopringClient, {
      url: projectConfig.url,
      callsPerMinute: projectConfig.callsPerMinute,
    })

    const queries = range(from, to + 1).map(async (blockNumber) => {
      const block = await loopringClient.getBlock(blockNumber)
      return {
        count: block.transactions,
        timestamp: block.createdAt,
      }
    })

    const blocks = await Promise.all(queries)
    return this.sumCountsPerDay(blocks)
  }

  sumCountsPerDay(
    blocks: {
      count: number
      timestamp: UnixTime
    }[],
  ): ActivityRecord[] {
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
