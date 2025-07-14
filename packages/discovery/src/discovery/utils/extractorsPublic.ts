// NOTE(radomski): There is a difference between the internals operate on raw
// addresses. To the outside we expose only chain-specific addresses.

import { ChainSpecificAddress, type Hash256 } from '@l2beat/shared-pure'
import type { ContractValue } from '../output/types'

export function get$AdminsPublic(
  values: Record<string, ContractValue | undefined> | undefined,
): ChainSpecificAddress[] {
  return toAddressArray(values?.$admin)
}

export function toAddressRecord(value: ContractValue | undefined) {
  if (Array.isArray(value) && value.every((v) => Array.isArray(v))) {
    return value.map(
      (e) =>
        [
          e[0] as string,
          e[1] as unknown as Hash256,
          e[2] as unknown as ChainSpecificAddress[],
        ] as [string, Hash256, ChainSpecificAddress[]],
    )
  }
  return []
}

export function toAddressArray(
  value: ContractValue | undefined,
): ChainSpecificAddress[] {
  if (Array.isArray(value)) {
    return value.flatMap((v) => toAddressArray(v))
  }
  if (typeof value === 'object') {
    return Object.values(value).flatMap((v) => toAddressArray(v))
  }
  if (typeof value === 'string') {
    try {
      return [ChainSpecificAddress(value)]
    } catch {
      return []
    }
  }
  return []
}
