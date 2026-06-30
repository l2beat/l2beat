import type { Node, State } from '../State'
import { containerBoxes } from '../utils/renderGraph'
import type { NodeLocations } from '../utils/storage'
import { updateNodePositions } from '../utils/updateNodePositions'

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
  // For an open group the location targets its container footprint, so we
  // measure the delta from there and move the whole subtree as one unit.
  const footprints = containerBoxes(state.nodes, state.hidden)
  const movedNodes = state.nodes.map((node) => {
    const location = locations[node.id]
    if (location === undefined) {
      return node
    }
    const origin = footprints.get(node.id) ?? node.box
    return translateNode(node, location.x - origin.x, location.y - origin.y)
  })

  return updateNodePositions(state, { nodes: movedNodes })
}

function translateNode(node: Node, dx: number, dy: number): Node {
  if (dx === 0 && dy === 0) {
    return node
  }
  return {
    ...node,
    box: { ...node.box, x: node.box.x + dx, y: node.box.y + dy },
    subnodes: node.subnodes.map((subnode) => translateNode(subnode, dx, dy)),
  }
}
