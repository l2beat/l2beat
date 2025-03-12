import type { Badge } from '@l2beat/config'
import { getL2Risks } from '~/app/(side-nav)/scaling/_utils/get-l2-risks'
import type { RosetteValue } from '~/components/rosette/types'
import { ps } from '~/server/projects'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import { get7dTokenBreakdown } from '../tvs/utils/get-7d-token-breakdown'

export interface ScalingApiEntry {
  id: string
  name: string
  shortName: string | undefined
  slug: string
  type: 'layer2' | 'layer3'
  hostChain: string | undefined
  category: string
  provider: string | undefined
  purposes: string[]
  isArchived: boolean
  isUpcoming: boolean
  isUnderReview: boolean
  badges: Badge[]
  stage: string
  risks: RosetteValue[]
  tvs: {
    breakdown: {
      total: number
      ether: number
      stablecoin: number
      associated: number
    }
    change7d: number
    associatedTokens: string[]
  }
}

export async function getScalingApiEntries(): Promise<ScalingApiEntry[]> {
  const [projectsChangeReport, tvs, projects] = await Promise.all([
    getProjectsChangeReport(),
    get7dTokenBreakdown({ type: 'layer2' }),
    ps.getProjects({
      select: ['display', 'statuses', 'scalingInfo', 'scalingRisks', 'tvlInfo'],
      whereNot: ['isArchived', 'isUpcoming'],
    }),
  ])

  return projects
    .map((project) => {
      const latestTvs = tvs.projects[project.id.toString()]
      const changes = projectsChangeReport.getChanges(project.id)

      return {
        id: project.id.toString(),
        name: project.name,
        shortName: project.shortName,
        slug: project.slug,
        type: project.scalingInfo.layer,
        hostChain: project.scalingInfo.hostChain.name,
        category: project.scalingInfo.type,
        provider: project.scalingInfo.stack,
        purposes: project.scalingInfo.purposes,
        isArchived: false,
        isUpcoming: false,
        isUnderReview: !!getUnderReviewStatus({
          isUnderReview: project.statuses.isUnderReview,
          impactfulChange: !!changes?.impactfulChange,
        }),
        badges: project.display.badges,
        stage: project.scalingInfo.stage,
        risks: getL2Risks(
          project.scalingRisks.stacked ?? project.scalingRisks.self,
        ),
        tvs: {
          breakdown: latestTvs?.breakdown ?? {
            total: 0,
            associated: 0,
            ether: 0,
            stablecoin: 0,
          },
          change7d: latestTvs?.change ?? 0,
          associatedTokens: project.tvlInfo.associatedTokens,
        },
      }
    })
    .sort((a, b) => b.tvs.breakdown.total - a.tvs.breakdown.total)
}
