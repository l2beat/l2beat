import {
  type DataAvailabilityWithSentiment,
  type Layer2,
  type Layer3,
  type ScalingProjectDisplay,
} from '@l2beat/config'
import { assert, ProjectId, notUndefined } from '@l2beat/shared-pure'
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
  const ethereumEntry = getEthereumEntry(ethereumData)

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
      rollups: [ethereumEntry, ...categorisedEntries.rollups].sort(sortByUops),
      validiumsAndOptimiums: [
        ethereumEntry,
        ...categorisedEntries.validiumsAndOptimiums,
      ].sort(sortByUops),
      others: categorisedEntries.others
        ? [ethereumEntry, ...categorisedEntries.others].sort(sortByUops)
        : undefined,
    }
  }

  return {
    rollups: [ethereumEntry, ...categorisedEntries.rollups],
    validiumsAndOptimiums: [
      ethereumEntry,
      ...categorisedEntries.validiumsAndOptimiums,
    ],
    others: categorisedEntries.others
      ? [ethereumEntry, ...categorisedEntries.others]
      : undefined,
  }
}

export interface ScalingActivityEntry extends CommonScalingEntry {
  entryType: 'activity'
  dataSource: ScalingProjectDisplay['activityDataSource']
  dataAvailability: {
    layer: DataAvailabilityWithSentiment['layer'] | undefined
  }
  data: ActivityProjectTableData
}

function getScalingProjectActivityEntry(
  project: ActivityProject,
  data: ActivityProjectTableData,
  isVerified: boolean,
  projectsChangeReport: ProjectsChangeReport,
): ScalingActivityEntry {
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
    entryType: 'activity',
    dataSource: project.display.activityDataSource,
    dataAvailability: {
      layer: currentDataAvailability?.layer,
    },
    data,
  }
}

function getEthereumEntry(
  data: ActivityProjectTableData,
): ScalingActivityEntry {
  return {
    id: ProjectId.ETHEREUM,
    basicInfo: {
      name: 'Ethereum',
      slug: 'ethereum',
    },
    statuses: {},
    entryType: 'activity',
    dataSource: 'Blockchain RPC',
    dataAvailability: {
      layer: undefined,
    },
    filterable: undefined,
    data,

    // TODO: remove all those!
    name: 'Ethereum',
    shortName: undefined,
    slug: 'ethereum',
    href: '',
    category: 'Optimistic Rollup',
    isOther: false,
    isVerified: true,
    underReviewStatus: undefined,
    isArchived: false,
    isUpcoming: false,
    warning: undefined,
    headerWarning: undefined,
    redWarning: undefined,
    purposes: [],
    badges: [],
    type: 'layer2',
    provider: undefined,
    hostChain: undefined,
    stage: { stage: 'NotApplicable' },
  }
}
