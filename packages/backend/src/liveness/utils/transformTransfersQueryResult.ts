import { assert } from '@l2beat/shared-pure'

import { LivenessRecord } from '../repositories/LivenessRepository'
import { LivenessTransfer } from '../types/LivenessConfig'
import { BigQueryTransfersResult } from '../types/model'

export function transformTransfersQueryResult(
  configs: LivenessTransfer[],
  queryResults: BigQueryTransfersResult,
): LivenessRecord[] {
  return queryResults.map((r) => {
    const matchingConfigs = configs.filter(
      (t) => t.from === r.from_address && t.to === r.to_address,
    )

    assert(
      matchingConfigs.length > 0,
      'There should be at least one matching config',
    )

    return {
      timestamp: r.block_timestamp,
      blockNumber: r.block_number,
      txHash: r.transaction_hash,
      livenessId: matchingConfigs[0].id,
    }
  })
}
