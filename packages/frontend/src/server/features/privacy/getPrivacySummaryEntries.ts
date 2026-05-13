import type { TokenValueRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { getPrivacyProjects } from './getPrivacyProjects'

export interface PrivacySummaryEntryData {
  id: string
  slug: string
  name: string
  shortName?: string
  description: string
  totalValueSecuredUsd: number
  poolsTracked: number
  totalDeposits: number
  totalValueDeposited30dUsd: number
  totalDeposits30d: number
  isUnderReview: boolean
  trustedSetup: {
    id: string
    name: string
    risk: 'green' | 'yellow' | 'red' | 'N/A'
    shortDescription: string
    longDescription: string
    participantCount?: number
  }
}

export async function getPrivacySummaryEntries(): Promise<
  PrivacySummaryEntryData[]
> {
  const db = getDb()
  const projects = await getPrivacyProjects()
  const projectIds = projects.map((p) => p.id.toString())

  const now = UnixTime.now()
  const currentDay = UnixTime.toStartOf(now, 'day')
  const last30dCutoff = currentDay - 29 * UnixTime.DAY

  const [totals, daily30d, ...projectTokenValues] = await Promise.all([
    db.privacyFlowEvent.getBucketTotalsByProjectIds(projectIds),
    db.privacyFlowEvent.getDailyByProjectIds(
      projectIds,
      last30dCutoff,
      currentDay,
    ),
    ...projects.map((p) =>
      db.tvsTokenValue.getLastNonZeroValue(now, p.id.toString()),
    ),
  ])

  const totalsByProject = groupByProjectId(totals)
  const dailyByProject = groupByProjectId(daily30d)

  const tokenValuesByProject = new Map<string, TokenValueRecord[]>()
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i]
    const tv = projectTokenValues[i]
    if (p && tv) {
      tokenValuesByProject.set(p.id.toString(), tv)
    }
  }

  const entries = projects.map((project) => {
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
      description: project.display.description,
      totalValueSecuredUsd,
      poolsTracked,
      totalDeposits,
      totalValueDeposited30dUsd,
      totalDeposits30d,
      isUnderReview: !!project.statuses.reviewStatus,
      trustedSetup: project.privacyInfo.trustedSetup,
    }
  })

  return entries.sort(
    (a, b) => b.totalValueSecuredUsd - a.totalValueSecuredUsd,
  )
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
