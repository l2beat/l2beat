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
  return queryResults.flatMap((result) => {
    // Find configs that match this result's from/to addresses
    const matchingConfigs = configs.filter(
      (config) =>
        config.properties.params.from === result.from_address &&
        config.properties.params.to === result.to_address,
    )

    assert(
      matchingConfigs.length > 0,
      'There should be at least one matching config',
    )

    // Map each matching config to a result object
    return matchingConfigs.map(
      (config) => ({
        formula: 'transfer',
        projectId: config.properties.projectId,
        id: config.id,
        type: config.properties.type,
        subtype: config.properties.subtype,
        hash: result.hash,
        blockNumber: result.block_number,
        blockTimestamp: result.block_timestamp,
        fromAddress: result.from_address,
        toAddress: result.to_address,
        receiptGasUsed: result.receipt_gas_used,
        gasPrice: result.gas_price,
        dataLength: result.data_length,
        calldataGasUsed: result.calldata_gas_used,
        receiptBlobGasUsed: result.receipt_blob_gas_used,
        receiptBlobGasPrice: result.receipt_blob_gas_price,
      })
    )
  })
}
