import type { Node, State } from '../State'

export function setNodes(_state: State, nodes: Node[]) {
  return {
    nodes,
  }
}
