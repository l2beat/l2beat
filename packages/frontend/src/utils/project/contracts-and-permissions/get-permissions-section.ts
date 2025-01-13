import {
  type Bridge,
  type DaLayer,
  type Layer2,
  type Layer3,
  type ScalingProjectPermission,
  type ScalingProjectPermissionedAccount,
  type ScalingProjectReference,
} from '@l2beat/config'
import { type ContractsVerificationStatuses } from '@l2beat/shared-pure'
import { type PermissionsSectionProps } from '~/components/projects/sections/permissions/permissions-section'
import { getExplorerUrl } from '~/utils/get-explorer-url'
import { slugToDisplayName } from '~/utils/project/slug-to-display-name'
import {
  type TechnologyContract,
  type TechnologyContractAddress,
} from '../../../components/projects/sections/contract-entry'
import { type UsedInProject } from '../../../components/projects/sections/permissions/used-in-project'
import { type ProjectSectionProps } from '../../../components/projects/sections/types'
import { getChain } from './get-chain'
import { getUsedInProjects } from './get-used-in-projects'
import { toVerificationStatus } from './to-verification-status'

type ProjectParams = {
  id: string
  permissions: ScalingProjectPermission[] | 'UnderReview'
  nativePermissions:
    | Record<string, ScalingProjectPermission[]>
    | 'UnderReview'
    | undefined
  isUnderReview: boolean
} & (
  | { type: (Layer2 | Bridge | DaLayer)['type'] }
  | { type: Layer3['type']; hostChain: string }
)

type PermissionSection = Omit<
  PermissionsSectionProps,
  keyof Omit<ProjectSectionProps, 'isUnderReview'>
>

export function getPermissionsSection(
  projectParams: ProjectParams,
  contractsVerificationStatuses: ContractsVerificationStatuses,
): PermissionSection | undefined {
  if (
    projectParams.permissions.length === 0 &&
    (!projectParams.nativePermissions ||
      projectParams.nativePermissions.length === 0)
  ) {
    return undefined
  }

  const section: PermissionSection = {
    isUnderReview: projectParams.isUnderReview,
    permissions: [],
    nativePermissions: {},
  }

  if (
    projectParams.permissions === 'UnderReview' ||
    projectParams.nativePermissions === 'UnderReview'
  ) {
    return {
      ...section,
      isUnderReview: true,
    }
  }

  if (!projectParams.permissions && !projectParams.nativePermissions) {
    return undefined
  }

  return {
    ...section,
    permissions:
      projectParams.permissions?.flatMap((permission) =>
        toTechnologyContract(
          projectParams,
          permission,
          contractsVerificationStatuses,
        ),
      ) ?? [],
    nativePermissions: Object.fromEntries(
      Object.entries(projectParams.nativePermissions ?? {}).map(
        ([slug, permissions]) => {
          return [
            slugToDisplayName(slug),
            permissions.flatMap((p) =>
              toTechnologyContract(
                projectParams,
                p,
                contractsVerificationStatuses,
              ),
            ),
          ]
        },
      ),
    ),
  }
}

function resolvePermissionedName(
  rootName: string,
  account: ScalingProjectPermissionedAccount,
  permissions: ProjectParams['permissions'],
): string {
  let name = `${account.address.slice(0, 6)}…${account.address.slice(38, 42)}`

  if (permissions !== undefined && permissions !== 'UnderReview') {
    const matchingPermissions = permissions.filter(
      (p) =>
        p.name !== rootName &&
        p.fromRole !== true &&
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

  return name
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
      const name = resolvePermissionedName(
        permission.name,
        account,
        projectParams.permissions,
      )
      return {
        name,
        address,
        href:
          permission.fromRole === true
            ? `#${name}`
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
    const name = resolvePermissionedName(
      permission.name,
      account,
      projectParams.permissions,
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
      references: permission.references ?? [],
      implementationChanged: false,
      highSeverityFieldChanged: false,
    },
  ]

  return result
}
