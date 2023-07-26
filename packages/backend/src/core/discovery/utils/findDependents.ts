import { ConfigReader } from '@l2beat/discovery'
import { ChainId } from '@l2beat/shared-pure'

export async function findDependents(name: string, configReader: ConfigReader) {
  if (!name.startsWith('l2beat')) return []

  const configs = await configReader.readAllConfigsForChain(ChainId.ETHEREUM)
  const dependents: string[] = []
  for (const config of configs) {
    if (config.sharedModules.includes(name)) {
      dependents.push(config.name)
    }
  }
  return dependents
}
