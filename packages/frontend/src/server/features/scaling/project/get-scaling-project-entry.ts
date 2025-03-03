import type {
  Badge,
  Layer2,
  Layer3,
  Project,
  ReasonForBeingInOther,
  ScalingProjectCapability,
  ScalingProjectCategory,
  StageConfig,
  WarningWithSentiment,
} from '@l2beat/config'
import { isVerified, layer2s, layer3s } from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { compact } from 'lodash'
import { env } from '~/env'
import { getProjectLinks } from '~/utils/project/get-project-links'
import {
  getUnderReviewStatus,
  UnderReviewStatus,
} from '~/utils/project/under-review'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import { getActivityProjectStats } from '../activity/get-activity-project-stats'
import { getTvsProjectStats } from '../tvs/get-tvs-project-stats'
import { getAssociatedTokenWarning } from '../tvs/utils/get-associated-token-warning'
import {
  getCountdowns,
  ProjectCountdownsWithContext,
} from '../utils/get-countdowns'
import { isProjectOther } from '../utils/is-project-other'
import { getDaSolution } from './get-scaling-project-da-solution'
import { getL2ProjectDetails } from './utils/get-l2-project-details'
import { getL3ProjectDetails } from './utils/get-l3-project-details'
import { getScalingRosetteValues } from './utils/get-scaling-rosette-values'
import { ProjectLink } from '~/components/projects/links/types'
import { ProjectDetailsSection } from '~/components/projects/sections/types'
import { RosetteValue } from '~/components/rosette/types'

export type ScalingProject = Layer2 | Layer3

export interface ScalingProjectEntry {
  type: 'layer3' | 'layer2'
  name: string
  slug: string
  isArchived: boolean
  isUpcoming: boolean
  underReviewStatus: UnderReviewStatus
  header: {
    warning?: string
    redWarning?: string
    description?: string
    badges?: Badge[]
    links: ProjectLink[]
    hostChain?: string
    category: ScalingProjectCategory
    purposes: string[]
    tvs?: {
      breakdown?: {
        total: number
        native: number
        canonical: number
        external: number
        totalChange: number
      }
      warning?: WarningWithSentiment
      tokens: {
        breakdown?: {
          total: number
          ether: number
          stablecoin: number
          associated: number
        }
        warnings: WarningWithSentiment[]
        associatedTokens: string[]
      }
    }
    activity?: {
      uopsCount: number
      lastDayUops: number
      uopsWeeklyChange: number
    }
    rosetteValues: RosetteValue[]
  }
  capability: ScalingProjectCapability
  baseLayerRosetteValues?: RosetteValue[]
  stackedRosetteValues?: RosetteValue[]
  projectDetails: ProjectDetailsSection[]
  countdowns: ProjectCountdownsWithContext
  reasonsForBeingOther?: ReasonForBeingInOther[]
  hostChainName?: string
  stageConfig: StageConfig
}

export async function getScalingProjectEntry(
  project: Project<
    | 'display'
    | 'statuses'
    | 'scalingInfo'
    | 'scalingRisks'
    | 'tvlInfo'
    | 'tvlConfig',
    'chainConfig'
  >,
): Promise<ScalingProjectEntry> {
  /** @deprecated */
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

  const header: ScalingProjectEntry['header'] = {
    description: project.display.description,
    warning: project.statuses.yellowWarning,
    redWarning: project.statuses.redWarning,
    category: isProjectOther(project.scalingInfo)
      ? 'Other'
      : project.scalingInfo.type,
    purposes: project.scalingInfo.purposes,
    activity: activityProjectStats,
    rosetteValues: getScalingRosetteValues(
      project.scalingRisks.stacked ?? project.scalingRisks.self,
    ),
    links: getProjectLinks(project.display.links),
    hostChain:
      project.scalingInfo.hostChain.id !== ProjectId.ETHEREUM
        ? project.scalingInfo.hostChain.name
        : undefined,
    tvs: !env.EXCLUDED_TVS_PROJECTS?.includes(project.id)
      ? {
          breakdown: tvsProjectStats?.tvsBreakdown,
          warning: project.tvlInfo.warnings[0],
          tokens: {
            breakdown: tvsProjectStats?.tokenBreakdown,
            warnings: compact([
              tvsProjectStats &&
                tvsProjectStats.tokenBreakdown.total > 0 &&
                getAssociatedTokenWarning({
                  associatedRatio:
                    tvsProjectStats.tokenBreakdown.associated /
                    tvsProjectStats.tokenBreakdown.total,
                  name: project.name,
                  associatedTokens: project.tvlInfo.associatedTokens,
                }),
            ]),
            associatedTokens: project.tvlInfo.associatedTokens,
          },
        }
      : undefined,
    badges: project.display.badges,
  }

  const changes = projectsChangeReport.getChanges(legacy.id)
  const common = {
    type: project.scalingInfo.layer,
    capability: project.scalingInfo.capability,
    name: project.name,
    slug: project.slug,
    underReviewStatus: getUnderReviewStatus({
      isUnderReview: !!project.statuses.isUnderReview,
      ...changes,
    }),
    isArchived: !!legacy.isArchived,
    isUpcoming: !!legacy.isUpcoming,
    header,
    reasonsForBeingOther: project.scalingInfo.reasonsForBeingOther,
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
      rosetteValues: header.rosetteValues,
      daSolution,
    })

    return {
      ...common,
      type: project.scalingInfo.layer,
      stageConfig: isProjectOther(project.scalingInfo)
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
    type: project.scalingInfo.layer,
    stageConfig: {
      stage: 'NotApplicable' as const,
    },
    baseLayerRosetteValues,
    stackedRosetteValues,
    hostChainName: hostChain?.display.name,
    projectDetails,
  }
}
