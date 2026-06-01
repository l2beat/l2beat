import type { State } from '../State'
import { entrypointGroupNodeId } from '../utils/entrypointGroups'
import type { NodeLocations } from '../utils/storage'
import { updateNodePositions } from '../utils/updateNodePositions'

export function toggleEntrypointGroup(
  state: State,
  groupId: string,
): Partial<State> {
  const collapsed = new Set(state.collapsedEntrypointGroups)
  const willCollapse = !collapsed.has(groupId)
  if (willCollapse) {
    collapsed.add(groupId)
  } else {
    collapsed.delete(groupId)
  }

  // When expanding, the synthetic group node disappears. If it was the
  // selected node, the selection would be stranded on a node that no longer
  // exists (visually a deselect). Remap it onto a real member of the group so
  // the selection survives the expand.
  const selected = willCollapse
    ? state.selected
    : remapSelectionOffGroupNode(state, [groupId])

  return { collapsedEntrypointGroups: [...collapsed], selected }
}

/**
 * Sets the collapsed state for several entrypoint groups at once. Used to
 * collapse/expand a whole module (all of its entrypoint clusters) from a single
 * control, instead of toggling each declared entrypoint individually.
 */
export function setEntrypointGroupsCollapsed(
  state: State,
  groupIds: readonly string[],
  collapsed: boolean,
): Partial<State> {
  const next = new Set(state.collapsedEntrypointGroups)
  for (const groupId of groupIds) {
    if (collapsed) {
      next.add(groupId)
    } else {
      next.delete(groupId)
    }
  }
  const selected = collapsed
    ? state.selected
    : remapSelectionOffGroupNode(state, groupIds)
  return { collapsedEntrypointGroups: [...next], selected }
}

/**
 * When a group is expanded its synthetic node disappears; move any selection
 * that pointed at it onto a real member so the selection isn't lost.
 */
function remapSelectionOffGroupNode(
  state: State,
  groupIds: readonly string[],
): readonly string[] {
  let selected: readonly string[] = state.selected
  for (const groupId of groupIds) {
    const groupNodeId = entrypointGroupNodeId(groupId)
    if (!selected.includes(groupNodeId)) {
      continue
    }
    const group = state.entrypointGroups.find((entry) => entry.id === groupId)
    const member = group?.bridgeAddresses[0] ?? group?.memberAddresses[0]
    selected = selected.flatMap((id) =>
      id === groupNodeId ? (member ? [member] : []) : [id],
    )
  }
  return selected
}

export function setEntrypointGroups(
  state: State,
  entrypointGroups: State['entrypointGroups'],
): Partial<State> {
  const validIds = new Set(entrypointGroups.map((group) => group.id))
  return {
    entrypointGroups,
    collapsedEntrypointGroups: state.collapsedEntrypointGroups.filter((id) =>
      validIds.has(id),
    ),
  }
}

export function hideSelected(state: State): Partial<State> {
  return {
    hidden: [...new Set([...state.hidden, ...state.selected])],
    selected: [],
  }
}

export function hideUnreachable(state: State): Partial<State> {
  const unreachableNodes = state.nodes.filter((node) => !node.isReachable)

  return {
    hidden: [
      ...new Set([...state.hidden, ...unreachableNodes.map((node) => node.id)]),
    ],
  }
}

export function showUnreachable(state: State): Partial<State> {
  const unreachableIds = new Set(
    state.nodes.filter((node) => !node.isReachable).map((node) => node.id),
  )

  return {
    hidden: state.hidden.filter((id) => !unreachableIds.has(id)),
  }
}

export function setPreferences(
  state: State,
  preferences: Partial<State['userPreferences']>,
): Partial<State> {
  return {
    userPreferences: {
      ...state.userPreferences,
      ...preferences,
    },
  }
}

export function showHidden(): Partial<State> {
  return { hidden: [] }
}

export function clear(): Partial<State> {
  return {
    projectId: '',
    nodes: [],
    entrypointGroups: [],
    collapsedEntrypointGroups: [],
    hidden: [],
    selected: [],
    loaded: false,
  }
}

export function colorSelected(state: State, color: number): Partial<State> {
  const nodes = state.nodes.map((node) =>
    state.selected.includes(node.id) ? { ...node, color } : node,
  )
  return { nodes }
}

export function layout(state: State, locations: NodeLocations): Partial<State> {
  const movedNodes = state.nodes.map((n) => ({
    ...n,
    box: {
      ...n.box,
      ...locations[n.id],
    },
  }))

  return updateNodePositions(state, { nodes: movedNodes })
}
