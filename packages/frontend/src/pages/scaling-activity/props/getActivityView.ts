import { Layer2 } from '@l2beat/config'
import { ActivityApiChart, ActivityApiResponse, ProjectId } from '@l2beat/types'

import { getMaxTps } from '../../../utils/activity/getMaxTps'
import { getTpsDaily } from '../../../utils/activity/getTpsDaily'
import { getTpsWeeklyChange } from '../../../utils/activity/getTpsWeeklyChange'
import { getTransactionCount } from '../../../utils/activity/getTransactionCount'
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
  return {
    name: project.display.name,
    slug: project.display.slug,
    provider: project.technology.provider,
    warning: project.display.warning,
    dataSource: project.display.activityDataSource,
    ...getActivityViewEntryDetails(data),
  }
}

function getEthereumActivityViewEntry(
  activityApiResponse: ActivityApiResponse,
) {
  const data = activityApiResponse.ethereum?.data
  return {
    name: 'Ethereum',
    slug: 'ethereum',
    ...getActivityViewEntryDetails(data),
  }
}

function getActivityViewEntryDetails(data?: ActivityApiChart['data']) {
  return {
    tpsDaily: getTpsDaily(data),
    tpsWeeklyChange: getTpsWeeklyChange(data),
    transactionsMonthlyCount: getTransactionCount(data, 'month'),
    ...getMaxTps(data),
  }
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
