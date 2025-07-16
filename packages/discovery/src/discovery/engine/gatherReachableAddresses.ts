import type { ChainSpecificAddress } from '@l2beat/shared-pure'

export function gatherReachableAddresses(
  from: ChainSpecificAddress[],
  addressRelatives: Record<string, ChainSpecificAddress[] | undefined>,
): Set<ChainSpecificAddress> {
  const reachable = new Set<ChainSpecificAddress>()
  gatherReachableAddressesRecursively(from, addressRelatives, reachable)
  return reachable
}

function gatherReachableAddressesRecursively(
  from: ChainSpecificAddress[],
  addressRelatives: Record<string, ChainSpecificAddress[] | undefined>,
  reachable: Set<ChainSpecificAddress>,
) {
  from.forEach((address) => {
    if (!reachable.has(address)) {
      reachable.add(address)
      const relatives = addressRelatives[address.toString()]
      if (relatives) {
        gatherReachableAddressesRecursively(
          relatives,
          addressRelatives,
          reachable,
        )
      }
    }
  })
}
