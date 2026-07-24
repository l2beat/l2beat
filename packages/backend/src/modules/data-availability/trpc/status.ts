import { UnixTime } from '@l2beat/shared-pure'
import type {
  BlockDaIndexedConfig,
  DataAvailabilityTrackingConfig,
  TimestampDaIndexedConfig,
} from '../../../config/Config'
import { router } from '../../../trpc/init'
import { protectedProcedure } from '../../../trpc/procedures'

export const STALE_AFTER_SECONDS = 2 * UnixTime.DAY

export interface DaTrackingStatusRow {
  configId: string
  type: BlockDaIndexedConfig['type'] | TimestampDaIndexedConfig['type']
  projectId: string
  daLayer: string
  since: number
  sinceUnit: 'block' | 'timestamp'
  latestTimestamp: number | undefined
  ageSeconds: number | undefined
  details: string
  status: 'missing' | 'stale' | 'fresh'
}

export function createDaTrackingStatusRouter(deps: {
  config: DataAvailabilityTrackingConfig
}) {
  return router({
    configs: protectedProcedure.query(async ({ ctx }) => {
      const latestTimestamps =
        await ctx.db.dataAvailability.getLatestTimestampsByConfigId()

      return getDaTrackingStatusRows({
        configs: deps.config,
        latestTimestamps,
        now: UnixTime.now(),
      })
    }),
  })
}

export function getDaTrackingStatusRows({
  configs,
  latestTimestamps,
  now,
}: {
  configs: DataAvailabilityTrackingConfig
  latestTimestamps: { configurationId: string; latestTimestamp: UnixTime }[]
  now: UnixTime
}): DaTrackingStatusRow[] {
  const latestByConfigId = new Map(
    latestTimestamps.map((row) => [row.configurationId, row.latestTimestamp]),
  )

  const rows = [
    ...configs.blockProjects.filter(isActiveBlockConfig),
    ...configs.timestampProjects.filter(isActiveTimestampConfig),
  ].map((config) => toStatusRow(config, latestByConfigId, now))

  return rows.sort(compareStatusRows)
}

function isActiveBlockConfig(config: BlockDaIndexedConfig): boolean {
  return config.untilBlock === undefined
}

function isActiveTimestampConfig(config: TimestampDaIndexedConfig): boolean {
  return config.untilTimestamp === undefined
}

function toStatusRow(
  config: BlockDaIndexedConfig | TimestampDaIndexedConfig,
  latestByConfigId: Map<string, UnixTime>,
  now: UnixTime,
): DaTrackingStatusRow {
  const latestTimestamp = latestByConfigId.get(config.configurationId)
  const ageSeconds =
    latestTimestamp !== undefined
      ? Math.max(now - latestTimestamp, 0)
      : undefined

  return {
    configId: config.configurationId,
    type: config.type,
    projectId: config.projectId.toString(),
    daLayer: config.daLayer.toString(),
    since: 'sinceBlock' in config ? config.sinceBlock : config.sinceTimestamp,
    sinceUnit: 'sinceBlock' in config ? 'block' : 'timestamp',
    latestTimestamp,
    ageSeconds,
    details: getConfigDetails(config),
    status:
      latestTimestamp === undefined
        ? 'missing'
        : ageSeconds !== undefined && ageSeconds > STALE_AFTER_SECONDS
          ? 'stale'
          : 'fresh',
  }
}

function getConfigDetails(
  config: BlockDaIndexedConfig | TimestampDaIndexedConfig,
): string {
  switch (config.type) {
    case 'baseLayer':
      return 'base layer'
    case 'ethereum': {
      if (config.calls !== undefined) {
        return `calls: ${config.calls
          .map((call) => `${call.selector}(${call.firstParameter})`)
          .join(', ')}`
      }

      const parts = [`inbox: ${config.inbox}`]
      if (config.sequencers && config.sequencers.length > 0) {
        parts.push(`sequencers: ${config.sequencers.join(', ')}`)
      }
      if (config.topics && config.topics.length > 0) {
        parts.push(`topics: ${config.topics.join(', ')}`)
      }
      return parts.join('; ')
    }
    case 'celestia':
      return `namespace: ${config.namespace}`
    case 'avail':
      return `app IDs: ${config.appIds.join(', ')}`
    case 'eigen-da':
      return `customer ID: ${config.customerId}`
  }
}

function compareStatusRows(a: DaTrackingStatusRow, b: DaTrackingStatusRow) {
  const statusDiff = statusRank(a.status) - statusRank(b.status)
  if (statusDiff !== 0) return statusDiff

  const timestampDiff =
    (a.latestTimestamp ?? Number.NEGATIVE_INFINITY) -
    (b.latestTimestamp ?? Number.NEGATIVE_INFINITY)
  if (timestampDiff !== 0) return timestampDiff

  const projectDiff = a.projectId.localeCompare(b.projectId)
  if (projectDiff !== 0) return projectDiff

  const layerDiff = a.daLayer.localeCompare(b.daLayer)
  if (layerDiff !== 0) return layerDiff

  const typeDiff = a.type.localeCompare(b.type)
  if (typeDiff !== 0) return typeDiff

  return a.configId.localeCompare(b.configId)
}

function statusRank(status: DaTrackingStatusRow['status']) {
  switch (status) {
    case 'stale':
      return 0
    case 'missing':
      return 1
    case 'fresh':
      return 2
  }
}
