import { UnixTime } from '../../model/UnixTime'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { Logger } from '../../tools/Logger'
import { ReportRangeService } from './ReportRangeService'

export type Report = { timestamp: UnixTime; blockNumber: BigInt }[]

export class ReportCreator {
  constructor(
    private ethereumClient: EthereumClient,
    private reportRangeService: ReportRangeService,
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
    const range = await this.reportRangeService.getRange(start)

    this.newestReport = range
    this.logger.info('Report created')
  }

  private async getStartTimestamp() {
    const lastBlock = await this.ethereumClient.getBlockNumber()
    // we use a block in the past to not have to worry about reorgs
    const maxBlock = lastBlock - 100n
    const { timestamp } = await this.ethereumClient.getBlock(maxBlock)
    return timestamp
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
