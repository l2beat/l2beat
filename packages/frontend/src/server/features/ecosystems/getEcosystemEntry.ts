import type {
  Milestone,
  Project,
  ProjectCustomColors,
  ProjectEcosystemInfo,
} from '@l2beat/config'
import { assert, type ProjectId } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import type { ProjectLink } from '~/components/projects/links/types'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import { getCollection } from '~/content/getCollection'
import type { EcosystemGovernanceLinks } from '~/pages/ecosystems/project/components/widgets/EcosystemGovernanceLinks'
import { ps } from '~/server/projects'
import type { SsrHelpers } from '~/trpc/server'
import { getBadgeWithParams } from '~/utils/project/getBadgeWithParams'
import { getImageParams } from '~/utils/project/getImageParams'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import { getProjectsChangeReport } from '../projects-change-report/getProjectsChangeReport'
import { getActivityLatestUops } from '../scaling/activity/getActivityLatestTps'
import { getApprovedOngoingAnomalies } from '../scaling/liveness/getApprovedOngoingAnomalies'
import {
  getScalingSummaryEntry,
  type ScalingSummaryEntry,
} from '../scaling/summary/getScalingSummaryEntries'
import {
  get7dTvsBreakdown,
  type ProjectSevenDayTvsBreakdown,
} from '../scaling/tvs/get7dTvsBreakdown'
import { compareTvs } from '../scaling/tvs/utils/compareTvs'
import {
  getScalingUpcomingEntry,
  type ScalingUpcomingEntry,
} from '../scaling/upcoming/getScalingUpcomingEntries'
import { getStaticAsset } from '../utils/getProjectIcon'
import { type BlobsData, getBlobsData } from './getBlobsData'
import { getEcosystemLogo } from './getEcosystemLogo'
import type { EcosystemProjectsCountData } from './getEcosystemProjectsChartData'
import { getEcosystemProjectsChartData } from './getEcosystemProjectsChartData'
import type { EcosystemToken } from './getEcosystemToken'
import { getEcosystemToken } from './getEcosystemToken'
import {
  getProjectsByDaLayer,
  type ProjectsByDaLayer,
} from './getProjectsByDaLayer'
import type { ProjectByRaas } from './getProjectsByRaas'
import { getProjectsByRaas } from './getProjectsByRaas'
import { getTvsByStage, type TvsByStage } from './getTvsByStage'
import type { TvsByTokenType } from './getTvsByTokenType'
import { getTvsByTokenType } from './getTvsByTokenType'

const EXCLUDED_FILTERS = ['stack', 'infrastructure', 'vm']

export interface EcosystemEntry {
  id: ProjectId
  slug: string
  name: string
  logo: {
    light: string
    dark: string | undefined
    width: number
    height: number
  }
  badges: BadgeWithParams[]
  colors: ProjectCustomColors
  liveProjects: EcosystemProjectEntry[]
  upcomingProjects: ScalingUpcomingEntry[]
  projectsChartData: EcosystemProjectsCountData
  allScalingProjects: {
    tvs: number
    uops: number
  }
  banners: {
    firstBanner?: {
      headlineText?: string
      mainText?: string
    }
    secondBanner?: {
      headlineText?: string
      mainText?: string
    }
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
    ecosystemUpdate: string
  }
  images: {
    buildOn: string
    delegateToL2BEAT: string
  }
  allMilestones: EcosystemMilestone[]
  ecosystemMilestones: EcosystemMilestone[]
}

export interface EcosystemProjectEntry extends ScalingSummaryEntry {
  ecosystemInfo: ProjectEcosystemInfo
  gasTokens?: string[]
  tvsData: ProjectSevenDayTvsBreakdown | undefined
}

