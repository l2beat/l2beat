import type {
  ApiAddressEntry,
  ApiProjectResponse,
  ApiReceivedPermission,
} from '../../../api/types'
import type { BuiltNodes } from '../panel-nodes/NodesPanel'
import type { AutoGroup } from '../panel-nodes/store/actions/loadNodes'
import type { Field, Node } from '../panel-nodes/store/State'
import type { GraphEdge } from '../panel-nodes/store/utils/graphProjection'
import { makeNode } from '../panel-nodes/store/utils/makeNode'
import { toCopyId } from '../panel-nodes/store/utils/nodeAddress'
import { stackAutoLayout } from '../panel-nodes/store/utils/stackLayout'
import { getColor } from '../panel-nodes/view/colors/colors'

// Indices into the node palette: pink, green, blue, orange, teal, yellow,
// cyan, purple, red.
const ROLE_COLORS = [9, 5, 7, 2, 4, 3, 6, 8, 1]
const ROLE_GROUP_PREFIX = 'role:'

const FRAME_PADDING = 24
const FRAME_HEADER_HEIGHT = 64
const FRAME_GAP = 160

export interface RoleSummary {
  readonly role: string
  readonly groupId: string
  readonly color: number
  readonly permissionCount: number
}

// Upgrade roles first, then the roles most permissions go through, so the
// strongest colors land on what matters most.
export function summarizeRoles(data: ApiProjectResponse): RoleSummary[] {
  const counts = new Map<string, number>()
  const upgradeRoles = new Set<string>()
  for (const { permission } of receivedPermissions(data)) {
    const role = roleOf(permission)
    counts.set(role, (counts.get(role) ?? 0) + 1)
    if (permission.permission === 'upgrade') {
      upgradeRoles.add(role)
    }
  }
  return [...counts.entries()]
    .sort(
      ([a, aCount], [b, bCount]) =>
        Number(upgradeRoles.has(b)) - Number(upgradeRoles.has(a)) ||
        bCount - aCount ||
        a.localeCompare(b),
    )
    .map(([role, permissionCount], i) => ({
      role,
      groupId: `${ROLE_GROUP_PREFIX}${role}`,
      permissionCount,
      color: ROLE_COLORS[i % ROLE_COLORS.length] as number,
    }))
}

// Every role is its own graph: an address taking part in three roles is drawn
// three times, once inside each role's frame, from granter through every step
// to the holder.
export function buildPermissionNodes(data: ApiProjectResponse): BuiltNodes {
  const entries = new Map<string, ApiAddressEntry>()
  const initial = new Set<string>()
  for (const chain of data.entries) {
    for (const entry of chain.initialContracts) {
      initial.add(entry.address)
    }
    for (const entry of [
      ...chain.initialContracts,
      ...chain.discoveredContracts,
      ...chain.eoas,
    ]) {
      entries.set(entry.address, entry)
    }
  }

  const roles = summarizeRoles(data)
  const roleByName = new Map(roles.map((role) => [role.role, role]))
  const fieldsByCopy = new Map<string, Field[]>()
  const membersByRole = new Map<string, Set<string>>()
  for (const { holder, permission } of receivedPermissions(data)) {
    const role = roleByName.get(roleOf(permission)) as RoleSummary
    const path = [
      permission.from,
      ...permission.via.map((step) => step.address),
      holder,
    ].filter((address) => entries.has(address))
    const members = membersByRole.get(role.role) ?? new Set()
    for (const address of path) {
      members.add(address)
    }
    membersByRole.set(role.role, members)
    for (let i = 0; i + 1 < path.length; i++) {
      const source = toCopyId(role.role, path[i] as string)
      const target = toCopyId(role.role, path[i + 1] as string)
      const fields = fieldsByCopy.get(source) ?? []
      const name = `${permission.permission}.${path[i + 1]}`
      if (!fields.some((field) => field.name === name)) {
        fields.push(toField(name, target, role, permission.permission))
      }
      fieldsByCopy.set(source, fields)
    }
  }

  const nodes: Node[] = []
  const autoGroups: AutoGroup[] = []
  for (const role of roles) {
    const memberIds: string[] = []
    for (const address of membersByRole.get(role.role) ?? []) {
      const id = toCopyId(role.role, address)
      const node = makeNode(entries.get(address) as ApiAddressEntry, {
        isInitial: initial.has(address),
        hueShift: 0,
        fields: fieldsByCopy.get(id) ?? [],
        hiddenFields: [],
      })
      nodes.push({ ...node, id, color: role.color })
      memberIds.push(id)
    }
    autoGroups.push({
      id: role.groupId,
      name: role.role,
      memberIds,
      color: role.color,
      opened: true,
    })
  }
  return { nodes, autoGroups, arrange: arrangeByRole }
}

