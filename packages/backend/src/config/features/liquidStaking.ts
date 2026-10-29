import type { ProjectService } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { getLiquidStakingConfigurationId } from '../../modules/liquid-staking/getLiquidStakingConfigurationId'
import type { LiquidStakingConfig } from '../../modules/liquid-staking/types'
import type { FeatureFlags } from '../FeatureFlags'

/** The charts go back to the start of 2024. */
const SINCE_TIMESTAMP = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))

export async function getLiquidStakingConfig(
  ps: ProjectService,
  flags: FeatureFlags,
): Promise<LiquidStakingConfig | false> {
  const projects = (await ps.getProjects({ select: ['liquidStaking'] }))
    .filter((project) => flags.isEnabled('liquid-staking', project.id))
    .map((project) => ({
      configurationId: getLiquidStakingConfigurationId(
        project.id,
        project.liquidStaking.contracts,
      ),
      projectId: project.id,
      contracts: project.liquidStaking.contracts,
    }))

  if (projects.length === 0) return false

  return { sinceTimestamp: SINCE_TIMESTAMP, projects }
}
