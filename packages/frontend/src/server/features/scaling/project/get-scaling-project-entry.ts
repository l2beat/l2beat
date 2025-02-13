import type { Layer2, Layer3 } from '@l2beat/config'
import { badges, badgesCompareFn, isVerified, layer2s } from '@l2beat/config'
import { compact } from 'lodash'
import { env } from '~/env'
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import { getActivityProjectStats } from '../activity/get-activity-project-stats'
import { getTvsProjectStats } from '../tvs/get-tvs-project-stats'
import { getAssociatedTokenWarning } from '../tvs/utils/get-associated-token-warning'
import { getCountdowns } from '../utils/get-countdowns'
import { isProjectOther } from '../utils/is-project-other'
import { getDaSolution } from './get-scaling-project-da-solution'
import { getL2ProjectDetails } from './utils/get-l2-project-details'
import { getL3ProjectDetails } from './utils/get-l3-project-details'
import { getScalingRosetteValues } from './utils/get-scaling-rosette-values'

export type ScalingProject = Layer2 | Layer3

export type ScalingProjectEntry = Awaited<
  ReturnType<typeof getScalingProjectEntry>
>

export async function getScalingProjectEntry(project: ScalingProject) {
  const [projectsChangeReport, header] = await Promise.all([
    getProjectsChangeReport(),
    getHeader(project),
  ])

  const changes = projectsChangeReport.getChanges(project.id)
  const common = {
    type: project.type,
    capability: project.capability,
    name: project.display.name,
    slug: project.display.slug,
    underReviewStatus: getUnderReviewStatus({
      isUnderReview: !!project.isUnderReview,
      ...changes,
    }),
    isArchived: !!project.isArchived,
    isUpcoming: !!project.isUpcoming,
    header,
    reasonsForBeingOther: project.reasonsForBeingOther,
    countdowns: getCountdowns(project),
  }
  const daSolution = await getDaSolution(project)

  const rosetteValues = getScalingRosetteValues(project.riskView)
  const isProjectVerified = isVerified(project)

  if (project.type === 'layer2') {
    const projectDetails = await getL2ProjectDetails({
      project,
      isVerified: isProjectVerified,
      projectsChangeReport,
      rosetteValues,
      daSolution,
    })

    return {
      ...common,
      type: project.type,
      stageConfig: isProjectOther(project)
        ? {
            stage: 'NotApplicable' as const,
          }
        : project.stage,
      projectDetails,
      header,
    }
  }

  // L3
  const hostChain = layer2s.find((layer2) => layer2.id === project.hostChain)
  const baseLayerRosetteValues = hostChain
    ? getScalingRosetteValues(hostChain.riskView)
    : undefined
  const stackedRosetteValues = project.stackedRiskView
    ? getScalingRosetteValues(project.stackedRiskView)
    : undefined
  const isHostChainVerified =
    hostChain === undefined ? false : isVerified(hostChain)

  const projectDetails = await getL3ProjectDetails({
    project,
    hostChain,
    isVerified: isProjectVerified,
    daSolution,
    rosetteValues,
    isHostChainVerified,
    projectsChangeReport,
    combinedRosetteValues: stackedRosetteValues,
    hostChainRosetteValues: baseLayerRosetteValues,
  })

  return {
    ...common,
    type: project.type,
    stageConfig: {
      stage: 'NotApplicable' as const,
    },
    baseLayerRosetteValues,
    stackedRosetteValues,
    hostChainName: hostChain?.display.name,
    projectDetails,
  }
}

async function getHeader(project: ScalingProject) {
  const [activityProjectStats, tvsProjectStats] = await Promise.all([
    getActivityProjectStats(project.id),
    getTvsProjectStats(project),
  ])

  const associatedTokens = project.config.associatedTokens ?? []
  return {
    description: project.display.description,
    warning: project.display.headerWarning,
    redWarning: project.display.redWarning,
    category: isProjectOther(project) ? 'Other' : project.display.category,
    purposes: project.display.purposes,
    activity: activityProjectStats,
    rosetteValues: getScalingRosetteValues(project.riskView),
    links: getProjectLinks(project.display.links),
    hostChain:
      project.type === 'layer3'
        ? (layer2s.find((l) => l.id === project.hostChain)?.display.name ??
          project.hostChain)
        : undefined,
    tvs: !env.EXCLUDED_TVS_PROJECTS?.includes(project.id.toString())
      ? {
          breakdown: tvsProjectStats?.tvsBreakdown,
          warning: project.display.tvlWarning,
          tokens: {
            breakdown: tvsProjectStats?.tokenBreakdown,
            warnings: compact([
              tvsProjectStats &&
                tvsProjectStats.tokenBreakdown.total > 0 &&
                getAssociatedTokenWarning({
                  associatedRatio:
                    tvsProjectStats.tokenBreakdown.associated /
                    tvsProjectStats.tokenBreakdown.total,
                  name: project.display.name,
                  associatedTokens,
                }),
            ]),
            associatedTokens,
          },
        }
      : undefined,
    badges:
      project.badges && project.badges.length !== 0
        ? project.badges?.sort(badgesCompareFn).map((id) => ({
            ...badges[id],
            id,
          }))
        : undefined,
  }
}
