import type {
  Milestone,
  Project,
  ProjectEcosystemConfig,
  ProjectEcosystemInfo,
} from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import type { EcosystemGovernanceLinks } from '~/app/(side-nav)/ecosystems/_components/widgets/ecosystem-governance-links'
import type { ProjectLink } from '~/components/projects/links/types'
import type { BadgeWithParams } from '~/components/projects/project-badge'
import { getCollection } from '~/content/get-collection'
import { ps } from '~/server/projects'
import { getBadgeWithParams } from '~/utils/project/get-badge-with-params'
import { getImageDimensions } from '~/utils/project/get-image-params'
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getProjectsChangeReport } from '../projects-change-report/get-projects-change-report'
import { getActivityLatestUops } from '../scaling/activity/get-activity-latest-tps'
import {
  type ScalingSummaryEntry,
  getScalingSummaryEntry,
} from '../scaling/summary/get-scaling-summary-entries'
import { get7dTvsBreakdown } from '../scaling/tvs/utils/get-7d-tvs-breakdown'
import { compareStageAndTvs } from '../scaling/utils/compare-stage-and-tvs'
import { type DaLayersUsed, getDaLayersUsed } from './get-da-layers-used'
import type { EcosystemNativeToken } from './get-native-token'
import { getNativeToken } from './get-native-token'
import type { ProjectByRaas } from './get-projects-by-raas'
import { getProjectsByRaas } from './get-projects-by-raas'
import { type TvsByStage, getTvsByStage } from './get-tvs-by-stage'
import type { TvsByTokenType } from './get-tvs-by-token-type'
import { getTvsByTokenType } from './get-tvs-by-token-type'

export interface EcosystemEntry {
  slug: string
  name: string
  logo: {
    light: string
    dark: string | undefined
    width: number
    height: number
  }
  badges: BadgeWithParams[]
  colors: ProjectEcosystemConfig['colors']
  projects: EcosystemProjectEntry[]
  allScalingProjects: {
    tvs: number
    uops: number
    count: number
  }
  tvsByStage: TvsByStage
  tvsByTokenType: TvsByTokenType
  daLayersUsed: DaLayersUsed
  projectsByRaas: ProjectByRaas
  nativeToken: EcosystemNativeToken
  links: {
    header: ProjectLink[]
    buildOn: string
    learnMore: string
    governance: EcosystemGovernanceLinks
  }
  milestones: Milestone[]
}

export interface EcosystemProjectEntry extends ScalingSummaryEntry {
  ecosystemInfo: ProjectEcosystemInfo
}

export async function getEcosystemEntry(
  slug: string,
): Promise<EcosystemEntry | undefined> {
  const ecosystem = await ps.getProject({
    slug,
    select: ['ecosystemConfig', 'display'],
    optional: ['milestones'],
  })

  if (!ecosystem) {
    return undefined
  }

  const allScalingProjects = await ps.getProjects({
    where: ['isScaling'],
  })

  const projects = await ps.getProjects({
    select: [
      'statuses',
      'scalingInfo',
      'scalingRisks',
      'display',
      'ecosystemInfo',
    ],
    optional: [
      'tvlInfo',
      'tvsConfig',
      'scalingDa',
      'scalingStage',
      'chainConfig',
      'milestones',
    ],
    where: ['isScaling'],
    whereNot: ['isUpcoming', 'isArchived'],
  })

  const [projectsChangeReport, tvs, projectsActivity] = await Promise.all([
    getProjectsChangeReport(),
    get7dTvsBreakdown({ type: 'layer2' }),
    getActivityLatestUops(allScalingProjects),
  ])

  const ecosystemProjects = projects.filter(
    (p) => p.ecosystemInfo.id === ecosystem.id,
  )
  const allScalingProjectsUops = allScalingProjects.reduce(
    (acc, curr) =>
      acc + (projectsActivity[curr.id.toString()]?.pastDayUops ?? 0),
    0,
  )

  return {
    ...ecosystem,
    colors: ecosystem.ecosystemConfig.colors,
    logo: getEcosystemLogo(slug),
    badges: ecosystem.display.badges
      .map((badge) => getBadgeWithParams(badge, ecosystem))
      .filter((badge) => badge !== undefined),
    links: {
      header: getProjectLinks(ecosystem.display.links),
      buildOn: ecosystem.ecosystemConfig.links.buildOn,
      learnMore: ecosystem.ecosystemConfig.links.learnMore,
      governance: getGovernanceLinks(ecosystem),
    },
    allScalingProjects: {
      tvs: tvs.total,
      uops: allScalingProjectsUops,
      count: allScalingProjects.length,
    },
    tvsByStage: getTvsByStage(ecosystemProjects, tvs),
    tvsByTokenType: getTvsByTokenType(ecosystemProjects, tvs),
    daLayersUsed: getDaLayersUsed(ecosystemProjects),
    projectsByRaas: getProjectsByRaas(ecosystemProjects),
    nativeToken: await getNativeToken(ecosystem, ecosystemProjects),
    projects: ecosystemProjects
      .map((project) => ({
        ...getScalingSummaryEntry(
          project,
          projectsChangeReport.getChanges(project.id),
          tvs.projects[project.id.toString()],
          projectsActivity[project.id.toString()],
        ),
        ecosystemInfo: project.ecosystemInfo,
      }))
      .sort(compareStageAndTvs),
    milestones: getMilestones([ecosystem, ...ecosystemProjects]),
  }
}

function getEcosystemLogo(slug: string) {
  const imgBuffer = readFileSync(
    path.join(process.cwd(), 'public', `ecosystems/${slug}/logo.png`),
  )
  const hasDark = existsSync(
    path.join(process.cwd(), 'public', `ecosystems/${slug}/logo.dark.png`),
  )
  const dimensions = getImageDimensions(imgBuffer)
  assert(dimensions, 'Ecosystem logo not found')
  return {
    ...dimensions,
    light: `/ecosystems/${slug}/logo.png`,
    dark: hasDark ? `/ecosystems/${slug}/logo.dark.png` : undefined,
  }
}

function getMilestones(projects: Project<never, 'milestones'>[]) {
  return projects
    .flatMap((project) => {
      return project.milestones ?? []
    })
    .sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
}

function getGovernanceLinks(
  ecosystem: Project<'ecosystemConfig'>,
): EcosystemGovernanceLinks {
  const lastPublication = getCollection('publications')
    .filter((p) => p.id.includes('review'))
    .sort((a, b) => a.data.publishedOn.getTime() - b.data.publishedOn.getTime())
    .at(-1)
  assert(lastPublication, 'No last publication')

  return {
    topDelegates: ecosystem.ecosystemConfig.links.governanceTopDelegates,
    proposals: ecosystem.ecosystemConfig.links.governanceProposals,
    review: `/governance/publications/${lastPublication.id}`,
    reviewThumbnail: `/meta-images/governance/publications/${lastPublication.id}.png`,
  }
}
