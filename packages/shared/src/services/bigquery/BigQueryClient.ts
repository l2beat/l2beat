import { getMethodQuery, getTransferQuery } from '@l2beat/shared-pure'

import { BigQueryProvider } from './BigQueryProvider'
import { Method, Project, Transfer } from './config'

export class BigQueryClient {
  constructor(private readonly bigquery: BigQueryProvider) {}

  async getLivenessData(projectsConfig: Project[]) {
    const transfersProjects = projectsConfig
      .filter((p) => p.transfers)
      .flatMap((p) => p.transfers) as Transfer[]
    const methodsProjects = projectsConfig
      .filter((p) => p.methods)
      .flatMap((p) => p.methods) as Method[]

    await this.makeTransfersQuery(transfersProjects)
    await this.makeMethodQuery(methodsProjects)
    // return LivenessQuery.parse(data)
  }

  async makeTransfersQuery(transfers: Transfer[]) {
    const from_addresses = transfers.map((t) => t.from_address.toLowerCase())
    const to_addresses = transfers.map((t) => t.to_address.toLowerCase())
    const query = getTransferQuery(
      from_addresses,
      to_addresses,
      'block_timestamp',
      'test',
    )
    const transfersData = await this.bigquery.query(query)
    return transfersData
  }

  async makeMethodQuery(methods: Method[]) {
    const addresses = methods.map((m) => m.address.toLowerCase())
    const methodSelectors = methods.map((m) => m.selector.toLowerCase())
    const query = getMethodQuery(
      addresses,
      methodSelectors,
      'block_timestamp',
      'test',
    )
    const methodsData = await this.bigquery.query(query)
    return methodsData
  }
}
