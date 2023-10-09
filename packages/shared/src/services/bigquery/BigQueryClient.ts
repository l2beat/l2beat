import { getMethodQuery, getTransferQuery } from '@l2beat/shared-pure'

import { BigQueryProvider } from './BigQueryProvider'
import { Method, Transfer } from './config'
import { LivenessMethodsQuery, LivenessTransfersQuery } from './model'

export class BigQueryClient {
  constructor(private readonly bigquery: BigQueryProvider) {}

  async makeTransfersQuery(
    transfers: Transfer[],
    from_timestamp: string,
    to_timestamp: string,
  ) {
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
    methods: Method[],
    from_timestamp: string,
    to_timestamp: string,
  ) {
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
