import { manifest } from '~/utils/Manifest'
import { getTotalValueLockedByProject } from '../getDefiTotalValueLocked'
import type { LiquidStakingCharts } from './getLiquidStakingCharts'
import type { LiquidStakingProject } from './getLiquidStakingProjects'
import {
  buildLiquidStakingSummary,
  type LiquidStakingSummary,
} from './getLiquidStakingSummary'

export interface LiquidStakingEntry extends LiquidStakingSummary {
  id: string
  slug: string
  name: string
  shortName?: string
  icon: string
  href: string
  description: string
  isUnderReview: boolean
}

/**
 * Sorted by TVL, the projects without one last. The latest yield and cost of
 * exit come from `charts`, so the page reads them once.
 */
export async function getLiquidStakingEntries(
  projects: LiquidStakingProject[],
  charts: LiquidStakingCharts,
): Promise<LiquidStakingEntry[]> {
  const tvlByProject = await getTotalValueLockedByProject(projects)

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
        ...buildLiquidStakingSummary(
          project.id,
          project.liquidStakingRisks,
          tvlByProject.get(project.id),
          charts,
        ),
      }),
    )
    .sort(
      (a, b) =>
        (b.totalValueLockedUsd ?? -1) - (a.totalValueLockedUsd ?? -1) ||
        a.name.localeCompare(b.name),
    )
}
