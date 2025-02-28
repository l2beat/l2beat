import type { Layer2, Layer3, Project } from '@l2beat/config'
import { isVerified, layer2s, layer3s } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { compact } from 'lodash'
import { env } from '~/env'
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import { getActivityProjectStats } from '../activity/get-activity-project-stats'
import { getTvsProjectStats } from '../tvs/get-tvs-project-stats'
import { getAssociatedTokenWarning } from '../tvs/utils/get-associated-token-warning'
import { getCountdowns } from '../utils/get-countdowns'
import { isProjectOther_legacy } from '../utils/is-project-other'
import { getDaSolution } from './get-scaling-project-da-solution'
import { getL2ProjectDetails } from './utils/get-l2-project-details'
import { getL3ProjectDetails } from './utils/get-l3-project-details'
import { getScalingRosetteValues } from './utils/get-scaling-rosette-values'

export type ScalingProject = Layer2 | Layer3

export type ScalingProjectEntry = Awaited<
  ReturnType<typeof getScalingProjectEntry>
>

export async function getScalingProjectEntry(
  project: Project<'display' | 'scalingInfo' | 'tvlConfig', 'chainConfig'>,
) {
  const legacy =
    layer2s.find((x) => x.id === project.id) ??
    layer3s.find((x) => x.id === project.id)
  assert(legacy)

  const [projectsChangeReport, activityProjectStats, tvsProjectStats] =
    await Promise.all([
      getProjectsChangeReport(),
      getActivityProjectStats(project.id),
      getTvsProjectStats(project),
    ])
  const associatedTokens = legacy.config.associatedTokens ?? []

  const header = {
    description: legacy.display.description,
    warning: legacy.display.headerWarning,
    redWarning: legacy.display.redWarning,
    category: isProjectOther_legacy(legacy) ? 'Other' : legacy.display.category,
    purposes: legacy.display.purposes,
    activity: activityProjectStats,
    rosetteValues: getScalingRosetteValues(legacy.riskView),
    links: getProjectLinks(legacy.display.links),
    hostChain:
      legacy.type === 'layer3'
        ? (layer2s.find((l) => l.id === legacy.hostChain)?.display.name ??
          legacy.hostChain)
        : undefined,
    tvs: !env.EXCLUDED_TVS_PROJECTS?.includes(legacy.id.toString())
      ? {
          breakdown: tvsProjectStats?.tvsBreakdown,
          warning: legacy.display.tvlWarning,
          tokens: {
            breakdown: tvsProjectStats?.tokenBreakdown,
            warnings: compact([
              tvsProjectStats &&
                tvsProjectStats.tokenBreakdown.total > 0 &&
                getAssociatedTokenWarning({
                  associatedRatio:
                    tvsProjectStats.tokenBreakdown.associated /
                    tvsProjectStats.tokenBreakdown.total,
                  name: legacy.display.name,
                  associatedTokens,
                }),
            ]),
            associatedTokens,
          },
        }
      : undefined,
    badges: legacy.badges,
  }

  const changes = projectsChangeReport.getChanges(legacy.id)
  const common = {
    type: legacy.type,
    capability: legacy.capability,
    name: legacy.display.name,
    slug: legacy.display.slug,
    underReviewStatus: getUnderReviewStatus({
      isUnderReview: !!legacy.isUnderReview,
      ...changes,
    }),
    isArchived: !!legacy.isArchived,
    isUpcoming: !!legacy.isUpcoming,
    header,
    reasonsForBeingOther: legacy.reasonsForBeingOther,
    countdowns: getCountdowns(legacy),
  }
  const daSolution = await getDaSolution(legacy)

  const rosetteValues = getScalingRosetteValues(legacy.riskView)
  const isProjectVerified = isVerified(legacy)

  if (legacy.type === 'layer2') {
    const projectDetails = await getL2ProjectDetails({
      project: legacy,
      isVerified: isProjectVerified,
      projectsChangeReport,
      rosetteValues,
      daSolution,
    })

    return {
      ...common,
      type: legacy.type,
      stageConfig: isProjectOther_legacy(legacy)
        ? {
            stage: 'NotApplicable' as const,
          }
        : legacy.stage,
      projectDetails,
      header,
    }
  }

  // L3
  const hostChain = layer2s.find((layer2) => layer2.id === legacy.hostChain)
  const baseLayerRosetteValues = hostChain
    ? getScalingRosetteValues(hostChain.riskView)
    : undefined
  const stackedRosetteValues = legacy.stackedRiskView
    ? getScalingRosetteValues(legacy.stackedRiskView)
    : undefined
  const isHostChainVerified =
    hostChain === undefined ? false : isVerified(hostChain)

  const projectDetails = await getL3ProjectDetails({
    project: legacy,
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
    type: legacy.type,
    stageConfig: {
      stage: 'NotApplicable' as const,
    },
    baseLayerRosetteValues,
    stackedRosetteValues,
    hostChainName: hostChain?.display.name,
    projectDetails,
  }
}
