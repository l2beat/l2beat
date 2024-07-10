import {
  type ScalingProjectReference,
  type ScalingProjectPermission,
  type DaBridge,
  type DaLayer,
} from '@l2beat/config'
import {
  notUndefined,
  type ManuallyVerifiedContracts,
  type VerificationStatus,
} from '@l2beat/shared-pure'
import {
  type TechnologyContractAddress,
  type TechnologyContract,
  type UsedInProject,
} from './contract-entry.'
import { type ProjectDetailsPermissionsSection } from '../types'
import { getExplorerUrl } from '~/utils/get-explorer-url'
import { concat } from 'lodash'

export function getPermissionsSection(
  layer: DaLayer,
  bridge: DaBridge,
  verificationStatus: VerificationStatus,
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
): ProjectDetailsPermissionsSection['props'] | undefined {
  const section: ProjectDetailsPermissionsSection['props'] = {
    id: 'da-bridge-permissions',
    title: 'DA Bridge permissions',
    isUnderReview: layer.isUnderReview,
    permissions: [],
    nativePermissions: {},
  }

  if (
    bridge.permissions === 'UnderReview' ||
    bridge.nativePermissions === 'UnderReview'
  ) {
    return {
      ...section,
      isUnderReview: true,
    }
  }

  if (!bridge.permissions && !bridge.nativePermissions) {
    return undefined
  }

  return {
    ...section,
    permissions:
      bridge.permissions?.flatMap((permission) =>
        toTechnologyContract(
          bridge,
          permission,
          verificationStatus,
          manuallyVerifiedContracts,
        ),
      ) ?? [],
    nativePermissions: Object.fromEntries(
      Object.entries(bridge.nativePermissions ?? {}).map(
        ([slug, permissions]) => {
          return [
            // TODO: slugToDisplayName(slug),
            slug,
            permissions.flatMap((p) =>
              toTechnologyContract(
                bridge,
                p,
                verificationStatus,
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
  bridge: DaBridge,
  permission: ScalingProjectPermission,
  verificationStatus: VerificationStatus,
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
): TechnologyContract[] {
  const chain = permission.chain ?? 'ethereum'
  const verificationStatusForChain = verificationStatus.contracts[chain] ?? {}
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
        verified: !!verificationStatusForChain[address],
      }
    },
  )

  let usedInProjects: UsedInProject[] | undefined
  // if (permission.accounts.length === 1) {
  //   usedInProjects = getUsedInProjects(bridge, [], addresses)
  //   if (usedInProjects !== undefined) {
  //     usedInProjects = usedInProjects.map((p) => ({
  //       ...p,
  //       type: 'permission',
  //     }))
  //   }
  // }

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
          bridge.permissions !== undefined &&
          bridge.permissions !== 'UnderReview'
        ) {
          const matchingPermissions = bridge.permissions.filter((p) =>
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
          verified: !!verificationStatusForChain[address],
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
