import type { Project } from '@l2beat/config'
import { measureOssification } from '@l2beat/shared/frontend'
import { UnixTime } from '@l2beat/shared-pure'
import { getRowBackgroundColor } from '~/components/table/utils/rowType'
import { env } from '~/env'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { getUnderReviewStatus } from '~/utils/project/underReview'
import {
  getOssificationStats,
  type OssificationStats,
} from './getOssificationStats'

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
}

type OssificationEntryProject = Project<
  'ossification' | 'statuses',
  'scalingInfo' | 'scalingRisks' | 'privacyInfo' | 'defiInfo' | 'tvsConfig'
>

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

  const entries = await Promise.all(
    projects.map(async (project): Promise<OssificationEntry | undefined> => {
      const placement = getPlacement(project)
      if (!placement) {
        return undefined
      }

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
        ...(await getOssificationStats(
          project,
          measureOssification(project.ossification, now),
          now,
        )),
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
