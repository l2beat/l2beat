import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { BigQueryProvider } from './BigQueryProvider'
import { BigQueryMethodsResult, BigQueryTransfersResult } from './model'
import { getFunctionCallQuery } from './sql/getFunctionCallQuery'
import { getTransferQuery } from './sql/getTransferQuery'

export interface FunctionCallQueryParams {
  address: EthereumAddress
  selector: string
}

export interface TransferQueryParams {
  from: EthereumAddress
  to: EthereumAddress
}

export class BigQueryClient {
  constructor(private readonly bigquery: BigQueryProvider) {}

  async getTransfers(
    transfers: TransferQueryParams[],
    from: UnixTime,
    to: UnixTime,
  ) {
    const senders = transfers.map((t) => t.from)
    const receivers = transfers.map((t) => t.to)

    const query = getTransferQuery(senders, receivers, from, to)

    const result = await this.bigquery.query(query)

    return BigQueryTransfersResult.parse(result)
  }

  async getFunctionCalls(
    methods: FunctionCallQueryParams[],
    from: UnixTime,
    to: UnixTime,
  ) {
    const addresses = methods.map((m) => m.address)
    const methodSelectors = methods.map((m) => m.selector.toLowerCase())

    const query = getFunctionCallQuery(addresses, methodSelectors, from, to)

    const result = await this.bigquery.query(query)

    return BigQueryMethodsResult.parse(result)
  }
}
