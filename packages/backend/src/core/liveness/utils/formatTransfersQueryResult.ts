import { BigQueryTransfersResult } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'

import { LivenessRecord } from '../../../peripherals/database/LivenessRepository'
import { LivenessConfig } from '../types/LivenessConfig'

export function formatTransfersQueryResult(
  configs: LivenessConfig[],
  transfersConfig: LivenessConfig['transfers'],
  queryResults: BigQueryTransfersResult,
): LivenessRecord[] {
  const results: LivenessRecord[] = queryResults.map((r) => {
    const project = configs.find((c) =>
      c.transfers?.find(
        (cc) => cc.from === r.from_address && cc.to === r.to_address,
      ),
    )

    assert(project, 'Programmer error: project should not be undefined there')

    const transfer = transfersConfig?.find(
      (t) => t.from === r.from_address && t.to === r.to_address,
    )

    assert(transfer, 'Programmer error: transfer should not be undefined there')

    return {
      projectId: project.projectId,
      timestamp: r.block_timestamp,
      blockNumber: r.block_number,
      txHash: r.transaction_hash,
      type: transfer.type,
    }
  })
  return results
}