export async function getEcosystemEntry(
  slug: string,
  helpers: SsrHelpers,
): Promise<EcosystemEntry | undefined> {
  const ecosystem = await ps.getProject({
    slug,
    select: ['ecosystemConfig', 'display', 'colors'],
    optional: ['milestones'],
  })

  if (!ecosystem) {
    return undefined
  }

  const [allScalingProjects, projects, zkCatalogProjects] = await Promise.all([
    ps.getProjects({
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'archivedAt'],
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
        'isUpcoming',
        'hasTestnet',
      ],
      where: ['isScaling'],
    }),
    ps.getProjects({
      select: ['zkCatalogInfo'],
    }),
  ])

  const ecosystemProjects = projects.filter(
    (p) => p.ecosystemInfo.id === ecosystem.id,
  )

  const upcomingProjects = ecosystemProjects.filter((p) => p.isUpcoming)
  const archivedProjects = ecosystemProjects.filter((p) => !!p.archivedAt)
  const liveProjects = ecosystemProjects
    .filter((p) => !p.isUpcoming && !p.archivedAt)
    .toSorted((a, b) => a.id.localeCompare(b.id))

  const [
    projectsChangeReport,
    tvs,
    projectsActivity,
    projectsOngoingAnomalies,
    blobsData,
    token,
  ] = await Promise.all([
    getProjectsChangeReport(),
    get7dTvsBreakdown({ type: 'layer2' }),
    getActivityLatestUops(allScalingProjects),
    getApprovedOngoingAnomalies(),
    getBlobsData(liveProjects),
    getEcosystemToken(ecosystem, liveProjects),
    helpers.activity.chart.prefetch({
      range: { type: '1y' },
      filter: {
        type: 'projects',
        projectIds: liveProjects.map((project) => project.id),
      },
    }),
  ])

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
      ecosystemUpdate: getEcosystemUpdateLink(ecosystem),
    },
    allScalingProjects: {
      tvs: tvs.total,
      uops: allScalingProjectsUops,
    },
    tvsByStage: getTvsByStage(liveProjects, tvs),
    tvsByTokenType: getTvsByTokenType(liveProjects, tvs),
    projectsByDaLayer: getProjectsByDaLayer(liveProjects),
    blobsData,
    projectsByRaas: getProjectsByRaas(liveProjects),
    token,
    projectsChartData: getEcosystemProjectsChartData(
      [...archivedProjects, ...liveProjects],
      allScalingProjects.length,
      tvs.projects,
      projectsActivity,
      ecosystem.ecosystemConfig.startedAt,
    ),
    banners: {
      firstBanner: ecosystem.ecosystemConfig.firstBanner,
      secondBanner: ecosystem.ecosystemConfig.secondBanner,
    },
    liveProjects: liveProjects
      .map((project) => {
        const entry = getScalingSummaryEntry(
          project,
          projectsChangeReport.getChanges(project.id),
          tvs.projects[project.id.toString()],
          projectsActivity[project.id.toString()],
          !!projectsOngoingAnomalies[project.id.toString()],
          zkCatalogProjects,
        )

        const result: EcosystemProjectEntry = {
          ...entry,
          gasTokens: project.chainConfig?.gasTokens,
          ecosystemInfo: project.ecosystemInfo,
          filterable: compact([
            ecosystem.id === 'superchain' && {
              id: 'isPartOfSuperchain',
              value: project.ecosystemInfo.isPartOfSuperchain ? 'Yes' : 'No',
            },
            ...(entry.filterable?.filter(
              (f) => !EXCLUDED_FILTERS.includes(f.id),
            ) ?? []),
          ]),
          tvsData: tvs.projects[project.id.toString()],
        }
        return result
      })
      .sort(compareTvs),
    upcomingProjects: upcomingProjects.map((p) =>
      getScalingUpcomingEntry(p, zkCatalogProjects),
    ),
    allMilestones: getMilestones([ecosystem, ...ecosystemProjects]),
    ecosystemMilestones: getMilestones([ecosystem]),
    images: {
      buildOn: getStaticAsset(`/partners/${slug}/build-on.png`),
      delegateToL2BEAT: getStaticAsset(
        '/partners/governance-delegate-to-l2beat.png',
      ),
    },
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
  const lastPublication = getCollection('governance-publications')
    .filter((p) => p.id.includes('review'))
    .sort((a, b) => a.data.publishedOn.getTime() - b.data.publishedOn.getTime())
    .at(-1)
  assert(lastPublication, 'No last publication')

  const bankImage = getImageParams('/partners/governance-bank.png')
  assert(bankImage, 'Bank image not found')

  return {
    delegateToL2BEAT:
      ecosystem.ecosystemConfig.links.governanceDelegateToL2BEAT,
    proposals: ecosystem.ecosystemConfig.links.governanceProposals,
    review: `/governance/publications/${lastPublication.id}`,
    bankImage,
  }
}

function getEcosystemUpdateLink(ecosystem: Project<'ecosystemConfig'>): string {
  const lastReport = getCollection('monthly-updates')
    .sort((a, b) => a.data.publishedOn.getTime() - b.data.publishedOn.getTime())
    .at(-1)
  assert(lastReport, 'No last report')

  return `/publications/${lastReport.id}#${ecosystem.id}`
}