// Lays out each role's frame on its own, then sets the frames in rows like
// tiles, biggest roles first.
export function arrangeByRole(nodes: readonly Node[]): Node[] {
  const frames = nodes
    .filter(
      (node) =>
        node.id.startsWith(ROLE_GROUP_PREFIX) && node.subnodes.length > 0,
    )
    .map((group) => layoutFrame(group))
  const rowWidth = Math.max(
    ...frames.map((frame) => frame.width),
    Math.sqrt(
      frames.reduce((total, frame) => total + frame.width * frame.height, 0),
    ) * 1.6,
  )

  const placed = new Map<string, Node>()
  let x = 0
  let y = 0
  let rowHeight = 0
  for (const frame of frames) {
    if (x > 0 && x + frame.width > rowWidth) {
      x = 0
      y += rowHeight + FRAME_GAP
      rowHeight = 0
    }
    placed.set(frame.group.id, frame.placeAt(x, y))
    x += frame.width + FRAME_GAP
    rowHeight = Math.max(rowHeight, frame.height)
  }
  return nodes.map((node) => placed.get(node.id) ?? node)
}

function layoutFrame(group: Node) {
  const members = group.subnodes
  const ids = new Set(members.map((member) => member.id))
  const edges: GraphEdge[] = members.flatMap((member) =>
    member.fields
      .filter((field) => ids.has(field.target))
      .map((field) => ({
        source: member.id,
        target: field.target,
        fieldName: field.name,
      })),
  )
  const locations = stackAutoLayout(members, true, edges)
  const at = (member: Node) =>
    locations[member.id] ?? { x: member.box.x, y: member.box.y }
  const minX = Math.min(...members.map((member) => at(member).x))
  const minY = Math.min(...members.map((member) => at(member).y))
  const maxX = Math.max(
    ...members.map((member) => at(member).x + member.box.width),
  )
  const maxY = Math.max(
    ...members.map((member) => at(member).y + member.box.height),
  )
  return {
    group,
    width: maxX - minX + FRAME_PADDING * 2,
    height: maxY - minY + FRAME_PADDING * 2 + FRAME_HEADER_HEIGHT,
    placeAt(x: number, y: number): Node {
      const left = x + FRAME_PADDING - minX
      const top = y + FRAME_HEADER_HEIGHT + FRAME_PADDING - minY
      return {
        ...group,
        subnodes: members.map((member) => ({
          ...member,
          box: {
            ...member.box,
            x: at(member).x + left,
            y: at(member).y + top,
          },
        })),
      }
    },
  }
}

function* receivedPermissions(
  data: ApiProjectResponse,
): Generator<{ holder: string; permission: ApiReceivedPermission }> {
  for (const chain of data.entries) {
    for (const entry of [
      ...chain.initialContracts,
      ...chain.discoveredContracts,
      ...chain.eoas,
    ]) {
      for (const permission of entry.receivedPermissions) {
        yield { holder: entry.address, permission }
      }
    }
  }
}

function roleOf(permission: ApiReceivedPermission): string {
  return permission.role ?? permission.permission
}

function toField(
  name: string,
  target: string,
  role: RoleSummary,
  kind: string,
): Field {
  return {
    name,
    target,
    permission: {
      role: role.role,
      kind,
      color: getColor({ id: target, color: role.color, hueShift: 0 }).color,
    },
    box: { x: 0, y: 0, width: 0, height: 0 },
    connection: {
      from: { direction: 'right', x: 0, y: 0 },
      to: { direction: 'left', x: 0, y: 0 },
    },
  }
}
