import type {
  TrackedTxConfigEntry,
  TrackedTxFunctionCallConfig,
  TrackedTxFunctionCallGrouping,
  TrackedTxFunctionCallLivenessConfig,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { getFunctionCallParameter } from './functionCallParameter'

export type GroupedLivenessConfig = TrackedTxFunctionCallLivenessConfig & {
  groupBy: TrackedTxFunctionCallGrouping
}

export function hasLivenessGrouping(
  config: TrackedTxConfigEntry,
): config is GroupedLivenessConfig {
  return (
    config.type === 'liveness' &&
    config.params.formula === 'functionCall' &&
    config.groupBy !== undefined
  )
}

export function getLivenessGroupingKey(
  input: string,
  config: TrackedTxFunctionCallConfig,
  grouping: TrackedTxFunctionCallGrouping,
): string {
  const key = getFunctionCallParameter(config.signature, input, grouping.path)
  // Keep in sync with the groupingKey columns.
  assert(key.length <= 255, 'Liveness grouping key exceeds 255 characters')
  return key
}
