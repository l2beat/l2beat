import { Layer2 } from '@l2beat/config'
import { ActivityApiResponse, ProjectId } from '@l2beat/types'

import { getPercentageChange } from '../../../utils/utils'
import { ActivityViewEntry, ActivityViewProps } from '../view/ActivityView'

export function getActivityView(
  projects: Layer2[],
  apiActivity: ActivityApiResponse,
): ActivityViewProps {
  return {
    items: projects
      .map((x) => getActivityViewEntry(x, apiActivity))
      .sort((a, b) => +b.tpsDaily - +a.tpsDaily),
  }
}

export function getActivityViewEntry(
  project: Layer2,
  apiActivity: ActivityApiResponse,
): ActivityViewEntry {
  const SECONDS_IN_A_DAY = 24 * 60 * 60
  const transactionsWeeklyCount = getWeeklyCount(apiActivity, project.id)
  const tps =
    (apiActivity.projects[project.id.toString()]?.data.at(-1)?.[1] ?? 0) /
    SECONDS_IN_A_DAY
  const tpsSevenDaysAgo =
    (apiActivity.projects[project.id.toString()]?.data.at(-7)?.[1] ?? 0) /
    SECONDS_IN_A_DAY
  const sevenDayChange = getPercentageChange(tps, tpsSevenDaysAgo)

  return {
    name: project.display.name,
    slug: project.display.slug,
    tpsDaily: tps.toFixed(2),
    tpsWeeklyChange: sevenDayChange,
    transactionsWeeklyCount: transactionsWeeklyCount.toString(),
  }
}

function getWeeklyCount(
  apiActivity: ActivityApiResponse,
  projectId: ProjectId,
): number {
  const lastSevenDays =
    apiActivity.projects[projectId.toString()]?.data.slice(-7)

  if (lastSevenDays === undefined) {
    return 0
  }

  return lastSevenDays.map((d) => d[1]).reduce((prev, curr) => prev + curr, 0)
}
