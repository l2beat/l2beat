import type {
  AmountFormula,
  CalculationFormula,
  Project,
  TvsToken,
  ValueFormula,
} from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
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
   * Undefined when the project has no TVS tracking or its TVS is excluded
   * from display via `EXCLUDED_TVS_PROJECTS`.
   */
  tvsSinceTimestamp: number | undefined
  /**
   * Earliest onchain costs timestamp derived from the project's tracked
   * transactions config. Undefined when the project has no costs tracking.
   */
  costsSinceTimestamp: number | undefined
  /** Latest total TVS, used to order the picker. 0 when not tracked. */
  tvs: number
  /** False when the project has no DA tracking, so no data-posted data. */
  hasDaTracking: boolean
  /**
   * False when the project has no activity tracking or its activity is
   * excluded from display via `EXCLUDED_ACTIVITY_PROJECTS`.
   */
  hasActivityTracking: boolean
}

/**
 * The selectable universe of the compare page: Ethereum as the baseline,
 * then live scaling projects only (rollups, validiums & optimiums, others) -
 * no archived, no upcoming. Projects are ordered by TVS descending, which is
 * the order the picker shows them in; Ethereum is pinned first so the
 * baseline is easy to find rather than buried among 0-TVS projects.
 */
export async function getCompareProjectEntries(): Promise<
  CompareProjectEntry[]
> {
  const [projects, tvs] = await Promise.all([
    ps.getProjects({
      select: ['scalingInfo'],
      optional: [
        'tvsConfig',
        'trackedTxsConfig',
        'daTrackingConfig',
        'activityConfig',
      ],
      where: ['scalingInfo'],
      whereNot: ['archivedAt'],
    }),
    get7dTvsBreakdown({ type: 'layer2' }),
  ])

  const entries = projects
    .map((project) => ({
      id: project.id,
      slug: project.slug,
      name: project.name,
      shortName: project.shortName,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      tvsSinceTimestamp: isTvsExcluded(project.id)
        ? undefined
        : getTvsSinceTimestamp(project.tvsConfig),
      costsSinceTimestamp: getCostsSinceTimestamp(project.trackedTxsConfig),
      tvs: tvs.projects[project.id.toString()]?.breakdown.total ?? 0,
      hasDaTracking: (project.daTrackingConfig?.length ?? 0) > 0,
      hasActivityTracking:
        project.activityConfig !== undefined && !isActivityExcluded(project.id),
    }))
    .sort((a, b) => b.tvs - a.tvs || a.name.localeCompare(b.name))
  return [getEthereumEntry(), ...entries]
}

/**
 * Ethereum as a compare entry. Only activity tracks it, so on every other
 * metric it is marked "no data" like any project without that tracking.
 */
function getEthereumEntry(): CompareProjectEntry {
  return {
    id: ProjectId.ETHEREUM,
    slug: 'ethereum',
    name: 'Ethereum',
    shortName: undefined,
    iconUrl: manifest.getUrl('/icons/ethereum.png'),
    tvsSinceTimestamp: undefined,
    costsSinceTimestamp: undefined,
    tvs: 0,
    hasDaTracking: false,
    hasActivityTracking: !isActivityExcluded(ProjectId.ETHEREUM),
  }
}

/**
 * The same exclusions the TVS and activity pages apply, so a project whose
 * metric is hidden there cannot be compared on it either.
 */
function isTvsExcluded(projectId: ProjectId): boolean {
  return env.EXCLUDED_TVS_PROJECTS?.includes(projectId) ?? false
}

function isActivityExcluded(projectId: ProjectId): boolean {
  return env.EXCLUDED_ACTIVITY_PROJECTS?.includes(projectId) ?? false
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
