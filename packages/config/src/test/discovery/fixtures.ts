import {
  ConfigReader,
  type ConfigRegistry,
  type DiscoveryOutput,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'

// Parsing every config.jsonc costs ~700ms and every discovered.json is ~34MB
// together. Three test files assert over the same two sets and none of them
// mutate what they read, so they share one parse through this module.
export const paths = getDiscoveryPaths()
export const configReader = new ConfigReader(paths.discovery)

export const configs: ConfigRegistry[] = configReader
  .readAllDiscoveredProjects()
  .flatMap((project) => configReader.readConfig(project))

const discoveries = new Map<string, DiscoveryOutput>(
  configs.map((c) => [c.name, configReader.readDiscovery(c.name)]),
)

export function discoveryOf(name: string): DiscoveryOutput {
  const discovery = discoveries.get(name)
  assert(discovery !== undefined, `No discovery read for ${name}`)
  return discovery
}

export function discoveryOrUndefined(
  name: string,
): DiscoveryOutput | undefined {
  return discoveries.get(name)
}
