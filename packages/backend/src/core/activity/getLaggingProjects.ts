import { ProjectId, UnixTime } from '@l2beat/types'

import { DailyTransactionCountProjectsMap } from './types'

export interface LaggingProject {
  projectId: ProjectId
  tip: UnixTime | undefined
}

export function getLaggingProjects(
  counts: DailyTransactionCountProjectsMap,
  expectedTip: UnixTime,
): LaggingProject[] {
  const lagging = []

  for (const [projectId, count] of counts) {
    const tip = count.at(-1)?.timestamp
    if (!tip || tip.lt(expectedTip)) {
      lagging.push({ projectId, tip })
    }
  }

  return lagging
}
