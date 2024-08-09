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

    graph[address.toString()]?.edges.push(
      ...(analysis.combinedMeta.permissions ?? []).map((p) => ({
        toNode: p.target,
        delay: p.delay,
        permission: p.type,
      })),
    )
  }

  return resolvePermissions(Object.values(graph))
}
