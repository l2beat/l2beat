import { Bytes, EthereumAddress } from '@l2beat/types'
import { BigNumber } from 'ethers'

import { ContractValue } from '../../types'

export function bytes32ToContractValue(
  value: Bytes,
  returnType: 'address' | 'bytes' | 'number',
): ContractValue {
  if (returnType === 'number') {
    const parsed = BigNumber.from(value)
    if (parsed.gt(Number.MAX_SAFE_INTEGER)) {
      return parsed.toString()
    }
    return parsed.toNumber()
  } else if (returnType === 'address') {
    return EthereumAddress(value.slice(12, 32).toString()).toString()
  }
  return value.toString()
}
