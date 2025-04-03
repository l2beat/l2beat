import type { Node, State } from '../State'
import { updateNodePositions } from '../utils/updateNodePositions'

export function setNodes(state: State, nodes: Node[]) {
  return updateNodePositions({
    ...state,
    nodes,
  })
}
