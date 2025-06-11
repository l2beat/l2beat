import type { ConfigReader } from '@l2beat/discovery'

export function findDependents(
  name: string,
  chain: string,
  configReader: ConfigReader,
) {
  if (!name.startsWith('shared-')) return []

  const configs = configReader.readAllDiscoveredConfigsForChain(chain)
  const dependents: string[] = []
  for (const config of configs) {
    if (config.structure.sharedModules.includes(name)) {
      dependents.push(config.name)
    }
  }
  return dependents
}
