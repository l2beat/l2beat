import type { ProjectContracts, ProjectPermissions } from '@l2beat/config'
import { ChainSpecificAddress, formatAddress } from '@l2beat/shared-pure'

export interface UnverifiedContractEntry {
  address: string
  contractName: string
  targetId: string | undefined
}

export function getUnverifiedContractEntries(
  unverifiedContracts: ChainSpecificAddress[],
  contracts: ProjectContracts | undefined,
  permissions: Record<string, ProjectPermissions> | undefined,
): UnverifiedContractEntry[] {
  const projectContracts = Object.values(contracts?.addresses ?? {}).flat()
  const projectPermissions = Object.values(permissions ?? {}).flatMap(
    ({ roles = [], actors = [] }) => roles.concat(actors),
  )

  return unverifiedContracts.map((unverifiedContract) => {
    const address = ChainSpecificAddress.address(unverifiedContract)
    const contract = projectContracts.find(
      (contract) => contract.address === unverifiedContract,
    )
    if (contract) {
      return {
        address,
        contractName: contract.name || formatAddress(address),
        targetId: contract.name || undefined,
      }
    }

    const permission = projectPermissions.find((permission) =>
      permission.accounts.some(
        (account) => account.address === unverifiedContract,
      ),
    )
    if (permission) {
      return {
        address,
        contractName: permission.name || formatAddress(address),
        targetId: permission.id || undefined,
      }
    }

    return {
      address,
      contractName: formatAddress(address),
      targetId: undefined,
    }
  })
}
