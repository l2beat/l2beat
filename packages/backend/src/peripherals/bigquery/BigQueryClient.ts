import { BigQuery, type Query } from '@google-cloud/bigquery'
import { RateLimiter } from '@l2beat/backend-tools'

const BYTES_IN_GB = 1024 * 1024 * 1024

export interface BigQueryClientQuery extends Omit<Query, 'maximumBytesBilled'> {
  limitInGb: number
}

export class BigQueryClient {
  constructor(private readonly bigquery: BigQuery) {
    const rateLimiter = new RateLimiter({
      callsPerMinute: 10,
    })
    this.query = rateLimiter.wrap(this.query.bind(this))
  }

  static create(
    _: unknown,
    options: { clientEmail: string; privateKey: string; projectId: string },
  ) {
    const bigQuery = new BigQuery({
      credentials: {
        client_email: options.clientEmail,
        private_key: options.privateKey,
      },
      projectId: options.projectId,
    })
    return new BigQueryClient(bigQuery)
  }

  async query(query: BigQueryClientQuery): Promise<unknown[]> {
    const querySpecificBytesLimit = query.limitInGb * BYTES_IN_GB

    const [job] = await this.bigquery.createQueryJob({
      ...query,
      maximumBytesBilled: querySpecificBytesLimit.toString(),
      location: 'US',
    })
    const [rows] = await job.getQueryResults()
    return rows as unknown[]
  }
}
