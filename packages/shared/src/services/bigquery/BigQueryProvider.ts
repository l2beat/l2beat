import { RateLimiter } from '@l2beat/shared-pure'

import { BigQuerySDKWrapper } from './BigQuerySDKWrapper'

export class BigQueryProvider {
  constructor(private readonly bigquery: BigQuerySDKWrapper) {
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
