import type { ProjectPermission, ProjectPermissions } from '@l2beat/config'
import { ChainSpecificAddress, type ProjectId } from '@l2beat/shared-pure'
import type { PermissionsSectionProps } from '~/components/projects/sections/permissions/PermissionsSection'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/getProjectsChangeReport'
import type {
  TechnologyContract,
  TechnologyContractAddress,
} from '../../../components/projects/sections/ContractEntry'
import type { UsedInProject } from '../../../components/projects/sections/permissions/UsedInProject'
import type { ProjectSectionProps } from '../../../components/projects/sections/types'
import type { ContractUtils } from './getContractUtils'
import { toVerificationStatus } from './toVerificationStatus'

type ProjectParams = {
  id: ProjectId
  permissions?: Record<string, ProjectPermissions> | 'UnderReview'
  isUnderReview: boolean
  hostChain?: string
}

type PermissionSection = Omit<
  PermissionsSectionProps,
  keyof Omit<ProjectSectionProps, 'isUnderReview'>
>

function permissionsAreEmpty(
  permissions: ProjectPermissions | 'UnderReview' | undefined,
): boolean {
  if (permissions === undefined) {
    return true
  }

  if (permissions === 'UnderReview') {
    return false
  }

  const rolesAreEmpty =
    permissions.roles === undefined || permissions.roles.length === 0
  const actorsAreEmpty =
    permissions.actors === undefined || permissions.actors.length === 0

  return rolesAreEmpty && actorsAreEmpty
}

export function getPermissionsSection(
  projectParams: ProjectParams,
  contractUtils: ContractUtils,
  projectsChangeReport: ProjectsChangeReport,
): PermissionSection | undefined {
  if (!projectParams.permissions) {
    return undefined
  }
  if (
    projectParams.permissions !== 'UnderReview' &&
    Object.values(projectParams.permissions).every((p) =>
      permissionsAreEmpty(p),
    )
  ) {
    return undefined
  }

  const section: PermissionSection = {
    isUnderReview: projectParams.isUnderReview,
    permissionsByChain: {},
  }

  if (projectParams.permissions === 'UnderReview') {
    return { ...section, isUnderReview: true }
  }

  if (!projectParams.permissions) {
    return undefined
  }

  const projectChangeReport = projectParams.id
    ? projectsChangeReport?.projects[projectParams.id]
    : undefined

  const permissionsByChain = {
    ...Object.fromEntries(
      Object.entries(projectParams.permissions ?? {}).map(
        ([slug, permissions]) => {
          return [
            contractUtils.getChainName(slug),
            getGroupedTechnologyContracts(
              projectParams,
              permissions,
              contractUtils,
              projectChangeReport,
            ),
          ]
        },
      ),
    ),
  }

  return {
    ...section,
    permissionsByChain,
  }
}

function getGroupedTechnologyContracts(
  projectParams: ProjectParams,
  permissions: ProjectPermissions,
  contractUtils: ContractUtils,
  projectChangeReport: ProjectsChangeReport['projects'][string] | undefined,
): PermissionSection['permissionsByChain'][string] {
  return {
    roles:
      permissions.roles?.flatMap((permission) =>
        toTechnologyContract(
          projectParams,
          permission,
          contractUtils,
          projectChangeReport,
        ),
      ) ?? [],
    actors:
      permissions.actors?.flatMap((permission) =>
        toTechnologyContract(
          projectParams,
          permission,
          contractUtils,
          projectChangeReport,
        ),
      ) ?? [],
  }
}

function toTechnologyContract(
  projectParams: ProjectParams,
  permission: ProjectPermission,
  contractUtils: ContractUtils,
  projectChangeReport: ProjectsChangeReport['projects'][string] | undefined,
): TechnologyContract[] {
  const addresses: TechnologyContractAddress[] = permission.accounts.map(
    (account) => ({
      name: account.name,
      href: account.url,
      address: ChainSpecificAddress.address(account.address).toString(),
      verificationStatus: toVerificationStatus(
        account.isVerified ?? false,
        projectChangeReport?.[permission.chain]?.becameVerified.includes(
          ChainSpecificAddress.address(account.address),
        ),
      ),
    }),
  )

  let usedInProjects: UsedInProject[] | undefined
  if (permission.accounts.length === 1) {
    usedInProjects = permission.accounts.flatMap((a) =>
      contractUtils.getUsedIn(
        projectParams.id,
        permission.chain,
        ChainSpecificAddress.address(a.address),
      ),
    )
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

  const participants = permission.participants?.map((account) => ({
    name: account.name,
    href: account.url,
    address: ChainSpecificAddress.address(account.address),
  }))

  const changes = Object.values(projectChangeReport ?? {}).flat()
  const impactfulChangeAddresses = changes.flatMap((c) =>
    c.implementationChange
      .concat(c.highSeverityFieldChange)
      .concat(c.ultimateUpgraderChange),
  )
  const impactfulChange = impactfulChangeAddresses.some((changedAddress) =>
    addresses.map((a) => a.address).includes(changedAddress),
  )

  const result: TechnologyContract[] = [
    {
      id: permission.id,
      name,
      addresses,
      admins: [],
      usedInProjects,
      chain: permission.chain,
      description: permission.description,
      participants,
      references: permission.references ?? [],
      impactfulChange,
    },
  ]

  return result
}
