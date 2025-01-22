import type { ConfigReader } from '@l2beat/discovery'

export function findDependents(
  name: string,
  chain: string,
  configReader: ConfigReader,
) {
  if (!name.startsWith('shared-')) return []

  const configs = configReader.readAllConfigsForChain(chain)
  const dependents: string[] = []
  for (const config of configs) {
    if (config.sharedModules.includes(name)) {
      dependents.push(config.name)
    }
  }
  return dependents
}
