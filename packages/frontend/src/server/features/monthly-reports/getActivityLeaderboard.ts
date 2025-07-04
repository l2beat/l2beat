import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'

export interface ActivityLeaderboard {
  projects: Record<
    string,
    {
      uops: number
      change: number
    }
  >
}

export const ActivityLeaderboardProjectFilter = v.object({
  type: v.literal('projects'),
  projectIds: v.array(v.string()),
})
type ActivityLeaderboardProjectFilter = v.infer<
  typeof ActivityLeaderboardProjectFilter
>

export async function getActivityLeaderboard(
  props: ActivityLeaderboardProjectFilter,
  range: { type: 'custom'; from: UnixTime; to: UnixTime },
): Promise<ActivityLeaderboard> {
  if (env.MOCK) {
    return getMockActivityLeaderboardData(props.projectIds)
  }

  const db = getDb()
  const records = await db.activity.getByProjectsAndTimeRange(
    props.projectIds as ProjectId[],
    [range.from, range.to],
  )
  const grouped = groupBy(records, (r) => r.projectId)

  const projects: ActivityLeaderboard['projects'] = {}
  for (const [projectId, values] of Object.entries(grouped)) {
    const oldestValue = values[0]
    const latestValue = values.at(-1)

    if (!latestValue || !oldestValue) {
      continue
    }

    projects[projectId] = {
      uops: latestValue.uopsCount ?? latestValue.count,
      change: calculatePercentageChange(
        latestValue.uopsCount ?? latestValue.count,
        oldestValue.uopsCount ?? oldestValue.count,
      ),
    }
  }

  return { projects }
}

function getMockActivityLeaderboardData(
  projectIds: string[],
): ActivityLeaderboard {
  const projects: ActivityLeaderboard['projects'] = {}
  for (const projectId of projectIds) {
    projects[projectId] = {
      uops: 1000,
      change: 0.1,
    }
  }
  return { projects }
}
