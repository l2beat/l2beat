import { type Layer2, type Layer3 } from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import { getActivityProjects } from './activity/get-activity-projects'
import {
  type ActivityTableData,
  getActivityTableData,
} from './activity/get-activity-table-data'
import { getCommonScalingEntry } from './get-common-scaling-entry'

export type ScalingActivityEntry =
  | ScalingActivityProjectEntry
  | ScalingActivityEthereumEntry
type ActivityProject = Layer2 | Layer3

export async function getScalingActivityEntries() {
  const projects = getActivityProjects()
  const projectsVerificationStatuses = await getProjectsVerificationStatuses()
  const implementationChangeReport = await getImplementationChangeReport()
  const activityData = await getActivityTableData(projects)

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
  ].sort((a, b) => (b.data?.pastDayTps ?? 0) - (a.data?.pastDayTps ?? 0))
}

export type ScalingActivityProjectEntry = ReturnType<
  typeof getScalingProjectActivityEntry
>
function getScalingProjectActivityEntry(
  project: ActivityProject,
  data: ActivityTableData | undefined,
  isVerified: boolean,
  hasImplementationChanged: boolean,
) {
  return {
    ...getCommonScalingEntry({
      project,
      isVerified,
      hasImplementationChanged,
    }),
    dataSource: project.display.activityDataSource,
    data,
  }
}

export type ScalingActivityEthereumEntry = ReturnType<typeof getEthereumEntry>
function getEthereumEntry(data: ActivityTableData) {
  return {
    id: ProjectId.ETHEREUM,
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
    isVerified: true,
    showProjectUnderReview: false,
    stage: { stage: 'NotApplicable' },
    data,
  }
}
