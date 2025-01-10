import { EthereumAddress } from '@l2beat/shared-pure'
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
    let multisigOwners: EthereumAddress[] = []

    if (analysis.type === 'Contract') {
      threshold = Number(analysis.values['$threshold']) ?? 1
      multisigOwners = (analysis.values['$members'] as EthereumAddress[]) ?? []
    }

    const address = analysis.address
    if (address === EthereumAddress.ZERO) {
      continue
    }

    graph[address.toString()] ??= {
      address,
      delay: 0,
      threshold,
      edges: multisigOwners.map((o) => ({
        toNode: o,
        delay: 0,
        permission: 'member',
      })),
      canActIndependently: analysis.combinedMeta?.canActIndependently ?? false,
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
        threshold,
        edges: [],
        canActIndependently:
          analysis.combinedMeta?.canActIndependently ?? false,
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
