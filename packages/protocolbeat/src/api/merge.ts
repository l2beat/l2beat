import { Node } from '../store/State'

export function merge(oldNodes: readonly Node[], newNodes: Node[]) {
  const combined = [...newNodes, ...oldNodes].filter(
    (x, i, a) => a.findIndex((y) => y.id === x.id) === i,
  )
  return [...combined, ...createEmptyNodes(combined)]
}

function createEmptyNodes(nodes: Node[]): Node[] {
  const unknownIds = new Set<string>()
  const knownIds = new Set(nodes.map((contract) => contract.id))

  for (const node of nodes) {
    for (const field of node.fields) {
      if (!knownIds.has(field.target)) {
        unknownIds.add(field.target)
      }
    }
  }

  return [...unknownIds].map((id): Node => {
    // TODO: better address treatment
    const address = id.split(':')[1] as string
    const name = `Unknown ${address.slice(0, 6)}…${address.slice(-4)}`
    return {
      id,
      name,
      box: { x: 0, y: 0, width: 0, height: 0 },
      color: { l: 0.67, c: 0.166, h: 22 },
      fields: [],
      meta: {
        type: 'Unknown',
        proxyType: undefined,
        address,
        data: null,
      },
    }
  })
}
