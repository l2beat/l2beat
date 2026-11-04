import {
  attachPermissions,
  type ConfigReader,
  getReachableEntries,
} from '@l2beat/discovery'
import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import type { AgentEntry } from './resolveRef'

// The contracts the graph draws: the project and the shared modules it
// references, reachable from the project, like getProject. A ref to anything
// else would point at nothing on screen.
export function readAgentEntries(
  configReader: ConfigReader,
  project: string,
): AgentEntry[] {
  const discoveries = configReader.readDiscoveryWithReferences(project)
  // The permission model makes shared modules reachable too.
  attachPermissions(discoveries)
  const all = discoveries
    .flatMap((d) => d.entries)
    .filter((e) => e.type !== 'Reference')
  const entrypoints = (discoveries[0]?.entries ?? []).map((e) => e.address)
  const byAddress = new Map<ChainSpecificAddress, AgentEntry>()
  for (const entry of getReachableEntries(all, entrypoints)) {
    if (ChainSpecificAddress.address(entry.address) === EthereumAddress.ZERO) {
      continue
    }
    if (!byAddress.has(entry.address)) {
      byAddress.set(entry.address, { address: entry.address, name: entry.name })
    }
  }
  return [...byAddress.values()]
}
