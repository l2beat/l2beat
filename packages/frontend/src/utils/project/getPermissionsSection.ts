import { Bridge, Layer2, ProjectPermission } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/types'

import { TechnologyContract } from '../../components/project/ContractEntry'
import { PermissionsSectionProps } from '../../components/project/PermissionsSection'

export function getPermissionsSection(
  project: Layer2 | Bridge,
  verificationStatus: VerificationStatus,
): PermissionsSectionProps | undefined {
  return (
    project.permissions && {
      permissions: project.permissions.map(toTechnologyContract),
      verificationStatus,
    }
  )
}

export function toTechnologyContract(
  permission: ProjectPermission,
): TechnologyContract {
  const links = permission.accounts.slice(1).map((account) => ({
    name: `${account.address.slice(0, 6)}…${account.address.slice(38, 42)}`,
    address: account.address,
    href: `https://etherscan.io/address/${account.address}#code`,
    isAdmin: false,
  }))

  return {
    name: permission.name,
    address: permission.accounts[0]?.address,
    description: permission.description,
    links,
  }
}
