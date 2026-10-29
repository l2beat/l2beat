import type { Project } from '@l2beat/config'
import { ps } from '~/server/projects'

export type LiquidStakingProject = Project<
  'display' | 'statuses' | 'defiInfo' | 'liquidStaking'
>

export function getLiquidStakingProjects(): Promise<LiquidStakingProject[]> {
  return ps.getProjects({
    select: ['display', 'statuses', 'defiInfo', 'liquidStaking'],
  })
}
