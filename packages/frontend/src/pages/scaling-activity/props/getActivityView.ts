import { Layer2 } from '@l2beat/config'
import { ActivityApiResponse } from '@l2beat/types'

import { getTpsDaily } from '../../../utils/activity/getTpsDaily'
import { getTpsWeeklyChange } from '../../../utils/activity/getTpsWeeklyChange'
import { getTransactionWeeklyCount } from '../../../utils/activity/getTransactionWeeklyCount'
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
  const data = apiActivity.projects[project.id.toString()]?.data
  const tpsDaily = getTpsDaily(data)
  const tpsWeeklyChange = getTpsWeeklyChange(data)
  const transactionsWeeklyCount = getTransactionWeeklyCount(data)

  return {
    name: project.display.name,
    slug: project.display.slug,
    tpsDaily: tpsDaily?.toString() ?? '',
    tpsWeeklyChange,
    transactionsWeeklyCount: transactionsWeeklyCount?.toString() ?? '',
  }
}
