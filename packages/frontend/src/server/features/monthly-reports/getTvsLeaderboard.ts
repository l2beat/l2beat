import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { queryExecutor } from '~/server/queryExecutor'
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
  range: { type: 'custom'; from: UnixTime; to: UnixTime },
): Promise<TvsLeaderboard> {
  if (env.MOCK) {
    return getMockTvsBreakdownData(props.projectIds)
  }

  const projectsValues = await queryExecutor.execute({
    name: 'getAtTimestampsPerProjectQuery',
    args: [
      range.from,
      range.to,
      true,
      false,
      range.from - 30 * UnixTime.DAY, // Cut off 30 days before the range
    ],
  })

  const projects: TvsLeaderboard['projects'] = {}
  for (const [projectId, values] of Object.entries(projectsValues)) {
    const oldestValue = values[0]
    const latestValue = values.at(-1)

    if (!latestValue || !oldestValue) {
      continue
    }

    projects[projectId] = {
      tvs: latestValue[0],
      change: calculatePercentageChange(latestValue[0], oldestValue[0]),
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
