import { Bytes, ContractValue, EthereumAddress } from '@l2beat/shared-pure'

export function bytes32ToContractValue(
  value: Bytes,
  returnType: 'address' | 'bytes' | 'number',
): ContractValue {
  if (returnType === 'number') {
    const parsed = BigInt(value.toString())
    if (parsed >= Number.MAX_SAFE_INTEGER) {
      return parsed.toString()
    }
    return Number(parsed)
  } else if (returnType === 'address') {
    return EthereumAddress(value.slice(12, 32).toString()).toString()
  }
  return value.toString()
}
