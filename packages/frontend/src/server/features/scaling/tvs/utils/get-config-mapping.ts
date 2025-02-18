import type { BackendProject } from '@l2beat/backend-shared'
import {
  ConfigMapping,
  getTvlAmountsConfigForProject,
  getTvlPricesConfig,
} from '@l2beat/backend-shared'
import type { ChainConfig } from '@l2beat/config'

export function getConfigMapping(
  project: BackendProject,
  chains: ChainConfig[],
) {
  const amountsConfigs = getTvlAmountsConfigForProject(project, chains)
  const priceConfigs = getTvlPricesConfig(chains)

  return new ConfigMapping(priceConfigs, amountsConfigs, [project.projectId])
}
