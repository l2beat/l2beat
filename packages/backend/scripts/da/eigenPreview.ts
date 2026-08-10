import type { Logger } from '@l2beat/backend-tools'
import type { DataAvailabilityRecord } from '@l2beat/database'
import { EIGENDA_LAYER_DATA_GAP, type EigenApiClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { TimestampDaIndexedConfig } from '../../src/config/Config'
import {
  type EigenDaProjectConfiguration,
  mapEigenProjectData,
} from '../../src/modules/data-availability/indexers/eigen-da/mapEigenProjectData'
import type { ExpectedCoverage, LayerPreviewResult } from './gaps'
import { clampTimestampRange, hoursInWindow, type PreviewWindow } from './range'

/** Date of the first per-project data file available from the Eigen API. */
const FIRST_FILE_DATE = UnixTime.fromDate(new Date('2025-08-01T00:00:00.000Z'))

/** One getMetrics call per hour - keep long windows from hammering the API. */
const MAX_METRICS_HOURS = 48

export async function previewEigen(
  client: EigenApiClient,
  configs: TimestampDaIndexedConfig[],
  window: PreviewWindow,
  logger: Logger,
): Promise<LayerPreviewResult> {
  const records: DataAvailabilityRecord[] = []
  const expected: ExpectedCoverage[] = []

  for (const config of configs.filter((c) => c.type === 'baseLayer')) {
    const result = await previewLayerTotal(client, config, window, logger)
    records.push(...result.records)
    expected.push(...result.expected)
  }

  const projectConfigs = configs.filter((c) => c.type === 'eigen-da')
  if (projectConfigs.length > 0) {
    const result = await previewProjects(client, projectConfigs, window, logger)
    records.push(...result.records)
    expected.push(...result.expected)
  }

  return { records, expected }
}

async function previewLayerTotal(
  client: EigenApiClient,
  config: Extract<TimestampDaIndexedConfig, { type: 'baseLayer' }>,
  window: PreviewWindow,
  logger: Logger,
): Promise<LayerPreviewResult> {
  const clamped = clampTimestampRange(config, window.from, window.to)
  if (!clamped) {
    logger.warn('EigenDA layer configuration inactive in window', {
      configurationId: config.configurationId,
    })
    return { records: [], expected: [] }
  }

  // The metrics API 500s inside this range; production skips it too
  // (EigenDaLayerIndexer.multiUpdate)
  let hours = hoursInWindow(clamped).filter(
    (h) => h < EIGENDA_LAYER_DATA_GAP.from || h >= EIGENDA_LAYER_DATA_GAP.until,
  )
  const skippedGapHours = hoursInWindow(clamped).length - hours.length
  if (skippedGapHours > 0) {
    logger.warn(
      `Skipping ${skippedGapHours} hour(s) inside the known EigenDA layer metrics gap`,
      {
        gapFrom: UnixTime.toDate(EIGENDA_LAYER_DATA_GAP.from).toISOString(),
        gapUntil: UnixTime.toDate(EIGENDA_LAYER_DATA_GAP.until).toISOString(),
      },
    )
  }
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
  return {
    records,
    expected: [
      {
        projectId: config.projectId,
        daLayer: config.daLayer,
        configurationId: config.configurationId,
        hours,
      },
    ],
  }
}

async function previewProjects(
  client: EigenApiClient,
  configs: Extract<TimestampDaIndexedConfig, { type: 'eigen-da' }>[],
  window: PreviewWindow,
  logger: Logger,
): Promise<LayerPreviewResult> {
  const configurations: EigenDaProjectConfiguration[] = configs.map((c) => ({
    id: c.configurationId,
    properties: c,
  }))
  // Per-config window clamp, computed once and reused for record filtering
  // and expected coverage; configs inactive in the window are absent
  const clampedById = new Map(
    configs.flatMap((c) => {
      const clamped = clampTimestampRange(c, window.from, window.to)
      return clamped
        ? [[c.configurationId, { config: c, clamped }] as const]
        : []
    }),
  )

  const records: DataAvailabilityRecord[] = []
  const fetchedHours: UnixTime[] = []
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
      // Only the API's known missing-file response is skippable (the assert
      // message in EigenApiClient.getByProjectData) - anything else (auth,
      // rate limit, network, malformed data) must fail the preview instead
      // of being silently excluded from gap detection
      const message = error instanceof Error ? error.message : `${error}`
      if (!message.includes('No EigenDA data for projects')) {
        throw error
      }
      logger.warn('No EigenDA per-project data for day', {
        day: UnixTime.toDate(day).toISOString(),
      })
      continue
    }

    for (let hour = day - UnixTime.DAY; hour < day; hour += UnixTime.HOUR) {
      fetchedHours.push(hour)
    }

    const dayRecords = mapEigenProjectData(
      data,
      configurations,
      configs[0].daLayer,
      day,
    )
    for (const record of dayRecords) {
      const entry = clampedById.get(record.configurationId)
      if (!entry) continue
      if (
        record.timestamp >= entry.clamped.from &&
        record.timestamp < entry.clamped.to
      ) {
        records.push(record)
      }
    }
  }

  const fetched = new Set(fetchedHours)
  const expected: ExpectedCoverage[] = [...clampedById.values()].map(
    ({ config, clamped }) => ({
      projectId: config.projectId,
      daLayer: config.daLayer,
      configurationId: config.configurationId,
      hours: hoursInWindow(clamped).filter((hour) => fetched.has(hour)),
    }),
  )

  return { records, expected }
}
