import type {
  TrackedTxConfigEntry,
  TrackedTxFunctionCallConfig,
  TrackedTxSharedBridgeConfig,
  TrackedTxSharpSubmissionConfig,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { Configuration } from '../../../tools/uif/multi/types'
import type {
  BigQueryFunctionCallResult,
  TrackedTxFunctionCallResult,
} from '../types/model'
import { calculateCalldataGasUsed } from './calculateCalldataGasUsed'
import { isChainIdMatching } from './isChainIdMatching'
import { isProgramHashProven } from './isProgramHashProven'

export function transformFunctionCallsQueryResult(
  functionCalls: Configuration<
    TrackedTxConfigEntry & { params: TrackedTxFunctionCallConfig }
  >[],
  sharpSubmissions: Configuration<
    TrackedTxConfigEntry & { params: TrackedTxSharpSubmissionConfig }
  >[],
  sharedBridgesConfig: Configuration<
    TrackedTxConfigEntry & { params: TrackedTxSharedBridgeConfig }
  >[],
  queryResults: BigQueryFunctionCallResult[],
): TrackedTxFunctionCallResult[] {
  return queryResults.flatMap((r) => {
    const selector = r.input.slice(0, 10)

    const matchingCalls = functionCalls.filter(
      (c) =>
        c.properties.params.selector === selector &&
        c.properties.params.address === r.to_address,
    )

    const matchingSubmissions = sharpSubmissions.filter(
      (c) =>
        c.properties.params.selector === selector &&
        c.properties.params.address === r.to_address,
    )

    const matchingSharedBridgeCalls = sharedBridgesConfig.filter(
      (c) =>
        c.properties.params.selector === selector &&
        c.properties.params.address === r.to_address,
    )

    assert(
      matchingCalls.length > 0 ||
        matchingSubmissions.length > 0 ||
        matchingSharedBridgeCalls.length > 0,
      'There should be at least one matching config',
    )

    const filteredSubmissions = matchingSubmissions.filter((c) =>
      isProgramHashProven(r, c.properties.params.programHashes),
    )

    const filteredSharedBridgeCalls = matchingSharedBridgeCalls.filter((c) =>
      isChainIdMatching(r.input, c.properties.params),
    )

    const results = [
      ...matchingCalls,
      ...filteredSubmissions,
      ...filteredSharedBridgeCalls,
    ].map(
      (config) =>
        ({
          id: config.id,
          formula: 'functionCall',
          projectId: config.properties.projectId,
          hash: r.hash,
          type: config.properties.type,
          subtype: config.properties.subtype,
          blockNumber: r.block_number,
          blockTimestamp: r.block_timestamp,
          toAddress: r.to_address,
          input: r.input,
          receiptGasUsed: r.receipt_gas_used,
          gasPrice: r.gas_price,
          dataLength: r.data_length,
          calldataGasUsed: calculateCalldataGasUsed(
            r.block_number,
            r.data_length,
            r.non_zero_bytes,
            r.receipt_gas_used,
          ),
          receiptBlobGasUsed: r.receipt_blob_gas_used,
          receiptBlobGasPrice: r.receipt_blob_gas_price,
        }) as const,
    )

    return results
  })
}
