import { BigQuery } from '@google-cloud/bigquery'
import { providers } from 'ethers'
import { AsyncCache } from './AsyncCache'
import { AsyncQueue } from './AsyncQueue'
import { Logger } from './Logger'
import { SimpleDate } from './SimpleDate'

export class BlockInfo {
  private bigQueryQueue = new AsyncQueue({ length: 1 })
  private ethersQueue = new AsyncQueue({ length: 1 })

  constructor(
    private bigQuery: BigQuery,
    private provider: providers.Provider,
    private asyncCache: AsyncCache,
    private logger: Logger
  ) {}

  async getMaxBlock(date: SimpleDate) {
    return this.asyncCache.getOrFetch(['getMaxBlock', date], () =>
      this._getMaxBlock(date)
    )
  }

  private async _getMaxBlock(date: SimpleDate) {
    const [rows] = await this.bigQueryQueue.enqueue(() =>
      this.bigQuery.query({
        query: `
        SELECT MAX(number) as block
        FROM bigquery-public-data.crypto_ethereum.blocks
        WHERE date(timestamp) = @date;
      `,
        params: { date: date.toString() },
      })
    )
    this.logger.log(`fetched max block for ${date}`)
    return rows[0].block as number
  }

  async getBlockDate(block: number) {
    return this.asyncCache.getOrFetch(
      ['getBlockDate', block],
      () => this._getBlockDate(block),
      (date) => date.toString(),
      (json) => SimpleDate.fromString(json)
    )
  }

  private async _getBlockDate(block: number) {
    const { timestamp } = await this.ethersQueue.enqueue(() =>
      this.provider.getBlock(block)
    )
    this.logger.log(`fetched block date for ${block}`)
    return SimpleDate.fromUnixTimestamp(timestamp)
  }
}
