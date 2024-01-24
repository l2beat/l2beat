import { ConfigReader } from '@l2beat/discovery'

export async function findDependents(
  name: string,
  chain: string,
  configReader: ConfigReader,
) {
  if (!name.startsWith('l2beat')) return []

  const configs = await configReader.readAllConfigsForChain(chain)
  const dependents: string[] = []
  for (const config of configs) {
    if (config.sharedModules.includes(name)) {
      dependents.push(config.name)
    }
  }
  return dependents
}
