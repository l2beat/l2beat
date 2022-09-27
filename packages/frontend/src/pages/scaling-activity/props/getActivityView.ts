import { Layer2 } from '@l2beat/config'
import { ApiActivity } from '@l2beat/types'

import { getPercentageChange } from '../../../utils/utils'
import { ActivityViewEntry, ActivityViewProps } from '../view/ActivityView'

export function getActivityView(
  projects: Layer2[],
  apiActivity: ApiActivity,
): ActivityViewProps {
  return {
    items: projects
      .map((x) => getActivityViewEntry(x, apiActivity))
      .sort((a, b) => +b.tpsDaily - +a.tpsDaily),
  }
}

export function getActivityViewEntry(
  project: Layer2,
  apiActivity: ApiActivity,
): ActivityViewEntry {
  const SECONDS_IN_A_DAY = 24 * 60 * 60
  const transactionsWeeklyCount =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    apiActivity.projects[project.id.toString()]?.data.at(-1)?.[1] ?? 0
  const tps =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (apiActivity.projects[project.id.toString()]?.data.at(-1)?.[1] ?? 0) /
    SECONDS_IN_A_DAY
  const tpsSevenDaysAgo =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
