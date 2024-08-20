import { type Layer2, type Layer3, badgesCompareFn } from '@l2beat/config'
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getContractsVerificationStatuses } from '../../verification-status/get-contracts-verification-statuses'
import { getManuallyVerifiedContracts } from '../../verification-status/get-manually-verified-contracts'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getActivityProjectStats } from '../activity/get-activity-project-stats'
import { getL2ProjectDetails } from './utils/get-l2-project-details'
import { getScalingRosetteValues } from './utils/get-scaling-rosette-values'
import { getL3ProjectDetails } from './utils/get-l3-project-details'
import { getTvlProjectData } from '../tvl/get-tvl-project-data'
import { formatPercent } from '~/utils/get-percentage-change'

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

  return {
    type: project.type,
    name: project.display.name,
    slug: project.display.slug,
    isUnderReview: project.isUnderReview,
    isArchived: project.isArchived,
    stageConfig:
      project.type === 'layer2'
        ? project.stage
        : {
            stage: 'NotApplicable' as const,
          },
    header,
    projectDetails:
      project.type === 'layer2'
        ? getL2ProjectDetails({
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
          }),
  }
}

async function getHeader(project: ScalingProject) {
  const projectStats = await getActivityProjectStats(project.id)
  const tvlProjectData = (await getTvlProjectData(project.id))!
  const associatedRatio =
    tvlProjectData.tokenBreakdown.associated /
    tvlProjectData.tokenBreakdown.total

  return {
    description: project.display.description,
    category: project.display.category,
    purposes: project.display.purposes,
    activity: projectStats,
    rosetteValues: getScalingRosetteValues(project.riskView),
    links: getProjectLinks(project.display.links),
    tokenBreakdown: {
      ...tvlProjectData.tokenBreakdown,
      warning: getTvlWarning(
        associatedRatio,
        project.display.name,
        project.config.associatedTokens ?? [],
      ),
      associatedTokens: project.config.associatedTokens,
    },
    tvlBreakdown: tvlProjectData.tvlBreakdown,
    badges:
      project.badges && project.badges.length !== 0
        ? project.badges?.sort(badgesCompareFn)
        : undefined,
  }
}

function getTvlWarning(
  associatedRatio: number,
  name: string,
  associatedTokens: string[],
) {
  if (associatedRatio < 0.1) return
  const sentiment: 'bad' | 'warning' = associatedRatio > 0.8 ? 'bad' : 'warning'

  const percent = formatPercent(associatedRatio)
  if (associatedTokens.length === 1) {
    const what = `The ${associatedTokens[0]} token associated with ${name}`
    return {
      content: `${what} accounts for ${percent} of the TVL!`,
      sentiment,
    }
  } else {
    const joined = associatedTokens.join(' and ')
    const what = `The ${joined} tokens associated with ${name}`
    return {
      content: `${what} account for ${percent} of the TVL!`,
      sentiment,
    }
  }
}
