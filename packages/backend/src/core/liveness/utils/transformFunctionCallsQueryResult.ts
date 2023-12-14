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
    const functionCallsConfig = functionCalls.filter(
      (t) => r.input.startsWith(t.selector) && t.address === r.to_address,
    )

    if (functionCallsConfig.length > 0) {
      assert(
        functionCallsConfig.length === 1,
        'There should be exactly one matching config for functions',
      )
      return {
        timestamp: r.block_timestamp,
        blockNumber: r.block_number,
        txHash: r.transaction_hash,
        livenessId: functionCallsConfig[0].id,
      }
    }

    // There can be more than one matching config for the projects using the same contract.
    const sharpSubmissionsConfig = sharpSubmissions.filter(
      (t) => r.input.startsWith(t.selector) && t.address === r.to_address,
    )

    const results: LivenessRecord[] = []

    for (const config of sharpSubmissionsConfig) {
      if (isProgramHashProven(r, config.programHashes)) {
        results.push({
          timestamp: r.block_timestamp,
          blockNumber: r.block_number,
          txHash: r.transaction_hash,
          livenessId: config.id,
        })
      }
    }

    assert(results.length > 0, 'There should be at least one matching config')

    return results
  })
}
