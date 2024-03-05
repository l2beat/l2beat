import { assert } from '@l2beat/shared-pure'

import {
  BigQueryTransferResult,
  ParsedBigQueryTransferResult,
} from '../types/model'
import { TrackedTxTransfer } from '../types/TrackedTxsConfig'

export function transformTransfersQueryResult(
  configs: TrackedTxTransfer[],
  queryResults: BigQueryTransferResult[],
): ParsedBigQueryTransferResult[] {
  return queryResults.map((r) => {
    const matchingConfigs = configs.filter(
      (t) => t.from === r.from_address && t.to === r.to_address,
    )

    assert(
      matchingConfigs.length > 0,
      'There should be at least one matching config',
    )

    return {
      type: 'transfer',
      hash: r.hash,
      blockNumber: r.block_number,
      blockTimestamp: r.block_timestamp,
      fromAddress: r.from_address,
      toAddress: r.to_address,
      gasPrice: r.gas_price,
      gasUsed: r.receipt_gas_used,
    }
  })
}
