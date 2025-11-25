import { Bytes } from '@l2beat/shared-pure'
import type { ContractValue } from '../../output/types.js'

export function valueToBigInt(value: bigint | Bytes | ContractValue): bigint {
  if (value instanceof Bytes) {
    return BigInt(value.toString())
  }
  if (Array.isArray(value) || typeof value === 'object') {
    throw new Error('Cannot convert value to bigint')
  }
  try {
    return BigInt(value)
  } catch {
    throw new Error('Cannot convert value to bigint')
  }
}
