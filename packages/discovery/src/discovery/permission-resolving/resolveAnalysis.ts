import { Analysis } from '../analysis/AddressAnalyzer'
import {
  Node,
  ResolvedPermission,
  resolvePermissions,
} from './resolvePermissions'

export function resolveAnalysis(analyses: Analysis[]): ResolvedPermission[] {
  const graph: Record<string, Node> = {}

  for (const analysis of analyses) {
    let threshold = 1

    if (analysis.type === 'Contract') {
      threshold = Number(analysis.values['$threshold']) ?? 1
    }

    const address = analysis.address
    graph[address.toString()] ??= {
      address,
      delay: 0,
      threshold,
      edges: [],
    }
    if (analysis.combinedMeta === undefined) {
      continue
    }

    for (const entry of analysis.combinedMeta.permissions ?? []) {
      graph[entry.target.toString()] ??= {
        address: entry.target,
        delay: 0,
        threshold,
        edges: [],
      }
      if (entry.description !== undefined) {
        console.log(entry.description)
      }
      graph[entry.target.toString()]?.edges.push({
        toNode: address,
        delay: entry.delay,
        permission: entry.type,
        description: entry.description,
      })
    }
  }

  return resolvePermissions(Object.values(graph))
}
