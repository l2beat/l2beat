import {
  ContractParameters,
  ContractValue,
  ProjectParameters,
} from '@l2beat/shared'

export function getDiscoveryChild(
  discovery: ProjectParameters,
  contract: ContractParameters,
  v: ContractValue,
): string | undefined {
  const discoveryChild = discovery.contracts.find(
    (c) => c.address.toString() === v,
  )

  if (
    discoveryChild === undefined ||
    discoveryChild.address.toString() === contract.address.toString()
  ) {
    return undefined
  }

  return discoveryChild.address.toString()
}
