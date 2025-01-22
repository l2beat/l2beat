import type { EthereumAddress } from '@l2beat/shared-pure'

export function gatherReachableAddresses(
  from: EthereumAddress[],
  addressRelatives: Record<string, EthereumAddress[] | undefined>,
): Set<EthereumAddress> {
  const reachable = new Set<EthereumAddress>()
  gatherReachableAddressesRecursively(from, addressRelatives, reachable)
  return reachable
}

function gatherReachableAddressesRecursively(
  from: EthereumAddress[],
  addressRelatives: Record<string, EthereumAddress[] | undefined>,
  reachable: Set<EthereumAddress>,
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
