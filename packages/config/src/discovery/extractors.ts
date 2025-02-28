import type { ContractValue } from '@l2beat/discovery'
import type { EthereumAddress, Hash256 } from '@l2beat/shared-pure'

// TODO(radomski): This is duplicated from discovery/extractors.ts. Pulling
// functions from discovery would make config dependent on discovery. We want
// to break the dependency between config and discovery and since only
// ProjectDiscovery basically uses these functions we're going to duplicate
// this since in the future ProjectDiscovery might be removed.
export function get$Implementations(
  values: Record<string, ContractValue | undefined> | undefined,
): EthereumAddress[] {
  return toAddressArray(values?.$implementation)
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
