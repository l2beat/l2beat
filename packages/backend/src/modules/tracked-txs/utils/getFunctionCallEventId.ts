import type { TrackedTxLivenessEventIdentity } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { utils } from 'ethers'

export function getFunctionCallEventId(
  input: string,
  signature: `function ${string}`,
  identity: TrackedTxLivenessEventIdentity,
): string {
  const functionFragment = signature.replace('function ', '')
  const iface = new utils.Interface([signature])
  let value: unknown = iface.decodeFunctionData(functionFragment, input)

  for (const index of identity.path) {
    assert(Number.isInteger(index) && index >= 0, 'Invalid parameter path')
    assert(
      typeof value === 'object' && value !== null,
      'Parameter path does not exist',
    )
    value = (value as Record<number, unknown>)[index]
  }

  assert(value !== undefined && value !== null, 'Parameter path does not exist')
  assert(!Array.isArray(value), 'Event identity parameter must be a scalar')

  return String(value)
}
