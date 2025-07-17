import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ContractValue } from '../output/types'

export function prefixAddresses(
  longChain: string,
  value: ContractValue,
): ContractValue {
  if (Array.isArray(value)) {
    return value.map((v) => prefixAddresses(longChain, v))
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, value]) => [
        prefixAddresses(longChain, key),
        prefixAddresses(longChain, value as ContractValue),
      ]),
    )
  }

  if (typeof value === 'string') {
    try {
      return ChainSpecificAddress.fromLong(
        longChain,
        value.toLowerCase(),
      ).toString()
    } catch {
      return value
    }
  }

  return value
}
