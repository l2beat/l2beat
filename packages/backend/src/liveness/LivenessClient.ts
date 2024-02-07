import { UnixTime } from '@l2beat/shared-pure'

import { BigQueryClient } from '../peripherals/bigquery/BigQueryClient'
import { LivenessRecord } from './repositories/LivenessRepository'
import {
  LivenessConfigEntry,
  LivenessFunctionCall,
  LivenessSharpSubmission,
  LivenessTransfer,
} from './types/LivenessConfig'
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
    configurations: LivenessConfigEntry[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    const transfersConfig = configurations.filter(
      (c): c is LivenessTransfer => c.formula === 'transfer',
    )
    const functionCallsConfig = configurations.filter(
      (c): c is LivenessFunctionCall => c.formula === 'functionCall',
    )
    const sharpSubmissionsConfig = configurations.filter(
      (c): c is LivenessSharpSubmission => c.formula === 'sharpSubmission',
    )

    const [transfers, functionCalls] = await Promise.all([
      this.getTransfers(transfersConfig, from, to),
      this.getFunctionCalls(
        functionCallsConfig,
        sharpSubmissionsConfig,
        from,
        to,
      ),
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
    sharpSubmissionsConfig: LivenessSharpSubmission[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    if (functionCallsConfig.length === 0 && sharpSubmissionsConfig.length === 0)
      return Promise.resolve([])

    // function calls and sharp submissions will be batched into one query to save costs
    const query = getFunctionCallQuery(
      combineCalls(functionCallsConfig, sharpSubmissionsConfig),
      from,
      to,
    )

    const queryResult = await this.bigquery.query(query)
    // function calls and sharp submissions need the same fields for the later transform logic
    // this is why we parse all the results with the same parser
    const parsedResult = BigQueryFunctionCallsResult.parse(queryResult)

    // this will find matching configs based on different criteria for function calls and sharp submissions
    // hence this is the place where "unbatching" happens
    return transformFunctionCallsQueryResult(
      functionCallsConfig,
      sharpSubmissionsConfig,
      parsedResult,
    )
  }
}

function combineCalls(
  functionCallsConfig: LivenessFunctionCall[],
  sharpSubmissionsConfig: LivenessSharpSubmission[],
) {
  // TODO: unique
  return [
    ...functionCallsConfig.map((c) => ({ ...c, getFullInput: false })),
    ...sharpSubmissionsConfig.map((c) => ({ ...c, getFullInput: true })),
  ]
}
