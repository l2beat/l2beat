import { Layer2 } from '@l2beat/config'
import {
  ActivityApiChart,
  ActivityApiResponse,
  ProjectId,
  VerificationStatus,
} from '@l2beat/shared-pure'

import { getMaxTps } from '../../../utils/activity/getMaxTps'
import { getTpsDaily } from '../../../utils/activity/getTpsDaily'
import { getTpsWeeklyChange } from '../../../utils/activity/getTpsWeeklyChange'
import { getTransactionCount } from '../../../utils/activity/getTransactionCount'
import { isAnySectionUnderReview } from '../../../utils/project/isAnySectionUnderReview'
import { ActivityViewEntry, ActivityViewProps } from '../view/ActivityView'

export function getActivityView(
  projects: Layer2[],
  activityApiResponse: ActivityApiResponse,
  verificationStatus: VerificationStatus,
): ActivityViewProps {
  const included = getIncludedProjects(projects, activityApiResponse, [])
  const items = included.map((x) =>
    getActivityViewEntry(x, activityApiResponse, verificationStatus),
  )
  items.push(getEthereumActivityViewEntry(activityApiResponse))

  return {
    items: items.sort((a, b) => (b.tpsDaily ?? -1) - (a.tpsDaily ?? -1)),
  }
}

export function getActivityViewEntry(
  project: Layer2,
  activityApiResponse: ActivityApiResponse,
  verificationStatus: VerificationStatus,
): ActivityViewEntry {
  const data = activityApiResponse.projects[project.id.toString()]?.data
  const isVerified = verificationStatus.projects[project.id.toString()]

  return {
    name: project.display.name,
    slug: project.display.slug,
    provider: project.display.provider,
    warning: project.display.warning,
    isVerified,
    showProjectUnderReview: isAnySectionUnderReview(project),
    dataSource: project.display.activityDataSource,
    ...getActivityViewEntryDetails(data),
  }
}

function getEthereumActivityViewEntry(
  activityApiResponse: ActivityApiResponse,
) {
  const data = activityApiResponse.ethereum.data
  return {
    name: 'Ethereum',
    slug: 'ethereum',
    dataSource: 'Blockchain RPC',
    verificationStatus: true,
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
