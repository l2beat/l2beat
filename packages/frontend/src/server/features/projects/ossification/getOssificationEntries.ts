import type { ExitWindowRisk, Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { getRowBackgroundColor } from '~/components/table/utils/rowType'
import { env } from '~/env'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { getUnderReviewStatus } from '~/utils/project/underReview'
import { getOssificationSeries } from './getOssificationSeries'
import {
  getOssificationStats,
  type OssificationStats,
} from './getProjectOssification'
import { sampleTimeline } from './sampleTimeline'

type OssificationCategory = 'Layer 2' | 'Layer 3' | 'Privacy' | 'DeFi'

export interface OssificationEntry
  extends OssificationStats,
    Pick<
      CommonProjectEntry,
      'slug' | 'name' | 'icon' | 'backgroundColor' | 'statuses'
    > {
  category: OssificationCategory
  /** Project page; absent for DeFi projects while DeFi pages are disabled */
  href?: string
  contractCount: number
  /** Absent for DeFi, which has no exit window in config yet */
  exitWindow?: OssificationExitWindow
  timeline: OssificationTimeline
}

type OssificationExitWindow = Pick<
  ExitWindowRisk,
  'value' | 'sentiment' | 'description' | 'warning' | 'regular' | 'orderHint'
>

interface OssificationTimeline {
  from: number
  to: number
  clockStart: number
  /** Perimeter resets inside the window, up to the clock start */
  resets: number[]
  /** Critical changes inside the window, up to the clock start */
  criticalChanges: number
  /** Evenly spread from `from` to `to`, see sampleTimeline */
  values: (number | null)[] | null
}

type OssificationEntryProject = Project<
  'ossification' | 'statuses',
  'scalingInfo' | 'scalingRisks' | 'privacyInfo' | 'defiInfo' | 'tvsConfig'
>

const TIMELINE_WINDOW = 365 * UnixTime.DAY

export async function getOssificationEntries(): Promise<OssificationEntry[]> {
  const projects = await ps.getProjects({
    select: ['ossification', 'statuses'],
    optional: [
      'scalingInfo',
      'scalingRisks',
      'privacyInfo',
      'defiInfo',
      'tvsConfig',
    ],
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
      // Later ones belong to contracts that have left the perimeter.
      const isInTimeline = (timestamp: number) =>
        timestamp >= from && timestamp <= clockStart
      const series = await getOssificationSeries(
        project,
        Math.min(from, clockStart),
      )
      const statuses = {
        yellowWarning: project.statuses.yellowWarning,
        redWarning: project.statuses.redWarning,
        underReview: getUnderReviewStatus({
          isUnderReview: !!project.statuses.reviewStatus,
          impactfulChange: false,
        }),
      }

      return {
        slug: project.slug,
        name: project.name,
        icon: manifest.getUrl(`/icons/${project.slug}.png`),
        backgroundColor: getRowBackgroundColor(statuses),
        statuses,
        ...placement,
        ...getOssificationStats(ossification, series, now),
        contractCount: ossification.contracts.length,
        exitWindow: getExitWindow(project),
        timeline: {
          from,
          to: now,
          clockStart,
          resets: ossification.perimeterResets.filter(isInTimeline),
          criticalChanges:
            ossification.criticalChanges.filter(isInTimeline).length,
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

function getExitWindow(
  project: OssificationEntryProject,
): OssificationExitWindow | undefined {
  const risk = project.scalingRisks
    ? (project.scalingRisks.stacked ?? project.scalingRisks.self).exitWindow
    : project.privacyInfo?.exitWindow
  if (!risk) {
    return undefined
  }
  const { value, sentiment, description, warning, regular, orderHint } = risk
  return { value, sentiment, description, warning, regular, orderHint }
}

function getPlacement(
  project: OssificationEntryProject,
): Pick<OssificationEntry, 'category' | 'href'> | undefined {
  if (project.scalingInfo) {
    return {
      category: project.scalingInfo.layer === 'layer2' ? 'Layer 2' : 'Layer 3',
      href: `/layer2s/projects/${project.slug}`,
    }
  }
  if (project.privacyInfo) {
    return {
      category: 'Privacy',
      href: `/privacy/projects/${project.slug}`,
    }
  }
  if (project.defiInfo) {
    return {
      category: 'DeFi',
      ...(env.CLIENT_SIDE_DEFI_ENABLED && {
        href: `/defi/projects/${project.slug}`,
      }),
    }
  }
}
