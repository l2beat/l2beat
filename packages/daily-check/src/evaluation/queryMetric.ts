import type { ElasticSearchClient } from '../clients/ElasticSearchClient'
import type { LensColumn, Tile } from '../dashboard/types'
import { classify } from './classify'
import { formatValue } from './formatValue'
import type { Status, TileResult } from './types'

const STATUS_SEVERITY: Record<Status, number> = {
  none: 0,
  green: 1,
  amber: 2,
  red: 3,
}

export async function evaluateBreakdown(
  es: ElasticSearchClient,
  tile: Tile,
): Promise<TileResult> {
  const breakdown = tile.breakdown
  if (!breakdown) {
    throw new Error('not a breakdown tile')
  }
  const column = tile.columns[tile.metricColumnId]
  if (!column) {
    throw new Error(`metric column "${tile.metricColumnId}" not found`)
  }
  if (column.operationType === 'formula' || column.operationType === 'math') {
    throw new Error('formula with breakdown is not supported')
  }

  const isCount = column.operationType === 'count'
  const order =
    breakdown.orderBy === 'metric'
      ? { [isCount ? '_count' : 'value']: breakdown.orderDirection }
      : breakdown.orderBy === 'key'
        ? { _key: breakdown.orderDirection }
        : undefined
  const body: Record<string, unknown> = {
    size: 0,
    query: buildQuery(tile, column),
    ...runtimeMappings(tile),
    aggs: {
      split: {
        terms: { field: breakdown.field, size: breakdown.size, order },
        aggs: isCount ? undefined : { value: metricAgg(column) },
      },
    },
  }
  const response = (await es.search(tile.index, body)) as {
    aggregations?: { split?: { buckets?: Record<string, unknown>[] } }
  }

  const buckets = (response.aggregations?.split?.buckets ?? [])
    .map((bucket) => {
      const value = isCount
        ? ((bucket.doc_count as number) ?? 0)
        : extractMetric(bucket.value, column)
      return {
        key: String(bucket.key),
        value,
        status: classify(value, tile.palette),
      }
    })
    .filter((bucket) => Number.isFinite(bucket.value))
  buckets.sort(
    (a, b) =>
      STATUS_SEVERITY[b.status] - STATUS_SEVERITY[a.status] ||
      b.value - a.value,
  )

  const worst = buckets[0]
  if (!worst) {
    return { tile, value: 0, status: 'none', formatted: 'no data', buckets }
  }
  return {
    tile,
    value: worst.value,
    status: worst.status,
    formatted: `${formatValue(worst.value, column)} (${worst.key})`,
    buckets,
  }
}

export async function evaluateMetricColumn(
  es: ElasticSearchClient,
  tile: Tile,
  column: LensColumn,
): Promise<number> {
  const body: Record<string, unknown> = {
    size: 0,
    track_total_hits: true,
    query: buildQuery(tile, column),
    ...runtimeMappings(tile),
  }
  if (!isPlainCount(column)) {
    body.aggs = { value: metricAgg(column) }
  }

  const response = (await es.search(tile.index, body)) as {
    hits?: { total?: number | { value?: number } }
    aggregations?: { value?: unknown }
  }

  if (isPlainCount(column)) {
    const total = response.hits?.total
    return (typeof total === 'number' ? total : total?.value) ?? 0
  }
  return extractMetric(response.aggregations?.value, column)
}

function runtimeMappings(tile: Tile): Record<string, unknown> {
  return tile.runtimeMappings ? { runtime_mappings: tile.runtimeMappings } : {}
}

function isPlainCount(column: LensColumn): boolean {
  return (
    column.operationType === 'count' &&
    (!column.sourceField || column.sourceField === '___records___')
  )
}

export function buildQuery(
  tile: Tile,
  column: LensColumn,
): Record<string, unknown> {
  const gte = column.reducedTimeRange
    ? `now-${column.reducedTimeRange}`
    : tile.timeFrom
  const filter: Record<string, unknown>[] = [
    {
      range: {
        '@timestamp': { gte, lte: tile.timeTo },
      },
    },
    ...tile.controlFilters,
  ]
  if (tile.query) {
    filter.push({ kql: { query: tile.query } })
  }
  if (column.filter?.query) {
    if (column.filter.language !== 'kuery') {
      throw new Error(`unsupported filter language "${column.filter.language}"`)
    }
    filter.push({ kql: { query: column.filter.query } })
  }
  return { bool: { filter } }
}

function metricAgg(column: LensColumn): Record<string, unknown> {
  const field = column.sourceField
  if (!field) {
    throw new Error(`${column.operationType} column has no source field`)
  }
  switch (column.operationType) {
    case 'count':
      return { value_count: { field } }
    case 'sum':
    case 'max':
    case 'min':
      return { [column.operationType]: { field } }
    case 'average':
      return { avg: { field } }
    case 'median':
      return { percentiles: { field, percents: [50] } }
    case 'percentile':
      return {
        percentiles: { field, percents: [column.params?.percentile ?? 95] },
      }
    case 'unique_count':
      return { cardinality: { field } }
    case 'last_value':
      return {
        top_metrics: {
          metrics: { field },
          sort: { [column.params?.sortField ?? '@timestamp']: 'desc' },
        },
      }
    default:
      throw new Error(`unsupported operation "${column.operationType}"`)
  }
}

/** Returns NaN when the aggregation has no data. */
function extractMetric(aggregation: unknown, column: LensColumn): number {
  const agg = aggregation as
    | {
        value?: number | null
        values?: Record<string, number | null>
        top?: { metrics: Record<string, unknown> }[]
      }
    | undefined
  if (!agg) {
    return Number.NaN
  }
  if (
    column.operationType === 'median' ||
    column.operationType === 'percentile'
  ) {
    return Object.values(agg.values ?? {})[0] ?? Number.NaN
  }
  if (column.operationType === 'last_value') {
    const metric = agg.top?.[0]?.metrics[column.sourceField ?? '']
    return toNumber(metric)
  }
  return agg.value ?? Number.NaN
}

function toNumber(value: unknown): number {
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string') {
    const asDate = Date.parse(value)
    if (!Number.isNaN(asDate)) {
      return asDate
    }
    const asNumber = Number(value)
    if (!Number.isNaN(asNumber)) {
      return asNumber
    }
  }
  return Number.NaN
}
