import type {
  AmountFormula,
  CalculationFormula,
  Project,
  TvsToken,
  ValueFormula,
} from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { get7dTvsBreakdown } from '../tvs/get7dTvsBreakdown'

export interface CompareProjectEntry {
  id: ProjectId
  slug: string
  name: string
  shortName: string | undefined
  iconUrl: string
  /**
   * Earliest TVS data timestamp derived from the project's TVS config.
   * Undefined when the project has no TVS tracking.
   */
  tvsSinceTimestamp: number | undefined
  /**
   * Earliest onchain costs timestamp derived from the project's tracked
   * transactions config. Undefined when the project has no costs tracking.
   */
  costsSinceTimestamp: number | undefined
  /** Latest total TVS, used to order the picker. 0 when not tracked. */
  tvs: number
}

/**
 * The selectable universe of the compare page: live scaling projects only
 * (rollups, validiums & optimiums, others) - no archived, no upcoming,
 * no Ethereum. Ordered by TVS descending, which is the order the picker
 * shows them in.
 */
export async function getCompareProjectEntries(): Promise<
  CompareProjectEntry[]
> {
  const [projects, tvs] = await Promise.all([
    ps.getProjects({
      select: ['scalingInfo'],
      optional: ['tvsConfig', 'trackedTxsConfig'],
      where: ['scalingInfo'],
      whereNot: ['archivedAt'],
    }),
    get7dTvsBreakdown({ type: 'layer2' }),
  ])

  return projects
    .map((project) => ({
      id: project.id,
      slug: project.slug,
      name: project.name,
      shortName: project.shortName,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      tvsSinceTimestamp: getTvsSinceTimestamp(project.tvsConfig),
      costsSinceTimestamp: getCostsSinceTimestamp(project.trackedTxsConfig),
      tvs: tvs.projects[project.id.toString()]?.breakdown.total ?? 0,
    }))
    .sort((a, b) => b.tvs - a.tvs || a.name.localeCompare(b.name))
}

function getCostsSinceTimestamp(
  trackedTxsConfig: Project<never, 'trackedTxsConfig'>['trackedTxsConfig'],
): number | undefined {
  const timestamps =
    trackedTxsConfig
      ?.filter((entry) => entry.type === 'l2costs')
      .map((entry) => entry.sinceTimestamp) ?? []
  if (timestamps.length === 0) return undefined
  return Math.min(...timestamps)
}

function getTvsSinceTimestamp(
  tvsConfig: TvsToken[] | undefined,
): number | undefined {
  if (!tvsConfig || tvsConfig.length === 0) return undefined
  const timestamps = tvsConfig
    .map((token) => getFormulaSinceTimestamp(token.amount))
    .filter((timestamp) => timestamp !== undefined)
  if (timestamps.length === 0) return undefined
  return Math.min(...timestamps)
}

function getFormulaSinceTimestamp(
  formula: CalculationFormula | ValueFormula | AmountFormula,
): number | undefined {
  switch (formula.type) {
    case 'calculation': {
      const timestamps = formula.arguments
        .map(getFormulaSinceTimestamp)
        .filter((timestamp) => timestamp !== undefined)
      if (timestamps.length === 0) return undefined
      return Math.min(...timestamps)
    }
    case 'value':
      return getFormulaSinceTimestamp(formula.amount)
    default:
      return formula.sinceTimestamp
  }
}
