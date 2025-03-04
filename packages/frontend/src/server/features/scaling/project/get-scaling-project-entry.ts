import type {
  Badge,
  Layer2,
  Layer3,
  Project,
  ReasonForBeingInOther,
  ScalingProjectCategory,
  StageConfig,
  WarningWithSentiment,
} from '@l2beat/config'
import { isVerified, layer2s, layer3s } from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { compact } from 'lodash'
import type { ProjectLink } from '~/components/projects/links/types'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { env } from '~/env'
import { getProjectLinks } from '~/utils/project/get-project-links'
import type { UnderReviewStatus } from '~/utils/project/under-review'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import { getActivityProjectStats } from '../activity/get-activity-project-stats'
import { getTvsProjectStats } from '../tvs/get-tvs-project-stats'
import { getAssociatedTokenWarning } from '../tvs/utils/get-associated-token-warning'
import type { ProjectCountdownsWithContext } from '../utils/get-countdowns'
import { getCountdowns } from '../utils/get-countdowns'
import { isProjectOther } from '../utils/is-project-other'
import { getScalingDaSolution } from './get-scaling-da-solution'
import { getScalingProjectDetails } from './get-scaling-project-details'
import type { ScalingRosette } from './get-scaling-rosette-values'
import { getScalingRosette } from './get-scaling-rosette-values'

export type ScalingProject = Layer2 | Layer3

export interface ScalingProjectEntry {
  type: 'layer3' | 'layer2'
  name: string
  slug: string
  isArchived: boolean
  isUpcoming: boolean
  isAppchain: boolean
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
  }
  rosette: ScalingRosette
  sections: ProjectDetailsSection[]
  countdowns: ProjectCountdownsWithContext
  reasonsForBeingOther?: ReasonForBeingInOther[]
  hostChainName: string
  stageConfig: StageConfig
}

export async function getScalingProjectEntry(
  project: Project<
    | 'display'
    | 'statuses'
    | 'scalingInfo'
    | 'scalingRisks'
    | 'scalingStage'
    | 'scalingTechnology'
    | 'contracts'
    | 'permissions'
    | 'tvlInfo'
    | 'tvlConfig',
    'scalingDa' | 'chainConfig' | 'isUpcoming' | 'isArchived'
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

  const changes = projectsChangeReport.getChanges(project.id)
  const common = {
    type: project.scalingInfo.layer,
    name: project.name,
    slug: project.slug,
    underReviewStatus: getUnderReviewStatus({
      isUnderReview: !!project.statuses.isUnderReview,
      ...changes,
    }),
    isArchived: !!project.isArchived,
    isUpcoming: !!project.isUpcoming,
    isAppchain: project.scalingInfo.capability === 'appchain',
    header,
    reasonsForBeingOther: project.scalingInfo.reasonsForBeingOther,
    countdowns: getCountdowns(legacy),
    rosette: getScalingRosette(project),
    hostChainName: project.scalingInfo.hostChain.name,
    stageConfig: isProjectOther(project.scalingInfo)
      ? project.scalingStage
      : { stage: 'NotApplicable' as const },
  }
  const daSolution = await getScalingDaSolution(project)

  const hostChain =
    project.scalingInfo.hostChain.id !== ProjectId.ETHEREUM
      ? layer2s.find((layer2) => layer2.id === project.scalingInfo.hostChain.id)
      : undefined
  const isHostChainVerified =
    hostChain !== undefined ? isVerified(hostChain) : true
  const sections = await getScalingProjectDetails({
    legacy: legacy,
    project,
    hostChain,
    daSolution,
    isHostChainVerified,
    projectsChangeReport,
    rosette: common.rosette,
  })

  return { ...common, sections }
}
