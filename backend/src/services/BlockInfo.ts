import { BigQuery } from '@google-cloud/bigquery'
import { providers } from 'ethers'
import { SimpleDate } from './SimpleDate'

export class BlockInfo {
  constructor(
    private bigQuery: BigQuery,
    private provider: providers.Provider
  ) {}

  async getMaxBlock(date: SimpleDate) {
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
    const { timestamp } = await this.provider.getBlock(block)
    return SimpleDate.fromUnixTimestamp(timestamp)
  }
}
