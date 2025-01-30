import type { BackendProject } from '@l2beat/backend-shared'
import {
  ConfigMapping,
  getTvlAmountsConfigForProject,
  getTvlPricesConfig,
} from '@l2beat/backend-shared'

export function getConfigMapping(project: BackendProject) {
  const amountsConfigs = getTvlAmountsConfigForProject(project)
  const priceConfigs = getTvlPricesConfig()

  return new ConfigMapping(priceConfigs, amountsConfigs, [project.projectId])
}
