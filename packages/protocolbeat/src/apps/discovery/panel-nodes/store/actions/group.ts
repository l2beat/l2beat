import { unique } from '@l2beat/shared-pure'
import type { Field, Node, State } from '../State'
import { NODE_WIDTH } from '../utils/constants'
import type { StoredGroup } from '../utils/layout'
import { updateNodePositions } from '../utils/updateNodePositions'

export function groupSelected(state: State): Partial<State> {
  const selectedSet = new Set(state.selected)
  const subnodes = state.nodes.filter((node) => selectedSet.has(node.id))
  if (subnodes.length === 0) {
    return {}
  }

  const phantom = createPhantomNode(subnodes)
  const remaining = state.nodes.filter((node) => !selectedSet.has(node.id))

  return updateNodePositions(state, {
    nodes: [...remaining, phantom],
    selected: [phantom.id],
  })
}

export function ungroupSelected(state: State): Partial<State> {
  const selectedSet = new Set(state.selected)
  const phantoms = state.nodes.filter(
    (node) => selectedSet.has(node.id) && node.subnodes.length > 0,
  )
  if (phantoms.length === 0) {
    return {}
  }

  const phantomIds = new Set(phantoms.map((node) => node.id))
  const remaining = state.nodes.filter((node) => !phantomIds.has(node.id))
  const lifted = phantoms.flatMap((node) => node.subnodes)
  const keptSelected = state.selected.filter((id) => !phantomIds.has(id))

  return updateNodePositions(state, {
    nodes: [...remaining, ...lifted],
    selected: [...keptSelected, ...lifted.map((node) => node.id)],
  })
}

export function renameGroup(
  state: State,
  id: string,
  name: string,
): Partial<State> {
  const nodes = state.nodes.map((node) =>
    node.id === id && node.subnodes.length > 0 ? { ...node, name } : node,
  )
  return { nodes }
}

function createPhantomNode(members: Node[]): Node {
  const anchor = members[0]?.box
  return makeGroupNode(
    {
      id: `group:${crypto.randomUUID()}`,
      name: 'Group',
      opened: false,
      color: 0,
      box: {
        x: anchor?.x ?? 0,
        y: anchor?.y ?? 0,
        width: NODE_WIDTH,
        height: NODE_WIDTH,
      },
      members: [],
    },
    members,
  )
}

export function makeGroupNode(group: StoredGroup, members: Node[]): Node {
  const internal = unique(members.flatMap((n) => collectIds(n)))
  return {
    id: group.id,
    address: '',
    isInitial: false,
    hasTemplate: false,
    addressType: 'Group',
    name: group.name,
    fields: collectOutgoingFields(members, internal),
    hiddenFields: [],
    box: {
      x: group.box.x,
      y: group.box.y,
      width: group.box.width ?? NODE_WIDTH,
      height: group.box.height ?? NODE_WIDTH,
    },
    color: group.color,
    hueShift: 0,
    data: null,
    isReachable: true,
    opened: group.opened,
    subnodes: members,
  }
}

export function collectIds(node: Node): string[] {
  return unique([node.id, ...node.subnodes.flatMap((n) => collectIds(n))])
}

export function collectOutgoingFields(
  subnodes: Node[],
  internal: string[],
): Field[] {
  const outgoing: Field[] = []
  const seenTargets = new Set<string>()
  for (const node of subnodes) {
    for (const field of node.fields) {
      if (internal.includes(field.target) || seenTargets.has(field.target)) {
        continue
      }
      seenTargets.add(field.target)
      outgoing.push({ ...field, name: node.name })
    }
  }
  return outgoing
}
