import type { Project } from '@l2beat/config'
import { ps } from '~/server/projects'

export type LiquidStakingProject = Project<
  'defiInfo' | 'liquidStaking',
  'display' | 'statuses'
>

/** Protocols listed with `liquidStakingListing` have neither display nor statuses. */
export function getLiquidStakingProjects(): Promise<LiquidStakingProject[]> {
  return ps.getProjects({
    select: ['defiInfo', 'liquidStaking'],
    optional: ['display', 'statuses'],
  })
}
