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

import { getExplorerUrl } from '../../../utils/getExplorerUrl'
import { TechnologyContract } from '../components/sections/common/ContractEntry'
import { ProjectDetailsPermissionsSection } from '../components/sections/types'

export function getPermissionsSection(
  project: Layer2 | Layer3 | Bridge,
  verificationStatus: VerificationStatus,
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
): ProjectDetailsPermissionsSection['props'] | undefined {
  const section: ProjectDetailsPermissionsSection['props'] = {
    id: 'permissions',
    title: 'Permissions',
    verificationStatus,
    manuallyVerifiedContracts,
    isUnderReview: project.isUnderReview,
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
  _index: number,
  permissions: ScalingProjectPermission[],
): TechnologyContract {
  const chain = permission.chain ?? 'ethereum'
  const etherscanUrl = getExplorerUrl(chain)
  const links = permission.accounts.map((account) => {
    const vanityName = !permission.name.includes('Multisig')
      ? permissions
          .filter(
            (p) =>
              !p.name.endsWith(' participants') &&
              p.name !== permission.name &&
              p.accounts.length === 1 &&
              p.accounts[0]?.address === account.address,
          )
          .sort((a, b) => {
            if (a.name.includes('Multisig') && !b.name.includes('Multisig'))
              return -1
            if (!a.name.includes('Multisig') && b.name.includes('Multisig'))
              return 1
            return 0
          })[0]?.name
      : undefined
    return {
      name:
        vanityName ??
        `${account.address.slice(0, 6)}…${account.address.slice(38, 42)}`,
      address: account.address.toString(),
      href: `${etherscanUrl}/address/${account.address.toString()}#code`,
      isAdmin: false,
    }
  })

  return {
    name: permission.name,
    addresses: [],
    etherscanUrl,
    chain,
    description: permission.description,
    links,
    references: permission.references,
  }
}
