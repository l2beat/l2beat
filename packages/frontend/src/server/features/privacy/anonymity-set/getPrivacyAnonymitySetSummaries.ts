import type { Database, IndexerConfigurationRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import type { PrivacyProject } from '../types'
import {
  ANONYMITY_SET_WINDOW_DAYS,
  calculateAnonymitySetHistory,
  type PrivacyAnonymitySetRecords,
} from './calculateAnonymitySets'
import {
  getPrivacyAnonymitySetCoverage,
  type PrivacyAnonymitySetCoverage,
} from './getPrivacyAnonymitySetCoverage'
import { getPrivacyAnonymitySetRecords } from './getPrivacyAnonymitySetRecords'
import {
  getPrivacyAnonymitySetSeries,
  type PrivacyAnonymitySetProject,
  type PrivacyAnonymitySetSeries,
} from './getPrivacyAnonymitySetSeries'
import {
  getPrivacyAnonymitySetConfigurations,
  getPrivacyAnonymitySetSyncStatus,
} from './getPrivacyAnonymitySetSync'

export type PrivacyAnonymitySetSummary =
  | ({
      status: 'available'
      value: number
      label: string
      /** Labels of configured series excluded from the value while their history is indexed. */
      syncingLabels: string[]
      coverage?: PrivacyAnonymitySetCoverage
    } & Pick<
      PrivacyAnonymitySetSeries,
      'bucketType' | 'chain' | 'formattedAmount' | 'token' | 'unit'
    >)
  | {
      status: 'not-applicable'
      description: string
    }
  | { status: 'too-small' }
  | { status: 'syncing' }
  | { status: 'unavailable' }

export async function getPrivacyAnonymitySetSummaries(
  projects: PrivacyProject[],
  currentDay: UnixTime,
): Promise<Map<string, PrivacyAnonymitySetSummary>> {
  const seriesByProject = new Map(
    projects.map((project) => [
      project.id,
      getPrivacyAnonymitySetSeries(project),
    ]),
  )
  if (env.MOCK) return getMockSummaries(projects, seriesByProject)

  const db = getDb()
  const allSeries = [...seriesByProject.values()].flat()
  const cutoff = currentDay - ANONYMITY_SET_WINDOW_DAYS * UnixTime.DAY

  const [configurations, records, coverageByProject] = await Promise.all([
    getPrivacyAnonymitySetConfigurations(db, allSeries),
    getPrivacyAnonymitySetRecords(db, allSeries, cutoff, currentDay),
    getCoverageByProject(db, projects, currentDay),
  ])

  return new Map(
    projects.map((project) => [
      project.id,
      getPrivacyAnonymitySetSummary(
        project,
        seriesByProject.get(project.id) ?? [],
        configurations,
        records,
        currentDay,
        coverageByProject.get(project.id),
      ),
    ]),
  )
}

export function getPrivacyAnonymitySetSummary(
  project: PrivacyAnonymitySetProject,
  series: PrivacyAnonymitySetSeries[],
  configurations: IndexerConfigurationRecord[],
  records: PrivacyAnonymitySetRecords,
  currentDay: UnixTime,
  coverage?: PrivacyAnonymitySetCoverage,
): PrivacyAnonymitySetSummary {
  const state = project.privacyInfo.anonymitySet
  if (state?.type === 'not-applicable') {
    return { status: 'not-applicable', description: state.description }
  }
  if (state?.type === 'too-small') {
    return { status: 'too-small' }
  }
  if (series.length === 0) {
    return { status: 'unavailable' }
  }

  const { syncedSeries, syncingLabels } = getPrivacyAnonymitySetSyncStatus(
    series,
    configurations,
    currentDay,
  )
  const [point] = calculateAnonymitySetHistory(records, syncedSeries, [
    currentDay,
  ])
  const largest = pickLargestSeries(syncedSeries, point?.slice(1) ?? [])
  if (largest === undefined) {
    return { status: 'syncing' }
  }

  return {
    status: 'available',
    value: largest.value,
    label: largest.series.label,
    syncingLabels,
    ...(coverage && { coverage }),
    bucketType: largest.series.bucketType,
    chain: largest.series.chain,
    formattedAmount: largest.series.formattedAmount,
    token: largest.series.token,
    unit: largest.series.unit,
  }
}

async function getCoverageByProject(
  db: Database,
  projects: PrivacyProject[],
  currentDay: UnixTime,
): Promise<Map<string, PrivacyAnonymitySetCoverage | undefined>> {
  const entries = await Promise.all(
    projects.map(
      async (project) =>
        [
          project.id,
          await getPrivacyAnonymitySetCoverage(db, project, currentDay),
        ] as const,
    ),
  )
  return new Map(entries)
}

/**
 * The headline is the series with the most candidates. Ties keep the
 * earlier series, so the configuration order decides between equal sets.
 */
function pickLargestSeries(
  series: PrivacyAnonymitySetSeries[],
  values: number[],
): { series: PrivacyAnonymitySetSeries; value: number } | undefined {
  let best: { series: PrivacyAnonymitySetSeries; value: number } | undefined
  for (const [index, item] of series.entries()) {
    const value = values[index] ?? 0
    if (best === undefined || value > best.value) {
      best = { series: item, value }
    }
  }
  return best
}

function getMockSummaries(
  projects: PrivacyProject[],
  seriesByProject: Map<string, PrivacyAnonymitySetSeries[]>,
): Map<string, PrivacyAnonymitySetSummary> {
  return new Map(
    projects.map((project): [string, PrivacyAnonymitySetSummary] => {
      const state = project.privacyInfo.anonymitySet
      if (state?.type === 'not-applicable') {
        return [
          project.id,
          { status: 'not-applicable', description: state.description },
        ]
      }
      if (state?.type === 'too-small') {
        return [project.id, { status: 'too-small' }]
      }
      const series = seriesByProject.get(project.id)?.[0]
      if (series) {
        return [
          project.id,
          {
            status: 'available',
            value: Math.round(Math.random() * 1_000),
            label: series.label,
            syncingLabels: [],
            ...(state?.type === 'partially-attributed' && {
              coverage: { attributed: 90, total: 100 },
            }),
            bucketType: series.bucketType,
            chain: series.chain,
            formattedAmount: series.formattedAmount,
            token: series.token,
            unit: series.unit,
          },
        ]
      }
      return [project.id, { status: 'unavailable' }]
    }),
  )
}
