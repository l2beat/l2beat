import { BigQuery } from '@google-cloud/bigquery'
import { providers } from 'ethers'
import { SimpleDate } from './SimpleDate'

export class BlockInfo {
  private maxBlocks = new Map<string, Promise<number>>()
  private blockDates = new Map<number, Promise<SimpleDate>>()

  constructor(
    private bigQuery: BigQuery,
    private provider: providers.Provider
  ) {}

  async getMaxBlock(date: SimpleDate) {
    const key = date.toString()
    const cached = this.maxBlocks.get(key)
    if (cached) {
      return cached
    }
    const promise = this._getMaxBlock(date)
    this.maxBlocks.set(key, promise)
    return promise
  }

  private async _getMaxBlock(date: SimpleDate) {
    const [rows] = await this.bigQuery.query({
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
    const cached = this.blockDates.get(block)
    if (cached) {
      return cached
    }
    const promise = this._getBlockDate(block)
    this.blockDates.set(block, promise)
    return promise
  }

  private async _getBlockDate(block: number) {
    const { timestamp } = await this.provider.getBlock(block)
    return SimpleDate.fromUnixTimestamp(timestamp)
  }
}
