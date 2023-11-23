import { BigQuery, Query } from '@google-cloud/bigquery'
import { RateLimiter } from '@l2beat/shared-pure'

export interface BigQueryAuth {
  // Client Email
  clientEmail: string
  // Consumer Private Key
  privateKey: string
  // Project ID
  projectId: string
}

export class BigQueryClient {
  private readonly bigquery: BigQuery
  constructor(auth: BigQueryAuth) {
    this.bigquery = new BigQuery({
      credentials: {
        client_email: auth.clientEmail,
        private_key: auth.privateKey,
      },
      projectId: auth.projectId,
    })
    const rateLimiter = new RateLimiter({
      callsPerMinute: 100,
    })
    this.query = rateLimiter.wrap(this.query.bind(this))
  }

  async query(query: Query | string): Promise<unknown[]> {
    const [job] = await this.bigquery.createQueryJob(query)
    const [rows] = await job.getQueryResults()
    return rows as unknown[]
  }
}
