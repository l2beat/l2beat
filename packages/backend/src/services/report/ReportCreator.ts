import { EthereumClient } from '../ethereum'
import { EtherscanClient } from '../etherscan'
import { Logger } from '../Logger'
import { UnixTime } from '../model/UnixTime'

export type Report = { time: UnixTime; blockNumber: BigInt }[]

export class ReportCreator {
  constructor(
    private minTimestamp: UnixTime,
    private ethereumClient: EthereumClient,
    private etherscanClient: EtherscanClient,
    private logger: Logger
  ) {
    this.logger = this.logger.for(this)
  }

  private newestReport?: Report

  getReport() {
    return this.newestReport
  }

  async createReport(time: UnixTime) {
    this.logger.info('Creating report', { time: time.toNumber() })

    const start = time.toStartOf('hour')
    const lastDay = new Array(24)
      .fill(0)
      .map((_, i) => start.add(-i, 'hours'))
      .filter((time) => time.gte(this.minTimestamp))
    const maxBlock = (await this.ethereumClient.getBlockNumber()) - 100n

    const blocks = await Promise.all(
      lastDay.map(async (time) => ({
        time: time,
        blockNumber: await this.etherscanClient.getBlockNumberAtOrBefore(time),
      }))
    )
    this.newestReport = blocks.filter((x) => x.blockNumber <= maxBlock)
  }

  startBackgroundWork() {
    const TEN_MINUTES = 10 * 60 * 1000
    const run = () => {
      // TODO: error handling
      this.createReport(UnixTime.now())
    }
    const timeout = setTimeout(run, 0)
    const interval = setInterval(run, TEN_MINUTES)
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }
}
