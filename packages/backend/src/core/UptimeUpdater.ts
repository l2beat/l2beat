import { Logger, TaskQueue } from '@l2beat/common'
import { ProjectUptime } from '@l2beat/config'
import { EthereumAddress } from '@l2beat/types'

import { ProjectInfo } from '../model'
import { RpcMonitor } from '../peripherals/uptime/RpcMonitor'
import { Clock } from './Clock'

export class UptimeUpdater {
  private taskQueue = new TaskQueue<void>(() => this.update(), this.logger)

  constructor(
    private rpcMonitor: RpcMonitor,
    private clock: Clock,
    private projects: ProjectInfo[],
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  start() {
    this.logger.info('Started')
    return this.clock.onNewMinute(() => {
      this.taskQueue.addToFront()
    })
  }

  async update() {
    this.logger.info('Update started')

    await Promise.allSettled(
      this.projects.flatMap(({ urls }) =>
        urls?.map((url) => this.checkUptime(url)),
      ),
    )

    this.logger.info('Update completed')
  }

  async checkUptime(uptime: ProjectUptime) {
    if (uptime.action === 'rpc_estimateGas') {
      return this.rpcMonitor.estimateGas(
        uptime.url,
        EthereumAddress(uptime.from),
        EthereumAddress(uptime.to),
      )
    }

    if (uptime.action === 'rpc_getBalance') {
      return this.rpcMonitor.getBalance(
        uptime.url,
        EthereumAddress(uptime.to),
        uptime.data,
      )
    }
  }
}
