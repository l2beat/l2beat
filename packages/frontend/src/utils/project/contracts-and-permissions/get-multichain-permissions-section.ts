import {
  type DaBridge,
  type ScalingProjectPermission,
  type ScalingProjectPermissionedAccount,
  type ScalingProjectReference,
} from '@l2beat/config'
import { type UsedInProject as ConfigUsedInProject } from '@l2beat/config/build/src/projects/other/da-beat/types/UsedInProject'
import {
  type ContractsVerificationStatuses,
  type ManuallyVerifiedContracts,
  notUndefined,
} from '@l2beat/shared-pure'
import { concat } from 'lodash'
import { getPermissionedEntities } from '~/app/(top-nav)/data-availability/projects/[layer]/_utils/get-permissioned-entities'
import { type MultichainPermissionsSectionProps } from '~/components/projects/sections/permissions/multichain-permissions-section'
import { type UsedInProject } from '~/components/projects/sections/permissions/used-in-project'
import { getExplorerUrl } from '~/utils/get-explorer-url'
import { slugToDisplayName } from '~/utils/project/slug-to-display-name'
import {
  type TechnologyContract,
  type TechnologyContractAddress,
} from '../../../components/projects/sections/contract-entry'
import { type ProjectSectionProps } from '../../../components/projects/sections/types'
import { getUsedInProjects } from './get-used-in-projects'
import { toVerificationStatus } from './to-verification-status'

type ProjectParams = {
  id: string
  permissions: Record<string, ScalingProjectPermission[]> | 'UnderReview'
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
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
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
            permissions.flatMap((p) =>
              toTechnologyContract(
                projectParams,
                p,
                contractsVerificationStatuses,
                manuallyVerifiedContracts,
              ),
            ),
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
    const matchingPermissions = permissions[chain]?.filter(
      (p) =>
        p.name !== rootName &&
        p.fromRole !== true &&
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
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
): TechnologyContract[] {
  const chain = permission.chain ?? 'ethereum'
  const verificationStatusForChain = contractsVerificationStatuses[chain] ?? {}
  const manuallyVerifiedContractsForChain =
    manuallyVerifiedContracts[chain] ?? {}
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

  const manuallyVerifiedReferences: ScalingProjectReference[] = addresses
    .map((address) => {
      const manuallyVerified =
        manuallyVerifiedContractsForChain[address.address]
      if (!manuallyVerified) {
        return
      }
      return {
        text: 'Source code',
        href: manuallyVerified,
      }
    })
    .filter(notUndefined)

  const references =
    permission.participants === undefined && permission.references
      ? concat(permission.references, manuallyVerifiedReferences)
      : manuallyVerifiedReferences

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
