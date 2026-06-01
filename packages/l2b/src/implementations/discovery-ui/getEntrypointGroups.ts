import type { DiscoveryOutput } from '@l2beat/discovery'
import type { Entrypoint } from '@l2beat/discovery/dist/discovery/config/StructureConfig'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ApiEntrypointGroup } from './types'

export function entrypointGroupId(
  sourceProject: string,
  address: ChainSpecificAddress,
): string {
  return `${sourceProject}::${address}`
}

function formatDeclaredEntrypointLabel(
  entrypoint: Entrypoint,
  sourceProject: string,
): string {
  if (entrypoint.name) {
    return `${sourceProject}: ${entrypoint.name}`
  }
  return `${sourceProject}/entrypoints.json`
}

export function getEntrypointGroups(
  projectName: string,
  entrypoints: Record<ChainSpecificAddress, Entrypoint> | undefined,
  baseDiscovery: DiscoveryOutput,
  loadedDiscoveries: DiscoveryOutput[],
  /**
   * Projects that ship an entrypoints.json. These are entrypoint-managed: when
   * they declare no entrypoints we emit no group for them, instead of the
   * whole-module fallback group. Reference modules without the file still group.
   */
  entrypointManagedProjects: ReadonlySet<string> = new Set(),
): ApiEntrypointGroup[] {
  if (!entrypoints) {
    return []
  }

  const bridgeAddressesByProject = new Map<string, ChainSpecificAddress[]>()
  for (const entry of baseDiscovery.entries) {
    if (entry.type !== 'Reference' || !entry.targetProject) {
      continue
    }
    const bridges = bridgeAddressesByProject.get(entry.targetProject) ?? []
    bridges.push(entry.address)
    bridgeAddressesByProject.set(entry.targetProject, bridges)
  }

  const projectsWithDeclaredEntrypoints = new Set<string>()
  const groups: ApiEntrypointGroup[] = []

  for (const [address, entrypoint] of Object.entries(entrypoints)) {
    // `isLegacy` only means the *declaring* module's own discovery no longer
    // emits this address (e.g. shared-sp1 dropped its eth deployment in favour
    // of arb/base). In a consumer project (e.g. mantle uses the eth gateway)
    // the address is still a real, present entrypoint, so we must still form a
    // collapsible group for it — otherwise the whole eth subgraph it owns can
    // never fold up to the entrypoint.

    projectsWithDeclaredEntrypoints.add(entrypoint.project)
    const chainAddress = address as ChainSpecificAddress
    const projectBridges = bridgeAddressesByProject.get(entrypoint.project) ?? []
    const bridgeAddresses = projectBridges.includes(chainAddress)
      ? [chainAddress]
      : projectBridges

    groups.push({
      id: entrypointGroupId(entrypoint.project, chainAddress),
      label: formatDeclaredEntrypointLabel(entrypoint, entrypoint.project),
      sourceProject: entrypoint.project,
      memberAddresses: [chainAddress],
      bridgeAddresses,
      contractCount: entrypoint.type === 'Contract' ? 1 : 0,
      eoaCount: entrypoint.type === 'EOA' ? 1 : 0,
    })
  }

  for (const refDiscovery of loadedDiscoveries) {
    if (refDiscovery.name === projectName) {
      continue
    }
    if (projectsWithDeclaredEntrypoints.has(refDiscovery.name)) {
      continue
    }
    if (entrypointManagedProjects.has(refDiscovery.name)) {
      continue
    }

    const memberAddresses: ChainSpecificAddress[] = []
    let contractCount = 0
    let eoaCount = 0
    for (const entry of refDiscovery.entries) {
      if (entry.type === 'Reference') {
        continue
      }
      memberAddresses.push(entry.address)
      if (entry.type === 'Contract') {
        contractCount++
      } else if (entry.type === 'EOA') {
        eoaCount++
      }
    }
    if (memberAddresses.length === 0) {
      continue
    }

    groups.push({
      id: refDiscovery.name,
      label: refDiscovery.name,
      sourceProject: refDiscovery.name,
      memberAddresses,
      bridgeAddresses: bridgeAddressesByProject.get(refDiscovery.name) ?? [],
      contractCount,
      eoaCount,
    })
  }

  return groups.sort((a, b) => a.label.localeCompare(b.label))
}
