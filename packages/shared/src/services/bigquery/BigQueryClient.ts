import { getMethodQuery, getTransferQuery } from '@l2beat/shared-pure'

import { BigQueryProvider } from './BigQueryProvider'
import { Method, Project, Transfer } from './config'
import { LivenessMethodsQuery, LivenessTransfersQuery } from './model'

export class BigQueryClient {
  constructor(private readonly bigquery: BigQueryProvider) {}

  async makeTransfersQuery(
    projectsConfig: Project[],
    from_timestamp: string,
    to_timestamp: string,
  ) {
    const transfers = projectsConfig
      .filter((p) => p.transfers)
      .flatMap((p) => p.transfers) as Transfer[]
    const from_addresses = transfers.map((t) => t.from_address.toLowerCase())
    const to_addresses = transfers.map((t) => t.to_address.toLowerCase())
    const query = getTransferQuery(
      from_addresses,
      to_addresses,
      from_timestamp,
      to_timestamp,
    )
    const transfersData = await this.bigquery.query(query)
    return LivenessTransfersQuery.parse(transfersData)
  }

  async makeMethodsQuery(
    projectsConfig: Project[],
    from_timestamp: string,
    to_timestamp: string,
  ) {
    const methods = projectsConfig
      .filter((p) => p.methods)
      .flatMap((p) => p.methods) as Method[]
    const addresses = methods.map((m) => m.address.toLowerCase())
    const methodSelectors = methods.map((m) => m.selector.toLowerCase())
    const query = getMethodQuery(
      addresses,
      methodSelectors,
      from_timestamp,
      to_timestamp,
    )
    const methodsData = await this.bigquery.query(query)
    return LivenessMethodsQuery.parse(methodsData)
  }
}
