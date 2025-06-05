import { existsSync } from 'fs'
import path from 'path'
import type {
  Milestone,
  Project,
  ProjectColors,
  ProjectEcosystemInfo,
} from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import type { ProjectLink } from '~/components/projects/links/types'
import { getCollection } from '~/content/getCollection'
import type { EcosystemGovernanceLinks } from '~/pages/ecosystems/project/components/widgets/EcosystemGovernanceLinks'
import { ps } from '~/server/projects'
import { getBadgeWithParams } from '~/utils/project/getBadgeWithParams'
import { getImageParams } from '~/utils/project/getImageParams'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import { getProjectsChangeReport } from '../projects-change-report/getProjectsChangeReport'
import { getActivityLatestUops } from '../scaling/activity/getActivityLatestTps'
import {
  type ScalingSummaryEntry,
  getScalingSummaryEntry,
} from '../scaling/summary/getScalingSummaryEntries'
import { get7dTvsBreakdown } from '../scaling/tvs/get7dTvsBreakdown'
import { compareStageAndTvs } from '../scaling/utils/compareStageAndTvs'
import { getStaticAsset } from '../utils/getProjectIcon'
import { type BlobsData, getBlobsData } from './getBlobsData'
import type { EcosystemProjectsCountData } from './getEcosystemProjectsChartData'
import { getEcosystemProjectsChartData } from './getEcosystemProjectsChartData'
import type { EcosystemToken } from './getEcosystemToken'
import { getEcosystemToken } from './getEcosystemToken'
import {
  type ProjectsByDaLayer,
  getProjectsByDaLayer,
} from './getProjectsByDaLayer'
import type { ProjectByRaas } from './getProjectsByRaas'
import { getProjectsByRaas } from './getProjectsByRaas'
import { type TvsByStage, getTvsByStage } from './getTvsByStage'
import type { TvsByTokenType } from './getTvsByTokenType'
import { getTvsByTokenType } from './getTvsByTokenType'
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
  colors: ProjectColors
  projects: EcosystemProjectEntry[]
  projectsChartData: EcosystemProjectsCountData
  allScalingProjects: {
    tvs: number
    uops: number
  }
  tvsByStage: TvsByStage
  tvsByTokenType: TvsByTokenType
  projectsByDaLayer: ProjectsByDaLayer
  blobsData: BlobsData
  projectsByRaas: ProjectByRaas
  token: EcosystemToken
  links: {
    header: ProjectLink[]
    buildOn: string
    learnMore: string
    governance: EcosystemGovernanceLinks
  }
  images: {
    buildOn: string
    topDelegates: string
  }
  milestones: EcosystemMilestone[]
}

export interface EcosystemProjectEntry extends ScalingSummaryEntry {
  ecosystemInfo: ProjectEcosystemInfo
}

export async function getEcosystemEntry(
  slug: string,
): Promise<EcosystemEntry | undefined> {
  const ecosystem = await ps.getProject({
    slug,
    select: ['ecosystemConfig', 'display', 'colors'],
    optional: ['milestones'],
  })

  if (!ecosystem) {
    return undefined
  }

  const [allScalingProjects, projects] = await Promise.all([
    ps.getProjects({
      where: ['isScaling'],
    }),
    ps.getProjects({
      select: [
        'statuses',
        'scalingInfo',
        'scalingRisks',
        'display',
        'ecosystemInfo',
      ],
      optional: [
        'tvsInfo',
        'tvsConfig',
        'scalingDa',
        'scalingStage',
        'chainConfig',
        'milestones',
        'archivedAt',
      ],
      where: ['isScaling'],
      whereNot: ['isUpcoming'],
    }),
  ])

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
    colors: ecosystem.colors,
    logo: getEcosystemLogo(ecosystem.slug),
    badges: ecosystem.display.badges
      .map((badge) => getBadgeWithParams(badge))
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
    },
    tvsByStage: getTvsByStage(ecosystemProjects, tvs),
    tvsByTokenType: getTvsByTokenType(ecosystemProjects, tvs),
    projectsByDaLayer: getProjectsByDaLayer(ecosystemProjects),
    blobsData: await getBlobsData(ecosystemProjects),
    projectsByRaas: getProjectsByRaas(ecosystemProjects),
    token: await getEcosystemToken(ecosystem, ecosystemProjects),
    projectsChartData: getEcosystemProjectsChartData(
      ecosystemProjects,
      allScalingProjects.length,
    ),
    projects: ecosystemProjects
      .filter((p) => !p.archivedAt)
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
    images: {
      buildOn: getStaticAsset(`/ecosystems/${slug}/build-on.png`),
      topDelegates: getStaticAsset(`/ecosystems/governance-delegates.png`),
    },
  }
}

function getEcosystemLogo(slug: string) {
  const light = getImageParams(`/ecosystems/${slug}/logo.png`)
  assert(light, 'Ecosystem logo not found')
  const hasDark = existsSync(
    path.join(process.cwd(), 'static', `ecosystems/${slug}/logo.dark.png`),
  )
  const dark = hasDark
    ? getImageParams(`/ecosystems/${slug}/logo.dark.png`)
    : undefined
  if (dark?.width !== light.width || dark?.height !== light.height) {
    throw new Error('Ecosystem logo dimensions mismatch')
  }

  return {
    width: light.width,
    height: light.height,
    light: light.src,
    dark: dark?.src,
  }
}

export interface EcosystemMilestone extends Milestone {
  projectName: string
}

function getMilestones(
  projects: Project<never, 'milestones'>[],
): EcosystemMilestone[] {
  return projects
    .flatMap((project) => {
      return (
        project.milestones?.map((milestone) => ({
          ...milestone,
          projectName: project.name,
        })) ?? []
      )
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

  const bankImage = getImageParams('/ecosystems/governance-bank.png')
  assert(bankImage, 'Bank image not found')

  return {
    topDelegates: ecosystem.ecosystemConfig.links.governanceTopDelegates,
    proposals: ecosystem.ecosystemConfig.links.governanceProposals,
    review: `/governance/publications/${lastPublication.id}`,
    bankImage,
  }
}
