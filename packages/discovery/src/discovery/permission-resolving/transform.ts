import type {
  IssuedPermission,
  PermissionType,
  ReceivedPermission,
  ResolvedPermissionPath,
} from '@l2beat/discovery-types'
import { assert, type EthereumAddress } from '@l2beat/shared-pure'
import { isEqual } from 'lodash'
import type {
  Permission,
  PermissionConfiguration,
} from '../config/RawDiscoveryConfig'
import type { ResolvedPermission } from './resolvePermissions'

export function transformToIssued(
  forAddress: EthereumAddress,
  resolved: ResolvedPermission[],
): IssuedPermission[] | undefined {
  const matching = resolved.filter((r) => r.path[0]?.address === forAddress)
  if (matching.length === 0) {
    return undefined
  }

  return sort(
    matching.map((r) => {
      const last = r.path[r.path.length - 1]
      assert(r.path[0])
      assert(r.path[0]?.gives)
      assert(last)
      return {
        permission: internalPermissionToExternal(r.path[0].gives),
        to: last.address,
        delay: zeroToUndefined(r.path[0].delay),
        description: r.path[0]?.description,
        condition: r.path[0]?.condition,
        via: r.path
          .slice(1, -1)
          .reverse()
          .map(
            (x): ResolvedPermissionPath => ({
              address: x.address,
              delay: zeroToUndefined(x.delay),
              condition: x.condition,
            }),
          ),
      }
    }),
  )
}

export function transformToReceived(
  toAddress: EthereumAddress,
  resolved: ResolvedPermission[],
  metaPermissions: PermissionConfiguration[] = [],
): {
  directlyReceivedPermissions?: ReceivedPermission[]
  receivedPermissions?: ReceivedPermission[]
} {
  const emptyToUndefined = <T>(arr: T[]) => (arr.length === 0 ? undefined : arr)

  const assignedToThisAddress = resolved.filter(
    (r) => r.path[r.path.length - 1]?.address === toAddress,
  )

  const ultimate = sort(
    assignedToThisAddress.map((r) => {
      assert(r.path[0])
      assert(r.path[0]?.gives)
      return {
        permission: internalPermissionToExternal(r.path[0].gives),
        from: r.path[0].address,
        delay: zeroToUndefined(r.path[0].delay),
        description: r.path[0]?.description,
        condition: r.path[0]?.condition,
        via: emptyToUndefined(
          r.path.slice(1, -1).map(
            (x): ResolvedPermissionPath => ({
              address: x.address,
              delay: zeroToUndefined(x.delay),
              condition: x.condition,
            }),
          ),
        ),
      }
    }),
  )

  const direct: ReceivedPermission[] = sort(
    metaPermissions
      .map((p) => ({
        permission: internalPermissionToExternal(p.type),
        from: p.target,
        delay: zeroToUndefined(p.delay),
        description: p.description,
        condition: p.condition,
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

function sort<T extends ReceivedPermission | IssuedPermission>(
  input: T[],
): T[] {
  return input.sort((a, b) => {
    return JSON.stringify(a).localeCompare(JSON.stringify(b))
  })
}

function zeroToUndefined(x: number) {
  return x === 0 ? undefined : x
}
