import { unique } from '@l2beat/shared-pure'
import type { Field, Node, State } from '../State'
import { NODE_WIDTH } from '../utils/constants'
import type { StoredGroup } from '../utils/layout'
import { reconcileNodeHiddenFields } from '../utils/storage'
import { updateNodePositions } from '../utils/updateNodePositions'

export function groupSelected(state: State): Partial<State> {
  const selectedSet = new Set(state.selected)
  const selected: SelectedNode[] = []
  collectSelected(state.nodes, selectedSet, undefined, selected)
  if (selected.length < 2) {
    return {}
  }

  const phantom = createPhantomNode(selected.map((member) => member.node))

  // Nest the group inside the parent the whole selection shares; a selection
  // spanning parents (or including top-level nodes) puts it at the top level.
  const parentIds = new Set(selected.map((member) => member.parentId))
  const parentId = parentIds.size === 1 ? [...parentIds][0] : undefined
  const rebuilt = regroup(state.nodes, selectedSet, parentId, phantom)
  const nodes = parentId === undefined ? [...rebuilt, phantom] : rebuilt

  return updateNodePositions(state, { nodes, selected: [phantom.id] })
}

interface SelectedNode {
  readonly node: Node
  readonly parentId: string | undefined
}

// Members of an opened group are nested under it, so walk the whole tree and
// remember each selected node's parent to know where the new group can nest.
function collectSelected(
  nodes: readonly Node[],
  selectedSet: ReadonlySet<string>,
  parentId: string | undefined,
  into: SelectedNode[],
): void {
  for (const node of nodes) {
    if (selectedSet.has(node.id)) {
      into.push({ node, parentId })
    } else if (node.subnodes.length > 0) {
      collectSelected(node.subnodes, selectedSet, node.id, into)
    }
  }
}

// Remove the selected nodes and drop the new group into parentId's subnodes. A
// group that changed has its fields recomputed; an emptied one is dropped.
function regroup(
  nodes: readonly Node[],
  selectedSet: ReadonlySet<string>,
  parentId: string | undefined,
  phantom: Node,
): readonly Node[] {
  let changed = false
  const result: Node[] = []
  for (const node of nodes) {
    if (selectedSet.has(node.id)) {
      changed = true
      continue
    }
    let subnodes = regroup(node.subnodes, selectedSet, parentId, phantom)
    if (node.id === parentId) {
      subnodes = [...subnodes, phantom]
    }
    if (subnodes === node.subnodes) {
      result.push(node)
      continue
    }
    changed = true
    if (subnodes.length === 0) {
      continue
    }
    result.push(updateGroupMembers(node, subnodes))
  }
  return changed ? result : nodes
}

export function ungroupSelected(state: State): Partial<State> {
  const selectedSet = new Set(state.selected)
  const lifted: string[] = []
  const dissolved: string[] = []
  const nodes = ungroupTree(state.nodes, selectedSet, lifted, dissolved)
  if (dissolved.length === 0) {
    return {}
  }

  const dissolvedSet = new Set(dissolved)
  const kept = state.selected.filter((id) => !dissolvedSet.has(id))
  return updateNodePositions(state, {
    nodes,
    selected: unique([...kept, ...lifted]),
  })
}

// Dissolve every selected group wherever it sits, spilling its members into the
// parent. The absorbing parent has its fields recomputed; a top-level group
// just spills into the root list.
function ungroupTree(
  nodes: readonly Node[],
  selectedSet: ReadonlySet<string>,
  lifted: string[],
  dissolved: string[],
): readonly Node[] {
  let changed = false
  const result: Node[] = []
  for (const node of nodes) {
    const subnodes = ungroupTree(node.subnodes, selectedSet, lifted, dissolved)
    if (selectedSet.has(node.id) && node.subnodes.length > 0) {
      changed = true
      dissolved.push(node.id)
      for (const child of subnodes) {
        result.push(child)
        lifted.push(child.id)
      }
      continue
    }
    if (subnodes === node.subnodes) {
      result.push(node)
      continue
    }
    changed = true
    result.push(updateGroupMembers(node, subnodes))
  }
  return changed ? result : nodes
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

export function makeGroupNode(
  group: StoredGroup,
  members: Node[],
  settings?: Pick<Node, 'color' | 'colorSourceId' | 'hueShift'>,
): Node {
  return {
    id: group.id,
    address: '',
    isInitial: false,
    hasTemplate: false,
    addressType: 'Group',
    name: group.name,
    fields: collectOutgoingFields(members),
    hiddenFields: [],
    box: {
      x: group.box.x,
      y: group.box.y,
      width: group.box.width ?? NODE_WIDTH,
      height: group.box.height ?? NODE_WIDTH,
    },
    color: settings?.color ?? group.color,
    colorSourceId: settings?.colorSourceId,
    hueShift: settings?.hueShift ?? 0,
    data: null,
    isReachable: true,
    opened: group.opened,
    subnodes: members,
  }
}

export function collectIds(node: Node): string[] {
  return unique([node.id, ...node.subnodes.flatMap((n) => collectIds(n))])
}

export function collectOutgoingFields(members: readonly Node[]): Field[] {
  const internal = unique(members.flatMap((node) => collectIds(node)))
  const outgoing: Field[] = []
  const seenTargets = new Set<string>()
  for (const node of members) {
    for (const field of node.fields) {
      if (internal.includes(field.target) || seenTargets.has(field.target)) {
        continue
      }
      seenTargets.add(field.target)
      outgoing.push({
        ...field,
        name: `group-field:${field.target}`,
        label: node.name,
      })
    }
  }
  return outgoing
}

function updateGroupMembers(node: Node, subnodes: readonly Node[]): Node {
  const fields = collectOutgoingFields(subnodes)
  return {
    ...node,
    subnodes,
    fields,
    hiddenFields: reconcileNodeHiddenFields(fields, node.hiddenFields),
  }
}
