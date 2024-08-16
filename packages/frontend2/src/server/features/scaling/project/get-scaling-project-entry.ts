import { type Layer2 } from '@l2beat/config'
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getScalingRosetteValues } from './utils/get-scaling-rosette-values'
import { getProjectDetails } from './utils/get-project-details'
import { getContractsVerificationStatuses } from '../../verification-status/get-contracts-verification-statuses'
import { getManuallyVerifiedContracts } from '../../verification-status/get-manually-verified-contracts'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getActivityProjectStats } from '../activity/get-activity-project-stats'

export type ScalingProject = Layer2

export type ScalingProjectEntry = Awaited<
  ReturnType<typeof getScalingProjectEntry>
>

export async function getScalingProjectEntry(project: ScalingProject) {
  const [
    projectsVerificationStatuses,
    contractsVerificationStatuses,
    manuallyVerifiedContracts,
    implementationChangeReport,
    header,
  ] = await Promise.all([
    getProjectsVerificationStatuses(),
    getContractsVerificationStatuses(project),
    getManuallyVerifiedContracts(project),
    getImplementationChangeReport(),
    getHeader(project),
  ])

  const isVerified = !!projectsVerificationStatuses[project.id]

  return {
    type: project.type,
    name: project.display.name,
    slug: project.display.slug,
    description: project.display.description,
    isUnderReview: project.isUnderReview,
    category: project.display.category,
    purposes: project.display.purposes,
    stageConfig:
      project.type === 'layer2'
        ? project.stage
        : {
            stage: 'NotApplicable' as const,
          },
    header,
    projectDetails: getProjectDetails({
      project,
      isVerified,
      contractsVerificationStatuses,
      manuallyVerifiedContracts,
      implementationChangeReport,
      rosetteValues: getScalingRosetteValues(project.riskView),
    }),
  }
}

async function getHeader(project: ScalingProject) {
  const projectStats = await getActivityProjectStats(project.id)

  return {
    activity: projectStats,
    rosetteValues: getScalingRosetteValues(project.riskView),
    links: getProjectLinks(project.display.links),
  }
}
