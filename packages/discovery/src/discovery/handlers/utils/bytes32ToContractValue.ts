import { type Bytes, EthereumAddress } from '@l2beat/shared-pure'
import type { ContractValue } from '../../output/types'

export function bytes32ToContractValue(
  value: Bytes,
  returnType: 'address' | 'bytes' | 'number' | 'uint8',
): ContractValue {
  if (returnType === 'number') {
    const parsed = BigInt(value.toString())
    if (parsed >= Number.MAX_SAFE_INTEGER) {
      return parsed.toString()
    }
    return Number(parsed)
  }
  if (returnType === 'address') {
    return EthereumAddress(value.slice(12, 32).toString()).toString()
  }
  if (returnType === 'uint8') {
    return Number(value.get(31))
  }
  return value.toString()
}
