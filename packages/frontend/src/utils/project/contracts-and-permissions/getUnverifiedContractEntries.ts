import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import type {
  TechnologyContract,
  TechnologyContractAddress,
} from '~/components/projects/sections/ContractEntry'
import type { ContractsSection } from './getContractsSection'
import type { PermissionSection } from './getPermissionsSection'

export interface UnverifiedContractEntry {
  address: string
  chain: string
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

export function hasCompleteUnverifiedContractEntries(
  entries: UnverifiedContractEntry[],
  unverifiedContracts: ChainSpecificAddress[],
): boolean {
  const entryKeys = new Set(
    entries.map((entry) => getAddressKey(entry.chain, entry.address)),
  )
  const contractKeys = new Set(
    unverifiedContracts.map((contract) =>
      getAddressKey(
        ChainSpecificAddress.longChain(contract),
        ChainSpecificAddress.address(contract),
      ),
    ),
  )

  return (
    entryKeys.size === contractKeys.size &&
    [...entryKeys].every((key) => contractKeys.has(key))
  )
}

function getAddressKey(chain: string, address: string): string {
  return `${chain}:${address.toLowerCase()}`
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
        chain: contract.chain,
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
      chain: permission.chain,
      contractName: permission.name,
      href: address.href,
      targetId: permission.id,
      type: 'permission',
    }))
}
