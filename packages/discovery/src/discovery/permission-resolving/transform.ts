import {
  ResolvedPermission as OutputResolvedPermission,
  PermissionType,
  ResolvedPermissionPath,
} from '@l2beat/discovery-types'
import { EthereumAddress, assert } from '@l2beat/shared-pure'
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

  return sort(
    matching.map((r) => ({
      // biome-ignore lint/style/noNonNullAssertion: we know it's fine
      permission: internalPermissionToExternal(r.path[0]!.gives!),
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

  const assignedToThisAddress = resolved.filter(
    (r) => r.path[r.path.length - 1]?.address === toAddress,
  )

  if (
    toAddress === EthereumAddress('0x847B5c174615B1B7fDF770882256e2D3E95b9D92')
  ) {
    console.dir(assignedToThisAddress, { depth: null })
  }

  const ultimate = sort(
    assignedToThisAddress.map((r) => {
      assert(r.path[0])
      assert(r.path[0]?.gives)
      return {
        permission: internalPermissionToExternal(r.path[0].gives),
        target: r.path[0].address,
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

  const direct: OutputResolvedPermission[] = sort(
    metaPermissions
      .map((p) => ({
        permission: internalPermissionToExternal(p.type),
        target: p.target,
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

function sort(input: OutputResolvedPermission[]): OutputResolvedPermission[] {
  return input.sort((a, b) => {
    return JSON.stringify(a).localeCompare(JSON.stringify(b))
  })
}
