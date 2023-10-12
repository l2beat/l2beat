import { BigQueryFunctionCallsResult } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'

import { LivenessRecord } from '../../../peripherals/database/LivenessRepository'
import { LivenessConfig } from '../types/LivenessConfig'

export function formatFunctionCallsQueryResult(
  configs: LivenessConfig[],
  functionCallsConfig: LivenessConfig['functionCalls'],
  queryResults: BigQueryFunctionCallsResult,
): LivenessRecord[] {
  const results: LivenessRecord[] = queryResults.map((r) => {
    const project = configs.find((c) =>
      c.functionCalls?.find(
        (cc) => r.input.startsWith(cc.selector) && cc.address === r.to_address,
      ),
    )

    assert(project, 'Programmer error: project should not be undefined there')

    const call = functionCallsConfig?.find(
      (t) => r.input.startsWith(t.selector) && t.address === r.to_address,
    )

    assert(
      call,
      'Programmer error: function call should not be undefined there',
    )

    return {
      projectId: project.projectId,
      timestamp: r.block_timestamp,
      blockNumber: r.block_number,
      txHash: r.transaction_hash,
      type: call.type,
    }
  })
  return results
}
