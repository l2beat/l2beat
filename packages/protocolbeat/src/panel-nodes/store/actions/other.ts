import type { State } from '../State'
import type { NodeLocations } from '../utils/storage'
import { updateNodePositions } from '../utils/updateNodePositions'

export function hideSelected(state: State): Partial<State> {
  return {
    hidden: [...new Set([...state.hidden, ...state.selected])],
    selected: [],
  }
}

export function hideUnknowns(state: State): Partial<State> {
  const unknownNodes = state.nodes.filter(
    (node) => node.addressType === 'Unknown',
  )

  return {
    hidden: [
      ...new Set([...state.hidden, ...unknownNodes.map((node) => node.id)]),
    ],
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
    hidden: [],
    selected: [],
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

  return updateNodePositions({
    ...state,
    nodes: movedNodes,
  })
}
