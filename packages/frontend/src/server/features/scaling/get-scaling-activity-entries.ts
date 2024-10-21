import { type Layer2, type Layer3 } from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import {
  type ActivityProjectTableData,
  getActivityTableData,
} from './activity/get-activity-table-data'
import { getActivityProjects } from './activity/utils/get-activity-projects'
import { getCommonScalingEntry } from './get-common-scaling-entry'

type ActivityProject = Layer2 | Layer3

export async function getScalingActivityEntries() {
  const projects = getActivityProjects()
  const [
    projectsVerificationStatuses,
    implementationChangeReport,
    activityData,
  ] = await Promise.all([
    getProjectsVerificationStatuses(),
    getImplementationChangeReport(),
    getActivityTableData(projects),
  ])

  const ethereumData = activityData[ProjectId.ETHEREUM]
  assert(ethereumData !== undefined, 'Ethereum data not found')

  return [
    getEthereumEntry(ethereumData),
    ...projects.map((project) => {
      const isVerified = !!projectsVerificationStatuses[project.id]
      const hasImplementationChanged =
        !!implementationChangeReport.projects[project.id]
      const data = activityData[project.id]
      return getScalingProjectActivityEntry(
        project,
        data,
        isVerified,
        hasImplementationChanged,
      )
    }),
  ]
    .filter((e) => e.data)
    .sort((a, b) => (b.data?.pastDayUops ?? 0) - (a.data?.pastDayUops ?? 0))
}

export type ScalingActivityEntry = ReturnType<
  typeof getScalingProjectActivityEntry
>

function getScalingProjectActivityEntry(
  project: ActivityProject,
  data: ActivityProjectTableData | undefined,
  isVerified: boolean,
  hasImplementationChanged: boolean,
) {
  return {
    ...getCommonScalingEntry({
      project,
      isVerified,
      hasImplementationChanged,
    }),
    entryType: 'activity' as const,
    dataSource: project.display.activityDataSource,
    data,
  }
}

function getEthereumEntry(data: ActivityProjectTableData) {
  return {
    ...getCommonScalingEntry({ project: 'ethereum' }),
    entryType: 'activity' as const,

    dataSource: 'Blockchain RPC' as const,
    data,
  }
}
