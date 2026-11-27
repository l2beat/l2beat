import type { UnixTime } from '@l2beat/shared-pure'
import { PUBLIC_API_URL } from '~/consts/publicApi'

/** The project's endpoints in the public JSON API, which names projects by id. */
export function getL2ProjectApiUrls(project: {
  id: string
  archivedAt: UnixTime | undefined
}) {
  // The chart endpoints default to 30d, which holds no points for a project
  // archived before then, so they would answer with an empty chart
  const range = project.archivedAt ? '?range=max' : ''
  return {
    tvs: `${PUBLIC_API_URL}/v1/tvs/${project.id}${range}`,
    tvsBreakdown: `${PUBLIC_API_URL}/v1/project/${project.id}/tokens`,
    activity: `${PUBLIC_API_URL}/v1/activity/${project.id}${range}`,
  }
}
