import type { ProjectContracts, ProjectPermissions } from '@l2beat/config'
import { ChainSpecificAddress, formatAddress } from '@l2beat/shared-pure'

export interface UnverifiedContractEntry {
  address: ChainSpecificAddress
  target?: UnverifiedContractTarget
}

interface UnverifiedContractTarget {
  id: string
  label: string
}

export function getUnverifiedContractEntries(
  unverifiedContracts: ChainSpecificAddress[],
  contracts: ProjectContracts | undefined,
  permissions: Record<string, ProjectPermissions> | undefined,
): UnverifiedContractEntry[] {
  const targetByAddress = new Map<
    ChainSpecificAddress,
    UnverifiedContractTarget
  >()

  const projectPermissions = Object.values(permissions ?? {}).flatMap(
    ({ roles = [], actors = [] }) => roles.concat(actors),
  )
  for (const permission of projectPermissions) {
    if (!permission.id) continue
    for (const account of permission.accounts) {
      targetByAddress.set(account.address, {
        id: permission.id,
        label:
          permission.name ||
          formatAddress(ChainSpecificAddress.address(account.address)),
      })
    }
  }

  const projectContracts = Object.values(contracts?.addresses ?? {}).flat()
  for (const contract of projectContracts) {
    if (!contract.name) continue
    targetByAddress.set(contract.address, {
      id: contract.name,
      label: contract.name,
    })
  }

  return [...new Set(unverifiedContracts)].map((address) => ({
    address,
    target: targetByAddress.get(address),
  }))
}
