import type { Field, Node, State } from '../State'
import { NODE_WIDTH } from '../utils/constants'
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

export function renameSelectedGroup(
  state: State,
  name: string,
): Partial<State> {
  if (state.selected.length !== 1) {
    return {}
  }
  const id = state.selected[0]
  const nodes = state.nodes.map((node) =>
    node.id === id && node.subnodes.length > 0 ? { ...node, name } : node,
  )
  return { nodes }
}

function createPhantomNode(subnodes: Node[]): Node {
  const anchor = subnodes[0]?.box
  const internal = new Set<string>()
  for (const node of subnodes) {
    collectIds(node, internal)
  }
  return {
    id: `group:${crypto.randomUUID()}`,
    address: '',
    isInitial: false,
    hasTemplate: false,
    addressType: 'Group',
    name: 'Group',
    fields: collectOutgoingFields(subnodes, internal),
    hiddenFields: [],
    box: {
      x: anchor?.x ?? 0,
      y: anchor?.y ?? 0,
      width: NODE_WIDTH,
      height: NODE_WIDTH,
    },
    color: 0,
    hueShift: 0,
    data: null,
    isReachable: true,
    opened: false,
    subnodes,
  }
}

function collectIds(node: Node, into: Set<string>): void {
  into.add(node.id)
  for (const subnode of node.subnodes) {
    collectIds(subnode, into)
  }
}

function collectOutgoingFields(
  subnodes: Node[],
  internal: Set<string>,
): Field[] {
  const outgoing: Field[] = []
  const seen = new Set<string>()
  for (const node of subnodes) {
    for (const field of node.fields) {
      if (internal.has(field.target) || seen.has(field.target)) {
        continue
      }
      seen.add(field.target)
      outgoing.push({ ...field, name: node.name })
    }
  }
  return outgoing
}
