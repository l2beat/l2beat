import {
  type BackendProject,
  ConfigMapping,
  getTvlAmountsConfigForProject,
  getTvlPricesConfig,
} from '@l2beat/backend-shared'

export function getConfigMapping(project: BackendProject) {
  const amountsConfigs = getTvlAmountsConfigForProject(project)
  const priceConfigs = getTvlPricesConfig()

  return new ConfigMapping(priceConfigs, amountsConfigs, [project.projectId])
}
