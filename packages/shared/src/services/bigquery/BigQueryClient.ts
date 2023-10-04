import { BigQuery } from '@google-cloud/bigquery'
import { RateLimiter } from '@l2beat/shared-pure'

import { QueryRows } from './model'

export class BigQueryClient {
  private readonly bigquery: BigQuery

  constructor(
    private readonly clientEmail: string,
    private readonly privateKey: string,
    private readonly projectId: string,
  ) {
    this.bigquery = new BigQuery({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      projectId,
    })
    const rateLimiter = new RateLimiter({
      callsPerMinute: 100,
    })
    this.query = rateLimiter.wrap(this.query.bind(this))
  }

  async query(sqlQuery: string): Promise<QueryRows> {
    try {
      const [job] = await this.bigquery.createQueryJob({
        query: sqlQuery,
        location: 'US',
      })
      try {
        const [rows] = await job.getQueryResults()
        return QueryRows.parse(rows)
      } catch (resultsError) {
        throw new Error('Failed to fetch query results.')
      }
    } catch (jobError) {
      throw new Error('Failed to create query job.')
    }
  }
}
