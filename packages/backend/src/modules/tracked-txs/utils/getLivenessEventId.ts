import type {
  TrackedTxFunctionCallParameterLivenessConfig,
  TrackedTxLivenessConfig,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { utils } from 'ethers'

interface LivenessTransaction {
  hash: string
  input?: string
}

const interfaces = new Map<`function ${string}`, utils.Interface>()

export function getLivenessEventId(
  config: TrackedTxLivenessConfig,
  transaction: LivenessTransaction,
): string {
  if (!usesFunctionCallParameter(config)) return transaction.hash

  assert(
    transaction.input !== undefined,
    'Function call input is required to derive its liveness event ID',
  )
  return getFunctionCallParameter(
    transaction.input,
    config.params.signature,
    config.eventIdentity.path,
  )
}

function usesFunctionCallParameter(
  config: TrackedTxLivenessConfig,
): config is TrackedTxFunctionCallParameterLivenessConfig {
  return config.eventIdentity.type === 'functionCallParameter'
}

function getFunctionCallParameter(
  input: string,
  signature: `function ${string}`,
  path: readonly [number, ...number[]],
): string {
  const functionFragment = signature.replace('function ', '')
  const iface = getInterface(signature)
  let value: unknown = iface.decodeFunctionData(functionFragment, input)

  for (const index of path) {
    assert(Number.isInteger(index) && index >= 0, 'Invalid parameter path')
    assert(
      typeof value === 'object' && value !== null,
      'Parameter path does not exist',
    )
    value = Reflect.get(value, index)
  }

  assert(value !== undefined && value !== null, 'Parameter path does not exist')
  assert(!Array.isArray(value), 'Event identity parameter must be a scalar')

  const eventId = String(value)
  assert(eventId.length <= 255, 'Liveness event ID exceeds 255 characters')
  return eventId
}

function getInterface(signature: `function ${string}`): utils.Interface {
  const cached = interfaces.get(signature)
  if (cached !== undefined) return cached

  const iface = new utils.Interface([signature])
  interfaces.set(signature, iface)
  return iface
}
