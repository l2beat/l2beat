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

  return merged
}
