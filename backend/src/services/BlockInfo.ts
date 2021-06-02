import { providers } from 'ethers'
import { AsyncCache } from './AsyncCache'
import { QueryQueue } from './QueryQueue'
import { SimpleDate } from './SimpleDate'

export class BlockInfo {
  constructor(
    private queryQueue: QueryQueue,
    private provider: providers.Provider,
    private asyncCache: AsyncCache
  ) {}

  async getMaxBlock(date: SimpleDate) {
    return this.asyncCache.getOrFetch(['getMaxBlock', date], () =>
      this._getMaxBlock(date)
    )
  }

  private async _getMaxBlock(date: SimpleDate) {
    const [rows] = await this.queryQueue.query({
      query: `
        SELECT MAX(number) as block
        FROM bigquery-public-data.crypto_ethereum.blocks
        WHERE date(timestamp) = @date;
      `,
      params: { date: date.toString() },
    })
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
    const { timestamp } = await this.provider.getBlock(block)
    return SimpleDate.fromUnixTimestamp(timestamp)
  }
}
