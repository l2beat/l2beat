import { Layer2 } from '@l2beat/config'
import { ActivityApiChart, ActivityApiResponse, ProjectId } from '@l2beat/types'

import { getTpsDaily } from '../../../utils/activity/getTpsDaily'
import { getTpsWeeklyChange } from '../../../utils/activity/getTpsWeeklyChange'
import { getTransactionWeeklyCount } from '../../../utils/activity/getTransactionWeeklyCount'
import { formatPercent } from '../../../utils/utils'
import { ActivityViewEntry, ActivityViewProps } from '../view/ActivityView'

export function getActivityView(
  projects: Layer2[],
  activityApiResponse: ActivityApiResponse,
  tpsCombined?: number,
): ActivityViewProps {
  const included = getIncludedProjects(projects, activityApiResponse)
  const items = included.map((x) =>
    getActivityViewEntry(x, activityApiResponse, tpsCombined),
  )
  items.push(getEthereumActivityViewEntry(activityApiResponse))

  return {
    items: items.sort((a, b) => (b.tpsDaily ?? -1) - (a.tpsDaily ?? -1)),
  }
}

export function getActivityViewEntry(
  project: Layer2,
  activityApiResponse: ActivityApiResponse,
  tpsCombined?: number,
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
    marketShare:
      tpsDaily && tpsCombined
        ? formatPercent(tpsDaily / tpsCombined)
        : undefined,
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
    provider: undefined,
    marketShare: undefined,
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
) {
  return projects.filter((x) => !!activityApiResponse.projects[x.id.toString()])
}
