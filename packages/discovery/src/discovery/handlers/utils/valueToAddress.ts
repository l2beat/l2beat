import type { ContractValue } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

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
  } catch {
    throw new Error('Cannot convert value to address, invalid value')
  }
}
