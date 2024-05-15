import { assert } from '@l2beat/shared-pure'

import {
  TrackedTxFunctionCallConfig,
  TrackedTxSharpSubmissionConfig,
} from '../types/TrackedTxsConfig'
import {
  BigQueryFunctionCallResult,
  TrackedTxFunctionCallResult,
} from '../types/model'
import { isProgramHashProven } from './isProgramHashProven'

export function transformFunctionCallsQueryResult(
  functionCalls: TrackedTxFunctionCallConfig[],
  sharpSubmissions: TrackedTxSharpSubmissionConfig[],
  queryResults: BigQueryFunctionCallResult[],
): TrackedTxFunctionCallResult[] {
  return queryResults.flatMap((r) => {
    const selector = r.input.slice(0, 10)

    const matchingCalls = functionCalls.filter(
      (c) => c.selector === selector && c.address === r.to_address,
    )
    const matchingSubmissions = sharpSubmissions.filter(
      (c) => c.selector === selector && c.address === r.to_address,
    )

    assert(
      matchingCalls.length > 0 || matchingSubmissions.length > 0,
      'There should be at least one matching config',
    )

    const filteredSubmissions = matchingSubmissions.filter((c) =>
      isProgramHashProven(r, c.programHashes),
    )

    const results = [...matchingCalls, ...filteredSubmissions].flatMap(
      (config) =>
        config.uses.map(
          (use) =>
            ({
              type: 'functionCall',
              use,
              projectId: config.projectId,
              hash: r.hash,
              blockNumber: r.block_number,
              blockTimestamp: r.block_timestamp,
              toAddress: r.to_address,
              input: r.input,
              transactionType: r.transaction_type,
              receiptGasUsed: r.receipt_gas_used,
              gasPrice: r.gas_price,
              dataLength: r.data_length,
              calldataGasUsed: r.calldata_gas_used,
            }) as const,
        ),
    )

    return results
  })
}
