import { UnixTime } from '@l2beat/shared-pure'

import { BigQueryClient } from '../../peripherals/bigquery/BigQueryClient'
import { UpdateConfiguration } from '../../tools/uif/multi/types'
import {
  TrackedTxConfigEntry,
  TrackedTxFunctionCallConfig,
  TrackedTxSharpSubmissionConfig,
  TrackedTxTransferConfig,
} from './types/TrackedTxsConfig'
import {
  BigQueryFunctionCallResult,
  BigQueryTransferResult,
  TrackedTxFunctionCallResult,
  TrackedTxResult,
  TrackedTxTransferResult,
} from './types/model'
import { getFunctionCallQuery, getTransferQuery } from './utils/sql'
import { transformFunctionCallsQueryResult } from './utils/transformFunctionCallsQueryResult'
import { transformTransfersQueryResult } from './utils/transformTransfersQueryResult'

export class TrackedTxsClient {
  constructor(private readonly bigquery: BigQueryClient) {}

  async getData(
    configurations: UpdateConfiguration<TrackedTxConfigEntry>[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<TrackedTxResult[]> {
    const transfersConfig = configurations.filter(
      (
        c,
      ): c is UpdateConfiguration<
        TrackedTxConfigEntry & { params: TrackedTxTransferConfig }
      > => c.properties.params.formula === 'transfer',
    )
    const functionCallsConfig = configurations.filter(
      (
        c,
      ): c is UpdateConfiguration<
        TrackedTxConfigEntry & { params: TrackedTxFunctionCallConfig }
      > => c.properties.params.formula === 'functionCall',
    )
    const sharpSubmissionsConfig = configurations.filter(
      (
        c,
      ): c is UpdateConfiguration<
        TrackedTxConfigEntry & { params: TrackedTxSharpSubmissionConfig }
      > => c.properties.params.formula === 'sharpSubmission',
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
    transfersConfig: UpdateConfiguration<
      TrackedTxConfigEntry & { params: TrackedTxTransferConfig }
    >[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<TrackedTxTransferResult[]> {
    if (transfersConfig.length === 0) return Promise.resolve([])

    const query = getTransferQuery(
      transfersConfig.map((c) => c.properties.params),
      from,
      to,
    )

    const queryResult = await this.bigquery.query(query)
    const parsedResult = BigQueryTransferResult.array().parse(queryResult)
    return transformTransfersQueryResult(transfersConfig, parsedResult)
  }

  async getFunctionCalls(
    functionCallsConfig: UpdateConfiguration<
      TrackedTxConfigEntry & { params: TrackedTxFunctionCallConfig }
    >[],
    sharpSubmissionsConfig: UpdateConfiguration<
      TrackedTxConfigEntry & { params: TrackedTxSharpSubmissionConfig }
    >[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<TrackedTxFunctionCallResult[]> {
    if (functionCallsConfig.length === 0 && sharpSubmissionsConfig.length === 0)
      return Promise.resolve([])

    // function calls and sharp submissions will be batched into one query to save costs
    const query = getFunctionCallQuery(
      combineCalls(
        functionCallsConfig.map((c) => c.properties.params),
        sharpSubmissionsConfig.map((c) => c.properties.params),
      ),
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
  functionCallsConfig: TrackedTxFunctionCallConfig[],
  sharpSubmissionsConfig: TrackedTxSharpSubmissionConfig[],
) {
  // TODO: unique
  return [
    ...functionCallsConfig.map((c) => ({ ...c, getFullInput: false })),
    ...sharpSubmissionsConfig.map((c) => ({ ...c, getFullInput: true })),
  ]
}
