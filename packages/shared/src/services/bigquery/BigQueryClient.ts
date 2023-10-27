import { RateLimiter } from '@l2beat/shared-pure'

import { BigQuerySDKWrapper } from './BigQuerySDKWrapper'

export class BigQueryClient {
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
      if (error instanceof Error) {
        throw {
          ...error,
          message: 'Google BigQuery error: ' + error.message,
        }
      } else {
        throw error
      }
    }
  }
}
