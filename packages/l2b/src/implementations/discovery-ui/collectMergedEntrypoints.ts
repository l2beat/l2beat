import type { ConfigReader, DiscoveryOutput } from '@l2beat/discovery'
import type { Entrypoint } from '@l2beat/discovery/dist/discovery/config/StructureConfig'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { readModuleEntrypoints } from './configs/entrypointsFile'

export function collectMergedEntrypoints(
  configReader: ConfigReader,
  openProject: string,
  discoveries: DiscoveryOutput[],
): Record<ChainSpecificAddress, Entrypoint> {
  const merged: Record<ChainSpecificAddress, Entrypoint> = {}
  const projectsToLoad = new Set<string>([openProject])

  for (const discovery of discoveries) {
    projectsToLoad.add(discovery.name)
  }

  for (const module of discoveries[0]?.sharedModules ?? []) {
    projectsToLoad.add(module)
  }

  for (const discovery of discoveries) {
    for (const entry of discovery.entries) {
      if (entry.type === 'Reference' || !('template' in entry) || !entry.template) {
        continue
      }
      const slash = entry.template.indexOf('/')
      if (slash > 0) {
        projectsToLoad.add(entry.template.slice(0, slash))
      }
    }
  }

  for (const project of projectsToLoad) {
    Object.assign(merged, readModuleEntrypoints(configReader, project))
  }

  const structureEntrypoints =
    configReader.readConfig(openProject).structure.entrypoints ?? {}
  Object.assign(merged, structureEntrypoints)

  // Entrypoint colors are global: any address present in this project that is
  // declared as an entrypoint by *any* other project should be colored with
  // that project's entrypoint color, even when the declaring project is not a
  // shared module here and its discovery was never pulled in as a reference.
  // We only adopt declarations that don't already have a local one, so local
  // (or already-loaded) entrypoints keep precedence.
  mergeGlobalEntrypointsForPresentAddresses(
    configReader,
    discoveries,
    projectsToLoad,
    merged,
  )

  return merged
}

function mergeGlobalEntrypointsForPresentAddresses(
  configReader: ConfigReader,
  discoveries: DiscoveryOutput[],
  alreadyLoadedProjects: ReadonlySet<string>,
  merged: Record<ChainSpecificAddress, Entrypoint>,
): void {
  const presentAddresses = new Set<ChainSpecificAddress>()
  for (const discovery of discoveries) {
    for (const entry of discovery.entries) {
      presentAddresses.add(entry.address)
    }
  }
  if (presentAddresses.size === 0) {
    return
  }

  for (const project of configReader.readAllDiscoveredProjects()) {
    if (alreadyLoadedProjects.has(project)) {
      continue
    }
    const projectEntrypoints = readModuleEntrypoints(configReader, project)
    for (const [address, entrypoint] of Object.entries(projectEntrypoints)) {
      const chainAddress = address as ChainSpecificAddress
      if (!presentAddresses.has(chainAddress) || merged[chainAddress]) {
        continue
      }
      merged[chainAddress] = entrypoint
    }
  }
}
