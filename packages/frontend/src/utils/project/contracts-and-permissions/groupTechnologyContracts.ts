import { assert } from '@l2beat/shared-pure'
import type { TechnologyContract } from '~/components/projects/sections/ContractEntry'

export function hasGroupableTechnologyContractState(
  contract: TechnologyContract,
) {
  return (
    (contract.pastUpgrades?.upgrades.length ?? 0) === 0 &&
    !contract.escrow &&
    !contract.impactfulChange &&
    !contract.addresses.some(
      (address) => address.verificationStatus === 'became-verified',
    )
  )
}

export function groupTechnologyContracts<T>(
  entries: (readonly [T, TechnologyContract])[],
  isGroupable: (entry: readonly [T, TechnologyContract]) => boolean,
): TechnologyContract[] {
  const groupKey = (contract: TechnologyContract) =>
    JSON.stringify({
      name: contract.name,
      description: contract.description ?? null,
      upgradeableBy: contract.upgradeableBy ?? null,
      upgradeConsiderations: contract.upgradeConsiderations ?? null,
      references: contract.references,
      usedInProjects: contract.usedInProjects ?? null,
      participants: contract.participants ?? null,
    })

  const result: TechnologyContract[] = []
  const groupIndexByKey = new Map<string, number>()

  for (const entry of entries) {
    const [, contract] = entry
    if (!isGroupable(entry)) {
      result.push(contract)
      continue
    }

    const key = groupKey(contract)
    const existingIndex = groupIndexByKey.get(key)
    if (existingIndex === undefined) {
      groupIndexByKey.set(key, result.length)
      result.push(contract)
      continue
    }

    const group = result[existingIndex]
    assert(group, 'Group must exist')
    const additionalAnchorIds = [
      ...new Set([
        ...(group.additionalAnchorIds ?? []),
        contract.id,
        ...(contract.additionalAnchorIds ?? []),
      ]),
    ].filter((id) => id !== group.id)
    result[existingIndex] = {
      ...group,
      addresses: [...group.addresses, ...contract.addresses],
      groupCount: (group.groupCount ?? 1) + (contract.groupCount ?? 1),
      additionalAnchorIds,
    }
  }

  return result
}
