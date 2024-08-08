import { type Layer2, type Layer3, layer2s, layer3s } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from './get-common-scaling-entry'

export type ScalingActivityEntry =
  | ScalingProjectActivityEntry
  | ScalingActivityEthereumEntry
type ActivityProject = Layer2 | Layer3

export async function getScalingActivityEntries() {
  const projects = getIncludedProjects()
  const projectsVerificationStatuses = await getProjectsVerificationStatuses()
  const implementationChangeReport = await getImplementationChangeReport()

  return [
    getEthereumEntry(),
    ...projects.map((project) => {
      const isVerified = !!projectsVerificationStatuses[project.id]
      const hasImplementationChanged =
        !!implementationChangeReport.projects[project.id]
      return getScalingProjectActivityEntry(
        project,
        isVerified,
        hasImplementationChanged,
      )
    }),
  ]
}

export type ScalingProjectActivityEntry = ReturnType<
  typeof getScalingProjectActivityEntry
>
function getScalingProjectActivityEntry(
  project: ActivityProject,
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
  }
}

export type ScalingActivityEthereumEntry = ReturnType<typeof getEthereumEntry>
function getEthereumEntry() {
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
  }
}

function getIncludedProjects() {
  return [...layer2s, ...layer3s].filter(
    (project) =>
      !project.isUpcoming &&
      !project.isArchived &&
      project.config.transactionApi !== undefined,
  )
}
