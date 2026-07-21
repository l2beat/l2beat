import type {
  ProjectContract,
  ProjectContracts,
  ProjectPermissions,
} from '@l2beat/config'
import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'

export interface UnverifiedContractEntry {
  address: string
  contractName: string
  href: string
  targetId: string
  type: 'proxy' | 'implementation' | 'standalone' | 'permission'
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
  const contractsList = Object.values(contracts.addresses).flat()
  const contractEntries: UnverifiedContractEntry[] = contractsList
    .filter((contract) => !contract.isVerified)
    .map((contract) => {
      assert(contract.url, `Missing explorer URL for ${contract.name}`)
      return {
        address: ChainSpecificAddress.address(contract.address),
        contractName: contract.name,
        href: contract.url,
        targetId: contract.name,
        type: contract.upgradeability
          ? ('proxy' as const)
          : ('standalone' as const),
      }
    })

  const implementationEntries = contractsList.flatMap((contract) =>
    (contract.upgradeability?.unverifiedImplementations ?? []).map((address) =>
      toImplementationEntry(contract, address),
    ),
  )

  return contractEntries.concat(implementationEntries)
}

function toImplementationEntry(
  contract: ProjectContract,
  address: ChainSpecificAddress,
): UnverifiedContractEntry {
  assert(contract.url, `Missing explorer URL for ${contract.name}`)
  const explorerUrl = new URL(contract.url).origin
  const ethereumAddress = ChainSpecificAddress.address(address)

  return {
    address: ethereumAddress,
    contractName: contract.name,
    href: `${explorerUrl}/address/${ethereumAddress}#code`,
    targetId: contract.name,
    type: 'implementation',
  }
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
        type: 'permission' as const,
      })),
  )
}
