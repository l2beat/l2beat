import { EthereumAddress } from '@l2beat/shared-pure'
import type { Analysis } from '../analysis/AddressAnalyzer'
import {
  type Node,
  type ResolvedPermission,
  resolvePermissions,
} from './resolvePermissions'

export function buildGraph(analyses: Analysis[]): Record<string, Node> {
  const graph: Record<string, Node> = {}
  const nonZeroAnalyses = analyses.filter(
    (a) => a.address !== EthereumAddress.ZERO,
  )

  // add contract nodes
  for (const analysis of nonZeroAnalyses) {
    let threshold = 1
    let multisigOwners: EthereumAddress[] = []

    if (analysis.type === 'Contract') {
      threshold = Number(analysis.values['$threshold'] ?? 1)
      multisigOwners = (analysis.values['$members'] as EthereumAddress[]) ?? []
    }

    const address = analysis.address
    graph[address.toString()] = {
      address,
      delay: 0,
      threshold,
      edges: multisigOwners.map((o) => ({
        toNode: o,
        delay: 0,
        permission: 'member',
      })),
      canActIndependently: analysis.combinedMeta?.canActIndependently,
    }
  }

  // add permission edges
  for (const analysis of nonZeroAnalyses) {
    for (const entry of analysis.combinedMeta?.permissions ?? []) {
      const entryAddress = entry.target
      if (entryAddress === EthereumAddress.ZERO) {
        continue
      }

      graph[entryAddress.toString()] ??= {
        address: entry.target,
        delay: 0,
        threshold: 1,
        edges: [],
        canActIndependently: undefined,
      }
      graph[entryAddress.toString()]?.edges.push({
        toNode: analysis.address,
        delay: entry.delay,
        permission: entry.type,
        description: entry.description,
        condition: entry.condition,
      })
    }
  }

  return graph
}

export function resolveAnalysis(analyses: Analysis[]): ResolvedPermission[] {
  const graph = buildGraph(analyses)
  return resolvePermissions(Object.values(graph))
}
