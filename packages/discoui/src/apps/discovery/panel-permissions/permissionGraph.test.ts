import { expect } from 'earl'
import type {
  ApiProjectContract,
  ApiProjectResponse,
  ApiReceivedPermission,
} from '../../../api/types'
import type { Node } from '../panel-nodes/store/State'
import {
  arrangeByRole,
  buildPermissionNodes,
  summarizeRoles,
} from './permissionGraph'

describe(buildPermissionNodes.name, () => {
  it('draws a permission from its granter through every step to the holder', () => {
    const data = project([
      entry('eth:0xBridge'),
      entry('eth:0xProxyAdmin'),
      entry('eth:0xTimelock'),
      entry('eth:0xMultisig', [
        {
          permission: 'upgrade',
          from: 'eth:0xBridge',
          role: 'admin',
          via: [{ address: 'eth:0xProxyAdmin' }, { address: 'eth:0xTimelock' }],
        },
      ]),
    ])

    const { nodes } = buildPermissionNodes(data)

    expect(edges(nodes)).toEqual([
      ['admin|eth:0xBridge', 'admin|eth:0xProxyAdmin'],
      ['admin|eth:0xProxyAdmin', 'admin|eth:0xTimelock'],
      ['admin|eth:0xTimelock', 'admin|eth:0xMultisig'],
    ])
  })

  it('draws an address once per role it takes part in', () => {
    const data = project([
      entry('eth:0xToken'),
      entry('eth:0xPortal'),
      entry('eth:0xSafe', [
        { permission: 'upgrade', from: 'eth:0xPortal', role: 'admin', via: [] },
        {
          permission: 'interact',
          from: 'eth:0xPortal',
          role: '.guardian',
          via: [],
        },
      ]),
    ])

    const { nodes, autoGroups } = buildPermissionNodes(data)

    expect(nodes.map((node) => node.id)).toEqual([
      'admin|eth:0xPortal',
      'admin|eth:0xSafe',
      '.guardian|eth:0xPortal',
      '.guardian|eth:0xSafe',
    ])
    expect(
      autoGroups.map((group) => [group.name, group.memberIds, group.opened]),
    ).toEqual([
      ['admin', ['admin|eth:0xPortal', 'admin|eth:0xSafe'], true],
      ['.guardian', ['.guardian|eth:0xPortal', '.guardian|eth:0xSafe'], true],
    ])
  })

  it('draws a hop shared by two holders once', () => {
    const viaTimelock: ApiReceivedPermission = {
      permission: 'upgrade',
      from: 'eth:0xBridge',
      role: 'admin',
      via: [{ address: 'eth:0xTimelock' }],
    }
    const data = project([
      entry('eth:0xBridge'),
      entry('eth:0xTimelock'),
      entry('eth:0xProposer', [viaTimelock]),
      entry('eth:0xCanceller', [viaTimelock]),
    ])

    const { nodes } = buildPermissionNodes(data)

    expect(edges(nodes)).toEqual([
      ['admin|eth:0xBridge', 'admin|eth:0xTimelock'],
      ['admin|eth:0xTimelock', 'admin|eth:0xProposer'],
      ['admin|eth:0xTimelock', 'admin|eth:0xCanceller'],
    ])
  })
})

describe(summarizeRoles.name, () => {
  it('puts upgrade roles first, then the busiest', () => {
    const interact = (from: string): ApiReceivedPermission => ({
      permission: 'interact',
      from,
      role: '.owner',
      via: [],
    })
    const data = project([
      entry('eth:0xMultisig', [
        interact('eth:0xA'),
        interact('eth:0xB'),
        { permission: 'upgrade', from: 'eth:0xC', role: 'admin', via: [] },
      ]),
    ])

    expect(
      summarizeRoles(data).map((x) => [x.role, x.permissionCount]),
    ).toEqual([
      ['admin', 1],
      ['.owner', 2],
    ])
  })
})

describe(arrangeByRole.name, () => {
  it('sets role frames apart so no two overlap', () => {
    const permission = (role: string): ApiReceivedPermission => ({
      permission: 'interact',
      from: 'eth:0xPortal',
      role,
      via: [],
    })
    const { nodes, autoGroups } = buildPermissionNodes(
      project([
        entry('eth:0xPortal'),
        entry('eth:0xSafe', [permission('.a'), permission('.b')]),
      ]),
    )
    const frames = autoGroups.map((group) =>
      groupNode(
        group.id,
        nodes.filter((node) => group.memberIds.includes(node.id)),
      ),
    )

    const [a, b] = arrangeByRole(frames).map(bounds) as [Bounds, Bounds]

    const apartX = a.right < b.left || b.right < a.left
    const apartY = a.bottom < b.top || b.bottom < a.top
    expect(apartX || apartY).toEqual(true)
  })
})

interface Bounds {
  left: number
  right: number
  top: number
  bottom: number
}

function bounds(group: Node): Bounds {
  return {
    left: Math.min(...group.subnodes.map((node) => node.box.x)),
    right: Math.max(
      ...group.subnodes.map((node) => node.box.x + node.box.width),
    ),
    top: Math.min(...group.subnodes.map((node) => node.box.y)),
    bottom: Math.max(
      ...group.subnodes.map((node) => node.box.y + node.box.height),
    ),
  }
}

function edges(nodes: Node[]) {
  return nodes.flatMap((node) =>
    node.fields.map((field) => [node.id, field.target]),
  )
}

function groupNode(id: string, members: Node[]): Node {
  return {
    ...(members[0] as Node),
    id,
    fields: [],
    opened: true,
    subnodes: members.map((member) => ({
      ...member,
      box: { ...member.box, height: 40 },
    })),
  }
}

function project(contracts: ApiProjectContract[]): ApiProjectResponse {
  return {
    entries: [
      {
        project: 'test',
        initialContracts: [],
        discoveredContracts: contracts,
        eoas: [],
        blockNumbers: {},
      },
    ],
  }
}

function entry(
  address: string,
  receivedPermissions: ApiReceivedPermission[] = [],
): ApiProjectContract {
  return {
    address,
    type: 'Contract',
    roles: [],
    referencedBy: [],
    receivedPermissions,
    chain: 'ethereum',
    isReachable: true,
    fields: [],
    abis: [],
  }
}
