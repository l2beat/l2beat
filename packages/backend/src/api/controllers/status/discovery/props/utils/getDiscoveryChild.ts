import {
  ContractParameters,
  ContractValue,
  DiscoveryOutput,
} from '@l2beat/shared'

export function getDiscoveryChild(
  discovery: DiscoveryOutput,
  contract: ContractParameters,
  value: ContractValue,
): string | undefined {
  const discoveryChild = discovery.contracts.find(
    (c) => c.address.toString() === value,
  )

  if (
    discoveryChild === undefined ||
    discoveryChild.address.toString() === contract.address.toString()
  ) {
    return undefined
  }

  return discoveryChild.address.toString()
}
