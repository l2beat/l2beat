import { readFileSync } from 'fs'
import path from 'path'
import type { ProjectEcosystemConfig } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import type { ProjectLink } from '~/components/projects/links/types'
import type { BadgeWithParams } from '~/components/projects/project-badge'
import { ps } from '~/server/projects'
import { getBadgeWithParams } from '~/utils/project/get-badge-with-params'
import { getImageDimensions } from '~/utils/project/get-image-params'
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getProjectsChangeReport } from '../projects-change-report/get-projects-change-report'
import { getActivityLatestUops } from '../scaling/activity/get-activity-latest-tps'
import { get7dTvsBreakdown } from '../scaling/new-tvs/utils/get-7d-tvs-breakdown'
import {
  type ScalingSummaryEntry,
  getScalingSummaryEntry,
} from '../scaling/summary/get-scaling-summary-entries'
import { compareStageAndTvs } from '../scaling/utils/compare-stage-and-tvs'

export interface EcosystemProjectEntry {
  slug: string
  name: string
  logo: {
    src: string
    width: number
    height: number
  }
  badges: BadgeWithParams[]
  colors: ProjectEcosystemConfig['colors']
  projects: ScalingSummaryEntry[]
  links: ProjectLink[]
}

export async function getEcosystemProjectEntry(
  slug: string,
): Promise<EcosystemProjectEntry | undefined> {
  const ecosystem = await ps.getProject({
    slug,
    select: ['ecosystemConfig', 'display'],
  })

  if (!ecosystem) {
    return undefined
  }

  const projects = await ps.getProjects({
    select: [
      'statuses',
      'scalingInfo',
      'scalingRisks',
      'display',
      'ecosystemInfo',
    ],
    optional: ['tvlInfo', 'scalingDa', 'scalingStage', 'chainConfig'],
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

  const logo = getEcosystemLogo(slug)

  return {
    ...ecosystem,
    colors: ecosystem.ecosystemConfig.colors,
    logo,
    badges: ecosystem.display.badges
      .map((badge) => getBadgeWithParams(badge, ecosystem))
      .filter((badge) => badge !== undefined),
    links: getProjectLinks(ecosystem.display.links),
    projects: ecosystemProjects
      .map((project) =>
        getScalingSummaryEntry(
          project,
          projectsChangeReport.getChanges(project.id),
          tvs.projects[project.id.toString()],
          projectsActivity[project.id.toString()],
        ),
      )
      .sort(compareStageAndTvs),
  }
}

function getEcosystemLogo(slug: string) {
  const imgBuffer = readFileSync(
    path.join(process.cwd(), './public', `/ecosystems/${slug}.png`),
  )
  const dimensions = getImageDimensions(imgBuffer)
  assert(dimensions, 'Ecosystem logo not found')
  return { ...dimensions, src: `/ecosystems/${slug}.png` }
}
