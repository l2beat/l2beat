import { SimpleNode } from '../store/State'

export function merge(oldNodes: SimpleNode[], newNodes: SimpleNode[]) {
  const combined = [...newNodes, ...oldNodes].filter(
    (x, i, a) => a.findIndex((y) => y.id === x.id) === i,
  )
  return [...combined, ...createEmptyNodes(combined)]
}

function createEmptyNodes(nodes: SimpleNode[]): SimpleNode[] {
  const unknownIds = new Set<string>()
  const knownIds = new Set(nodes.map((contract) => contract.id))

  for (const node of nodes) {
    for (const field of node.fields) {
      if (field.connection && !knownIds.has(field.connection)) {
        unknownIds.add(field.connection)
      }
    }
  }

  return [...unknownIds].map((id) => ({
    type: 'Unknown',
    data: null,
    id,
    color: { l: 0.67, c: 0.166, h: 22 },
    chain: 'unknown',
    name: 'Unknown',
    fields: [],
    discovered: false,
  }))
}
