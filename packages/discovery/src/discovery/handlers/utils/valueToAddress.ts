import { ContractValue } from '@l2beat/discovery-types'

import { EthereumAddress } from '../../../utils/EthereumAddress'

export function valueToAddress(
  value: EthereumAddress | ContractValue,
): EthereumAddress {
  if (
    Array.isArray(value) ||
    typeof value === 'object' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    throw new Error('Cannot convert value to address, invalid type')
  }

  try {
    return EthereumAddress(value)
  } catch (e) {
    throw new Error('Cannot convert value to address, invalid value')
  }
}
