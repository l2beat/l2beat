import type {
  TrackedTxConfigEntry,
  TrackedTxFunctionCallConfig,
  TrackedTxSharedBridgeConfig,
  TrackedTxSharpSubmissionConfig,
  TrackedTxTransferConfig,
} from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { BigQueryClient } from '../../peripherals/bigquery/BigQueryClient'
import type { Configuration } from '../../tools/uif/multi/types'
import {
  BigQueryFunctionCallResult,
  BigQueryTransferResult,
  type TrackedTxFunctionCallResult,
  type TrackedTxResult,
  type TrackedTxTransferResult,
} from './types/model'
import { getFunctionCallQuery, getTransferQuery } from './utils/sql'
import { transformFunctionCallsQueryResult } from './utils/transformFunctionCallsQueryResult'
import { transformTransfersQueryResult } from './utils/transformTransfersQueryResult'

export class TrackedTxsClient {
  constructor(private readonly bigquery: BigQueryClient) {}

  async getData(
    configurations: Configuration<TrackedTxConfigEntry>[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<TrackedTxResult[]> {
    const transfersConfig = configurations.filter(
      (
        c,
      ): c is Configuration<
        TrackedTxConfigEntry & { params: TrackedTxTransferConfig }
      > => c.properties.params.formula === 'transfer',
    )
    const functionCallsConfig = configurations.filter(
      (
        c,
      ): c is Configuration<
        TrackedTxConfigEntry & { params: TrackedTxFunctionCallConfig }
      > => c.properties.params.formula === 'functionCall',
    )
    const sharpSubmissionsConfig = configurations.filter(
      (
        c,
      ): c is Configuration<
        TrackedTxConfigEntry & { params: TrackedTxSharpSubmissionConfig }
      > => c.properties.params.formula === 'sharpSubmission',
    )
    const sharedBridgesConfig = configurations.filter(
      (
        c,
      ): c is Configuration<
        TrackedTxConfigEntry & { params: TrackedTxSharedBridgeConfig }
      > => c.properties.params.formula === 'sharedBridge',
    )

    const [transfers, functionCalls] = await Promise.all([
      this.getTransfers(transfersConfig, from, to),
      this.getFunctionCalls(
        functionCallsConfig,
        sharpSubmissionsConfig,
        sharedBridgesConfig,
        from,
        to,
      ),
    ])

    return [...transfers, ...functionCalls]
  }

  async getTransfers(
    transfersConfig: Configuration<
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
    const parsedResult = v.array(BigQueryTransferResult).parse(queryResult)
    return transformTransfersQueryResult(transfersConfig, parsedResult)
  }

  async getFunctionCalls(
    functionCallsConfig: Configuration<
      TrackedTxConfigEntry & { params: TrackedTxFunctionCallConfig }
    >[],
    sharpSubmissionsConfig: Configuration<
      TrackedTxConfigEntry & { params: TrackedTxSharpSubmissionConfig }
    >[],
    sharedBridgesConfig: Configuration<
      TrackedTxConfigEntry & { params: TrackedTxSharedBridgeConfig }
    >[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<TrackedTxFunctionCallResult[]> {
    if (
      functionCallsConfig.length === 0 &&
      sharpSubmissionsConfig.length === 0 &&
      sharedBridgesConfig.length === 0
    )
      return Promise.resolve([])

    // function calls and sharp submissions will be batched into one query to save costs
    const query = getFunctionCallQuery(
      combineCalls(
        functionCallsConfig.map((c) => c.properties.params),
        sharpSubmissionsConfig.map((c) => c.properties.params),
        sharedBridgesConfig.map((c) => c.properties.params),
      ),
      from,
      to,
    )

    const queryResult = await this.bigquery.query(query)
    // function calls and sharp submissions need the same fields for the later transform logic
    // this is why we parse all the results with the same parser
    const parsedResult = v.array(BigQueryFunctionCallResult).parse(queryResult)

    // this will find matching configs based on different criteria for function calls and sharp submissions
    // hence this is the place where "unbatching" happens
    return transformFunctionCallsQueryResult(
      functionCallsConfig,
      sharpSubmissionsConfig,
      sharedBridgesConfig,
      parsedResult,
    )
  }
}

function combineCalls(
  functionCallsConfig: TrackedTxFunctionCallConfig[],
  sharpSubmissionsConfig: TrackedTxSharpSubmissionConfig[],
  sharedBridgesConfig: TrackedTxSharedBridgeConfig[],
) {
  // TODO: unique
  return [
    ...functionCallsConfig.map((c) => ({ ...c, getFullInput: false })),
    ...sharpSubmissionsConfig.map((c) => ({ ...c, getFullInput: true })),
    ...sharedBridgesConfig.map((c) => ({ ...c, getFullInput: true })),
  ]
}
