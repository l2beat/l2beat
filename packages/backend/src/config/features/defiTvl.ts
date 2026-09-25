import type { ProjectService } from '@l2beat/config'
import { getDefiTvlConfigurationId } from '../../modules/defi-tvl/getDefiTvlConfigurationId'
import type { DefiTvlConfig } from '../../modules/defi-tvl/types'
import type { FeatureFlags } from '../FeatureFlags'

export async function getDefiTvlConfig(
  ps: ProjectService,
  flags: FeatureFlags,
  apiUrl: string,
): Promise<DefiTvlConfig | false> {
  const projects = (await ps.getProjects({ select: ['defiInfo'] }))
    .filter((project) => flags.isEnabled('defi-tvl', project.id))
    .flatMap((project) => {
      const tvl = project.defiInfo.tvl
      if (tvl?.source !== 'defillama') return []

      const config = {
        projectId: project.id,
        protocolSlug: tvl.protocolSlug,
        sinceTimestamp: tvl.sinceTimestamp,
        chains: tvl.chains,
      }
      return [{ ...config, configurationId: getDefiTvlConfigurationId(config) }]
    })

  if (projects.length === 0) return false

  return { apiUrl, projects }
}
