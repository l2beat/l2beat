import type { EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import type { ContractValue } from '../output/types'

export function get$Implementations(
  values: Record<string, ContractValue | undefined> | undefined,
): EthereumAddress[] {
  return toAddressArray(values?.$implementation)
}

export function get$Beacons(
  values: Record<string, ContractValue | undefined> | undefined,
): EthereumAddress[] {
  return toAddressArray(values?.$beacon)
}

export function get$PastUpgrades(
  values: Record<string, ContractValue | undefined> | undefined,
): [string, Hash256, EthereumAddress[]][] {
  return toAddressRecord(values?.$pastUpgrades)
}

export function get$Admins(
  values: Record<string, ContractValue | undefined> | undefined,
): EthereumAddress[] {
  return toAddressArray(values?.$admin)
}

export function toAddressRecord(value: ContractValue | undefined) {
  if (Array.isArray(value) && value.every((v) => Array.isArray(v))) {
    return value.map(
      (e) =>
        [
          e[0] as string,
          e[1] as unknown as Hash256,
          e[2] as unknown as EthereumAddress[],
        ] as [string, Hash256, EthereumAddress[]],
    )
  }
  return []
}

export function toAddressArray(value: ContractValue | undefined) {
  if (typeof value === 'string') {
    return [value as unknown as EthereumAddress]
  }
  if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
    return value.map((v) => v as unknown as EthereumAddress)
  }
  return []
}
