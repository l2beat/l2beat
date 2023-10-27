import { BigQuery } from '@google-cloud/bigquery'

export interface BigQueryAuth {
  // Client Email
  clientEmail: string
  // Consumer Private Key
  privateKey: string
  // Project ID
  projectId: string
}

export class BigQuerySDKWrapper {
  private readonly bigquery: BigQuery

  constructor(params: BigQueryAuth) {
    this.bigquery = new BigQuery({
      credentials: {
        client_email: params.clientEmail,
        private_key: params.privateKey,
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
