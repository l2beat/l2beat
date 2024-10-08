import type { SimpleNode } from '../../api/SimpleNode'
import { White } from '../../utils/color'
import type { Connection, Node, State } from '../State'
import { NODE_SPACING, NODE_WIDTH } from '../utils/constants'
import { persistNodeState, recallNodeState } from '../utils/localStore'
import { NodeColors, type NodeLocations } from '../utils/storageParsing'
import { updateNodePositions } from '../utils/updateNodePositions'

export function updateNodes(state: State, nodes: SimpleNode[]): Partial<State> {
  const oldNodes = new Map(
    state.nodes.map((node) => [node.simpleNode.id, node]),
  )
  const newIds = new Set(nodes.map((node) => node.id))

  const retainedNodes = state.nodes.filter((node) =>
    newIds.has(node.simpleNode.id),
  )

  const startX =
    retainedNodes.length === 0
      ? 0
      : Math.max(...retainedNodes.map((node) => node.box.x + node.box.width)) +
        NODE_SPACING

  const updatedNodes = nodes
    .filter((node) => oldNodes.has(node.id))
    .map((node) => {
      const oldNode = oldNodes.get(node.id)
      return simpleNodeToNode(
        node,
        oldNode?.box.x ?? 0,
        oldNode?.box.y ?? 0,
        oldNode?.box.width ?? NODE_WIDTH,
      )
    })

  const addedNodes = nodes
    .filter((node) => !oldNodes.has(node.id))
    .map((node, i) => {
      const box = getNodeBoxFromStorage(state.projectId, node)
      const x = box?.x ?? startX + (NODE_WIDTH + NODE_SPACING) * i
      const y = box?.y ?? 0
      const width = box?.width ?? NODE_WIDTH
      return simpleNodeToNode(node, x, y, width)
    })

  clearTimeout(state.saveLayoutStartTime)
  const result = updateNodePositions({
    ...state,
    nodes: updatedNodes.concat(addedNodes),
    saveLayoutStartTime: setTimeout(() => {
      persistNodeState(state)
    }, 250),
  })

  return result
}

export function updateNodeLocations(
  state: State,
  locations: NodeLocations,
): Partial<State> {
  const movedNodes = state.nodes.map((n) => ({
    ...n,
    box: {
      ...n.box,
      ...locations[n.simpleNode.id],
    },
  }))

  return updateNodePositions({
    ...state,
    nodes: movedNodes,
  })
}

export function updateNodeColors(
  state: State,
  colors?: NodeColors,
): Partial<State> {
  const simpleNodes: SimpleNode[] = state.nodes.map((n) => ({
    ...n.simpleNode,
    color: colors?.[n.simpleNode.id] ?? White,
  }))

  return updateNodes(state, simpleNodes)
}

function getNodeBoxFromStorage(projectId: string, node: SimpleNode) {
  const state = recallNodeState(projectId)
  return state?.locations[node.id]
}

function simpleNodeToNode(
  node: SimpleNode,
  x: number,
  y: number,
  width: number,
): Node {
  return {
    simpleNode: node,
    // height will be updated by updateNodePositions
    box: { x, y, width: width, height: 0 },
    fields: node.fields.map((field) => ({
      name: field.name,
      connection: toConnection(field.connection),
    })),
  }
}

export function nodeToSimpleNode(node: Node): SimpleNode {
  return node.simpleNode
}

function toConnection(nodeId: string | undefined): Connection | undefined {
  if (nodeId === undefined) {
    return
  }
  return {
    nodeId,
    highlighted: false,
    // fields below will be updated by updateNodePositions
    from: { direction: 'left', x: 0, y: 0 },
    to: { direction: 'left', x: 0, y: 0 },
  }
}
