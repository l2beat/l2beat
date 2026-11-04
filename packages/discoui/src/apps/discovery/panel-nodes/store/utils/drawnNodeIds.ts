import type { Node } from '../State'
import { expandedNodes } from './renderGraph'
import { topLevelByDescendant } from './subnodes'

// A member of an opened group is drawn on its own, a closed group stands in
// for its members, and a hidden contract is not drawn at all.
export function drawnNodeIds(
  nodes: readonly Node[],
  addresses: readonly string[],
): string[] {
  const drawn = topLevelByDescendant(expandedNodes(nodes))
  const ids: string[] = []
  for (const address of addresses) {
    const id = drawn.get(address)?.id
    if (id !== undefined && !ids.includes(id)) {
      ids.push(id)
    }
  }
  return ids
}
