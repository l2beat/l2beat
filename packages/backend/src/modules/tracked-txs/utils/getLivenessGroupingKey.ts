import type {
  TrackedTxConfigEntry,
  TrackedTxFunctionCallConfig,
  TrackedTxFunctionCallGrouping,
  TrackedTxFunctionCallLivenessConfig,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { decodeFunctionCallInput } from './decodeFunctionCallInput'

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
  let value: unknown = decodeFunctionCallInput(config.signature, input)

  for (const index of grouping.path) {
    assert(Number.isInteger(index) && index >= 0, 'Invalid parameter path')
    assert(
      typeof value === 'object' && value !== null,
      'Parameter path does not exist',
    )
    value = Reflect.get(value, index)
  }

  assert(value !== undefined && value !== null, 'Parameter path does not exist')
  assert(!Array.isArray(value), 'Grouping parameter must be a scalar')

  const key = String(value)
  // Keep in sync with the groupingKey columns.
  assert(key.length <= 255, 'Liveness grouping key exceeds 255 characters')
  return key
}
