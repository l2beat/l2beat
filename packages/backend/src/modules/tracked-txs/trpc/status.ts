import type { TrackedTxConfigEntry } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { TrackedTxProject } from '../../../config/Config'
import { router } from '../../../trpc/init'
import { protectedProcedure } from '../../../trpc/procedures'

export const STALE_AFTER_SECONDS = 2 * UnixTime.DAY

export interface TrackedTxsStatusRow {
  configId: string
  feature: TrackedTxConfigEntry['type']
  projectId: string
  subtype: string
  sinceTimestamp: number
  latestTimestamp: number | undefined
  ageSeconds: number | undefined
  formula: string
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
  const rows: TrackedTxsStatusRow[] = []

  for (const project of projects) {
    if (project.isArchived) {
      continue
    }

    const activeConfigurations = project.configurations.filter(isActiveConfig)

    for (const config of activeConfigurations) {
      rows.push(
        toStatusRow(
          project.id.toString(),
          config,
          latestByConfigId[config.type],
          now,
        ),
      )
    }
  }

  return rows.sort(compareStatusRows)
}

function isActiveConfig(config: TrackedTxConfigEntry): boolean {
  return config.untilTimestamp === undefined
}

function toStatusRow(
  projectId: string,
  config: TrackedTxConfigEntry,
  latestByConfigId: Map<string, UnixTime>,
  now: UnixTime,
): TrackedTxsStatusRow {
  const latestTimestamp = latestByConfigId.get(config.id)
  const ageSeconds =
    latestTimestamp !== undefined
      ? Math.max(now - latestTimestamp, 0)
      : undefined

  return {
    configId: config.id,
    feature: config.type,
    projectId,
    subtype: config.subtype,
    sinceTimestamp: config.sinceTimestamp,
    latestTimestamp,
    ageSeconds,
    formula: config.params.formula,
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
    case 'stale':
      return 0
    case 'missing':
      return 1
    case 'fresh':
      return 2
  }
}
