import { assert } from '@l2beat/shared-pure'

import type {
  TrackedTxConfigEntry,
  TrackedTxTransferConfig,
} from '@l2beat/shared'
import type { Configuration } from '../../../tools/uif/multi/types'
import type {
  BigQueryTransferResult,
  TrackedTxTransferResult,
} from '../types/model'

export function transformTransfersQueryResult(
  configs: Configuration<
    TrackedTxConfigEntry & { params: TrackedTxTransferConfig }
  >[],
  queryResults: BigQueryTransferResult[],
): TrackedTxTransferResult[] {
  return queryResults.flatMap((r) => {
    const matchingConfigs = configs.filter(
      (t) =>
        t.properties.params.from === r.from_address &&
        t.properties.params.to === r.to_address,
    )

    assert(
      matchingConfigs.length > 0,
      'There should be at least one matching config',
    )

    return matchingConfigs.map(
      (matchingConfig) =>
        ({
          formula: 'transfer',
          projectId: matchingConfig.properties.projectId,
          id: matchingConfig.id,
          type: matchingConfig.properties.type,
          subtype: matchingConfig.properties.subtype,
          hash: r.hash,
          blockNumber: r.block_number,
          blockTimestamp: r.block_timestamp,
          fromAddress: r.from_address,
          toAddress: r.to_address,
          receiptGasUsed: r.receipt_gas_used,
          gasPrice: r.gas_price,
          dataLength: r.data_length,
          calldataGasUsed: r.calldata_gas_used,
          receiptBlobGasUsed: r.receipt_blob_gas_used,
          receiptBlobGasPrice: r.receipt_blob_gas_price,
        }) as const,
    )
  })
}
