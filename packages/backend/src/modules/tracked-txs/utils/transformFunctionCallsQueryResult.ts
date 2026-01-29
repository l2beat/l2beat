import type {
  TrackedTxConfigEntry,
  TrackedTxFunctionCallConfig,
  TrackedTxSharedBridgeConfig,
  TrackedTxSharpSubmissionConfig,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { Configuration } from '../../../tools/uif/multi/types'
import type {
  DuneFunctionCallResult,
  TrackedTxFunctionCallResult,
} from '../types/model'
import { calculateCalldataGasUsed } from './calculateCalldataGasUsed'
import { isFistParameterMatching } from './isFirstParameterMatching'
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
  queryResults: DuneFunctionCallResult[],
): TrackedTxFunctionCallResult[] {
  return queryResults.flatMap((r) => {
    const selector = r.input.slice(0, 10)

    const matchingCalls = functionCalls.filter(
      (c) =>
        c.properties.params.selector === selector &&
        c.properties.params.address === r.to,
    )

    const matchingSubmissions = sharpSubmissions.filter(
      (c) =>
        c.properties.params.selector === selector &&
        c.properties.params.address === r.to,
    )

    const matchingSharedBridgeCalls = sharedBridgesConfig.filter(
      (c) =>
        c.properties.params.selector === selector &&
        c.properties.params.address === r.to,
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
      isFistParameterMatching(r.input, c.properties.params),
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
          blockTimestamp: r.block_time,
          toAddress: r.to,
          input: r.input,
          gasUsed: r.gas_used,
          gasPrice: r.gas_price,
          dataLength: r.data_length,
          calldataGasUsed: calculateCalldataGasUsed(
            r.block_number,
            r.data_length,
            r.non_zero_bytes,
            r.gas_used,
          ),
          blobVersionedHashes: r.blob_versioned_hashes,
        }) as const,
    )

    return results
  })
}
