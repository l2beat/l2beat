import type { ProjectService } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
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

      assert(
        tvl.protocolSlug.length > 0,
        `${project.id}: Missing protocol slug`,
      )
      assert(tvl.chains.length > 0, `${project.id}: Missing DeFi TVL chains`)
      assert(
        new Set(tvl.chains.map((chain) => chain.chain)).size ===
          tvl.chains.length,
        `${project.id}: Duplicate L2BEAT DeFi TVL chain`,
      )
      assert(
        new Set(tvl.chains.map((chain) => chain.providerChain)).size ===
          tvl.chains.length,
        `${project.id}: Duplicate provider DeFi TVL chain`,
      )

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
