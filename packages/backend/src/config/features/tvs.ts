import type { ProjectService } from '@l2beat/config'
import type { CleanableRepoName } from '@l2beat/database'
import { assert, type Configuration, notUndefined } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import { CirculatingSupplyAmountIndexer } from '../../modules/tvs/indexers/CirculatingSupplyAmountIndexer'
import {
  extractPricesAndAmounts,
  generateConfigurationId,
} from '../../modules/tvs/tools/extractPricesAndAmounts'
import { getEffectiveConfig } from '../../modules/tvs/tools/getEffectiveConfig'
import { isOnchainAmountConfig } from '../../modules/tvs/types'
import type { TvsCleanerConfig, TvsConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export async function getTvsConfig(
  ps: ProjectService,
  flags: FeatureFlags,
  sinceTimestamp?: number,
): Promise<TvsConfig> {
  const [projectsWithTvs, projectsWithChains] = await Promise.all([
    ps.getProjects({
      select: ['tvsConfig'],
    }),
    ps.getProjects({ select: ['chainConfig'] }),
  ])

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

  const chainRanges = new Map(
    projectsWithChains.map((p) => [
      p.chainConfig.name,
      {
        sinceTimestamp: p.chainConfig.sinceTimestamp,
        untilTimestamp: p.chainConfig.untilTimestamp,
      },
    ]),
  )

  // It is very important to pass ALL PROJECTS tokens here
  // this allows us to deduplicate amounts and extractPricesAndAmounts
  // and set since and untilTimestamp properly
  const { amounts, prices } = extractPricesAndAmounts(
    projects.flatMap((p) => p.tokens),
    chainRanges,
  )

  const projectsWithSources = projects.map((p) => {
    const { amounts: projectAmounts } = extractPricesAndAmounts(
      p.tokens,
      chainRanges,
    )
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

  const blockTimestamps = Array.from(new Set(chains).values()).map((c) => {
    const project = projectsWithChains.find((p) => p.chainConfig.name === c)
    assert(project, `${c}: chainConfig not configured`)
    assert(project.chainConfig.sinceTimestamp)

    return {
      chainName: c,
      configurationId: generateConfigurationId([`chain_${c}`]),
      sinceTimestamp: sinceTimestamp ?? project.chainConfig.sinceTimestamp,
      untilTimestamp: project.chainConfig.untilTimestamp,
    }
  })

  const cleaner =
    flags.isEnabled('tvs', 'cleaner') &&
    createTvsCleanerConfigurations([
      'tvsTokenValue',
      'tvsBlockTimestamp',
      'tvsAmount',
      'tvsPrice',
    ])

  return {
    projects: projectsWithSources,
    amounts,
    prices,
    chains,
    blockTimestamps,
    cleaner,
  }
}

export function createTvsCleanerConfigurations(
  repositories: readonly CleanableRepoName[],
): Configuration<TvsCleanerConfig>[] {
  return repositories.map((name) => ({
    id: repoNameToConfigId(name),
    minHeight: 0,
    maxHeight: null,
    properties: { name },
  }))
}

function repoNameToConfigId(name: CleanableRepoName): string {
  return createHash('sha1').update(name).digest('hex').slice(0, 12)
}
