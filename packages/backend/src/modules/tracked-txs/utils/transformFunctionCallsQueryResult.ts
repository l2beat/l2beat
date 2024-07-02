import { assert } from '@l2beat/shared-pure'

import { UpdateConfiguration } from '../../../tools/uif/multi/types'

import {
  TrackedTxConfigEntry,
  TrackedTxFunctionCallConfig,
  TrackedTxSharpSubmissionConfig,
} from '@l2beat/shared'
import {
  BigQueryFunctionCallResult,
  TrackedTxFunctionCallResult,
} from '../types/model'
import { isProgramHashProven } from './isProgramHashProven'

export function transformFunctionCallsQueryResult(
  functionCalls: UpdateConfiguration<
    TrackedTxConfigEntry & { params: TrackedTxFunctionCallConfig }
  >[],
  sharpSubmissions: UpdateConfiguration<
    TrackedTxConfigEntry & { params: TrackedTxSharpSubmissionConfig }
  >[],
  queryResults: BigQueryFunctionCallResult[],
): TrackedTxFunctionCallResult[] {
  return queryResults.flatMap((r) => {
    const selector = r.input.slice(0, 10)

    const matchingCalls = functionCalls.filter(
      (c) =>
        c.properties.params.selector === selector &&
        c.properties.params.address === r.to_address,
    )
    const matchingSubmissions = sharpSubmissions.filter(
      (c) =>
        c.properties.params.selector === selector &&
        c.properties.params.address === r.to_address,
    )

    assert(
      matchingCalls.length > 0 || matchingSubmissions.length > 0,
      'There should be at least one matching config',
    )

    const filteredSubmissions = matchingSubmissions.filter((c) =>
      isProgramHashProven(r, c.properties.params.programHashes),
    )

    const results = [...matchingCalls, ...filteredSubmissions].map(
      (config) =>
        ({
          id: config.id,
          formula: 'functionCall',
          projectId: config.properties.projectId,
          hash: r.hash,
          type: config.properties.type,
          subtype: config.properties.subtype,
          blockNumber: r.block_number,
          blockTimestamp: r.block_timestamp,
          toAddress: r.to_address,
          input: r.input,
          receiptGasUsed: r.receipt_gas_used,
          gasPrice: r.gas_price,
          dataLength: r.data_length,
          calldataGasUsed: r.calldata_gas_used,
          receiptBlobGasUsed: r.receipt_blob_gas_used,
          receiptBlobGasPrice: r.receipt_blob_gas_price,
        }) as const,
    )

    return results
  })
}
