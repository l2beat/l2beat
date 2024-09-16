import {
  type BackendProject,
  ConfigMapping,
  getTvlAmountsConfigForProject,
  getTvlPricesConfig,
} from '@l2beat/config'

export function getConfigMapping(project: BackendProject) {
  const amountsConfigs = getTvlAmountsConfigForProject(project)
  const priceConfigs = getTvlPricesConfig()

  return new ConfigMapping(priceConfigs, amountsConfigs, [project.projectId])
}
