import type { ExitWindowRisk } from '@l2beat/config'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import {
  measureProjectOssification,
  type OssificationTimeline,
} from './getProjectOssification'

export interface OssificationSummaryEntry {
  slug: string
  name: string
  shortName?: string
  description: string
  /** Which part of the site the project belongs to; the table mixes them. */
  category: 'Layer 2' | 'Layer 3' | 'Privacy' | 'DeFi' | undefined
  isUnderReview: boolean
  icon: string
  href: string | undefined
  score: number
  /** an unverified critical contract gates the score to zero; the summary
   *  shows this without sentiment */
  isUnverified: boolean
  exposure: number | null
  criticalChangesPerYear: number
  clusteredEventCount: number
  contractCount: number
  exitWindow: ExitWindowRisk | undefined
  timeline: OssificationTimeline
}

/** Every project that opted into the ossification factor. The comparison
 *  deliberately spans all project types tracked by L2BEAT. */
export async function getOssificationEntries(): Promise<
  OssificationSummaryEntry[]
> {
  const projects = await ps.getProjects({
    select: ['display', 'statuses', 'ossificationInfo'],
    optional: ['scalingInfo', 'scalingRisks', 'privacyInfo', 'defiInfo'],
    whereNot: ['archivedAt'],
  })

  const entries = await Promise.all(
    projects.map(async (project): Promise<OssificationSummaryEntry> => {
      const ossification = await measureProjectOssification(
        project.id,
        project.ossificationInfo,
      )
      const section = getSection(project)

      return {
        slug: project.slug,
        name: project.name,
        shortName: project.shortName,
        description: project.display.description,
        category: section?.category,
        isUnderReview: !!project.statuses.reviewStatus,
        icon: manifest.getUrl(`/icons/${project.slug}.png`),
        href:
          section && `/${section.path}/projects/${project.slug}#ossification`,
        score: ossification.score,
        isUnverified: ossification.contracts.some(
          (contract) => !contract.isVerified,
        ),
        exposure: ossification.exposure,
        criticalChangesPerYear: ossification.criticalChangesPerYear,
        clusteredEventCount: ossification.clusteredEventCount,
        contractCount: ossification.contracts.length,
        timeline: ossification.timeline,
        exitWindow: project.scalingRisks
          ? (project.scalingRisks.stacked ?? project.scalingRisks.self)
              .exitWindow
          : (project.privacyInfo?.exitWindow ?? project.defiInfo?.exitWindow),
      }
    }),
  )

  return entries.sort(
    (a, b) => b.score - a.score || (b.exposure ?? 0) - (a.exposure ?? 0),
  )
}

/** Which part of the site the project lives in; the table mixes them. */
function getSection(project: {
  scalingInfo?: { layer: string }
  privacyInfo?: unknown
  defiInfo?: unknown
}):
  | { path: string; category: OssificationSummaryEntry['category'] }
  | undefined {
  if (project.scalingInfo) {
    return {
      path: 'layer2s',
      category: project.scalingInfo.layer === 'layer3' ? 'Layer 3' : 'Layer 2',
    }
  }
  if (project.privacyInfo) return { path: 'privacy', category: 'Privacy' }
  if (project.defiInfo) return { path: 'defi', category: 'DeFi' }
  return undefined
}
