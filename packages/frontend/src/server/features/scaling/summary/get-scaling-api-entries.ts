import type { Layer2, Layer3, StageConfig } from '@l2beat/config'
import { badges, isUnderReview, layer2s, layer3s } from '@l2beat/config'
import { getL2Risks } from '~/app/(side-nav)/scaling/_utils/get-l2-risks'
import type { RosetteValue } from '~/components/rosette/types'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import type { ProjectChanges } from '../../projects-change-report/get-projects-change-report'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import type { LatestTvs } from '../tvs/utils/get-7d-token-breakdown'
import { get7dTokenBreakdown } from '../tvs/utils/get-7d-token-breakdown'
import { getHostChain } from '../utils/get-host-chain'

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
  badges: { category: string; name: string }[]
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
  const projects = [...layer2s, ...layer3s].filter(
    (project) => !project.isUpcoming && !project.isArchived,
  )
  const [projectsChangeReport, tvs] = await Promise.all([
    getProjectsChangeReport(),
    get7dTokenBreakdown({ type: 'layer2' }),
  ])

  return projects
    .map((project) => {
      const latestTvs = tvs.projects[project.id.toString()]
      return getScalingApiEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        latestTvs,
      )
    })
    .sort((a, b) => b.tvs.breakdown.total - a.tvs.breakdown.total)
}

function getScalingApiEntry(
  project: Layer2 | Layer3,
  changes: ProjectChanges,
  latestTvs: LatestTvs['projects'][string] | undefined,
): ScalingApiEntry {
  return {
    id: project.id.toString(),
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    type: project.type,
    hostChain: project.type === 'layer3' ? getHostChain(project) : undefined,
    category: project.display.category,
    provider: project.display.stack,
    purposes: project.display.purposes,
    isArchived: false,
    isUpcoming: false,
    isUnderReview: !!getUnderReviewStatus({
      isUnderReview: isUnderReview(project),
      implementationChanged: changes.implementationChanged,
      highSeverityFieldChanged: changes.highSeverityFieldChanged,
    }),
    badges:
      project.badges?.map((x) => ({
        category: badges[x].type,
        name: badges[x].display.name,
      })) ?? [],
    stage: getStage(project.stage),
    risks: getL2Risks(project.riskView),
    tvs: {
      breakdown: latestTvs?.breakdown ?? {
        total: 0,
        associated: 0,
        ether: 0,
        stablecoin: 0,
      },
      change7d: latestTvs?.change ?? 0,
      associatedTokens: project.config.associatedTokens ?? [],
    },
  }
}

function getStage(config: StageConfig) {
  if (config.stage === 'NotApplicable') {
    return 'Not applicable'
  }
  if (config.stage === 'UnderReview') {
    return 'Under review'
  }
  return config.stage
}
