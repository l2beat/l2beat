import { Logger, TaskQueue } from '@l2beat/common'
import { ProjectUptime } from '@l2beat/config'
import { EthereumAddress } from '@l2beat/types'

import { ProjectInfo } from '../model'
import { ApiMonitor } from '../peripherals/uptime/ApiMonitor'
import { RpcMonitor } from '../peripherals/uptime/RpcMonitor'

const FIVE_MINUTES = 1000 * 60 * 5

export class UptimeUpdater {
  private taskQueue = new TaskQueue<void>(() => this.update(), this.logger)

  constructor(
    private rpcMonitor: RpcMonitor,
    private apiMonitor: ApiMonitor,
    private projects: ProjectInfo[],
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  start() {
    this.logger.info('Started')
    const interval = setInterval(() => {
      this.taskQueue.addIfEmpty()
    }, FIVE_MINUTES)
    return () => clearInterval(interval)
  }

  async update() {
    this.logger.info('Update started')

    await Promise.allSettled(
      this.projects
        .flatMap(({ urls }) => urls?.map((url) => this.checkUptime(url)))
        .filter((x) => x),
    )

    this.logger.info('Update completed')
  }

  async checkUptime(uptime: ProjectUptime) {
    try {
      if (uptime.action === 'rpc_estimateGas') {
        return await this.rpcMonitor.estimateGas(
          uptime.url,
          EthereumAddress(uptime.from),
          EthereumAddress(uptime.to),
        )
      }

      if (uptime.action === 'rpc_getBalance') {
        return await this.rpcMonitor.getBalance(
          uptime.url,
          EthereumAddress(uptime.to),
          uptime.data,
        )
      }

      const maxSinceLastTrade = 3600 * 4 // TODO what is the longest we should wait since the last trade?
      if (uptime.action === 'dydx_checkTrades') {
        return await this.apiMonitor.dydxCheckTrades(
          uptime.url,
          maxSinceLastTrade,
        )
      }

      if (uptime.action === 'aztec_checkBlock') {
        return await this.apiMonitor.aztecCheckBlock(
          uptime.url,
          uptime.body,
          maxSinceLastTrade,
        )
      }
      if (uptime.action === 'immutableX_checkTrades') {
        return await this.apiMonitor.immutablexCheckTrades(
          uptime.url,
          maxSinceLastTrade,
        )
      }

      if (uptime.action === 'loopring_checkTrades') {
        return await this.apiMonitor.loopringCheckTrades(
          uptime.url,
          maxSinceLastTrade,
        )
      }

      if (uptime.action === 'starknet_checkBlock') {
        return await this.apiMonitor.starknetCheckBlock(
          uptime.url,
          maxSinceLastTrade,
        )
      }

      if (uptime.action === 'zkspace_checkTrades') {
        return await this.apiMonitor.zkspaceCheckTrades(
          uptime.url,
          maxSinceLastTrade,
        )
      }

      if (uptime.action === 'zksync_checkBlock') {
        return await this.apiMonitor.zksyncCheckBlock(
          uptime.url,
          maxSinceLastTrade,
        )
      }
    } catch {
      // TODO: save errors
      return { active: false }
    }
  }
}
