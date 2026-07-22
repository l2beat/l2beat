import type { ProjectContracts, ProjectPermissions } from '@l2beat/config'
import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'

export interface UnverifiedContractEntry {
  address: string
  contractName: string
  href: string
  targetId: string
}

export function getUnverifiedContractEntries(
  contracts: ProjectContracts | undefined,
  permissions: Record<string, ProjectPermissions> | undefined,
): UnverifiedContractEntry[] {
  const entries: UnverifiedContractEntry[] = []

  if (contracts) {
    entries.push(...getUnverifiedContracts(contracts))
  }
  if (permissions) {
    entries.push(...getUnverifiedPermissions(permissions))
  }

  return entries
}

function getUnverifiedContracts(
  contracts: ProjectContracts,
): UnverifiedContractEntry[] {
  return Object.values(contracts.addresses)
    .flat()
    .filter((contract) => !contract.isVerified)
    .map((contract) => {
      assert(contract.url, `Missing explorer URL for ${contract.name}`)
      return {
        address: ChainSpecificAddress.address(contract.address),
        contractName: contract.name,
        href: contract.url,
        targetId: contract.name,
      }
    })
}

function getUnverifiedPermissions(
  permissions: Record<string, ProjectPermissions>,
): UnverifiedContractEntry[] {
  const projectPermissions = Object.values(permissions).flatMap(
    ({ roles = [], actors = [] }) => roles.concat(actors),
  )

  return projectPermissions.flatMap((permission) =>
    permission.accounts
      .filter((account) => !account.isVerified)
      .map((account) => ({
        address: ChainSpecificAddress.address(account.address),
        contractName: permission.name,
        href: account.url,
        targetId: permission.id,
      })),
  )
}
