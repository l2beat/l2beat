import type { Node } from '../panel-nodes/store/State'
import { getGraphProjection } from '../panel-nodes/store/utils/graphProjection'

export interface GraphContract {
  address: string
  name: string
  hidden: boolean
  group?: string
  color: number
}

// Every contract as the researcher sees it, labelled with the innermost
// group it sits in.
export function describeGraph(nodes: readonly Node[]): GraphContract[] {
  const hidden = getGraphProjection(nodes).hiddenNodeIds
  const contracts: GraphContract[] = []
  const stack = nodes.map((node) => ({
    node,
    group: undefined as string | undefined,
  }))
  for (let item = stack.pop(); item !== undefined; item = stack.pop()) {
    const { node, group } = item
    if (node.subnodes.length > 0) {
      for (const member of node.subnodes) {
        stack.push({ node: member, group: node.name })
      }
      continue
    }
    contracts.push({
      address: node.id,
      name: node.name,
      hidden: hidden.has(node.id),
      group,
      color: node.color,
    })
  }
  return contracts.sort((a, b) => a.name.localeCompare(b.name))
}
