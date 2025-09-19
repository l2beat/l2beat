import type { ProjectService } from '@l2beat/config'
import { assert, notUndefined } from '@l2beat/shared-pure'
import { CirculatingSupplyAmountIndexer } from '../../modules/tvs/indexers/CirculatingSupplyAmountIndexer'
import {
  extractPricesAndAmounts,
  generateConfigurationId,
} from '../../modules/tvs/tools/extractPricesAndAmounts'
import { getEffectiveConfig } from '../../modules/tvs/tools/getEffectiveConfig'
import { isOnchainAmountConfig } from '../../modules/tvs/types'
import type { TvsConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export async function getTvsConfig(
  ps: ProjectService,
  flags: FeatureFlags,
  sinceTimestamp?: number,
): Promise<TvsConfig> {
  const projectsWithTvs = await ps.getProjects({
    select: ['tvsConfig'],
  })

  // filter our projects disabled by flag
  const enabledProjects = projectsWithTvs.filter((p) =>
    flags.isEnabled('tvs', p.id),
  )

  let projects = enabledProjects.map((p) => ({
    projectId: p.id,
    tokens: p.tvsConfig,
  }))

  // sinceTimestamp override for local development
  if (sinceTimestamp) {
    projects = projects.map((p) => ({
      projectId: p.projectId,
      tokens: getEffectiveConfig(p.tokens, sinceTimestamp),
    }))
  }

  // It is very important to pass ALL PROJECTS tokens here
  // this allows us to deduplicate amounts and extractPricesAndAmounts
  // and set since and untilTimestamp properly
  const { amounts, prices } = extractPricesAndAmounts(
    projects.flatMap((p) => p.tokens),
  )

  const projectsWithSources = projects.map((p) => {
    const { amounts: projectAmounts } = extractPricesAndAmounts(p.tokens)
    const amountChains = projectAmounts
      .map((a) => {
        switch (a.type) {
          case 'circulatingSupply':
            return CirculatingSupplyAmountIndexer.SOURCE()
          case 'balanceOfEscrow':
          case 'totalSupply':
          case 'starknetTotalSupply':
            return a.chain
          case 'const':
            return undefined
        }
      })
      .filter(notUndefined)

    return { ...p, amountSources: Array.from(new Set(amountChains).values()) }
  })

  const chains = Array.from(
    new Set(
      amounts
        .filter((a) => isOnchainAmountConfig(a))
        .map((c) => c.chain)
        .filter(notUndefined),
    ),
  )

  const allProjects = await ps.getProjects({
    select: ['chainConfig'],
  })

  const blockTimestamps = Array.from(new Set(chains).values()).map((c) => {
    const project = allProjects.find((p) => p.chainConfig.name === c)
    assert(project, `${c}: chainConfig not configured`)
    assert(project.chainConfig.sinceTimestamp)

    return {
      chainName: c,
      configurationId: generateConfigurationId([`chain_${c}`]),
      sinceTimestamp: sinceTimestamp ?? project.chainConfig.sinceTimestamp,
      untilTimestamp: project.chainConfig.untilTimestamp,
    }
  })

  return {
    projects: projectsWithSources,
    amounts,
    prices,
    chains,
    blockTimestamps,
  }
}
