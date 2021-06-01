import { BigQuery } from '@google-cloud/bigquery'

export class BlockInfo {
  constructor(private bigQuery: BigQuery) {}

  async getMaxBlockForDate(date: Date) {
    const [rows] = await this.bigQuery.query({
      query: `
        SELECT MAX(number) as block
        FROM bigquery-public-data.crypto_ethereum.blocks
        WHERE date(timestamp) = @date;
      `,
      params: { date: formatDate(date) },
    })
    return rows[0].block as number
  }
}

function formatDate(date: Date) {
  const year = date.getUTCFullYear().toString().padStart(4, '0')
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
  const day = date.getUTCDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}
