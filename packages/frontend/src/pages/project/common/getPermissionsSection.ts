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
    projectType: project.type === 'layer3' ? 'L3' : 'L2',
    verificationStatus,
    manuallyVerifiedContracts,
    isUnderReview: project.isUnderReview,
    permissions: [],
    nativePermissions: [],
  }

  if (
    project.permissions === 'UnderReview' ||
    project.nativePermissions === 'UnderReview'
  ) {
    return {
      ...section,
      isUnderReview: true,
    }
  }

  return (
    (project.permissions || project.nativePermissions) && {
      ...section,
      permissions: (project.permissions ?? []).flatMap((p) =>
        toTechnologyContract(project, p),
      ),
      nativePermissions: (project.nativePermissions ?? []).flatMap((p) =>
        toTechnologyContract(project, p),
      ),
    }
  )
}

function toTechnologyContract(
  project: Layer2 | Layer3 | Bridge,
  permission: ScalingProjectPermission,
): TechnologyContract[] {
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

  const name =
    permission.accounts.length > 1
      ? `${permission.name} (${permission.accounts.length})`
      : permission.name

  const result = [
    {
      name,
      addresses,
      etherscanUrl,
      usedInProjects,
      chain,
      description: permission.description,
      links,
      references:
        permission.participants === undefined
          ? permission.references
          : undefined,
    },
  ]

  if (permission.participants) {
    result.push({
      name: `${permission.name} participants (${permission.participants.length})`,
      addresses: [],
      chain,
      etherscanUrl,
      links: permission.participants.map((account) => {
        let name = `${account.address.slice(0, 6)}…${account.address.slice(
          38,
          42,
        )}`

        if (
          project.permissions !== undefined &&
          project.permissions !== 'UnderReview'
        ) {
          const matchingPermissions = project.permissions.filter((p) =>
            p.accounts
              .map((a) => a.address.toString())
              .includes(account.address.toString()),
          )
          if (matchingPermissions.length === 1) {
            name = matchingPermissions[0].name
          }

          const multisigs = matchingPermissions.filter(
            (p) => p.participants !== undefined,
          )
          if (multisigs.length === 1) {
            name = multisigs[0].name
          }
        }

        return {
          name,
          address: account.address.toString(),
          href: `${etherscanUrl}/address/${account.address.toString()}#code`,
          isAdmin: false,
        }
      }),
      description: `Those are the participants of the ${permission.name}.`,
      references: permission.references,
      usedInProjects: undefined,
    })
  }

  return result
}
