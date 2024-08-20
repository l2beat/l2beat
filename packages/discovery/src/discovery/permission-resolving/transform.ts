import {
  ResolvedPermission as OutputResolvedPermission,
  PermissionType,
} from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
import { Permission, ResolvedPermission } from './resolvePermissions'

export function transformToIssued(
  forAddress: EthereumAddress,
  resolved: ResolvedPermission[],
): OutputResolvedPermission[] | undefined {
  const matching = resolved.filter((r) => r.path[0]?.address === forAddress)
  if (matching.length === 0) {
    return undefined
  }

  return matching.map((r) => ({
    permission: internalPermissionToExternal(r.permission),
    // biome-ignore lint/style/noNonNullAssertion: we know it's fine
    target: r.path[0]!.address,
    via: r.path.slice(1),
  }))
}

export function transformToReceived(
  toAddress: EthereumAddress,
  resolved: ResolvedPermission[],
): OutputResolvedPermission[] | undefined {
  const matching = resolved.filter(
    (r) => r.path[r.path.length - 1]?.address === toAddress,
  )
  if (matching.length === 0) {
    return undefined
  }

  return matching.map((r) => ({
    permission: internalPermissionToExternal(r.permission),
    // biome-ignore lint/style/noNonNullAssertion: we know it's fine
    target: r.path[r.path.length - 1]!.address,
    via: r.path.reverse().slice(1),
  }))
}

function internalPermissionToExternal(permission: Permission): PermissionType {
  if (permission === 'member') {
    return 'act'
  }

  return permission
}
