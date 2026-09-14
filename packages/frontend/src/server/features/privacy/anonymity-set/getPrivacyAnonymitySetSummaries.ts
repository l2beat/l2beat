import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import type { PrivacyProject } from '../types'
import { calculateAnonymitySetHistory } from './calculateAnonymitySets'
import {
  getPrivacyAnonymitySetSeries,
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
      syncingTokens: string[]
    } & Pick<
      PrivacyAnonymitySetSeries,
      'bucketType' | 'chain' | 'formattedAmount' | 'token'
    >)
  | {
      status: 'not-applicable'
      description: string
    }
  | { status: 'syncing' }
  | { status: 'unavailable' }

export async function getPrivacyAnonymitySetSummaries(
  projects: PrivacyProject[],
  currentDay: UnixTime,
): Promise<Map<string, PrivacyAnonymitySetSummary>> {
  if (env.MOCK) return getMockSummaries(projects)

  const db = getDb()
  const trackedProjects = projects.filter(
    (project) => getPrivacyAnonymitySetSeries(project).length > 0,
  )
  const trackedProjectIds = trackedProjects.map((project) => project.id)
  const cutoff = currentDay - 30 * UnixTime.DAY

  const [configurations, rows] = await Promise.all([
    getPrivacyAnonymitySetConfigurations(db, trackedProjects),
    db.privacyAnonymitySetEvent.getSenderDaysByProjectIds(
      trackedProjectIds,
      cutoff,
      currentDay,
    ),
  ])

  return new Map<string, PrivacyAnonymitySetSummary>(
    projects.map((project): [string, PrivacyAnonymitySetSummary] => {
      const state = project.privacyInfo.anonymitySet
      if (state?.type === 'not-applicable') {
        return [
          project.id,
          { status: 'not-applicable', description: state.description },
        ]
      }

      const series = getPrivacyAnonymitySetSeries(project)
      if (series.length === 0) {
        return [project.id, { status: 'unavailable' }]
      }

      const { syncedSeries, syncingTokens } = getPrivacyAnonymitySetSyncStatus(
        series,
        configurations,
        currentDay,
      )
      const firstSeries = syncedSeries[0]
      if (firstSeries === undefined) {
        return [project.id, { status: 'syncing' }]
      }

      const point = calculateAnonymitySetHistory(rows, syncedSeries, [
        currentDay,
      ])[0]
      const values = point?.slice(1) ?? []
      let bestSeries = firstSeries
      let bestValue = values[0] ?? 0
      for (let i = 1; i < values.length; i++) {
        const value = values[i] ?? 0
        const candidate = syncedSeries[i]
        if (candidate !== undefined && value > bestValue) {
          bestSeries = candidate
          bestValue = value
        }
      }

      return [
        project.id,
        {
          status: 'available',
          value: bestValue,
          label: bestSeries.label,
          syncingTokens,
          bucketType: bestSeries.bucketType,
          chain: bestSeries.chain,
          formattedAmount: bestSeries.formattedAmount,
          token: bestSeries.token,
        },
      ]
    }),
  )
}

function getMockSummaries(
  projects: PrivacyProject[],
): Map<string, PrivacyAnonymitySetSummary> {
  return new Map<string, PrivacyAnonymitySetSummary>(
    projects.map((project): [string, PrivacyAnonymitySetSummary] => {
      const state = project.privacyInfo.anonymitySet
      if (state?.type === 'not-applicable') {
        return [
          project.id,
          { status: 'not-applicable', description: state.description },
        ]
      }
      const series = getPrivacyAnonymitySetSeries(project)
      if (series[0]) {
        return [
          project.id,
          {
            status: 'available',
            value: Math.round(Math.random() * 1_000),
            label: series[0].label,
            syncingTokens: [],
            bucketType: series[0].bucketType,
            chain: series[0].chain,
            formattedAmount: series[0].formattedAmount,
            token: series[0].token,
          },
        ]
      }
      return [project.id, { status: 'unavailable' }]
    }),
  )
}
