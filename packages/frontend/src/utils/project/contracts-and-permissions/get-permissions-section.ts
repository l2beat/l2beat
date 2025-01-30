import type {
  Bridge,
  DaLayer,
  Layer2,
  Layer3,
  ScalingProjectPermission,
  ScalingProjectPermissionedAccount,
  ScalingProjectPermissions,
} from '@l2beat/config'
import type { ContractsVerificationStatuses } from '@l2beat/shared-pure'
import type { PermissionsSectionProps } from '~/components/projects/sections/permissions/permissions-section'
import type { DaSolution } from '~/server/features/scaling/project/get-scaling-project-da-solution'
import { getExplorerUrl } from '~/utils/get-explorer-url'
import { slugToDisplayName } from '~/utils/project/slug-to-display-name'
import type {
  TechnologyContract,
  TechnologyContractAddress,
} from '../../../components/projects/sections/contract-entry'
import type { UsedInProject } from '../../../components/projects/sections/permissions/used-in-project'
import type { ProjectSectionProps } from '../../../components/projects/sections/types'
import { getChain } from './get-chain'
import { getUsedInProjects } from './get-used-in-projects'
import { toVerificationStatus } from './to-verification-status'

type ProjectParams = {
  id: string
  permissions: Record<string, ScalingProjectPermissions> | 'UnderReview'
  daSolution?: DaSolution
  isUnderReview: boolean
} & (
  | { type: (Layer2 | Bridge | DaLayer)['type'] }
  | { type: Layer3['type']; hostChain: string }
)

type PermissionSection = Omit<
  PermissionsSectionProps,
  keyof Omit<ProjectSectionProps, 'isUnderReview'>
>

function permissionsAreEmpty(
  permissions: ScalingProjectPermissions | 'UnderReview' | undefined,
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
  contractsVerificationStatuses: ContractsVerificationStatuses,
): PermissionSection | undefined {
  if (
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
            getGroupedTechnologyContracts(
              projectParams,
              contractsVerificationStatuses,
              permissions,
            ),
          ]
        },
      ),
    ),
  }

  return {
    ...section,
    permissionsByChain,
    daSolution: getDaSolution(projectParams, contractsVerificationStatuses),
  }
}

function getGroupedTechnologyContracts(
  projectParams: ProjectParams,
  contractsVerificationStatuses: ContractsVerificationStatuses,
  permissions: ScalingProjectPermissions,
): PermissionSection['permissionsByChain'][string] {
  return {
    roles:
      permissions.roles?.flatMap((permission) =>
        toTechnologyContract(
          projectParams,
          permission,
          contractsVerificationStatuses,
        ),
      ) ?? [],
    actors:
      permissions.actors?.flatMap((permission) =>
        toTechnologyContract(
          projectParams,
          permission,
          contractsVerificationStatuses,
        ),
      ) ?? [],
  }
}

function getDaSolution(
  projectParams: ProjectParams,
  contractsVerificationStatuses: ContractsVerificationStatuses,
): PermissionSection['daSolution'] {
  return projectParams.daSolution
    ? {
        layerName: projectParams.daSolution.layerName,
        bridgeName: projectParams.daSolution.bridgeName,
        hostChain: slugToDisplayName(projectParams.daSolution.hostChain),
        permissions: {
          roles:
            projectParams.daSolution.permissions?.roles?.flatMap((permission) =>
              toTechnologyContract(
                projectParams,
                permission,
                contractsVerificationStatuses,
              ),
            ) ?? [],
          actors:
            projectParams.daSolution.permissions?.actors?.flatMap(
              (permission) =>
                toTechnologyContract(
                  projectParams,
                  permission,
                  contractsVerificationStatuses,
                ),
            ) ?? [],
        },
      }
    : undefined
}

function resolvePermissionedName(
  rootName: string,
  account: ScalingProjectPermissionedAccount,
  projectPermissions: ProjectParams['permissions'],
  chain: string,
): {
  name: string
  redirectToName: boolean
} {
  const initialName = `${account.address.slice(0, 6)}…${account.address.slice(38, 42)}`
  let name = initialName
  if (projectPermissions === 'UnderReview') {
    return { name, redirectToName: name !== initialName }
  }

  const permissions = projectPermissions[chain]

  if (permissions !== undefined) {
    const matchingPermissions = (permissions.actors ?? []).filter(
      (p) =>
        p.name !== rootName &&
        p.accounts
          .map((a) => a.address.toString())
          .includes(account.address.toString()),
    )
    const firstMatchingPermission = matchingPermissions[0]
    if (matchingPermissions.length === 1 && firstMatchingPermission) {
      name = firstMatchingPermission.name
    }

    const multisigs = matchingPermissions.filter(
      (p) => p.participants !== undefined,
    )
    const firstMultisig = multisigs[0]
    if (multisigs.length === 1 && firstMultisig) {
      name = firstMultisig.name
    }
  }

  return { name, redirectToName: name !== initialName }
}

function toTechnologyContract(
  projectParams: ProjectParams,
  permission: ScalingProjectPermission,
  contractsVerificationStatuses: ContractsVerificationStatuses,
): TechnologyContract[] {
  const chain = getChain(projectParams, permission)
  const verificationStatusForChain = contractsVerificationStatuses[chain] ?? {}
  const etherscanUrl = getExplorerUrl(chain)
  const addresses: TechnologyContractAddress[] = permission.accounts.map(
    (account) => {
      const address = account.address.toString()
      const permissionedName = resolvePermissionedName(
        permission.name,
        account,
        projectParams.permissions,
        chain,
      )
      return {
        name: permissionedName.name,
        address,
        href: permissionedName.redirectToName
          ? `#${permissionedName.name}`
          : `${etherscanUrl}/address/${address}#code`,
        isAdmin: false,
        verificationStatus: toVerificationStatus(
          verificationStatusForChain[address],
        ),
      }
    },
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

  const participants = permission.participants?.map((account) => {
    const permissionedName = resolvePermissionedName(
      permission.name,
      account,
      projectParams.permissions,
      chain,
    )

    return {
      name: permissionedName.name,
      href: `${etherscanUrl}/address/${account.address.toString()}#code`,
      verificationStatus: toVerificationStatus(
        verificationStatusForChain[account.address.toString()],
      ),
    }
  })

  const result: TechnologyContract[] = [
    {
      name,
      addresses,
      usedInProjects,
      chain,
      description: permission.description,
      participants,
      references: permission.references ?? [],
      implementationChanged: false,
      highSeverityFieldChanged: false,
    },
  ]

  return result
}
