import { Logger } from '@l2beat/backend-tools'
import { ScalingProjectTransactionApi } from '@l2beat/config'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { Peripherals } from '../../../peripherals/Peripherals'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { promiseAllPlus } from '../../../tools/queue/promiseAllPlus'

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

  async getTxsCount(from: number, to: number): Promise<Map<number, number>> {
    switch (this.$.projectConfig.type) {
      case 'rpc': {
        return await this.getRpcTxsCount(from, to)
      }
      default:
        throw new Error(`${this.$.projectConfig.type} type not implemented`)
    }
  }

  async getRpcTxsCount(from: number, to: number): Promise<Map<number, number>> {
    const projectConfig = this.$.projectConfig
    assert(
      projectConfig.type === 'rpc',
      'Method not supported for projects other than rpc',
    )

    const rpcClient = this.$.peripherals.getClient(RpcClient, {
      url: projectConfig.defaultUrl,
      callsPerMinute: projectConfig.defaultCallsPerMinute,
    })

    const queries = range(from, to + 1).map((blockNumber) => async () => {
      const block = await rpcClient.getBlock(blockNumber)
      const timestamp = new UnixTime(block.timestamp)

      return {
        timestamp,
        count:
          projectConfig.assessCount?.(block.transactions.length, blockNumber) ??
          block.transactions.length,
      }
    })

    const blocks = await promiseAllPlus(queries, this.$.logger, {
      metricsId: `RpcBlockCounter_${this.$.projectId.toString()}`,
    })

    const sumsMap = new Map<number, number>()

    for (const block of blocks) {
      const timestamp = block.timestamp.toStartOf('day')

      const existing = sumsMap.get(timestamp.toNumber())
      if (existing) {
        sumsMap.set(timestamp.toNumber(), existing + block.count)
      } else {
        sumsMap.set(timestamp.toNumber(), block.count)
      }
    }
    return sumsMap
  }
}
