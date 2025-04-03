import type {
  Milestone,
  Project,
  ProjectEcosystemConfig,
  ProjectEcosystemInfo,
} from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { readFileSync } from 'fs'
import path from 'path'
import type { ProjectLink } from '~/components/projects/links/types'
import type { BadgeWithParams } from '~/components/projects/project-badge'
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

export interface EcosystemEntry {
  slug: string
  name: string
  logo: {
    src: string
    width: number
    height: number
  }
  badges: BadgeWithParams[]
  colors: ProjectEcosystemConfig['colors']
  projects: EcosystemProjectEntry[]
  allScalingProjectsCount: number
  daLayersUsed: Record<string, number>
  links: ProjectLink[]
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
    getActivityLatestUops(projects),
  ])

  const ecosystemProjects = projects.filter(
    (p) => p.ecosystemInfo.id === ecosystem.id,
  )

  return {
    ...ecosystem,
    colors: ecosystem.ecosystemConfig.colors,
    logo: getEcosystemLogo(slug),
    badges: ecosystem.display.badges
      .map((badge) => getBadgeWithParams(badge, ecosystem))
      .filter((badge) => badge !== undefined),
    links: getProjectLinks(ecosystem.display.links),
    allScalingProjectsCount: allScalingProjects.length,
    daLayersUsed: getDaLayersUsed(ecosystemProjects),
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

function getDaLayersUsed(ecosystemProjects: Project<'scalingInfo'>[]) {
  return ecosystemProjects
    .map((p) => p.scalingInfo.daLayer)
    .reduce(
      (acc, curr) => {
        const record = acc[curr]
        if (record) {
          acc[curr] = record + 1
        } else {
          acc[curr] = 1
        }
        return acc
      },
      {} as Record<string, number>,
    )
}

function getEcosystemLogo(slug: string) {
  const imgBuffer = readFileSync(
    path.join(process.cwd(), './public', `/ecosystems/${slug}.png`),
  )
  const dimensions = getImageDimensions(imgBuffer)
  assert(dimensions, 'Ecosystem logo not found')
  return { ...dimensions, src: `/ecosystems/${slug}.png` }
}

function getMilestones(projects: Project<never, 'milestones'>[]) {
  return projects.flatMap((project) => {
    return project.milestones ?? []
  })
}
