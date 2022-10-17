import { Layer2 } from '@l2beat/config'
import { ActivityApiChart, ActivityApiResponse, ProjectId } from '@l2beat/types'

import { getTpsDaily } from '../../../utils/activity/getTpsDaily'
import { getTpsWeeklyChange } from '../../../utils/activity/getTpsWeeklyChange'
import { getTransactionWeeklyCount } from '../../../utils/activity/getTransactionWeeklyCount'
import { ActivityViewEntry, ActivityViewProps } from '../view/ActivityView'

export function getActivityView(
  projects: Layer2[],
  activityApiResponse: ActivityApiResponse,
): ActivityViewProps {
  const included = getIncludedProjects(projects, activityApiResponse, [
    ProjectId('aztec'),
    ProjectId('aztecconnect'),
  ])
  const items = included.map((x) =>
    getActivityViewEntry(x, activityApiResponse),
  )
  items.push(getEthereumActivityViewEntry(activityApiResponse))

  return {
    items: items.sort((a, b) => (b.tpsDaily ?? -1) - (a.tpsDaily ?? -1)),
  }
}

export function getActivityViewEntry(
  project: Layer2,
  activityApiResponse: ActivityApiResponse,
): ActivityViewEntry {
  const data = activityApiResponse.projects[project.id.toString()]?.data
  const { tpsDaily, tpsWeeklyChange, transactionsWeeklyCount } =
    getActivityViewEntryDetails(data)

  return {
    name: project.display.name,
    slug: project.display.slug,
    provider: project.technology.provider,
    warning: project.display.warning,
    tpsDaily,
    tpsWeeklyChange,
    transactionsWeeklyCount,
  }
}

function getEthereumActivityViewEntry(
  activityApiResponse: ActivityApiResponse,
) {
  const data = activityApiResponse.ethereum?.data
  const { tpsDaily, tpsWeeklyChange, transactionsWeeklyCount } =
    getActivityViewEntryDetails(data)

  return {
    name: 'Ethereum',
    slug: 'ethereum',
    tpsDaily,
    tpsWeeklyChange,
    transactionsWeeklyCount,
  }
}

function getActivityViewEntryDetails(data?: ActivityApiChart['data']) {
  const tpsDaily = getTpsDaily(data)
  const tpsWeeklyChange = getTpsWeeklyChange(data)
  const transactionsWeeklyCount = getTransactionWeeklyCount(data)
  return { tpsDaily, tpsWeeklyChange, transactionsWeeklyCount }
}

export function getIncludedProjects<T extends { id: ProjectId }>(
  projects: T[],
  activityApiResponse: ActivityApiResponse,
  comingSoonProjects: ProjectId[],
) {
  return projects.filter(
    (x) =>
      !!activityApiResponse.projects[x.id.toString()] ||
      comingSoonProjects.includes(x.id),
  )
}
