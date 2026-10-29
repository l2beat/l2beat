import type { ProjectLiquidStakingRisks } from '@l2beat/config'
import { manifest } from '~/utils/Manifest'
import { getTotalValueLockedByProject } from '../getDefiTotalValueLocked'
import type { LiquidStakingStats } from './computeLiquidStakingCharts'
import { getLiquidStakingStats } from './getLiquidStakingCharts'
import type { LiquidStakingProject } from './getLiquidStakingProjects'

export interface LiquidStakingEntry {
  id: string
  slug: string
  name: string
  shortName?: string
  icon: string
  href: string
  description: string
  isUnderReview: boolean
  totalValueLockedUsd?: number
  risks: ProjectLiquidStakingRisks
  stats: LiquidStakingStats
}

const NO_STATS: LiquidStakingStats = { yield: null, costOfExit: null }

/** Sorted by TVL, the projects without one last. */
export async function getLiquidStakingEntries(
  projects: LiquidStakingProject[],
): Promise<LiquidStakingEntry[]> {
  const [tvlByProject, statsByProject] = await Promise.all([
    getTotalValueLockedByProject(projects),
    getLiquidStakingStats(projects),
  ])

  return projects
    .map(
      (project): LiquidStakingEntry => ({
        id: project.id,
        slug: project.slug,
        name: project.name,
        shortName: project.shortName,
        icon: manifest.getUrl(`/icons/${project.slug}.png`),
        href: `/defi/projects/${project.slug}`,
        description: project.display.description,
        isUnderReview: !!project.statuses.reviewStatus,
        totalValueLockedUsd: tvlByProject.get(project.id),
        risks: project.liquidStakingRisks,
        stats: statsByProject.get(project.id) ?? NO_STATS,
      }),
    )
    .sort(
      (a, b) =>
        (b.totalValueLockedUsd ?? -1) - (a.totalValueLockedUsd ?? -1) ||
        a.name.localeCompare(b.name),
    )
}
