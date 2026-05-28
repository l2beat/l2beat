import type { DiscoveryOutput } from '@l2beat/discovery'
import type { Entrypoint } from '@l2beat/discovery/dist/discovery/config/StructureConfig'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ApiEntrypointGroup } from './types'

export function getEntrypointGroups(
  projectName: string,
  entrypoints: Record<ChainSpecificAddress, Entrypoint> | undefined,
  baseDiscovery: DiscoveryOutput,
  loadedDiscoveries: DiscoveryOutput[],
): ApiEntrypointGroup[] {
  if (!entrypoints) {
    return []
  }

  const loadedAddresses = new Set(
    loadedDiscoveries
      .flatMap((discovery) => discovery.entries)
      .filter((entry) => entry.type !== 'Reference')
      .map((entry) => entry.address),
  )

  const bySourceProject = new Map<
    string,
    {
      memberAddresses: ChainSpecificAddress[]
      contractCount: number
      eoaCount: number
    }
  >()

  for (const [address, entrypoint] of Object.entries(entrypoints)) {
    if (entrypoint.project === projectName || entrypoint.isLegacy) {
      continue
    }
    if (!loadedAddresses.has(address as ChainSpecificAddress)) {
      continue
    }

    const group = bySourceProject.get(entrypoint.project) ?? {
      memberAddresses: [],
      contractCount: 0,
      eoaCount: 0,
    }
    group.memberAddresses.push(address as ChainSpecificAddress)
    if (entrypoint.type === 'Contract') {
      group.contractCount++
    } else {
      group.eoaCount++
    }
    bySourceProject.set(entrypoint.project, group)
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

  for (const refDiscovery of loadedDiscoveries) {
    if (refDiscovery.name === projectName) {
      continue
    }
    if (bySourceProject.has(refDiscovery.name)) {
      continue
    }

    const group = {
      memberAddresses: [] as ChainSpecificAddress[],
      contractCount: 0,
      eoaCount: 0,
    }
    for (const entry of refDiscovery.entries) {
      if (entry.type === 'Reference') {
        continue
      }
      group.memberAddresses.push(entry.address)
      if (entry.type === 'Contract') {
        group.contractCount++
      } else if (entry.type === 'EOA') {
        group.eoaCount++
      }
    }
    if (group.memberAddresses.length > 0) {
      bySourceProject.set(refDiscovery.name, group)
    }
  }

  const groups: ApiEntrypointGroup[] = []
  for (const [sourceProject, group] of bySourceProject) {
    if (group.memberAddresses.length === 0) {
      continue
    }

    const hasEntrypointsFile = Object.values(entrypoints).some(
      (entrypoint) => entrypoint.project === sourceProject,
    )

    groups.push({
      id: sourceProject,
      label: hasEntrypointsFile
        ? `${sourceProject}/entrypoints.json`
        : sourceProject,
      sourceProject,
      memberAddresses: group.memberAddresses,
      bridgeAddresses: bridgeAddressesByProject.get(sourceProject) ?? [],
      contractCount: group.contractCount,
      eoaCount: group.eoaCount,
    })
  }

  return groups.sort((a, b) => a.label.localeCompare(b.label))
}
