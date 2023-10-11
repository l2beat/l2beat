import { RateLimiter } from '@l2beat/shared-pure'

import { BigQueryWrapper } from './BigQueryWrapper'

export class BigQueryProvider {
  constructor(private readonly bigquery: BigQueryWrapper) {
    const rateLimiter = new RateLimiter({
      callsPerMinute: 100,
    })
    this.query = rateLimiter.wrap(this.query.bind(this))
  }

  async query(sqlQuery: string): Promise<unknown> {
    try {
      const [job] = await this.bigquery.createQueryJob(sqlQuery)
      const [rows] = await job.getQueryResults()
      return rows as unknown
    } catch (error) {
      throw new Error(
        '[Google BigQuery] Failed to query: ' + (error as Error).message,
      )
    }
  }
}
