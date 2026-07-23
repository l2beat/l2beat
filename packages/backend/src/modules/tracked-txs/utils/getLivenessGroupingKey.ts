import type {
  TrackedTxConfigEntry,
  TrackedTxFunctionCallConfig,
  TrackedTxFunctionCallGrouping,
  TrackedTxFunctionCallLivenessConfig,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { utils } from 'ethers'

const interfaces = new Map<`function ${string}`, utils.Interface>()

export type GroupedLivenessConfig = TrackedTxFunctionCallLivenessConfig & {
  groupBy: TrackedTxFunctionCallGrouping
}

export function hasLivenessGrouping(
  config: TrackedTxConfigEntry,
): config is GroupedLivenessConfig {
  return (
    config.type === 'liveness' &&
    config.params.formula === 'functionCall' &&
    'groupBy' in config &&
    config.groupBy !== undefined
  )
}

export function getLivenessGroupingKey(
  input: string,
  config: TrackedTxFunctionCallConfig,
  grouping: TrackedTxFunctionCallGrouping,
): string {
  const functionFragment = config.signature.replace('function ', '')
  const iface = getInterface(config.signature)
  let value: unknown = iface.decodeFunctionData(functionFragment, input)

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
  assert(key.length <= 255, 'Liveness grouping key exceeds 255 characters')
  return key
}

function getInterface(signature: `function ${string}`): utils.Interface {
  const cached = interfaces.get(signature)
  if (cached !== undefined) return cached

  const iface = new utils.Interface([signature])
  interfaces.set(signature, iface)
  return iface
}
