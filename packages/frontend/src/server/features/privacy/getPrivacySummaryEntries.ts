import type { PrivacyAttribute, TrustedSetup } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
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
  isTracked: boolean
  totalValueLockedUsd?: number
  poolsTracked: number
  totalDeposits?: number
  totalValueDeposited30dUsd?: number
  attributes: PrivacyAttribute[]
  isUnderReview: boolean
  trustedSetup: TrustedSetup
}

export async function getPrivacySummaryEntries(
  projects: PrivacyProject[],
): Promise<PrivacySummaryEntry[]> {
  if (env.MOCK) {
    return getMockPrivacySummaryEntries(projects)
  }

  const db = getDb()
  const projectIds = projects.map((p) => p.id)

  const now = UnixTime.now()
  const currentDay = UnixTime.toStartOf(now, 'day')
  const last30dCutoff = currentDay - 30 * UnixTime.DAY

  const [totals, daily30d, tokenValues] = await Promise.all([
    db.privacyFlowEvent.getBucketTotalsByProjectIds(projectIds),
    db.privacyFlowEvent.getDailyByProjectIds(
      projectIds,
      last30dCutoff,
      currentDay,
    ),
    db.tvsTokenValue.getLastNonZeroValueByProjects(now, projectIds),
  ])

  const totalsByProject = groupBy(totals, (t) => t.projectId)
  const dailyByProject = groupBy(daily30d, (d) => d.projectId)
  const tokenValuesByProject = groupBy(tokenValues, (v) => v.projectId)

  const entries = projects.map((project): PrivacySummaryEntry => {
    const projectId = project.id
    const projectTotals = totalsByProject[projectId] ?? []
    const projectDaily = dailyByProject[projectId] ?? []
    const tokenValues = tokenValuesByProject[projectId] ?? []

    const totalValueLockedUsd = tokenValues.reduce(
      (sum, tv) => sum + tv.valueForProject,
      0,
    )
    const poolsTracked = project.privacyInfo.tokens.reduce(
      (sum, t) => sum + t.buckets.length,
      0,
    )
    const isTracked = poolsTracked > 0
    const totalDeposits = projectTotals.reduce(
      (sum, t) => sum + t.depositCount,
      0,
    )
    const totalValueDeposited30dUsd = projectDaily.reduce(
      (sum, row) => sum + row.depositValueUsd,
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
      isTracked,
      totalValueLockedUsd: isTracked ? totalValueLockedUsd : undefined,
      poolsTracked,
      totalDeposits: isTracked ? totalDeposits : undefined,
      totalValueDeposited30dUsd: isTracked
        ? totalValueDeposited30dUsd
        : undefined,
      attributes: project.privacyInfo.attributes ?? [],
      isUnderReview: !!project.statuses.reviewStatus,
      trustedSetup: project.privacyInfo.trustedSetup,
    }
  })

  return entries.sort(comparePrivacySummaryEntries)
}

function getMockPrivacySummaryEntries(
  projects: PrivacyProject[],
): PrivacySummaryEntry[] {
  return projects
    .map((project): PrivacySummaryEntry => {
      const poolsTracked = project.privacyInfo.tokens.reduce(
        (sum, t) => sum + t.buckets.length,
        0,
      )
      const isTracked = poolsTracked > 0

      return {
        id: project.id,
        slug: project.slug,
        name: project.name,
        shortName: project.shortName,
        icon: manifest.getUrl(`/icons/${project.slug}.png`),
        href: `/privacy/projects/${project.slug}`,
        description: project.display.description,
        poolsTracked,
        isTracked,
        totalValueLockedUsd: isTracked
          ? Math.random() * 1_000_000_000
          : undefined,
        totalDeposits: isTracked
          ? Math.round(Math.random() * 10_000)
          : undefined,
        totalValueDeposited30dUsd: isTracked
          ? Math.random() * 100_000_000
          : undefined,
        attributes: project.privacyInfo.attributes ?? [],
        isUnderReview: !!project.statuses.reviewStatus,
        trustedSetup: project.privacyInfo.trustedSetup,
      }
    })
    .sort(comparePrivacySummaryEntries)
}

function comparePrivacySummaryEntries(
  a: PrivacySummaryEntry,
  b: PrivacySummaryEntry,
): number {
  if (a.isTracked !== b.isTracked) {
    return a.isTracked ? -1 : 1
  }

  return (b.totalValueLockedUsd ?? 0) - (a.totalValueLockedUsd ?? 0)
}
