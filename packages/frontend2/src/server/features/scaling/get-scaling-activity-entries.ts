import { type Layer2, type Layer3, layer2s, layer3s } from '@l2beat/config'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from './get-common-scaling-entry'

type ActivityProject = Layer2 | Layer3

export async function getScalingActivityEntries() {
  const projects = getIncludedProjects()
  const projectsVerificationStatuses = await getProjectsVerificationStatuses()
  const implementationChangeReport = await getImplementationChangeReport()

  return projects.map((project) => {
    const isVerified = !!projectsVerificationStatuses[project.id]
    const hasImplementationChanged =
      !!implementationChangeReport.projects[project.id]
    return getScalingActivityEntry(
      project,
      isVerified,
      hasImplementationChanged,
    )
  })
}

export type ScalingActivityEntry = ReturnType<typeof getScalingActivityEntry>
function getScalingActivityEntry(
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
  }
}

function getIncludedProjects() {
  return [...layer2s, ...layer3s].filter(
    (project) => !project.isUpcoming && !project.isArchived,
  )
}
