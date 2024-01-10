import { Layer2 } from '@l2beat/config'
import {
  ActivityApiChart,
  ActivityApiResponse,
  ProjectId,
  VerificationStatus,
} from '@l2beat/shared-pure'

import { getMaxTps } from '../../../../utils/activity/getMaxTps'
import { getTpsDaily } from '../../../../utils/activity/getTpsDaily'
import { getTpsWeeklyChange } from '../../../../utils/activity/getTpsWeeklyChange'
import { getTransactionCount } from '../../../../utils/activity/getTransactionCount'
import { isAnySectionUnderReview } from '../../../../utils/project/isAnySectionUnderReview'
import { ActivityPagesData, ActivityViewEntry } from '../types'
import { ScalingActivityViewProps } from '../view/ScalingActivityView'

export function getScalingActivityView(
  projects: Layer2[],
  pagesData: ActivityPagesData,
): ScalingActivityViewProps {
  const { activityApiResponse, verificationStatus } = pagesData

  const included = getIncludedProjects(projects, activityApiResponse, [])
  const items = [
    ...included.map((x) =>
      getScalingActivityViewEntry(x, activityApiResponse, verificationStatus),
    ),
    getEthereumActivityViewEntry(activityApiResponse),
  ]

  return {
    items: items.sort((a, b) => (b.tpsDaily ?? -1) - (a.tpsDaily ?? -1)),
  }
}

export function getScalingActivityViewEntry(
  project: Layer2,
  activityApiResponse: ActivityApiResponse,
  verificationStatus: VerificationStatus,
): ActivityViewEntry {
  const data = activityApiResponse.projects[project.id.toString()]?.daily.data
  const isVerified = verificationStatus.projects[project.id.toString()]

  return {
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    category: project.display.category,
    provider: project.display.provider,
    warning: project.display.warning,
    redWarning: project.display.redWarning,
    purpose: project.display.purpose,
    isVerified,
    showProjectUnderReview: isAnySectionUnderReview(project),
    dataSource: project.display.activityDataSource,
    stage: project.stage,
    ...getActivityViewEntryDetails(data, 'project'),
  }
}

function getEthereumActivityViewEntry(
  activityApiResponse: ActivityApiResponse,
): ActivityViewEntry {
  const data = activityApiResponse.combined.daily.data
  return {
    name: 'Ethereum',
    shortName: undefined,
    slug: 'ethereum',
    dataSource: 'Blockchain RPC',
    category: undefined,
    provider: undefined,
    purpose: undefined,
    warning: undefined,
    redWarning: undefined,
    isVerified: undefined,
    showProjectUnderReview: undefined,
    stage: undefined,
    ...getActivityViewEntryDetails(data, 'ethereum'),
  }
}

function getActivityViewEntryDetails(
  data: ActivityApiChart['data'] | undefined,
  type: 'project' | 'ethereum',
) {
  return {
    tpsDaily: getTpsDaily(data, type),
    tpsWeeklyChange: getTpsWeeklyChange(data, type),
    transactionsMonthlyCount: getTransactionCount(data, type, 'month'),
    ...getMaxTps(data, type),
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
