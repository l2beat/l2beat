import { type Layer2, type Layer3 } from '@l2beat/config'
import { assert, ProjectId, notUndefined } from '@l2beat/shared-pure'
import { type SetOptional } from 'type-fest'
import { env } from '~/env'
import { groupByMainCategories } from '~/utils/group-by-main-categories'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import { getCurrentEntry } from '../../utils/get-current-entry'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import {
  type CommonScalingEntry,
  getCommonScalingEntry,
} from '../get-common-scaling-entry'
import {
  orderByStageAndPastDayUops,
  sortByUops,
} from '../utils/order-by-stage-and-past-day-uops'
import {
  type ActivityProjectTableData,
  getActivityTable,
} from './get-activity-table-data'
import { getActivityProjects } from './utils/get-activity-projects'

type ActivityProject = Layer2 | Layer3

export async function getScalingActivityEntries() {
  const projects = getActivityProjects()
  const [projectsVerificationStatuses, projectsChangeReport, activityData] =
    await Promise.all([
      getProjectsVerificationStatuses(),
      getProjectsChangeReport(),
      getActivityTable(projects),
    ])

  const ethereumData = activityData[ProjectId.ETHEREUM]
  assert(ethereumData !== undefined, 'Ethereum data not found')

  const entries = projects
    .map((project) => {
      const isVerified = !!projectsVerificationStatuses[project.id]
      const data = activityData[project.id]
      if (!data) {
        return undefined
      }
      return getScalingProjectActivityEntry(
        project,
        data,
        isVerified,
        projectsChangeReport,
      )
    })
    .filter(notUndefined)
    .sort((a, b) => b.data.uops.pastDayCount - a.data.uops.pastDayCount)

  const categorisedEntries = groupByMainCategories(
    orderByStageAndPastDayUops(entries),
  )

  if (!env.NEXT_PUBLIC_FEATURE_FLAG_STAGE_SORTING) {
    return {
      rollups: [
        getEthereumEntry(ethereumData, 'Rollups'),
        ...categorisedEntries.rollups,
      ].sort(sortByUops),
      validiumsAndOptimiums: [
        getEthereumEntry(ethereumData, 'ValidiumsAndOptimiums'),
        ...categorisedEntries.validiumsAndOptimiums,
      ].sort(sortByUops),
      others: categorisedEntries.others
        ? [
            getEthereumEntry(ethereumData, 'Others'),
            ...categorisedEntries.others,
          ].sort(sortByUops)
        : undefined,
    }
  }

  return {
    rollups: [
      getEthereumEntry(ethereumData, 'Rollups'),
      ...categorisedEntries.rollups,
    ],
    validiumsAndOptimiums: [
      getEthereumEntry(ethereumData, 'ValidiumsAndOptimiums'),
      ...categorisedEntries.validiumsAndOptimiums,
    ],
    others: categorisedEntries.others
      ? [getEthereumEntry(ethereumData, 'Others'), ...categorisedEntries.others]
      : undefined,
  }
}

export type ScalingActivityEntry = SetOptional<
  ReturnType<typeof getScalingProjectActivityEntry>,
  'href'
>
function getScalingProjectActivityEntry(
  project: ActivityProject,
  data: ActivityProjectTableData,
  isVerified: boolean,
  projectsChangeReport: ProjectsChangeReport,
) {
  const currentDataAvailability = getCurrentEntry(project.dataAvailability)
  return {
    ...getCommonScalingEntry({
      project,
      isVerified,
      hasImplementationChanged: projectsChangeReport.hasImplementationChanged(
        project.id,
      ),
      hasHighSeverityFieldChanged:
        projectsChangeReport.hasHighSeverityFieldChanged(project.id),
    }),
    href: `/scaling/projects/${project.display.slug}#activity`,
    entryType: 'activity' as const,
    dataSource: project.display.activityDataSource,
    dataAvailability: {
      layer: currentDataAvailability?.layer,
    },
    data,
  }
}

function getEthereumEntry(
  data: ActivityProjectTableData,
  tab: CommonScalingEntry['tab'],
): ScalingActivityEntry {
  return {
    id: ProjectId.ETHEREUM,
    name: 'Ethereum',
    shortName: undefined,
    slug: 'ethereum',
    type: undefined,
    category: undefined,
    isOther: undefined,
    provider: undefined,
    purposes: [],
    warning: undefined,
    headerWarning: undefined,
    redWarning: undefined,
    isVerified: true,
    isArchived: false,
    hostChain: undefined,
    href: undefined,
    isUpcoming: false,
    underReviewStatus: undefined,
    stage: { stage: 'NotApplicable' as const },
    badges: [],
    // ---
    tab,
    stageOrder: 3,
    filterable: undefined,
    // ---
    entryType: 'activity' as const,
    dataSource: 'Blockchain RPC' as const,
    dataAvailability: {
      layer: undefined,
    },
    data,
  }
}
