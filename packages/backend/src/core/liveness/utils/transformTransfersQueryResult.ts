import { assert } from '@l2beat/shared-pure'

import { LivenessRecord } from '../../../peripherals/database/LivenessRepository'
import { LivenessTransfer } from '../types/LivenessConfig'
import { BigQueryTransfersResult } from '../types/model'

export function transformTransfersQueryResult(
  configs: LivenessTransfer[],
  queryResults: BigQueryTransfersResult,
): LivenessRecord[] {
  const results: LivenessRecord[] = queryResults.map((r) => {
    const config = configs.find(
      (t) => t.from === r.from_address && t.to === r.to_address,
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
