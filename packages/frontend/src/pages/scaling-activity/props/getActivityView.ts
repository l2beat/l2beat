import { Layer2 } from '@l2beat/config'
import { ApiActivity } from '@l2beat/types'

import { ActivityViewEntry, ActivityViewProps } from '../view/ActivityView'

export function getActivityView(
  projects: Layer2[],
  apiActivity: ApiActivity,
): ActivityViewProps {
  return {
    items: projects.map((x) => getActivityViewEntry(x, apiActivity)),
  }
}

export function getActivityViewEntry(
  project: Layer2,
  apiActivity: ApiActivity,
): ActivityViewEntry {
  return {
    name: project.display.name,
    slug: project.display.slug,
    tpsDaily: '1',
    tpsWeeklyChange: '+1%',
    transactionsWeeklyCount: '111',
  }
}
