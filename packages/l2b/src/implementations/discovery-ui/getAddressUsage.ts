import {
  type ConfigReader,
  type DiscoveryOutput,
  readJsonc,
} from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { existsSync } from 'fs'
import path from 'path'
import type {
  ApiAddressUsage,
  ApiAddressUsageResponse,
  ApiEntrypointInfo,
} from './types'

type EntrypointsFile = v.infer<typeof EntrypointsFile>
const EntrypointsFile = v.object({
  entrypoints: v
    .record(
      v.string(),
      v.object({ name: v.string().optional(), project: v.string() }),
    )
    .optional(),
})

export interface UsageSource {
  project: string
  discovery: DiscoveryOutput
  entrypoints: EntrypointsFile
}

export function readUsageSources(configReader: ConfigReader): UsageSource[] {
  return configReader
    .readAllDiscoveredProjects()
    .sort()
    .map((project) => {
      const entrypointsPath = path.join(
        configReader.getProjectPath(project),
        'entrypoints.json',
      )
      return {
        project,
        discovery: configReader.readDiscovery(project),
        entrypoints: existsSync(entrypointsPath)
          ? EntrypointsFile.parse(readJsonc(entrypointsPath))
          : {},
      }
    })
}

export function buildAddressUsage(
  sources: UsageSource[],
): ApiAddressUsageResponse {
  const usagesByAddress = new Map<string, ApiAddressUsage[]>()
  const consumersByModule = new Map<string, Set<string>>()
  const entrypoints: Record<string, ApiEntrypointInfo> = {}

  for (const { project, discovery, entrypoints: declared } of sources) {
    for (const entry of discovery.entries) {
      const usages = usagesByAddress.get(entry.address) ?? []
      assert(usages.at(-1)?.project !== project, 'Address discovered twice')
      usages.push({ project, name: entry.name, viaModule: entry.targetProject })
      usagesByAddress.set(entry.address, usages)

      if (entry.targetProject !== undefined) {
        const consumers =
          consumersByModule.get(entry.targetProject) ?? new Set<string>()
        consumers.add(project)
        consumersByModule.set(entry.targetProject, consumers)
      }
    }
    for (const [address, entrypoint] of Object.entries(
      declared.entrypoints ?? {},
    )) {
      assert(entrypoints[address] === undefined, 'Entrypoint declared twice')
      entrypoints[address] = {
        project: entrypoint.project,
        name: entrypoint.name,
      }
      if (!consumersByModule.has(entrypoint.project)) {
        consumersByModule.set(entrypoint.project, new Set())
      }
    }
  }

  const sharedAddresses: Record<string, ApiAddressUsage[]> = {}
  for (const [address, usages] of usagesByAddress) {
    if (usages.length > 1) {
      sharedAddresses[address] = usages
    }
  }

  const moduleConsumers: Record<string, string[]> = {}
  for (const [module, consumers] of consumersByModule) {
    moduleConsumers[module] = [...consumers].sort()
  }

  return { sharedAddresses, moduleConsumers, entrypoints }
}
