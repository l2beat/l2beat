import type { ContractValue } from '@l2beat/discovery-types'
import { type Bytes, EthereumAddress } from '@l2beat/shared-pure'

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
  } else if (returnType === 'address') {
    return EthereumAddress(value.slice(12, 32).toString()).toString()
  } else if (returnType === 'uint8') {
    return Number(value.get(31))
  }
  return value.toString()
}
