import { ConfigReader } from '../config/ConfigReader'

export async function findDependents(name: string, configReader: ConfigReader) {
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
