import type { ProjectPermission, ProjectPermissions } from '@l2beat/config'
import type { PermissionsSectionProps } from '~/components/projects/sections/permissions/permissions-section'
import type { DaSolution } from '~/server/features/scaling/project/get-scaling-project-da-solution'
import { slugToDisplayName } from '~/utils/project/slug-to-display-name'
import type {
  TechnologyContract,
  TechnologyContractAddress,
} from '../../../components/projects/sections/contract-entry'
import type { UsedInProject } from '../../../components/projects/sections/permissions/used-in-project'
import type { ProjectSectionProps } from '../../../components/projects/sections/types'
import { getUsedInProjects } from './get-used-in-projects'
import { toVerificationStatus } from './to-verification-status'

type ProjectParams = {
  type: 'layer2' | 'layer3' | 'bridge'
  id: string
  permissions: Record<string, ProjectPermissions> | 'UnderReview'
  daSolution?: DaSolution
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
): PermissionSection | undefined {
  if (
    projectParams.permissions !== 'UnderReview' &&
    Object.values(projectParams.permissions).every((p) =>
      permissionsAreEmpty(p),
    ) &&
    permissionsAreEmpty(projectParams.daSolution?.permissions)
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

  if (!projectParams.permissions && !projectParams.daSolution?.permissions) {
    return undefined
  }

  const permissionsByChain = {
    ...Object.fromEntries(
      Object.entries(projectParams.permissions ?? {}).map(
        ([slug, permissions]) => {
          return [
            slugToDisplayName(slug),
            getGroupedTechnologyContracts(projectParams, permissions),
          ]
        },
      ),
    ),
  }

  return {
    ...section,
    permissionsByChain,
    daSolution: getDaSolution(projectParams),
  }
}

function getGroupedTechnologyContracts(
  projectParams: ProjectParams,
  permissions: ProjectPermissions,
): PermissionSection['permissionsByChain'][string] {
  return {
    roles:
      permissions.roles?.flatMap((permission) =>
        toTechnologyContract(projectParams, permission),
      ) ?? [],
    actors:
      permissions.actors?.flatMap((permission) =>
        toTechnologyContract(projectParams, permission),
      ) ?? [],
  }
}

function getDaSolution(
  projectParams: ProjectParams,
): PermissionSection['daSolution'] {
  return projectParams.daSolution
    ? {
        layerName: projectParams.daSolution.layerName,
        bridgeName: projectParams.daSolution.bridgeName,
        hostChain: slugToDisplayName(projectParams.daSolution.hostChain),
        permissions: {
          roles:
            projectParams.daSolution.permissions?.roles?.flatMap((permission) =>
              toTechnologyContract(projectParams, permission),
            ) ?? [],
          actors:
            projectParams.daSolution.permissions?.actors?.flatMap(
              (permission) => toTechnologyContract(projectParams, permission),
            ) ?? [],
        },
      }
    : undefined
}

function toTechnologyContract(
  projectParams: ProjectParams,
  permission: ProjectPermission,
): TechnologyContract[] {
  const addresses: TechnologyContractAddress[] = permission.accounts.map(
    (account) => ({
      name: account.name,
      href: account.url,
      address: account.address.toString(),
      verificationStatus: toVerificationStatus(account.isVerified ?? false),
    }),
  )

  let usedInProjects: UsedInProject[] | undefined
  if (permission.accounts.length === 1) {
    usedInProjects = getUsedInProjects(projectParams, [], addresses)
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
    address: account.address,
  }))

  const result: TechnologyContract[] = [
    {
      name,
      addresses,
      admins: [],
      usedInProjects,
      chain: permission.chain,
      description: permission.description,
      participants,
      references: permission.references ?? [],
      implementationChanged: false,
      highSeverityFieldChanged: false,
    },
  ]

  return result
}
