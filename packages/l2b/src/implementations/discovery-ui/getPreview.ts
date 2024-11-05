import {
  ScalingProjectContract,
  ScalingProjectPermission,
  ScalingProjectPermissionedAccount,
  bridges,
  isSingleAddress,
  layer2s,
  layer3s,
} from '@l2beat/config'
import { toAddress } from './toAddress'
import {
  ApiAddressType,
  ApiPreviewContract,
  ApiPreviewPermission,
  ApiPreviewResponse,
} from './types'

const allProjects = [...layer2s, ...layer3s, ...bridges]

export function getPreview(projectId: string): ApiPreviewResponse | undefined {
  const project = allProjects.find((p) => p.id === projectId)
  if (!project) {
    return undefined
  }

  const permissions =
    project.permissions === 'UnderReview' || project.permissions === undefined
      ? []
      : project.permissions

  const contracts =
    project.contracts === undefined ? [] : project.contracts.addresses

  return {
    permissions: getPermissionsPreview(permissions),
    contracts: getContractsPreview(contracts),
  }
}

function getPermissionsPreview(
  permissions: ScalingProjectPermission[],
): ApiPreviewPermission[] {
  return permissions.map(
    (p): ApiPreviewPermission => ({
      addresses: p.accounts.map((a) => ({
        type: 'address',
        address: toAddress('ethereum', a.address.toString()),
        addressType: toApiAddressType(a.type),
      })),
      name: p.name,
      description: p.description,
      multisigParticipants: p.participants?.map((p) => ({
        type: 'address',
        address: toAddress('ethereum', p.address.toString()),
        addressType: toApiAddressType(p.type),
      })),
    }),
  )
}

function getContractsPreview(
  contracts: ScalingProjectContract[],
): ApiPreviewContract[] {
  return contracts.map(
    (c): ApiPreviewContract => ({
      addresses: isSingleAddress(c)
        ? [c.address.toString()]
        : c.multipleAddresses.map((a) => a.toString()),
      name: c.name,
      description: c.description ?? '',
    }),
  )
}

function toApiAddressType(
  type: ScalingProjectPermissionedAccount['type'],
): ApiAddressType {
  return type === 'MultiSig' ? 'Multisig' : type
}
