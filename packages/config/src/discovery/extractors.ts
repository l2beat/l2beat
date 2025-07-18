import type { ContractValue } from '@l2beat/discovery'
import { ChainSpecificAddress, type Hash256 } from '@l2beat/shared-pure'

// TODO(radomski): This is duplicated from discovery/extractors.ts. Pulling
// functions from discovery would make config dependent on discovery. We want
// to break the dependency between config and discovery and since only
// ProjectDiscovery basically uses these functions we're going to duplicate
// this since in the future ProjectDiscovery might be removed.
export function get$Implementations(
  values: Record<string, ContractValue | undefined> | undefined,
): ChainSpecificAddress[] {
  return toAddressArray(values?.$implementation)
}

export function get$Admins(
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
