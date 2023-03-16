import { ConfigReader } from '../../../../core/discovery/ConfigReader'

export async function getDiscoveryProjects(): Promise<string[]> {
  const configReader = new ConfigReader()
  const configs = await configReader.readAllConfigs()

  return configs.map((config) => config.name)
}
