import {
  ConfigMapping,
  getTvlAmountsConfigForProject,
  getTvlPricesConfig,
} from '@l2beat/backend-shared'
import type { ChainConfig, Project } from '@l2beat/config'

export function getConfigMapping(
  project: Project<'tvlConfig', 'chainConfig'>,
  chains: ChainConfig[],
) {
  const amountsConfigs = getTvlAmountsConfigForProject(project, chains)
  const priceConfigs = getTvlPricesConfig(chains)

  return new ConfigMapping(priceConfigs, amountsConfigs, [project.id])
}
