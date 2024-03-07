import { UnixTime } from '@l2beat/shared-pure'

import { BigQueryClient } from '../../peripherals/bigquery/BigQueryClient'
import {
  BigQueryFunctionCallResult,
  BigQueryTransferResult,
  ParsedBigQueryFunctionCallResult,
  ParsedBigQueryResult,
  ParsedBigQueryTransferResult,
} from './types/model'
import {
  TrackedTxFunctionCall,
  TrackedTxsConfigEntry,
  TrackedTxSharpSubmission,
  TrackedTxTransfer,
} from './types/TrackedTxsConfig'
import { getFunctionCallQuery, getTransferQuery } from './utils/sql'
import { transformFunctionCallsQueryResult } from './utils/transformFunctionCallsQueryResult'
import { transformTransfersQueryResult } from './utils/transformTransfersQueryResult'

export class TrackedTxsClient {
  constructor(private readonly bigquery: BigQueryClient) {}

  async getData(
    configurations: TrackedTxsConfigEntry[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<ParsedBigQueryResult[]> {
    const transfersConfig = configurations.filter(
      (c): c is TrackedTxTransfer => c.formula === 'transfer',
    )
    const functionCallsConfig = configurations.filter(
      (c): c is TrackedTxFunctionCall => c.formula === 'functionCall',
    )
    const sharpSubmissionsConfig = configurations.filter(
      (c): c is TrackedTxSharpSubmission => c.formula === 'sharpSubmission',
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
    transfersConfig: TrackedTxTransfer[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<ParsedBigQueryTransferResult[]> {
    if (transfersConfig.length === 0) return Promise.resolve([])

    const query = getTransferQuery(transfersConfig, from, to)

    const queryResult = await this.bigquery.query(query)
    const parsedResult = BigQueryTransferResult.array().parse(queryResult)
    return transformTransfersQueryResult(transfersConfig, parsedResult)
  }

  async getFunctionCalls(
    functionCallsConfig: TrackedTxFunctionCall[],
    sharpSubmissionsConfig: TrackedTxSharpSubmission[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<ParsedBigQueryFunctionCallResult[]> {
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
    const parsedResult = BigQueryFunctionCallResult.array().parse(queryResult)

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
  functionCallsConfig: TrackedTxFunctionCall[],
  sharpSubmissionsConfig: TrackedTxSharpSubmission[],
) {
  // TODO: unique
  return [
    ...functionCallsConfig.map((c) => ({ ...c, getFullInput: false })),
    ...sharpSubmissionsConfig.map((c) => ({ ...c, getFullInput: true })),
  ]
}
