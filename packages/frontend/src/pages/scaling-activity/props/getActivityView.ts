import { Layer2 } from '@l2beat/config'
import { ActivityApiResponse, TvlApiResponse } from '@l2beat/types'

import { getTpsDaily } from '../../../utils/activity/getTpsDaily'
import { getTpsWeeklyChange } from '../../../utils/activity/getTpsWeeklyChange'
import { getTransactionWeeklyCount } from '../../../utils/activity/getTransactionWeeklyCount'
import { getIncludedProjects } from '../../../utils/getIncludedProjects'
import { orderByTvl } from '../../../utils/orderByTvl'
import { ActivityViewEntry, ActivityViewProps } from '../view/ActivityView'

export function getActivityView(
  projects: Layer2[],
  tvlApiResponse: TvlApiResponse,
  activityApiResponse: ActivityApiResponse,
): ActivityViewProps {
  const included = getIncludedProjects(projects, tvlApiResponse)
  const ordering = orderByTvl(included, tvlApiResponse)

  return {
    items: ordering
      .map((x) => getActivityViewEntry(x, activityApiResponse))
      .sort((a, b) => (b.tpsDaily ?? -1) - (a.tpsDaily ?? -1)),
  }
}

export function getActivityViewEntry(
  project: Layer2,
  activityApiResponse: ActivityApiResponse,
): ActivityViewEntry {
  const data = activityApiResponse.projects[project.id.toString()]?.data
  const tpsDaily = getTpsDaily(data)
  const tpsWeeklyChange = getTpsWeeklyChange(data)
  const transactionsWeeklyCount = getTransactionWeeklyCount(data)

  return {
    name: project.display.name,
    slug: project.display.slug,
    provider: project.technology.provider,
    tpsDaily,
    tpsWeeklyChange,
    transactionsWeeklyCount,
  }
}
