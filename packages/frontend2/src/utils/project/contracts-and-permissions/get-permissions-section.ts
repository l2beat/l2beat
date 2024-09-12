import {
  type Bridge,
  type DaLayer,
  type Layer2,
  type Layer3,
  type ScalingProjectPermission,
  type ScalingProjectReference,
} from '@l2beat/config'
import {
  type ContractsVerificationStatuses,
  type ManuallyVerifiedContracts,
  notUndefined,
} from '@l2beat/shared-pure'
import { concat } from 'lodash'
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
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
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
          manuallyVerifiedContracts,
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
                manuallyVerifiedContracts,
              ),
            ),
          ]
        },
      ),
    ),
  }
}

function toTechnologyContract(
  projectParams: ProjectParams,
  permission: ScalingProjectPermission,
  contractsVerificationStatuses: ContractsVerificationStatuses,
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
): TechnologyContract[] {
  const chain = getChain(projectParams, permission)
  const verificationStatusForChain = contractsVerificationStatuses[chain] ?? {}
  const manuallyVerifiedContractsForChain =
    manuallyVerifiedContracts[chain] ?? {}
  const etherscanUrl = getExplorerUrl(chain)
  const addresses: TechnologyContractAddress[] = permission.accounts.map(
    (account) => {
      const address = account.address.toString()
      return {
        name: `${address.slice(0, 6)}…${address.slice(38, 42)}`,
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

  const result = [
    {
      name,
      addresses,
      usedInProjects,
      chain,
      description: permission.description,
      references,
    },
  ]

  if (permission.participants) {
    const addresses: TechnologyContractAddress[] = permission.participants.map(
      (account) => {
        let name = `${account.address.slice(0, 6)}…${account.address.slice(
          38,
          42,
        )}`

        if (
          projectParams.permissions !== undefined &&
          projectParams.permissions !== 'UnderReview'
        ) {
          const matchingPermissions = projectParams.permissions.filter((p) =>
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

        const address = account.address.toString()

        return {
          name,
          address,
          href: `${etherscanUrl}/address/${account.address.toString()}#code`,
          isAdmin: false,
          verificationStatus: toVerificationStatus(
            verificationStatusForChain[account.address.toString()],
          ),
        }
      },
    )

    result.push({
      name: `${permission.name} participants (${permission.participants.length})`,
      addresses,
      chain,
      description: `Those are the participants of the ${permission.name}.`,
      references: permission.references ?? [],
      usedInProjects: undefined,
    })
  }

  return result
}
