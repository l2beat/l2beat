import type { PrivacyAttribute, TrustedSetup } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { manifest } from '~/utils/Manifest'
import type { PrivacyProject } from './types'

export interface PrivacySummaryEntry {
  id: string
  slug: string
  name: string
  shortName?: string
  icon: string
  href: string
  description: string
  totalValueSecuredUsd: number
  poolsTracked: number
  totalDeposits: number
  totalValueDeposited30dUsd: number
  totalDeposits30d: number
  attributes: PrivacyAttribute[]
  isUnderReview: boolean
  trustedSetup: TrustedSetup
}

export async function getPrivacySummaryEntries(
  projects: PrivacyProject[],
): Promise<PrivacySummaryEntry[]> {
  const db = getDb()
  const projectIds = projects.map((p) => p.id.toString())

  const now = UnixTime.now()
  const currentDay = UnixTime.toStartOf(now, 'day')
  const last30dCutoff = currentDay - 29 * UnixTime.DAY

  const [totals, daily30d, tokenValues] = await Promise.all([
    db.privacyFlowEvent.getBucketTotalsByProjectIds(projectIds),
    db.privacyFlowEvent.getDailyByProjectIds(
      projectIds,
      last30dCutoff,
      currentDay,
    ),
    db.tvsTokenValue.getLastNonZeroValueByProjects(now, projectIds),
  ])

  const totalsByProject = groupByProjectId(totals)
  const dailyByProject = groupByProjectId(daily30d)
  const tokenValuesByProject = groupByProjectId(tokenValues)

  const entries = projects.map((project): PrivacySummaryEntry => {
    const projectId = project.id.toString()
    const projectTotals = totalsByProject.get(projectId) ?? []
    const projectDaily = dailyByProject.get(projectId) ?? []
    const tokenValues = tokenValuesByProject.get(projectId) ?? []

    const totalValueSecuredUsd = tokenValues.reduce(
      (sum, tv) => sum + tv.valueForProject,
      0,
    )
    const poolsTracked = project.privacyInfo.tokens.reduce(
      (sum, t) => sum + t.buckets.length,
      0,
    )
    const totalDeposits = projectTotals.reduce(
      (sum, t) => sum + t.depositCount,
      0,
    )
    const totalValueDeposited30dUsd = projectDaily.reduce(
      (sum, row) => sum + row.depositValueUsd,
      0,
    )
    const totalDeposits30d = projectDaily.reduce(
      (sum, row) => sum + row.depositCount,
      0,
    )

    return {
      id: project.id,
      slug: project.slug,
      name: project.name,
      shortName: project.shortName,
      icon: manifest.getUrl(`/icons/${project.slug}.png`),
      href: `/privacy/projects/${project.slug}`,
      description: project.display.description,
      totalValueSecuredUsd,
      poolsTracked,
      totalDeposits,
      totalValueDeposited30dUsd,
      totalDeposits30d,
      attributes: project.privacyInfo.attributes ?? [],
      isUnderReview: !!project.statuses.reviewStatus,
      trustedSetup: project.privacyInfo.trustedSetup,
    }
  })

  return entries.sort((a, b) => b.totalValueSecuredUsd - a.totalValueSecuredUsd)
}

function groupByProjectId<T extends { projectId: string }>(
  items: T[],
): Map<string, T[]> {
  const map = new Map<string, T[]>()
  for (const item of items) {
    const existing = map.get(item.projectId) ?? []
    existing.push(item)
    map.set(item.projectId, existing)
  }
  return map
}
