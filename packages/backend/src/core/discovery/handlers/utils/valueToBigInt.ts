import { Bytes } from '@l2beat/types'

import { ContractValue } from '../../types'

export function valueToBigInt(value: bigint | Bytes | ContractValue) {
  if (Array.isArray(value)) {
    throw new Error('Cannot convert value to bigint')
  }
  if (value instanceof Bytes) {
    return BigInt(value.toString())
  }
  try {
    return BigInt(value)
  } catch (e) {
    throw new Error('Cannot convert value to bigint')
  }
}
