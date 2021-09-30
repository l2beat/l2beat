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

    const start = await this.getStartTimestamp()
    const lastDay = new Array(24)
      .fill(0)
      .map((_, i) => start.add(-i, 'hours'))
      .filter((time) => time.gte(this.minTimestamp))

    this.newestReport = await Promise.all(
      lastDay.map(async (time) => ({
        time: time,
        blockNumber: await this.etherscanClient.getBlockNumberAtOrBefore(time),
      }))
    )
    this.logger.info('Report created')
  }

  private async getStartTimestamp() {
    const lastBlock = await this.ethereumClient.getBlockNumber()
    // we use a block in the past to not have to worry about reorgs
    const maxBlock = lastBlock - 100n
    const { timestamp } = await this.ethereumClient.getBlock(maxBlock)
    return timestamp.toStartOf('hour')
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
