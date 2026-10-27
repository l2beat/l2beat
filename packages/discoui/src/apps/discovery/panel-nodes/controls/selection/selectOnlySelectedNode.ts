import type { Node, State } from '../../store/State'

export function selectOnlySelectedNode(state: State): Node | undefined {
  if (state.selected.length !== 1) {
    return undefined
  }
  return state.nodes.find((node) => node.id === state.selected[0])
}
