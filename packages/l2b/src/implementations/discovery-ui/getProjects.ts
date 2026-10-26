import { ProjectService } from '@l2beat/config'
import type { ConfigReader, DiscoveryOutput } from '@l2beat/discovery'
import type { ApiProjectsResponse } from './types'

export function getProjects(
  configReader: ConfigReader,
  configNames: ReadonlyMap<string, string>,
) {
  const entries = configReader.readAllDiscoveredProjects()
  const projectToDiscovery = new Map<string, DiscoveryOutput>()
  for (const entry of entries) {
    projectToDiscovery.set(entry, configReader.readDiscovery(entry))
  }

  const response: ApiProjectsResponse = [...projectToDiscovery.entries()]
    .map(([name, discovery]) => ({
      name,
      displayName: getDisplayName(name, configNames.get(name)),
      addresses: discovery.entries.map((e) => e.address.toLowerCase()),
      contractNames: discovery.entries
        .map((e) => e.name?.toLowerCase())
        .filter((x) => x !== undefined),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return response
}

export async function readConfigNames(): Promise<Map<string, string>> {
  const projects = await new ProjectService().getProjects({})
  return new Map(projects.map((p) => [p.id, p.name]))
}

function getDisplayName(
  id: string,
  configName: string | undefined,
): string | undefined {
  if (configName === undefined) {
    return undefined
  }
  if (toComparable(configName) === toComparable(id)) {
    return undefined
  }
  return configName
}

function toComparable(name: string): string {
  let result = ''
  for (const char of name.toLowerCase()) {
    const isLetter = char >= 'a' && char <= 'z'
    const isDigit = char >= '0' && char <= '9'
    if (isLetter || isDigit) {
      result += char
    }
  }
  return result
}
