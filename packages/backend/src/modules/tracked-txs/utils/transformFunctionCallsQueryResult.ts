import type { Logger } from '@l2beat/backend-tools'
import { assert } from '@l2beat/shared-pure'
import type {
  DuneFunctionCallResult,
  TrackedTxFunctionCallResult,
} from '../types/model'
import { calculateCalldataGasUsed } from './calculateCalldataGasUsed'
import {
  getLivenessGroupingKeyFromProjectedValue,
  hasLivenessGrouping,
} from './getLivenessGroupingKey'
import { isFistParameterMatching } from './isFirstParameterMatching'
import { isProgramHashProven } from './isProgramHashProven'
import type { PreparedFunctionCalls } from './prepareFunctionCalls'

export function transformFunctionCallsQueryResult(
  plan: PreparedFunctionCalls,
  queryResults: DuneFunctionCallResult[],
  logger: Logger,
): TrackedTxFunctionCallResult[] {
  const {
    functionCalls,
    sharpSubmissions,
    sharedBridges,
    groupingProjections,
  } = plan

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

    const matchingSharedBridgeCalls = sharedBridges.filter(
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

    const results: TrackedTxFunctionCallResult[] = [
      ...matchingCalls,
      ...filteredSubmissions,
      ...filteredSharedBridgeCalls,
    ].flatMap((config): TrackedTxFunctionCallResult[] => {
      const common = {
        id: config.id,
        formula: 'functionCall' as const,
        projectId: config.properties.projectId,
        subtype: config.properties.subtype,
        hash: r.hash,
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
      }

      if (hasLivenessGrouping(config.properties)) {
        try {
          const projection = groupingProjections.get(config.id)
          assert(projection !== undefined, 'Grouping projection is missing')
          assert(r.grouping_value !== null, 'Grouping value is missing')

          return [
            {
              ...common,
              type: 'liveness',
              groupingKey: getLivenessGroupingKeyFromProjectedValue(
                r.grouping_value,
                projection.abiType,
              ),
            },
          ]
        } catch (error) {
          logger.error('Failed to derive liveness grouping key', {
            error,
            configurationId: config.id,
            projectId: config.properties.projectId,
            transactionHash: r.hash,
            blockNumber: r.block_number,
          })
          throw error
        }
      }

      if (config.properties.type === 'liveness') {
        return [{ ...common, type: 'liveness' }]
      }

      return [{ ...common, type: 'l2costs' }]
    })

    return results
  })
}
