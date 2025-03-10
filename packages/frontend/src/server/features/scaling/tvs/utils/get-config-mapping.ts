import {
  ConfigMapping,
  getTvlAmountsConfigForProject,
  getTvlPricesConfig,
} from '@l2beat/backend-shared'
import type { ChainConfig, Project } from '@l2beat/config'
import type { Token } from '@l2beat/shared-pure'

export function getConfigMapping(
  project: Project<'tvlConfig', 'chainConfig'>,
  chains: ChainConfig[],
  tokenList: Token[],
) {
  const amountsConfigs = getTvlAmountsConfigForProject(
    project,
    chains,
    tokenList,
  )
  const priceConfigs = getTvlPricesConfig(chains, tokenList)

  return new ConfigMapping(priceConfigs, amountsConfigs, [project.id])
}
