import type { ProjectService } from '@l2beat/config'
import { extractPricesAndAmounts } from '../../modules/tvs/tools/extractPricesAndAmounts'
import { getEffectiveConfig } from '../../modules/tvs/tools/getEffectiveConfig'
import type { TokenPriceConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export async function getTokenPriceConfig(
  ps: ProjectService,
  flags: FeatureFlags,
  sinceTimestamp?: number,
): Promise<TokenPriceConfig> {
  const projectsWithTvs = await ps.getProjects({
    select: ['tvsConfig'],
  })

  // filter out projects disabled by flag
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
    (await ps.getProjects({ select: ['chainConfig'] })).map((p) => [
      p.chainConfig.name,
      {
        sinceTimestamp: p.chainConfig.sinceTimestamp,
        untilTimestamp: p.chainConfig.untilTimestamp,
      },
    ]),
  )

  const { prices } = extractPricesAndAmounts(
    projects.flatMap((p) => p.tokens),
    chainRanges,
  )

  return {
    prices,
  }
}
