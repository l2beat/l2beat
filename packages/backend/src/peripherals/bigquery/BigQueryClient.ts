import { BigQuery, Query } from '@google-cloud/bigquery'
import { Logger } from '@l2beat/backend-tools'
import { assert, RateLimiter } from '@l2beat/shared-pure'

export interface BigQueryAuth {
  // Client Email
  clientEmail: string
  // Consumer Private Key
  privateKey: string
  // Project ID
  projectId: string
}

const BYTES_IN_GB = 1_000_000_000

export class BigQueryClient {
  private readonly bigquery: BigQuery
  private readonly queryLimit: number
  private readonly queryWarningLimit: number

  constructor(
    auth: BigQueryAuth,
    queryLimitGb: number,
    queryWarningLimitGb: number,
    private readonly logger: Logger,
  ) {
    this.bigquery = new BigQuery({
      credentials: {
        client_email: auth.clientEmail,
        private_key: auth.privateKey,
      },
      projectId: auth.projectId,
    })
    this.queryLimit = queryLimitGb * BYTES_IN_GB
    this.queryWarningLimit = queryWarningLimitGb * BYTES_IN_GB

    const rateLimiter = new RateLimiter({
      callsPerMinute: 100,
    })
    this.query = rateLimiter.wrap(this.query.bind(this))
  }

  async query(query: Query | string): Promise<unknown[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const estimate = await this.estimateQuerySize(query)

    assert(
      estimate && estimate < this.queryLimit,
      'BigQuery estimate too high: ' + estimate.toString(),
    )

    if (estimate > this.queryWarningLimit) {
      this.logger.warn('BigQuery estimate is high: ' + estimate.toString())
    }

    const [job] = await this.bigquery.createQueryJob(
      typeof query === 'string'
        ? { query, location: 'US' }
        : { ...query, location: 'US' },
    )
    const [rows] = await job.getQueryResults()
    return rows as unknown[]
  }

  async estimateQuerySize(query: Query | string) {
    const [dryJob] = await this.bigquery.createQueryJob(
      typeof query === 'string'
        ? { query, location: 'US', dryRun: true }
        : { ...query, location: 'US', dryRun: true },
    )
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const estimate = +dryJob.metadata.statistics.query.totalBytesProcessed

    return estimate
  }
}
