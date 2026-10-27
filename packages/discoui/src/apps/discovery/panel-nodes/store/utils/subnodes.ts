import type { Node } from '../State'

export function topLevelByDescendant(
  nodes: readonly Node[],
): Map<string, Node> {
  const map = new Map<string, Node>()
  for (const top of nodes) {
    const stack: Node[] = [top]
    while (stack.length > 0) {
      const node = stack.pop()
      if (node === undefined) {
        continue
      }
      map.set(node.id, top)
      for (const subnode of node.subnodes) {
        stack.push(subnode)
      }
    }
  }
  return map
}
