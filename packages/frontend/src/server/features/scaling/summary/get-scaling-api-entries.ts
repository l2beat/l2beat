import {
  type Layer2,
  type Layer3,
  badges,
  layer2s,
  layer3s,
} from '@l2beat/config'
import { type RosetteValue } from '~/components/rosette/types'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import { getStage } from '../get-common-scaling-entry'
import {
  type LatestTvl,
  get7dTokenBreakdown,
} from '../tvl/utils/get-7d-token-breakdown'
import { getHostChain } from '../utils/get-host-chain'
import { isAnySectionUnderReview } from '../utils/is-any-section-under-review'
import { getRisks } from './get-scaling-summary-entries'

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
  tvl: {
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
  const [projectsChangeReport, tvl] = await Promise.all([
    getProjectsChangeReport(),
    get7dTokenBreakdown({ type: 'layer2' }),
  ])

  return projects
    .map((project) => {
      const latestTvl = tvl.projects[project.id.toString()]
      return getScalingApiEntry(
        project,
        projectsChangeReport.hasImplementationChanged(project.id),
        projectsChangeReport.hasHighSeverityFieldChanged(project.id),
        latestTvl,
      )
    })
    .sort((a, b) => b.tvl.breakdown.total - a.tvl.breakdown.total)
}

function getScalingApiEntry(
  project: Layer2 | Layer3,
  hasImplementationChanged: boolean,
  hasHighSeverityFieldChanged: boolean,
  latestTvl: LatestTvl['projects'][string] | undefined,
): ScalingApiEntry {
  return {
    id: project.id.toString(),
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    type: project.type,
    hostChain: project.type === 'layer3' ? getHostChain(project) : undefined,
    category: project.display.category,
    provider: project.display.provider,
    purposes: project.display.purposes,
    isArchived: false,
    isUpcoming: false,
    isUnderReview: !!getUnderReviewStatus({
      isUnderReview: isAnySectionUnderReview(project),
      hasImplementationChanged,
      hasHighSeverityFieldChanged,
    }),
    badges:
      project.badges?.map((x) => ({
        category: badges[x].type,
        name: badges[x].display.name,
      })) ?? [],
    stage: getStage(project.stage),
    risks: getRisks(project).risks,
    tvl: {
      breakdown: latestTvl?.breakdown ?? {
        total: 0,
        associated: 0,
        ether: 0,
        stablecoin: 0,
      },
      change7d: latestTvl?.change ?? 0,
      associatedTokens: project.config.associatedTokens ?? [],
    },
  }
}
