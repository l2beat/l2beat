import { ContractValue } from '@l2beat/discovery-types'

import { Bytes } from '../../../utils/Bytes'
import { EthereumAddress } from '../../../utils/EthereumAddress'

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
