import type { ReceivedPermission } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  formatDelay,
  inheritedPaths,
  type PermissionHolder,
  permissionPaths,
  signerTree,
} from './permissionPaths'

const BRIDGE = ChainSpecificAddress.random()
const PROXY_ADMIN = ChainSpecificAddress.random()
const EXECUTOR = ChainSpecificAddress.random()
const COUNCIL = ChainSpecificAddress.random()
const TIMELOCK = ChainSpecificAddress.random()
const OTHER = ChainSpecificAddress.random()

describe(permissionPaths.name, () => {
  it('reads each path holder first and sums the delays along it', () => {
    const paths = permissionPaths(
      [
        holder(TIMELOCK, {
          receivedPermissions: [
            {
              permission: 'upgrade',
              from: BRIDGE,
              delay: 100,
              via: [{ address: PROXY_ADMIN }, { address: EXECUTOR, delay: 20 }],
            },
          ],
        }),
        holder(COUNCIL, {
          receivedPermissions: [
            {
              permission: 'upgrade',
              from: BRIDGE,
              via: [{ address: PROXY_ADMIN }, { address: EXECUTOR }],
            },
            { permission: 'upgrade', from: OTHER },
          ],
        }),
      ],
      BRIDGE,
    )
    expect(paths.map((p) => [p.path, p.delaySeconds])).toEqual([
      [[COUNCIL, EXECUTOR, PROXY_ADMIN, BRIDGE], 0],
      [[TIMELOCK, EXECUTOR, PROXY_ADMIN, BRIDGE], 120],
    ])
  })

  it('merges a route granted for several functions into one path', () => {
    const grant = (description: string): ReceivedPermission => ({
      permission: 'interact',
      from: BRIDGE,
      description,
      via: [{ address: EXECUTOR }],
    })
    const paths = permissionPaths(
      [
        holder(COUNCIL, {
          receivedPermissions: [
            grant('pause'),
            grant('unpause'),
            grant('pause'),
          ],
        }),
      ],
      BRIDGE,
    )
    expect(paths.length).toEqual(1)
    expect(paths[0]?.descriptions).toEqual(['pause', 'unpause'])
  })
})

describe(inheritedPaths.name, () => {
  it('answers for the nearest controller and appends the chain to each path', () => {
    const byAddress = index([
      holder(BRIDGE, { controllers: [PROXY_ADMIN] }),
      holder(PROXY_ADMIN, { controllers: [EXECUTOR] }),
      holder(EXECUTOR, {}),
      holder(COUNCIL, {
        receivedPermissions: [{ permission: 'interact', from: EXECUTOR }],
      }),
    ])
    const inherited = inheritedPaths(BRIDGE, byAddress, (a) =>
      permissionPaths([...byAddress.values()], a),
    )
    expect(inherited?.controller).toEqual(EXECUTOR)
    expect(inherited?.chain).toEqual([EXECUTOR, PROXY_ADMIN, BRIDGE])
    expect(inherited?.paths.map((p) => p.path)).toEqual([
      [COUNCIL, EXECUTOR, PROXY_ADMIN, BRIDGE],
    ])
  })

  it('gives up on a controller cycle', () => {
    const byAddress = index([
      holder(BRIDGE, { controllers: [PROXY_ADMIN] }),
      holder(PROXY_ADMIN, { controllers: [BRIDGE] }),
    ])
    expect(
      inheritedPaths(BRIDGE, byAddress, (a) =>
        permissionPaths([...byAddress.values()], a),
      ),
    ).toEqual(undefined)
  })
})

describe(signerTree.name, () => {
  it('nests multisig members and counts EOAs', () => {
    const eoas = [ChainSpecificAddress.random(), ChainSpecificAddress.random()]
    const byAddress = index([
      holder(COUNCIL, {
        name: 'Owner',
        signers: {
          threshold: 2,
          members: [TIMELOCK, eoas[0] as ChainSpecificAddress],
        },
      }),
      holder(TIMELOCK, {
        name: 'Council',
        signers: { threshold: 1, members: eoas },
      }),
      ...eoas.map((eoa) => holder(eoa, { isEOA: true })),
    ])
    expect(signerTree(COUNCIL, byAddress)).toEqual([
      'Owner: 2 of 2, 1 EOAs',
      '  Council: 1 of 2, 2 EOAs',
    ])
  })
})

describe(formatDelay.name, () => {
  it('uses the largest unit that is at least one', () => {
    expect(formatDelay(0)).toEqual('no delay')
    expect(formatDelay(45)).toEqual('45s')
    expect(formatDelay(5_400)).toEqual('1.5h')
    expect(formatDelay(1_503_616)).toEqual('17.4d')
  })
})

function holder(
  address: ChainSpecificAddress,
  fields: Partial<PermissionHolder>,
): PermissionHolder {
  return { address, name: undefined, isEOA: false, controllers: [], ...fields }
}

function index(holders: PermissionHolder[]) {
  return new Map(holders.map((h) => [h.address, h]))
}
