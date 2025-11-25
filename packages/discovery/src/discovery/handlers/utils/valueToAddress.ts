import { EthereumAddress } from '@l2beat/shared-pure'
import type { ContractValue } from '../../output/types.js'

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
