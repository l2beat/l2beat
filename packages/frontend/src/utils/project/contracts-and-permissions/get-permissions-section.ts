import type { ProjectPermission, ProjectPermissions } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { PermissionsSectionProps } from '~/components/projects/sections/permissions/permissions-section'
import type {
  TechnologyContract,
  TechnologyContractAddress,
} from '../../../components/projects/sections/contract-entry'
import type { UsedInProject } from '../../../components/projects/sections/permissions/used-in-project'
import type { ProjectSectionProps } from '../../../components/projects/sections/types'
import type { ContractUtils } from './get-contract-utils'
import { toVerificationStatus } from './to-verification-status'

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
): PermissionSection['permissionsByChain'][string] {
  return {
    roles:
      permissions.roles?.flatMap((permission) =>
        toTechnologyContract(projectParams, permission, contractUtils),
      ) ?? [],
    actors:
      permissions.actors?.flatMap((permission) =>
        toTechnologyContract(projectParams, permission, contractUtils),
      ) ?? [],
  }
}

function toTechnologyContract(
  projectParams: ProjectParams,
  permission: ProjectPermission,
  contractUtils: ContractUtils,
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
    usedInProjects = permission.accounts.flatMap((a) =>
      contractUtils.getUsedIn(projectParams.id, permission.chain, a.address),
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
      impactfulChange: false,
    },
  ]

  return result
}
