import type { Logger } from '@l2beat/backend-tools'
import type { DataAvailabilityRecord } from '@l2beat/database'
import type { EigenApiClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { TimestampDaIndexedConfig } from '../../src/config/Config'
import {
  type EigenDaProjectConfiguration,
  mapEigenProjectData,
} from '../../src/modules/data-availability/preview/mapEigenProjectData'
import {
  clampTimestampRange,
  hoursInWindow,
  type PreviewWindow,
} from '../../src/modules/data-availability/preview/range'

/** Date of the first per-project data file available from the Eigen API. */
const FIRST_FILE_DATE = UnixTime.fromDate(new Date('2025-08-01T00:00:00.000Z'))

/** One getMetrics call per hour - keep long windows from hammering the API. */
const MAX_METRICS_HOURS = 48

export async function previewEigen(
  client: EigenApiClient,
  configs: TimestampDaIndexedConfig[],
  window: PreviewWindow,
  logger: Logger,
): Promise<DataAvailabilityRecord[]> {
  const records: DataAvailabilityRecord[] = []

  for (const config of configs.filter((c) => c.type === 'baseLayer')) {
    records.push(...(await previewLayerTotal(client, config, window, logger)))
  }

  const projectConfigs = configs.filter((c) => c.type === 'eigen-da')
  if (projectConfigs.length > 0) {
    records.push(
      ...(await previewProjects(client, projectConfigs, window, logger)),
    )
  }

  return records
}

async function previewLayerTotal(
  client: EigenApiClient,
  config: Extract<TimestampDaIndexedConfig, { type: 'baseLayer' }>,
  window: PreviewWindow,
  logger: Logger,
): Promise<DataAvailabilityRecord[]> {
  const clamped = clampTimestampRange(config, window.from, window.to)
  if (!clamped) {
    logger.warn('EigenDA layer configuration inactive in window', {
      configurationId: config.configurationId,
    })
    return []
  }

  let hours = hoursInWindow(clamped)
  if (hours.length > MAX_METRICS_HOURS) {
    logger.warn(
      `EigenDA layer preview capped to the last ${MAX_METRICS_HOURS} hours (one getMetrics call per hour)`,
      { requestedHours: hours.length },
    )
    hours = hours.slice(-MAX_METRICS_HOURS)
  }

  const records: DataAvailabilityRecord[] = []
  for (const hour of hours) {
    logger.info('Fetching EigenDA layer metrics', {
      hour: UnixTime.toDate(hour).toISOString(),
    })
    const metrics = await client.getMetrics(hour, hour + UnixTime.HOUR - 1)
    records.push({
      timestamp: hour,
      projectId: config.projectId,
      daLayer: config.daLayer,
      configurationId: config.configurationId,
      totalSize: BigInt(metrics.total_bytes_posted),
    })
  }
  return records
}

async function previewProjects(
  client: EigenApiClient,
  configs: Extract<TimestampDaIndexedConfig, { type: 'eigen-da' }>[],
  window: PreviewWindow,
  logger: Logger,
): Promise<DataAvailabilityRecord[]> {
  const configurations: EigenDaProjectConfiguration[] = configs.map((c) => ({
    id: c.configurationId,
    properties: c,
  }))
  const configById = new Map(configs.map((c) => [c.configurationId, c]))

  const records: DataAvailabilityRecord[] = []
  // A daily file dated D contains hourly rows for [D - DAY, D)
  const firstDay = UnixTime.toStartOf(window.from, 'day') + UnixTime.DAY
  const lastDay = UnixTime.toStartOf(window.to - 1, 'day') + UnixTime.DAY
  for (let day = firstDay; day <= lastDay; day += UnixTime.DAY) {
    if (day < FIRST_FILE_DATE) {
      logger.warn('Skipping day - EigenDA per-project data starts 2025-08-01', {
        day: UnixTime.toDate(day).toISOString(),
      })
      continue
    }

    logger.info('Fetching EigenDA per-project data', {
      day: UnixTime.toDate(day).toISOString(),
    })
    let data: Awaited<ReturnType<EigenApiClient['getByProjectData']>>
    try {
      data = await client.getByProjectData(day)
    } catch (error) {
      logger.warn('No EigenDA per-project data for day', {
        day: UnixTime.toDate(day).toISOString(),
        error: error instanceof Error ? error.message : `${error}`,
      })
      continue
    }

    const dayRecords = mapEigenProjectData(
      data,
      configurations,
      configs[0].daLayer,
      day,
    )
    for (const record of dayRecords) {
      const config = configById.get(record.configurationId)
      if (!config) continue
      const clamped = clampTimestampRange(config, window.from, window.to)
      if (!clamped) continue
      if (record.timestamp >= clamped.from && record.timestamp < clamped.to) {
        records.push(record)
      }
    }
  }

  return records
}
