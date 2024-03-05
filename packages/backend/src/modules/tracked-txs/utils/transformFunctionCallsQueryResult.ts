import { assert } from '@l2beat/shared-pure'

import {
  BigQueryFunctionCallResult,
  ParsedBigQueryFunctionCallResult,
} from '../types/model'
import {
  TrackedTxFunctionCall,
  TrackedTxSharpSubmission,
} from '../types/TrackedTxsConfig'
import { isProgramHashProven } from './isProgramHashProven'

export function transformFunctionCallsQueryResult(
  functionCalls: TrackedTxFunctionCall[],
  sharpSubmissions: TrackedTxSharpSubmission[],
  queryResults: BigQueryFunctionCallResult[],
): ParsedBigQueryFunctionCallResult[] {
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

    const results = [...matchingCalls, ...filteredSubmissions].map(
      () =>
        ({
          type: 'functionCall',
          hash: r.hash,
          blockNumber: r.block_number,
          blockTimestamp: r.block_timestamp,
          toAddress: r.to_address,
          gasPrice: r.gas_price,
          gasUsed: r.receipt_gas_used,
          input: r.input,
        } as const),
    )

    return results
  })
}
