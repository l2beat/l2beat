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
import {
  TechnologyContract,
  UsedInProject,
} from '../components/sections/common/ContractEntry'
import { ProjectDetailsPermissionsSection } from '../components/sections/types'
import { getUsedInProjects } from './getUsedInProjects'

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
      permissions: project.permissions.map((p) => {
        const entry = toTechnologyContract(project, p)
        return {
          ...entry,
          // Plus one because the first address is set to `address` and is not present in the array
          name:
            entry.links.length > 0
              ? `${entry.name} (${entry.links.length + 1})`
              : entry.name,
        }
      }),
    }
  )
}

function toTechnologyContract(
  project: Layer2 | Layer3 | Bridge,
  permission: ScalingProjectPermission,
): TechnologyContract {
  const chain = permission.chain ?? 'ethereum'
  const etherscanUrl = getExplorerUrl(chain)
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

  let usedInProjects: UsedInProject[] | undefined
  if (permission.accounts.length === 1) {
    usedInProjects = getUsedInProjects(project, [], addresses)
    if (usedInProjects !== undefined) {
      usedInProjects = usedInProjects.map((p) => ({
        ...p,
        type: 'permission',
      }))
    }
  }

  return {
    name: permission.name,
    addresses,
    etherscanUrl,
    usedInProjects,
    chain,
    description: permission.description,
    links,
    references: permission.references,
  }
}
