import { assert, RateLimiter } from '@l2beat/shared-pure'

import { BigQuerySDKWrapper } from './BigQuerySDKWrapper'

const bytesInGb = 1_000_000_000
// Currently the biggest query that we do takes around 5.1 GB
// this limit ensures that there are no surprises and we do not overpay
const LIMIT = 6 * bytesInGb

export class BigQueryClient {
  constructor(
    private readonly bigquery: BigQuerySDKWrapper,
    private readonly queryLimit = LIMIT,
  ) {
    const rateLimiter = new RateLimiter({
      callsPerMinute: 100,
    })
    this.query = rateLimiter.wrap(this.query.bind(this))
  }

  async query(sqlQuery: string): Promise<unknown> {
    const estimate = await this.estimateQuerySize(sqlQuery)

    assert(
      estimate && estimate < this.queryLimit,
      'BigQuery estimate too high: ' + estimate.toString(),
    )

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

  async estimateQuerySize(sqlQuery: string) {
    const [dryJob] = await this.bigquery.createQueryJob(sqlQuery, true)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const estimate = +dryJob.metadata.statistics.query.totalBytesProcessed

    return estimate
  }
}
