import { EthereumAddress } from '@l2beat/shared-pure'
import type { Analysis } from '../analysis/AddressAnalyzer'
import {
  type Edge,
  type Node,
  type ResolvedPermission,
  resolvePermissions,
} from './resolvePermissions'

export function resolveAnalysis(analyses: Analysis[]): ResolvedPermission[] {
  const graph: Record<string, Node> = {}

  for (const analysis of analyses) {
    let threshold = 1
    let multisigOwners: EthereumAddress[] = []

    if (analysis.type === 'Contract') {
      threshold = Number(analysis.values['$threshold']) ?? 1
      multisigOwners = (analysis.values['$members'] as EthereumAddress[]) ?? []
    }

    const address = analysis.address
    if (address === EthereumAddress.ZERO) {
      continue
    }

    const existingNode = graph[address.toString()]
    const edges: Edge<EthereumAddress>[] = multisigOwners.map((o) => ({
      toNode: o,
      delay: 0,
      permission: 'member',
    }))
    const canActIndependently = analysis.combinedMeta?.canActIndependently

    if (existingNode) {
      existingNode.threshold = threshold
      existingNode.edges = [...existingNode.edges, ...edges]
      existingNode.canActIndependently = canActIndependently
    } else {
      graph[address.toString()] = {
        address,
        delay: 0,
        threshold,
        edges,
        canActIndependently,
      }
    }
    if (analysis.combinedMeta === undefined) {
      continue
    }

    for (const entry of analysis.combinedMeta.permissions ?? []) {
      const entryAddress = entry.target
      if (entryAddress === EthereumAddress.ZERO) {
        continue
      }

      graph[entryAddress.toString()] ??= {
        address: entry.target,
        delay: 0,
        threshold: 1, // we don't know the threshold
        edges: [],
        canActIndependently: undefined,
      }
      graph[entryAddress.toString()]?.edges.push({
        toNode: address,
        delay: entry.delay,
        permission: entry.type,
        description: entry.description,
        condition: entry.condition,
      })
    }
  }

  return resolvePermissions(Object.values(graph))
}
