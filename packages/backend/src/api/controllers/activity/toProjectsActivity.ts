import { ActivityApiResponse, ProjectId } from '@l2beat/shared-pure'

import { countsToChart } from './countsToChart'
import { DailyTransactionCount } from './types'

export function toProjectsActivity(
  projectCounts: Map<ProjectId, DailyTransactionCount[]>,
): ActivityApiResponse['projects'] {
  const projects: ActivityApiResponse['projects'] = {}
  for (const [projectId, counts] of projectCounts) {
    projects[projectId.toString()] = countsToChart(counts)
  }
  return projects
}
