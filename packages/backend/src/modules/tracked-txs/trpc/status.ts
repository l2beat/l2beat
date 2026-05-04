import type { TrackedTxConfigEntry } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { TrackedTxProject } from '../../../config/Config'
import { router } from '../../../trpc/init'
import { protectedProcedure } from '../../../trpc/procedures'

export const STALE_AFTER_SECONDS = 2 * UnixTime.DAY

export interface TrackedTxsStatusRow {
  feature: TrackedTxConfigEntry['type']
  projectId: string
  subtype: string
  sinceTimestamp: number
  latestTimestamp: number | undefined
  ageSeconds: number | undefined
  configsCount: number
  configsWithDataCount: number
  missingConfigsCount: number
  staleConfigsCount: number
  formulas: string[]
  status: 'missing' | 'stale' | 'fresh'
}

export function createTrackedTxsStatusRouter(deps: {
  projects: TrackedTxProject[]
}) {
  return router({
    configs: protectedProcedure.query(async ({ ctx }) => {
      const [livenessLatestTimestamps, l2CostsLatestTimestamps] =
        await Promise.all([
          ctx.db.liveness.getLatestTimestampsByConfigId(),
          ctx.db.l2Cost.getLatestTimestampsByConfigId(),
        ])

      return getTrackedTxsStatusRows({
        projects: deps.projects,
        latestTimestamps: {
          liveness: livenessLatestTimestamps,
          l2costs: l2CostsLatestTimestamps,
        },
        now: UnixTime.now(),
      })
    }),
  })
}

export function getTrackedTxsStatusRows({
  projects,
  latestTimestamps,
  now,
}: {
  projects: TrackedTxProject[]
  latestTimestamps: Record<
    TrackedTxConfigEntry['type'],
    { configurationId: string; latestTimestamp: UnixTime }[]
  >
  now: UnixTime
}): TrackedTxsStatusRow[] {
  const latestByConfigId = {
    liveness: new Map(
      latestTimestamps.liveness.map((row) => [
        row.configurationId,
        row.latestTimestamp,
      ]),
    ),
    l2costs: new Map(
      latestTimestamps.l2costs.map((row) => [
        row.configurationId,
        row.latestTimestamp,
      ]),
    ),
  }
  const groups = new Map<
    string,
    {
      feature: TrackedTxConfigEntry['type']
      projectId: string
      subtype: string
      configs: TrackedTxConfigEntry[]
    }
  >()

  for (const project of projects) {
    if (project.isArchived) {
      continue
    }

    const activeConfigurations = project.configurations.filter(isActiveConfig)

    for (const config of activeConfigurations) {
      const key = getGroupKey(
        config.type,
        project.id.toString(),
        config.subtype,
      )
      const group = groups.get(key) ?? {
        feature: config.type,
        projectId: project.id.toString(),
        subtype: config.subtype,
        configs: [],
      }
      group.configs.push(config)
      groups.set(key, group)
    }
  }

  return Array.from(groups.values())
    .map((group) => toStatusRow(group, latestByConfigId[group.feature], now))
    .sort(compareStatusRows)
}

function isActiveConfig(config: TrackedTxConfigEntry): boolean {
  return config.untilTimestamp === undefined
}

function toStatusRow(
  group: {
    feature: TrackedTxConfigEntry['type']
    projectId: string
    subtype: string
    configs: TrackedTxConfigEntry[]
  },
  latestByConfigId: Map<string, UnixTime>,
  now: UnixTime,
): TrackedTxsStatusRow {
  const { configs } = group
  const latestTimestamps = configs
    .map((config) => latestByConfigId.get(config.id))
    .filter((timestamp) => timestamp !== undefined)
  const latestTimestamp =
    latestTimestamps.length > 0 ? Math.max(...latestTimestamps) : undefined
  const ageSeconds =
    latestTimestamp !== undefined
      ? Math.max(now - latestTimestamp, 0)
      : undefined
  const staleConfigsCount = configs.filter((config) => {
    const timestamp = latestByConfigId.get(config.id)
    return timestamp !== undefined && now - timestamp > STALE_AFTER_SECONDS
  }).length
  const configsWithDataCount = latestTimestamps.length
  const missingConfigsCount = configs.length - configsWithDataCount

  return {
    feature: group.feature,
    projectId: group.projectId,
    subtype: group.subtype,
    sinceTimestamp: Math.min(...configs.map((config) => config.sinceTimestamp)),
    latestTimestamp,
    ageSeconds,
    configsCount: configs.length,
    configsWithDataCount,
    missingConfigsCount,
    staleConfigsCount,
    formulas: Array.from(
      new Set(configs.map((config) => config.params.formula)),
    ).sort(),
    status:
      latestTimestamp === undefined
        ? 'missing'
        : ageSeconds !== undefined && ageSeconds > STALE_AFTER_SECONDS
          ? 'stale'
          : 'fresh',
  }
}

function compareStatusRows(a: TrackedTxsStatusRow, b: TrackedTxsStatusRow) {
  const statusDiff = statusRank(a.status) - statusRank(b.status)
  if (statusDiff !== 0) return statusDiff

  const timestampDiff =
    (a.latestTimestamp ?? Number.NEGATIVE_INFINITY) -
    (b.latestTimestamp ?? Number.NEGATIVE_INFINITY)
  if (timestampDiff !== 0) return timestampDiff

  const projectDiff = a.projectId.localeCompare(b.projectId)
  if (projectDiff !== 0) return projectDiff

  const subtypeDiff = a.subtype.localeCompare(b.subtype)
  if (subtypeDiff !== 0) return subtypeDiff

  return a.feature.localeCompare(b.feature)
}

function statusRank(status: TrackedTxsStatusRow['status']) {
  switch (status) {
    case 'missing':
      return 0
    case 'stale':
      return 1
    case 'fresh':
      return 2
  }
}

function getGroupKey(
  feature: TrackedTxConfigEntry['type'],
  projectId: string,
  subtype: string,
) {
  return `${feature}:${projectId}:${subtype}`
}
