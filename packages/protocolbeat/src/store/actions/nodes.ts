import { merge } from '../../api/merge'
import { OklchColor } from '../../utils/color'
import type { Node, State } from '../State'
import { NODE_SPACING, NODE_WIDTH } from '../utils/constants'
import { recallNodeState } from '../utils/localStore'
import { type NodeLocations } from '../utils/storageParsing'
import { updateNodePositions } from '../utils/updateNodePositions'

export function loadNodes(
  state: State,
  projectId: string,
  nodes: Node[],
): Partial<State> {
  nodes = merge(state.nodes, nodes)
  const oldNodes = new Map(state.nodes.map((node) => [node.id, node]))
  const newIds = new Set(nodes.map((node) => node.id))

  const retainedNodes = state.nodes.filter((node) => newIds.has(node.id))

  const startX =
    retainedNodes.length === 0
      ? 0
      : Math.max(...retainedNodes.map((node) => node.box.x + node.box.width)) +
        NODE_SPACING

  const updatedNodes = nodes
    .filter((node) => oldNodes.has(node.id))
    .map((node) => {
      const oldNode = oldNodes.get(node.id)
      return oldNode ? { ...node, box: oldNode.box } : node
    })

  const addedNodes = nodes
    .filter((node) => !oldNodes.has(node.id))
    .map((node, i) => {
      const box = getNodeBoxFromStorage(projectId, node)
      const x = box?.x ?? startX + (NODE_WIDTH + NODE_SPACING) * i
      const y = box?.y ?? 0
      const width = box?.width ?? NODE_WIDTH
      // height will be updated by updatePositions
      return { ...node, box: { x, y, width, height: 0 } }
    })

  return updateNodePositions({
    ...state,
    projectId,
    nodes: updatedNodes.concat(addedNodes),
  })
}

export function hideSelected(state: State): Partial<State> {
  return {
    hidden: [...new Set([...state.hidden, ...state.selected])],
    selected: [],
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

export function colorSelected(state: State, color: OklchColor): Partial<State> {
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

function getNodeBoxFromStorage(projectId: string, node: Node) {
  const state = recallNodeState(projectId)
  return state?.locations[node.id]
}
