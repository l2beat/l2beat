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
  const i = discovery.contracts.find((c) => c.address.toString() === v)

  if (i === undefined || i.address.toString() === contract.address.toString()) {
    return undefined
  }

  return i.address.toString()
}
