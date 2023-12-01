import { UnixTime } from '@l2beat/shared-pure'

import { BigQueryClient } from '../../peripherals/bigquery/BigQueryClient'
import { LivenessRecord } from '../../peripherals/database/LivenessRepository'
import { LivenessFunctionCall, LivenessTransfer } from './types/LivenessConfig'
import {
  BigQueryFunctionCallsResult,
  BigQueryTransfersResult,
} from './types/model'
import {
  getFunctionCallQuery,
  getTransferQuery,
  transformFunctionCallsQueryResult,
  transformTransfersQueryResult,
} from './utils'

export class LivenessClient {
  constructor(private readonly bigquery: BigQueryClient) {}

  async getLivenessData(
    transfersConfig: LivenessTransfer[],
    functionCallsConfig: LivenessFunctionCall[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    const [transfers, functionCalls] = await Promise.all([
      this.getTransfers(transfersConfig, from, to),
      this.getFunctionCalls(functionCallsConfig, from, to),
    ])

    return [...transfers, ...functionCalls]
  }

  async getTransfers(
    transfersConfig: LivenessTransfer[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    if (transfersConfig.length === 0) return Promise.resolve([])

    const query = getTransferQuery(transfersConfig, from, to)

    const queryResult = await this.bigquery.query(query)
    const parsedResult = BigQueryTransfersResult.parse(queryResult)
    return transformTransfersQueryResult(transfersConfig, parsedResult)
  }

  async getFunctionCalls(
    functionCallsConfig: LivenessFunctionCall[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    if (functionCallsConfig.length === 0) return Promise.resolve([])

    const query = getFunctionCallQuery(functionCallsConfig, from, to)

    const queryResult = await this.bigquery.query(query)
    const parsedResult = BigQueryFunctionCallsResult.parse(queryResult)
    return transformFunctionCallsQueryResult(functionCallsConfig, parsedResult)
  }
}
