import {
  Bridge,
  Layer2,
  Layer3,
  ScalingProjectPermission,
} from '@l2beat/config'
import {
  ManuallyVerifiedContracts,
  VerificationStatus,
} from '@l2beat/shared-pure'

import { TechnologyContract } from '../../components/project/ContractEntry'
import { PermissionsSectionProps } from '../../components/project/PermissionsSection'
import { getExplorerUrl } from '../getExplorerUrl'

export function getPermissionsSection(
  project: Layer2 | Layer3 | Bridge,
  verificationStatus: VerificationStatus,
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
): PermissionsSectionProps | undefined {
  const section: PermissionsSectionProps = {
    id: 'permissions',
    title: 'Permissions',
    verificationStatus,
    manuallyVerifiedContracts,
    permissions: [],
  }

  if (project.permissions === 'UnderReview') {
    return {
      ...section,
      isUnderReview: true,
    }
  }

  return (
    project.permissions && {
      ...section,
      permissions: project.permissions.map(toTechnologyContract),
    }
  )
}

function toTechnologyContract(
  permission: ScalingProjectPermission,
): TechnologyContract {
  const devId = permission.devId ?? 'ethereum'
  const etherscanUrl = getExplorerUrl(devId)
  const links = permission.accounts.slice(1).map((account) => {
    return {
      name: `${account.address.slice(0, 6)}…${account.address.slice(38, 42)}`,
      address: account.address.toString(),
      href: `${etherscanUrl}/address/${account.address.toString()}#code`,
      isAdmin: false,
    }
  })

  const addresses = []

  if (permission.accounts.length > 0) {
    addresses.push(permission.accounts[0].address.toString())
  }

  return {
    name: permission.name,
    addresses,
    etherscanUrl,
    devId,
    description: permission.description,
    links,
    references: permission.references,
  }
}
