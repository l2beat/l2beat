import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { getOssificationSeries } from './getOssificationSeries'
import {
  getOssificationStats,
  type OssificationStats,
} from './getProjectOssification'
import { sampleTimeline } from './sampleTimeline'

export type OssificationCategory = 'Layer 2' | 'Layer 3' | 'Privacy' | 'DeFi'

export interface OssificationEntry extends OssificationStats {
  slug: string
  name: string
  icon: string
  category: OssificationCategory
  /** Absent for DeFi projects while DeFi pages are disabled */
  href?: string
  timeline: OssificationTimeline
}

export interface OssificationTimeline {
  from: number
  to: number
  clockStart: number
  /** Perimeter resets inside the window, up to the clock start */
  resets: number[]
  /** Evenly spread from `from` to `to`, see sampleTimeline */
  values: (number | null)[] | null
}

type OssificationEntryProject = Project<
  'ossification',
  'scalingInfo' | 'privacyInfo' | 'defiInfo' | 'tvsConfig'
>

const TIMELINE_WINDOW = 365 * UnixTime.DAY

export async function getOssificationEntries(): Promise<OssificationEntry[]> {
  const projects = await ps.getProjects({
    select: ['ossification'],
    optional: ['scalingInfo', 'privacyInfo', 'defiInfo', 'tvsConfig'],
    whereNot: ['archivedAt'],
  })

  const now = UnixTime.now()
  const from = now - TIMELINE_WINDOW

  const entries = await Promise.all(
    projects.map(async (project): Promise<OssificationEntry | undefined> => {
      const placement = getPlacement(project)
      if (!placement) {
        return undefined
      }

      const { ossification } = project
      const clockStart = ossification.projectClockStart
      const series = await getOssificationSeries(
        project,
        Math.min(from, clockStart),
      )

      return {
        slug: project.slug,
        name: project.name,
        icon: manifest.getUrl(`/icons/${project.slug}.png`),
        ...placement,
        ...getOssificationStats(ossification, series, now),
        timeline: {
          from,
          to: now,
          clockStart,
          // Later resets belong to contracts that have left the perimeter.
          resets: ossification.perimeterResets.filter(
            (reset) => reset >= from && reset <= clockStart,
          ),
          values: series ? sampleTimeline(series.points, from, now) : null,
        },
      }
    }),
  )

  return entries
    .filter((entry) => entry !== undefined)
    .sort(
      (a, b) => b.score - a.score || (b.exposure ?? -1) - (a.exposure ?? -1),
    )
}

function getPlacement(
  project: OssificationEntryProject,
): Pick<OssificationEntry, 'category' | 'href'> | undefined {
  if (project.scalingInfo) {
    return {
      category: project.scalingInfo.layer === 'layer2' ? 'Layer 2' : 'Layer 3',
      href: `/layer2s/projects/${project.slug}#ossification`,
    }
  }
  if (project.privacyInfo) {
    return {
      category: 'Privacy',
      href: `/privacy/projects/${project.slug}#ossification`,
    }
  }
  if (project.defiInfo) {
    return {
      category: 'DeFi',
      ...(env.CLIENT_SIDE_DEFI_ENABLED && {
        href: `/defi/projects/${project.slug}#ossification`,
      }),
    }
  }
}
