import type { UnixTime } from '@l2beat/shared-pure'
import { toProductionUrl } from '~/consts/productionOrigin'

/** The project's public JSON endpoints. */
export function getL2ProjectApiUrls(project: {
  slug: string
  archivedAt: UnixTime | undefined
}) {
  const api = toProductionUrl('/api/scaling')
  // The chart endpoints default to 30d, which holds no points for a project
  // archived before then, so they would answer "Missing data."
  const range = project.archivedAt ? '?range=max' : ''
  return {
    tvs: `${api}/tvs/${project.slug}${range}`,
    tvsBreakdown: `${api}/tvs/${project.slug}/breakdown`,
    activity: `${api}/activity/${project.slug}${range}`,
  }
}
