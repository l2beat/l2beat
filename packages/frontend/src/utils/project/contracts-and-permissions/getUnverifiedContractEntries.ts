import { assert } from '@l2beat/shared-pure'
import type {
  TechnologyContract,
  TechnologyContractAddress,
} from '~/components/projects/sections/ContractEntry'
import type { ContractsSection } from './getContractsSection'
import type { PermissionSection } from './getPermissionsSection'

export interface UnverifiedContractEntry {
  address: string
  contractName: string
  href: string
  targetId: string
  type: NonNullable<TechnologyContractAddress['contractType']> | 'permission'
}

export function getUnverifiedContractEntries(
  contractsSection: ContractsSection | undefined,
  permissionsSection: PermissionSection | undefined,
): UnverifiedContractEntry[] {
  const contracts = Object.values(contractsSection?.contracts ?? {}).flat()
  const permissions = Object.values(
    permissionsSection?.permissionsByChain ?? {},
  ).flatMap(({ roles, actors }) => roles.concat(actors))

  return [
    ...contracts.flatMap(getUnverifiedContractAddresses),
    ...permissions.flatMap(getUnverifiedPermissionAddresses),
  ]
}

function getUnverifiedContractAddresses(
  contract: TechnologyContract,
): UnverifiedContractEntry[] {
  return contract.addresses
    .filter((address) => address.verificationStatus === 'unverified')
    .map((address) => {
      assert(address.contractType, 'Contract address type is required')
      return {
        address: address.address,
        contractName: contract.name,
        href: address.href,
        targetId: contract.id,
        type: address.contractType,
      }
    })
}

function getUnverifiedPermissionAddresses(
  permission: TechnologyContract,
): UnverifiedContractEntry[] {
  return permission.addresses
    .filter((address) => address.verificationStatus === 'unverified')
    .map((address) => ({
      address: address.address,
      contractName: permission.name,
      href: address.href,
      targetId: permission.id,
      type: 'permission',
    }))
}
