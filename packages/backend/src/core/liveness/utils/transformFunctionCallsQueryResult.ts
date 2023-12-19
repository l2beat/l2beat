import { assert } from '@l2beat/shared-pure'

import { LivenessRecord } from '../../../peripherals/database/LivenessRepository'
import {
  LivenessFunctionCall,
  LivenessSharpSubmission,
} from '../types/LivenessConfig'
import { BigQueryFunctionCallsResult } from '../types/model'
import { isProgramHashProven } from './isProgramHashProven'

export function transformFunctionCallsQueryResult(
  functionCalls: LivenessFunctionCall[],
  sharpSubmissions: LivenessSharpSubmission[],
  queryResults: BigQueryFunctionCallsResult,
): LivenessRecord[] {
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

    const results = [...matchingCalls, ...filteredSubmissions].map((c) => ({
      timestamp: r.block_timestamp,
      blockNumber: r.block_number,
      txHash: r.transaction_hash,
      livenessId: c.id,
    }))

    return results
  })
}
