import type { Node, State } from '../State'
import { getGraphProjection, setItemsHidden } from '../utils/graphProjection'
import { containerBoxes } from '../utils/renderGraph'
import type { NodeLocations } from '../utils/storage'
import { updateNodePositions } from '../utils/updateNodePositions'

export function hideSelected(state: State): Partial<State> {
  const nodes = setItemsHidden(state.nodes, new Set(state.selected), true)
  if (nodes === state.nodes) return {}
  return updateNodePositions(state, {
    nodes,
    selected: [],
  })
}

export function hideUnreachable(state: State): Partial<State> {
  const projection = getGraphProjection(state.nodes)
  const unreachable = new Set(
    projection.leafNodes
      .filter((node) => !node.isReachable)
      .map((node) => node.id),
  )
  const nodes = setItemsHidden(state.nodes, unreachable, true)
  return updateNodePositions(state, { nodes })
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

export function showHidden(state: State): Partial<State> {
  const projection = getGraphProjection(state.nodes)
  const nodes = setItemsHidden(state.nodes, projection.hiddenNodeIds, false)
  return updateNodePositions(state, { nodes })
}

export function clear(): Partial<State> {
  return {
    projectId: '',
    nodes: [],
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
  const footprints = containerBoxes(state.nodes)
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
