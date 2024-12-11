import {
  type Layer2,
  type Layer3,
  type ScalingProjectDisplay,
} from '@l2beat/config'
import { assert, ProjectId, notUndefined } from '@l2beat/shared-pure'
import { env } from 'process'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import {
  type CommonScalingEntry,
  getCommonScalingEntry,
} from '../get-common-scaling-entry'
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
    .concat(
      getEthereumEntry(ethereumData, 'Rollups'),
      getEthereumEntry(ethereumData, 'ValidiumsAndOptimiums'),
      getEthereumEntry(ethereumData, 'Others'),
    )
    .sort(compareActivityEntry)

  return groupByTabs(entries)
}

export interface ScalingActivityEntry extends CommonScalingEntry {
  dataSource: ScalingProjectDisplay['activityDataSource']
  data: ActivityProjectTableData
}

function getScalingProjectActivityEntry(
  project: ActivityProject,
  data: ActivityProjectTableData,
  isVerified: boolean,
  projectsChangeReport: ProjectsChangeReport,
): ScalingActivityEntry {
  return {
    ...getCommonScalingEntry({
      project,
      isVerified,
      hasImplementationChanged: projectsChangeReport.hasImplementationChanged(
        project.id,
      ),
      hasHighSeverityFieldChanged:
        projectsChangeReport.hasHighSeverityFieldChanged(project.id),
      syncStatus: data.syncStatus,
    }),
    href: `/scaling/projects/${project.display.slug}#activity`,
    dataSource: project.display.activityDataSource,
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
    href: undefined,
    tab,
    // Ethereum is always at the top so it is always stageOrder 3
    stageOrder: 3,
    filterable: undefined,
    dataSource: 'Blockchain RPC',
    data,
    statuses: undefined,
  }
}

function compareActivityEntry(
  a: ScalingActivityEntry,
  b: ScalingActivityEntry,
) {
  if (env.NEXT_PUBLIC_FEATURE_FLAG_STAGE_SORTING) {
    const stageDiff = b.stageOrder - a.stageOrder
    if (stageDiff !== 0) {
      return stageDiff
    }
  }
  const diff = b.data.uops.pastDayCount - a.data.uops.pastDayCount
  if (diff !== 0) {
    return diff
  }
  return a.name.localeCompare(b.name)
}
