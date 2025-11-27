import type { Bytes } from '@l2beat/shared-pure'
import type { ContractValue } from '../../output/types.js'

import { valueToBigInt } from './valueToBigInt.js'

export function valueToNumber(value: bigint | Bytes | ContractValue): number {
  const bigint = valueToBigInt(value)
  // FIXME: Value was asserted, not bigint
  if (bigint > Number.MAX_SAFE_INTEGER || bigint < Number.MIN_SAFE_INTEGER) {
    throw new Error('Cannot convert value to number')
  }
  return Number(bigint)
}
