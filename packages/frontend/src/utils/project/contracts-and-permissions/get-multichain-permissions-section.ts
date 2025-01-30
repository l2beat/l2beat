import type {
  UsedInProject as ConfigUsedInProject,
  DaBridge,
  ScalingProjectPermission,
  ScalingProjectPermissionedAccount,
  ScalingProjectPermissions,
} from '@l2beat/config'
import type { ContractsVerificationStatuses } from '@l2beat/shared-pure'
import { getPermissionedEntities } from '~/app/(top-nav)/data-availability/projects/[layer]/_utils/get-permissioned-entities'
import type { MultichainPermissionsSectionProps } from '~/components/projects/sections/permissions/multichain-permissions-section'
import type { UsedInProject } from '~/components/projects/sections/permissions/used-in-project'
import { getExplorerUrl } from '~/utils/get-explorer-url'
import { slugToDisplayName } from '~/utils/project/slug-to-display-name'
import type {
  TechnologyContract,
  TechnologyContractAddress,
} from '../../../components/projects/sections/contract-entry'
import type { ProjectSectionProps } from '../../../components/projects/sections/types'
import { getUsedInProjects } from './get-used-in-projects'
import { toVerificationStatus } from './to-verification-status'

type ProjectParams = {
  id: string
  permissions: Record<string, ScalingProjectPermissions> | 'UnderReview'
  isUnderReview: boolean
  dacUsedIn?: ConfigUsedInProject
  bridge: DaBridge
}

type PermissionSection = Omit<
  MultichainPermissionsSectionProps,
  keyof Omit<ProjectSectionProps, 'isUnderReview'>
>

export function getMultichainPermissionsSection(
  projectParams: ProjectParams,
  contractsVerificationStatuses: ContractsVerificationStatuses,
): PermissionSection | undefined {
  const hasAnyPermissions =
    Object.values(projectParams.permissions).flat().length > 0

  const permissionedEntities = getPermissionedEntities(projectParams.bridge)

  if (!hasAnyPermissions && !permissionedEntities) {
    return undefined
  }

  const section: PermissionSection = {
    isUnderReview: projectParams.isUnderReview,
    permissions: {},
    dacUsedIn: projectParams.dacUsedIn,
  }

  if (projectParams.permissions === 'UnderReview') {
    return {
      ...section,
      isUnderReview: true,
    }
  }

  return {
    ...section,

    permissions: Object.fromEntries(
      Object.entries(projectParams.permissions ?? {}).map(
        ([slug, permissions]) => {
          return [
            slugToDisplayName(slug),
            {
              roles: (permissions.roles ?? []).flatMap((p) =>
                toTechnologyContract(
                  projectParams,
                  p,
                  contractsVerificationStatuses,
                ),
              ),
              actors: (permissions.actors ?? []).flatMap((p) =>
                toTechnologyContract(
                  projectParams,
                  p,
                  contractsVerificationStatuses,
                ),
              ),
            },
          ]
        },
      ),
    ),
    permissionedEntities: permissionedEntities,
  }
}

function resolvePermissionedName(
  rootName: string,
  account: ScalingProjectPermissionedAccount,
  permissions: ProjectParams['permissions'],
  chain: string,
): string {
  let name = `${account.address.slice(0, 6)}…${account.address.slice(38, 42)}`

  if (permissions !== undefined && permissions !== 'UnderReview') {
    const matchingPermissions = permissions[chain]?.actors?.filter(
      (p) =>
        p.name !== rootName &&
        p.accounts
          .map((a) => a.address.toString())
          .includes(account.address.toString()),
    )

    const firstMatchingPermission = matchingPermissions?.[0]
    if (matchingPermissions?.length === 1 && firstMatchingPermission) {
      name = firstMatchingPermission.name
    }

    const multisigs = matchingPermissions?.filter(
      (p) => p.participants !== undefined,
    )
    const firstMultisig = multisigs?.[0]
    if (multisigs?.length === 1 && firstMultisig) {
      name = firstMultisig.name
    }
  }

  return name
}

function toTechnologyContract(
  projectParams: ProjectParams,
  permission: ScalingProjectPermission,
  contractsVerificationStatuses: ContractsVerificationStatuses,
): TechnologyContract[] {
  const chain = permission.chain ?? 'ethereum'
  const verificationStatusForChain = contractsVerificationStatuses[chain] ?? {}
  const etherscanUrl = getExplorerUrl(chain)
  const addresses: TechnologyContractAddress[] = permission.accounts.map(
    (account) => {
      const address = account.address.toString()
      const name = resolvePermissionedName(
        permission.name,
        account,
        projectParams.permissions,
        chain,
      )
      return {
        name,
        address,
        href: `${etherscanUrl}/address/${address}#code`,
        isAdmin: false,
        verificationStatus: toVerificationStatus(
          verificationStatusForChain[address],
        ),
      }
    },
  )

  let usedInProjects: UsedInProject[] | undefined
  if (permission.accounts.length === 1) {
    usedInProjects = getUsedInProjects(
      { ...projectParams, type: 'DaLayer' },
      [],
      addresses,
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

  const references =
    permission.participants === undefined && permission.references
      ? permission.references
      : []

  const participants = permission.participants?.map((account) => {
    const name = resolvePermissionedName(
      permission.name,
      account,
      projectParams.permissions,
      chain,
    )

    return {
      name,
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
      references,
      implementationChanged: false,
      highSeverityFieldChanged: false,
    },
  ]

  return result
}
