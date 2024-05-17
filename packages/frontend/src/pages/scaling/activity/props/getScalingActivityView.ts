import { Layer2, Layer3 } from '@l2beat/config'
import {
  assert,
  ActivityApiChart,
  ActivityApiResponse,
  ImplementationChangeReportApiResponse,
  UnixTime,
  VerificationStatus,
} from '@l2beat/shared-pure'

import { formatTimestamp } from '../../../../utils'
import { getMaxTps } from '../../../../utils/activity/getMaxTps'
import { getTpsDaily } from '../../../../utils/activity/getTpsDaily'
import { getTpsWeeklyChange } from '../../../../utils/activity/getTpsWeeklyChange'
import { getTransactionCount } from '../../../../utils/activity/getTransactionCount'
import { isAnySectionUnderReview } from '../../../project/common/isAnySectionUnderReview'
import {
  ActivityPagesData,
  ActivityViewEntry,
  ActivityViewEntryData,
} from '../types'
import { ScalingActivityViewProps } from '../view/ScalingActivityView'

export function getScalingActivityView(
  projects: (Layer2 | Layer3)[],
  pagesData: ActivityPagesData,
): ScalingActivityViewProps {
  const { activityApiResponse, verificationStatus, implementationChange } =
    pagesData

  const included = getIncludedProjects(projects)
  const items = [
    ...included.map((x) =>
      getScalingActivityViewEntry(
        x,
        activityApiResponse,
        verificationStatus,
        implementationChange,
      ),
    ),
    getEthereumActivityViewEntry(activityApiResponse),
  ]

  return {
    items: items.sort(
      (a, b) => (b.data?.tpsDaily ?? -1) - (a.data?.tpsDaily ?? -1),
    ),
  }
}

export function getScalingActivityViewEntry(
  project: Layer2 | Layer3,
  activityApiResponse: ActivityApiResponse,
  verificationStatus: VerificationStatus,
  implementationChange?: ImplementationChangeReportApiResponse,
): ActivityViewEntry {
  const data = activityApiResponse.projects[project.id.toString()]?.daily.data
  const isVerified = verificationStatus.projects[project.id.toString()]
  const hasImplementationChanged =
    !!implementationChange?.projects[project.id.toString()]
  const combinedSyncedUntil =
    activityApiResponse.combined.daily.data.at(-1)?.[0]
  assert(combinedSyncedUntil !== undefined, 'combinedSyncedUntil is undefined')

  return {
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    type: project.type,
    category: project.display.category,
    provider: project.display.provider,
    warning: project.display.warning,
    redWarning: project.display.redWarning,
    purposes: project.display.purposes,
    hasImplementationChanged,
    isVerified,
    showProjectUnderReview: isAnySectionUnderReview(project),
    dataSource: project.display.activityDataSource,
    stage: project.type === 'layer2' ? project.stage : undefined,
    data: getActivityViewEntryDetails(data, 'project', combinedSyncedUntil),
  }
}

function getEthereumActivityViewEntry(
  activityApiResponse: ActivityApiResponse,
): ActivityViewEntry {
  const data = activityApiResponse.combined.daily.data
  const combinedSyncedUntil =
    activityApiResponse.combined.daily.data.at(-1)?.[0]
  assert(combinedSyncedUntil !== undefined, 'combinedSyncedUntil is undefined')

  return {
    name: 'Ethereum',
    shortName: undefined,
    slug: 'ethereum',
    type: undefined,
    dataSource: 'Blockchain RPC',
    category: undefined,
    provider: undefined,
    purposes: undefined,
    warning: undefined,
    redWarning: undefined,
    isVerified: undefined,
    showProjectUnderReview: undefined,
    stage: undefined,
    data: getActivityViewEntryDetails(data, 'ethereum', combinedSyncedUntil),
  }
}

function getActivityViewEntryDetails(
  data: ActivityApiChart['data'] | undefined,
  type: 'project' | 'ethereum',
  combinedSyncedUntil: UnixTime,
): ActivityViewEntryData | undefined {
  if (!data || data.length === 0) {
    return undefined
  }

  const syncedUntil = data.at(-1)?.[0]
  assert(syncedUntil !== undefined, 'syncedUntil is undefined')
  return {
    tpsDaily: getTpsDaily(data, type),
    tpsWeeklyChange: getTpsWeeklyChange(data, type),
    transactionsMonthlyCount: getTransactionCount(data, type, 30),
    syncStatus: {
      isSynced: syncedUntil.gte(combinedSyncedUntil),
      displaySyncedUntil: formatTimestamp(syncedUntil.toNumber(), {
        mode: 'datetime',
        longMonthName: true,
      }),
    },
    ...getMaxTps(data, type),
  }
}

function getIncludedProjects<T extends Layer2 | Layer3>(projects: T[]) {
  return projects.filter(
    (x) => (x.type === 'layer2' ? !x.isArchived : true) && !x.isUpcoming,
  )
}
