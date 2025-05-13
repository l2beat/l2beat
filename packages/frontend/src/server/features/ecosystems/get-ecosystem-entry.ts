import { existsSync } from 'fs'
import path from 'path'
import type {
  Milestone,
  Project,
  ProjectColors,
  ProjectEcosystemInfo,
} from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import type { EcosystemGovernanceLinks } from '~/app/(side-nav)/ecosystems/_components/widgets/ecosystem-governance-links'
import type { ProjectLink } from '~/components/projects/links/types'
import type { BadgeWithParams } from '~/components/projects/project-badge'
import { getCollection } from '~/content/get-collection'
import { ps } from '~/server/projects'
import { getBadgeWithParams } from '~/utils/project/get-badge-with-params'
import { getImageParams } from '~/utils/project/get-image-params'
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getProjectsChangeReport } from '../projects-change-report/get-projects-change-report'
import { getActivityLatestUops } from '../scaling/activity/get-activity-latest-tps'
import {
  type ScalingSummaryEntry,
  getScalingSummaryEntry,
} from '../scaling/summary/get-scaling-summary-entries'
import { get7dTvsBreakdown } from '../scaling/tvs/get-7d-tvs-breakdown'
import { compareStageAndTvs } from '../scaling/utils/compare-stage-and-tvs'
import { getStaticAsset } from '../utils/get-project-icon'
import { type BlobsData, getBlobsData } from './get-blobs-data'
import type { EcosystemProjectsCountData } from './get-ecosystem-projects-chart-data'
import { getEcosystemProjectsChartData } from './get-ecosystem-projects-chart-data'
import type { EcosystemToken } from './get-ecosystem-token'
import { getEcosystemToken } from './get-ecosystem-token'
import {
  type ProjectsByDaLayer,
  getProjectsByDaLayer,
} from './get-projects-by-da-layer'
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
    path.join(process.cwd(), 'public', `ecosystems/${slug}/logo.dark.png`),
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
