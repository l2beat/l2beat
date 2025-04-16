import { assert, type EthereumAddress } from '@l2beat/shared-pure'
import { isEqual } from 'lodash'
import type {
  Permission,
  PermissionConfiguration,
} from '../config/StructureConfig'
import type {
  ReceivedPermission,
  ResolvedPermissionPath,
} from '../output/types'
import type { ResolvedPermission } from './resolvePermissions'

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

  const ultimate = sortReceivedPermission(
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

  const direct: ReceivedPermission[] = sortReceivedPermission(
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

function internalPermissionToExternal(permission: Permission): Permission {
  if (permission === 'member') {
    return 'act'
  }

  return permission
}

function sortReceivedPermission<T extends ReceivedPermission>(input: T[]): T[] {
  return input.sort((a, b) => {
    return JSON.stringify(a).localeCompare(JSON.stringify(b))
  })
}

function zeroToUndefined(x: number) {
  return x === 0 ? undefined : x
}
