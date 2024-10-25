import { merge } from '../../api/merge'
import type { Node, State } from '../State'
import { NODE_SPACING, NODE_WIDTH } from '../utils/constants'
import { recallNodeState } from '../utils/localStore'
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

function getNodeBoxFromStorage(projectId: string, node: Node) {
  const state = recallNodeState(projectId)
  return state?.locations[node.id]
}
