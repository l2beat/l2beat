import type {
  Database,
  IndexerConfigurationRecord,
  PrivacyAnonymitySetSenderDayRecord,
} from '@l2beat/database'
import { UnixTime, unique } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import type { PrivacyProject } from '../types'
import {
  ANONYMITY_SET_WINDOW_DAYS,
  calculateAnonymitySetHistory,
} from './calculateAnonymitySets'
import {
  getPrivacyAnonymitySetCoverage,
  type PrivacyAnonymitySetCoverage,
} from './getPrivacyAnonymitySetCoverage'
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
  | {
      status: 'available'
      value: number
      /** Labels of configured series excluded from the value while their history is indexed. */
      syncingLabels: string[]
      coverage?: PrivacyAnonymitySetCoverage
      /** The series whose set is counted in the value. */
      series: Omit<PrivacyAnonymitySetSeries, 'configurationId'>
    }
  | {
      status: 'not-applicable'
      description: string
    }
  | { status: 'too-small' }
  | { status: 'syncing' }
  | { status: 'unavailable' }

/**
 * Keyed by the project passed in, not by its id: the summary table passes a
 * project once per tracked chain, each with that chain's buckets.
 */
export async function getPrivacyAnonymitySetSummaries(
  projects: PrivacyProject[],
  currentDay: UnixTime,
): Promise<Map<PrivacyProject, PrivacyAnonymitySetSummary>> {
  const seriesByProject = new Map(
    projects.map((project) => [project, getPrivacyAnonymitySetSeries(project)]),
  )
  if (env.MOCK) return getMockSummaries(projects, seriesByProject)

  const db = getDb()
  const allSeries = [...seriesByProject.values()].flat()
  const trackedProjectIds = unique(allSeries.map((item) => item.projectId))
  const cutoff = currentDay - ANONYMITY_SET_WINDOW_DAYS * UnixTime.DAY

  const [configurations, rows, coverageByProject] = await Promise.all([
    getPrivacyAnonymitySetConfigurations(db, allSeries),
    db.privacyAnonymitySetEvent.getSenderDaysByProjectIds(
      trackedProjectIds,
      cutoff,
      currentDay,
    ),
    getCoverageByProject(db, projects, currentDay),
  ])

  return new Map(
    projects.map((project) => [
      project,
      getPrivacyAnonymitySetSummary(
        project,
        seriesByProject.get(project) ?? [],
        configurations,
        rows,
        currentDay,
        coverageByProject.get(project),
      ),
    ]),
  )
}

export function getPrivacyAnonymitySetSummary(
  project: PrivacyAnonymitySetProject,
  series: PrivacyAnonymitySetSeries[],
  configurations: IndexerConfigurationRecord[],
  rows: PrivacyAnonymitySetSenderDayRecord[],
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
  const [point] = calculateAnonymitySetHistory(rows, syncedSeries, [currentDay])
  const largest = pickLargestSeries(syncedSeries, point?.slice(1) ?? [])
  if (largest === undefined) {
    return { status: 'syncing' }
  }

  return {
    status: 'available',
    value: largest.value,
    syncingLabels,
    ...(coverage && { coverage }),
    series: largest.series,
  }
}

async function getCoverageByProject(
  db: Database,
  projects: PrivacyProject[],
  currentDay: UnixTime,
): Promise<Map<PrivacyProject, PrivacyAnonymitySetCoverage | undefined>> {
  const entries = await Promise.all(
    projects.map(
      async (project) =>
        [
          project,
          await getPrivacyAnonymitySetCoverage(db, project, currentDay),
        ] as const,
    ),
  )
  return new Map(entries)
}

/**
 * The headline is the series with the most distinct depositors. Ties keep the
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
  seriesByProject: Map<PrivacyProject, PrivacyAnonymitySetSeries[]>,
): Map<PrivacyProject, PrivacyAnonymitySetSummary> {
  return new Map(
    projects.map((project): [PrivacyProject, PrivacyAnonymitySetSummary] => {
      const state = project.privacyInfo.anonymitySet
      if (state?.type === 'not-applicable') {
        return [
          project,
          { status: 'not-applicable', description: state.description },
        ]
      }
      if (state?.type === 'too-small') {
        return [project, { status: 'too-small' }]
      }
      const series = seriesByProject.get(project)?.[0]
      if (series) {
        return [
          project,
          {
            status: 'available',
            value: Math.round(Math.random() * 1_000),
            syncingLabels: [],
            ...(state?.type === 'partially-attributed' && {
              coverage: { attributed: 90, total: 100 },
            }),
            series,
          },
        ]
      }
      return [project, { status: 'unavailable' }]
    }),
  )
}
