import { type Layer2, type Layer3, badgesCompareFn } from '@l2beat/config'
import { compact } from 'lodash'
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getContractsVerificationStatuses } from '../../verification-status/get-contracts-verification-statuses'
import { getManuallyVerifiedContracts } from '../../verification-status/get-manually-verified-contracts'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getActivityProjectStats } from '../activity/get-activity-project-stats'
import { getTvlProjectStats } from '../tvl/get-tvl-project-stats'
import { getAssociatedTokenWarning } from '../tvl/utils/get-associated-token-warning'
import { getL2ProjectDetails } from './utils/get-l2-project-details'
import { getL3ProjectDetails } from './utils/get-l3-project-details'
import { getScalingRosetteValues } from './utils/get-scaling-rosette-values'

type ScalingProject = Layer2 | Layer3

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
  const isImplementationUnderReview =
    !!implementationChangeReport.projects[project.id]

  const projectDetails =
    project.type === 'layer2'
      ? await getL2ProjectDetails({
          project,
          isVerified,
          contractsVerificationStatuses,
          manuallyVerifiedContracts,
          implementationChangeReport,
          rosetteValues: getScalingRosetteValues(project.riskView),
        })
      : getL3ProjectDetails({
          project,
          isVerified,
          contractsVerificationStatuses,
          manuallyVerifiedContracts,
          implementationChangeReport,
          rosetteValues: getScalingRosetteValues(project.riskView),
        })

  return {
    type: project.type,
    name: project.display.name,
    slug: project.display.slug,
    isUnderReview: !!project.isUnderReview,
    isArchived: !!project.isArchived,
    isUpcoming: !!project.isUpcoming,
    isImplementationUnderReview,
    stageConfig:
      project.type === 'layer2'
        ? project.stage
        : {
            stage: 'NotApplicable' as const,
          },
    header,
    projectDetails,
  }
}

async function getHeader(project: ScalingProject) {
  const [activityProjectStats, tvlProjectStats] = await Promise.all([
    getActivityProjectStats(project.id),
    getTvlProjectStats(project.id),
  ])

  const associatedTokens = project.config.associatedTokens ?? []
  return {
    description: project.display.description,
    warning: project.display.headerWarning,
    category: project.display.category,
    purposes: project.display.purposes,
    activity: activityProjectStats,
    rosetteValues: getScalingRosetteValues(project.riskView),
    links: getProjectLinks(project.display.links),
    tvl: tvlProjectStats
      ? {
          tokenBreakdown: {
            ...tvlProjectStats.tokenBreakdown,
            warnings: compact([
              tvlProjectStats.tokenBreakdown.total > 0 &&
                getAssociatedTokenWarning({
                  associatedRatio:
                    tvlProjectStats.tokenBreakdown.associated /
                    tvlProjectStats.tokenBreakdown.total,
                  name: project.display.name,
                  associatedTokens,
                }),
            ]),
            associatedTokens,
          },
          tvlBreakdown: {
            ...tvlProjectStats.tvlBreakdown,
            warning: project.display.tvlWarning,
          },
        }
      : undefined,
    badges:
      project.badges && project.badges.length !== 0
        ? project.badges?.sort(badgesCompareFn)
        : undefined,
  }
}
