import type { State } from '../State'
import type { NodeLocations } from '../utils/storage'
import { updateNodePositions } from '../utils/updateNodePositions'

export function toggleEntrypointGroup(
  state: State,
  groupId: string,
): Partial<State> {
  const collapsed = new Set(state.collapsedEntrypointGroups)
  if (collapsed.has(groupId)) {
    collapsed.delete(groupId)
  } else {
    collapsed.add(groupId)
  }
  return { collapsedEntrypointGroups: [...collapsed] }
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
