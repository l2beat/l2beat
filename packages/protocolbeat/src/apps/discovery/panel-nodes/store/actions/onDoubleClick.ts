import type { Node, State } from '../State'
import { boxContains } from '../utils/containment'
import { toViewCoordinates } from '../utils/coordinates'
import { buildRenderGraph, headerAt } from '../utils/renderGraph'
import { reverseIter } from '../utils/reverseIter'
import { updateNodePositions } from '../utils/updateNodePositions'

export function onDoubleClick(
  state: State,
  event: MouseEvent,
  container: HTMLElement,
): Partial<State> {
  const { x, y } = toViewCoordinates(event, container, state.transform)
  const graph = buildRenderGraph(state.nodes)

  // Closing only happens on the open group's header, so members stay
  // freely selectable. Check it before nodes since the header sits above them.
  const header = headerAt(graph.containers, x, y)
  if (header !== undefined) {
    return updateNodePositions(state, {
      nodes: toggleOpened(state.nodes, header.id),
    })
  }

  // Topmost rendered node wins: double-clicking a (closed) group opens it,
  // including a group nested inside an already-open one. Leaf members do
  // nothing.
  for (const node of reverseIter(graph.nodes)) {
    if (!boxContains(node.box, x, y)) {
      continue
    }
    if (node.subnodes.length > 0) {
      return updateNodePositions(state, {
        nodes: toggleOpened(state.nodes, node.id),
      })
    }
    break
  }

  return {}
}

function toggleOpened(nodes: readonly Node[], id: string): Node[] {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, opened: !node.opened }
    }
    if (node.subnodes.length > 0) {
      return { ...node, subnodes: toggleOpened(node.subnodes, id) }
    }
    return node
  })
}
