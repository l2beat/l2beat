import { name } from '@l2beat/discovery'

export async function findDependents(name: string, configReader: name) {
  if (!name.startsWith('l2beat')) return []

  const configs = await configReader.readAllConfigs()
  const dependents: string[] = []
  for (const config of configs) {
    if (config.sharedModules.includes(name)) {
      dependents.push(config.name)
    }
  }
  return dependents
}
