import { ActivityApiResponse, ProjectId } from '@l2beat/types'

import { DailyTransactionCount } from '../../../core/transaction-count/TransactionCounter'
import { countsToChart } from './countsToChart'

export function toProjectsActivity(
  projectCounts: Map<ProjectId, DailyTransactionCount[]>,
): ActivityApiResponse['projects'] {
  const projects: ActivityApiResponse['projects'] = {}
  for (const [projectId, counts] of projectCounts) {
    projects[projectId.toString()] = countsToChart(counts)
  }
  return projects
}
