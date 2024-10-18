import {
  ResolvedPermission as OutputResolvedPermission,
  PermissionType,
  ResolvedPermissionPath,
} from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
import { isEqual } from 'lodash'
import {
  Permission,
  PermissionConfiguration,
} from '../config/RawDiscoveryConfig'
import { ResolvedPermission } from './resolvePermissions'

export function transformToIssued(
  forAddress: EthereumAddress,
  resolved: ResolvedPermission[],
): OutputResolvedPermission[] | undefined {
  const matching = resolved.filter((r) => r.path[0]?.address === forAddress)
  if (matching.length === 0) {
    return undefined
  }

  return sort(
    matching.map((r) => ({
      permission: internalPermissionToExternal(r.permission),
      // biome-ignore lint/style/noNonNullAssertion: we know it's fine
      target: r.path[r.path.length - 1]!.address,
      via: r.path.slice(1, -1).reverse(),
    })),
  )
}

export function transformToReceived(
  toAddress: EthereumAddress,
  resolved: ResolvedPermission[],
  metaPermissions: PermissionConfiguration[] = [],
): {
  directlyReceivedPermissions?: OutputResolvedPermission[]
  receivedPermissions?: OutputResolvedPermission[]
} {
  const emptyToUndefined = <T>(arr: T[]) => (arr.length === 0 ? undefined : arr)
  const zeroToUndefined = (x: number) => (x === 0 ? undefined : x)

  const ultimate = sort(
    resolved
      .filter((r) => r.path[r.path.length - 1]?.address === toAddress)
      .map((r) => ({
        permission: internalPermissionToExternal(r.permission),
        // biome-ignore lint/style/noNonNullAssertion: we path[0] exists
        target: r.path[0]!.address,
        // biome-ignore lint/style/noNonNullAssertion: we path[0] exists
        delay: zeroToUndefined(r.path[0]!.delay),
        description: r.path[1]?.description,
        via: emptyToUndefined(
          r.path.slice(1, -1).map(
            (x): ResolvedPermissionPath => ({
              address: x.address,
              delay: zeroToUndefined(x.delay),
            }),
          ),
        ),
      })),
  )

  const direct: OutputResolvedPermission[] = sort(
    metaPermissions
      .map((p) => ({
        permission: internalPermissionToExternal(p.type),
        target: p.target,
        delay: zeroToUndefined(p.delay),
        description: p.description,
        via: undefined,
      }))
      .filter((p) => !ultimate.some((m) => isEqual(m, p))),
  )

  return {
    directlyReceivedPermissions: emptyToUndefined(direct),
    receivedPermissions: emptyToUndefined(ultimate),
  }
}

function internalPermissionToExternal(permission: Permission): PermissionType {
  if (permission === 'member') {
    return 'act'
  }

  return permission
}

function sort(input: OutputResolvedPermission[]): OutputResolvedPermission[] {
  return input.sort((a, b) => {
    return JSON.stringify(a).localeCompare(JSON.stringify(b))
  })
}
