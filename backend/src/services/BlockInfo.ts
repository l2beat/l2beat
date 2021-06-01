import { BigQuery } from '@google-cloud/bigquery'
import { SimpleDate } from './SimpleDate'

export class BlockInfo {
  constructor(private bigQuery: BigQuery) {}

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
}
