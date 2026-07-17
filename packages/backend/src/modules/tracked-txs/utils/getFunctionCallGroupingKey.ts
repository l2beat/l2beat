import type { TrackedTxFunctionCallConfig } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { utils } from 'ethers'

export function getFunctionCallGroupingKey(
  input: string,
  config: TrackedTxFunctionCallConfig,
): string | undefined {
  const deduplication = config.deduplicateBy
  if (!deduplication) return

  const functionFragment = config.signature.replace('function ', '')
  const iface = new utils.Interface([config.signature])
  let value: unknown = iface.decodeFunctionData(functionFragment, input)

  for (const index of deduplication.path) {
    assert(Number.isInteger(index) && index >= 0, 'Invalid parameter path')
    assert(
      typeof value === 'object' && value !== null,
      'Parameter path does not exist',
    )
    value = (value as Record<number, unknown>)[index]
  }

  assert(value !== undefined && value !== null, 'Parameter path does not exist')
  assert(!Array.isArray(value), 'Grouping parameter must be a scalar')

  return String(value)
}
