import type {
  AmountFormula,
  CalculationFormula,
  TvsToken,
  ValueFormula,
} from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'

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
}

/**
 * The selectable universe of the compare page: live scaling projects only
 * (rollups, validiums & optimiums, others) - no archived, no upcoming,
 * no Ethereum.
 */
export async function getCompareProjectEntries(): Promise<
  CompareProjectEntry[]
> {
  const projects = await ps.getProjects({
    select: ['scalingInfo'],
    optional: ['tvsConfig'],
    where: ['scalingInfo'],
    whereNot: ['archivedAt'],
  })

  return projects.map((project) => ({
    id: project.id,
    slug: project.slug,
    name: project.name,
    shortName: project.shortName,
    iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
    tvsSinceTimestamp: getTvsSinceTimestamp(project.tvsConfig),
  }))
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
