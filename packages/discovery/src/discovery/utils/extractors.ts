import { ChainSpecificAddress, type Hash256 } from '@l2beat/shared-pure'
import type { ContractValue } from '../output/types'

export function get$Implementations(
  values: Record<string, ContractValue | undefined> | undefined,
): ChainSpecificAddress[] {
  return toAddressArrayPrivate(values?.$implementation)
}

export function get$Beacons(
  values: Record<string, ContractValue | undefined> | undefined,
): ChainSpecificAddress[] {
  return toAddressArrayPrivate(values?.$beacon)
}

export function get$PastUpgrades(
  values: Record<string, ContractValue | undefined> | undefined,
): [string, Hash256, ChainSpecificAddress[]][] {
  return toAddressRecordPrivate(values?.$pastUpgrades)
}

export function get$Admins(
  values: Record<string, ContractValue | undefined> | undefined,
): ChainSpecificAddress[] {
  return toAddressArrayPrivate(values?.$admin)
}

export function toAddressRecordPrivate(value: ContractValue | undefined) {
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

export function toAddressArrayPrivate(
  value: ContractValue | undefined,
): ChainSpecificAddress[] {
  if (Array.isArray(value)) {
    return value.flatMap((v) => toAddressArrayPrivate(v))
  }
  if (typeof value === 'object') {
    return Object.values(value).flatMap((v) => toAddressArrayPrivate(v))
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
