import { assert } from '@l2beat/shared-pure'

import { LivenessRecord } from '../../../peripherals/database/LivenessRepository'
import { LivenessFunctionCall } from '../types/LivenessConfig'
import { BigQueryFunctionCallsResult } from '../types/model'

export function transformFunctionCallsQueryResult(
  configs: LivenessFunctionCall[],
  queryResults: BigQueryFunctionCallsResult,
): LivenessRecord[] {
  const results: LivenessRecord[] = queryResults.map((r) => {
    const config = configs.find(
      (t) => r.input.startsWith(t.selector) && t.address === r.to_address,
    )

    assert(config, 'Programmer error: config should not be undefined there')

    return {
      timestamp: r.block_timestamp,
      blockNumber: r.block_number,
      txHash: r.transaction_hash,
      livenessId: config.id,
    }
  })
  return results
}
