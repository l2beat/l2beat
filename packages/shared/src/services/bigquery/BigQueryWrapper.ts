import { BigQuery } from '@google-cloud/bigquery'

export interface BigQueryAuth {
  // Client Email
  client_email: string
  // Consumer Private Key
  private_key: string
  // Project ID
  projectId: string
}

export class BigQueryWrapper {
  private readonly bigquery: BigQuery

  constructor(params: BigQueryAuth) {
    this.bigquery = new BigQuery({
      credentials: {
        client_email: params.client_email,
        private_key: params.private_key,
      },
      projectId: params.projectId,
    })
  }

  createQueryJob(query: string) {
    return this.bigquery.createQueryJob({
      query,
      // We specify location as US because it is the cheapest location (price depends on location)
      location: 'US',
    })
  }
}
