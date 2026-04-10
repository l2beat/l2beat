import type { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'

export interface TvsLeaderboard {
  projects: Record<
    string,
    {
      tvs: number
      change: number
    }
  >
}

export const TvsLeaderboardProjectFilter = v.object({
  type: v.literal('projects'),
  projectIds: v.array(v.string()),
})
type TvsLeaderboardProjectFilter = v.infer<typeof TvsLeaderboardProjectFilter>

export async function getTvsLeaderboard(
  props: TvsLeaderboardProjectFilter,
  [from, to]: [UnixTime, UnixTime],
): Promise<TvsLeaderboard> {
  if (env.MOCK) {
    return getMockTvsBreakdownData(props.projectIds)
  }
  const db = getDb()

  const values = await db.tvsTokenValue.getSummedAtTimestampsByProjects(
    from,
    to,
    {
      excludeAssociatedTokens: true,
      excludeRwaRestrictedTokens: true,
      cutOffTimestamp: from,
    },
  )

  const groupedByProject = groupBy(values, (v) => v.project)

  const projects: TvsLeaderboard['projects'] = {}
  for (const [projectId, values] of Object.entries(groupedByProject)) {
    const latestValue = values.at(-1)
    const oldestValue = values[0]

    if (!latestValue || !oldestValue) {
      continue
    }

    projects[projectId] = {
      tvs: latestValue.value,
      change: calculatePercentageChange(latestValue.value, oldestValue.value),
    }
  }

  return { projects }
}

function getMockTvsBreakdownData(projectIds: string[]): TvsLeaderboard {
  const projects: TvsLeaderboard['projects'] = {}
  for (const projectId of projectIds) {
    projects[projectId] = {
      tvs: 1000,
      change: 0.1,
    }
  }
  return { projects }
}
