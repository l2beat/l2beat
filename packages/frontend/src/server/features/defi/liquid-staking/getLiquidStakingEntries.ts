import type { ProjectDefiToken } from '@l2beat/config'
import type { AbstractTokenRecord } from '@l2beat/database'
import { getInteropTokenUrl } from '~/pages/interop/utils/getInteropTokenUrl'
import { manifest } from '~/utils/Manifest'
import { getTotalValueLockedByProject } from '../getDefiTotalValueLocked'
import { getAbstractTokenLookup } from '../project/getDefiTokens'
import type { LiquidStakingCharts } from './getLiquidStakingCharts'
import {
  getLiquidStakingProjects,
  type LiquidStakingProject,
} from './getLiquidStakingProjects'
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
  tokens: LiquidStakingToken[]
}

export interface LiquidStakingToken {
  symbol: string
  /** The token page, when the token database has the token. */
  href?: string
}

/**
 * An entry without its risks, for lists that show only the numbers. The risks
 * carry long descriptions, which a page that never shows them should not load.
 */
export type LiquidStakingStatsEntry = Omit<LiquidStakingEntry, 'risks'>

/**
 * The entries of every list of liquid staking protocols. The caller reads
 * the charts, so a page that shows them can go through its query cache.
 */
export async function loadLiquidStakingEntries(
  loadCharts: () => Promise<LiquidStakingCharts>,
): Promise<{ entries: LiquidStakingEntry[]; charts: LiquidStakingCharts }> {
  const projects = await getLiquidStakingProjects()
  const [tvlByProject, charts, findAbstractToken] = await Promise.all([
    getTotalValueLockedByProject(projects),
    loadCharts(),
    getAbstractTokenLookup(
      projects.flatMap((project) => project.defiInfo.tokens ?? []),
    ),
  ])
  return {
    entries: getEntries(projects, tvlByProject, charts, findAbstractToken),
    charts,
  }
}

/** Sorted by TVL, the projects without one last. */
function getEntries(
  projects: LiquidStakingProject[],
  tvlByProject: Map<string, number>,
  charts: LiquidStakingCharts,
  findAbstractToken: (
    token: ProjectDefiToken,
  ) => AbstractTokenRecord | undefined,
): LiquidStakingEntry[] {
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
        tokens: (project.defiInfo.tokens ?? []).map((token) => {
          const abstractToken = findAbstractToken(token)
          return {
            symbol: token.symbol,
            href: abstractToken && getInteropTokenUrl(abstractToken),
          }
        }),
        ...buildLiquidStakingSummary(
          project.id,
          project.liquidStaking.risks,
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
