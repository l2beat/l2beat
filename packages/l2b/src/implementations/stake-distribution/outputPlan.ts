import type { ProjectInclusionDelayChartStakeDistribution } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import path from 'path'
import type { StakingProjectId, StakingProjectSelection } from './types'

export const STAKE_DISTRIBUTION_FILE_NAME = 'stake-distribution.json'

export type StakeDistributionOutputTarget =
  /** One explicit file. Holds several projects when more than one is selected. */
  | { type: 'file'; path: string }
  /** The repository default: one stake-distribution.json per project directory. */
  | { type: 'discovery'; root: string }

export interface ProjectStakeDistribution {
  project: StakingProjectId
  distribution: ProjectInclusionDelayChartStakeDistribution
}

export interface OutputPlanEntry {
  path: string
  data: unknown
}

export function planStakeDistributionOutput(
  selection: StakingProjectSelection,
  output: StakeDistributionOutputTarget,
  results: ProjectStakeDistribution[],
): OutputPlanEntry[] {
  switch (output.type) {
    case 'discovery': {
      // config re-validates these files with ProjectStakeDistributionSchema
      // when it loads them, so shape drift fails the config build.
      return results.map(({ project, distribution }) => ({
        path: path.join(output.root, project, STAKE_DISTRIBUTION_FILE_NAME),
        data: distribution,
      }))
    }
    case 'file': {
      const data =
        selection === 'all'
          ? results.map(({ project, distribution }) => ({
              project,
              ...distribution,
            }))
          : results[0]?.distribution
      assert(data, `No staking data fetched for ${selection}`)
      return [{ path: output.path, data }]
    }
  }
}
