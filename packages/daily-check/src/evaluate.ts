import type { Elastic } from './elastic'
import { kqlToDsl } from './kql'
import type { LensColumn, Palette, Tile, TinymathNode } from './tiles'

export type Status = 'green' | 'amber' | 'red' | 'none'

export interface TileResult {
  tile: Tile
  status: Status
  value: number
  formatted: string
  /** For breakdown tiles: every bucket with its own status; worst first. */
  buckets?: { key: string; value: number; status: Status }[]
}

export async function evaluateTile(
  es: Elastic,
  tile: Tile,
): Promise<TileResult> {
  if (tile.breakdown) {
    return await evaluateBreakdown(es, tile)
  }
  const value = await evaluateColumn(es, tile, tile.metricColumnId, new Set())
  if (!Number.isFinite(value)) {
    // Formula tiles divide by zero when there is no matching data.
    return { tile, value, status: 'none', formatted: 'no data' }
  }
  return {
    tile,
    value,
    status: classify(value, tile.palette),
    formatted: formatValue(value, tile.columns[tile.metricColumnId]),
  }
}

const STATUS_SEVERITY: Record<Status, number> = {
  none: 0,
  green: 1,
  amber: 2,
  red: 3,
}

async function evaluateBreakdown(es: Elastic, tile: Tile): Promise<TileResult> {
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
    // Buckets with no data in the metric's window mirror Lens' emptyAsNull.
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

async function evaluateColumn(
  es: Elastic,
  tile: Tile,
  columnId: string,
  visiting: Set<string>,
): Promise<number> {
  if (visiting.has(columnId)) {
    throw new Error(`circular column reference "${columnId}"`)
  }
  visiting.add(columnId)

  const column = tile.columns[columnId]
  if (!column) {
    throw new Error(`column "${columnId}" not found`)
  }

  switch (column.operationType) {
    case 'now':
      return Date.now()
    case 'formula': {
      const reference = column.references?.[0]
      if (!reference) {
        throw new Error('formula column has no reference')
      }
      return await evaluateColumn(es, tile, reference, visiting)
    }
    case 'math': {
      const ast = column.params?.tinymathAst
      if (ast === undefined) {
        throw new Error('math column has no tinymath AST')
      }
      return await evaluateAst(es, tile, ast, visiting)
    }
    default:
      return await evaluateMetricColumn(es, tile, column)
  }
}

async function evaluateAst(
  es: Elastic,
  tile: Tile,
  node: TinymathNode,
  visiting: Set<string>,
): Promise<number> {
  if (typeof node === 'number') {
    return node
  }
  if (typeof node === 'string') {
    return await evaluateColumn(es, tile, node, new Set(visiting))
  }
  if (node.type === 'variable') {
    return await evaluateColumn(es, tile, node.value, new Set(visiting))
  }

  const args: number[] = []
  for (const arg of node.args) {
    args.push(await evaluateAst(es, tile, arg, visiting))
  }
  const arg = (index: number): number => {
    const value = args[index]
    if (value === undefined) {
      throw new Error(`formula function "${node.name}" is missing an argument`)
    }
    return value
  }
  switch (node.name) {
    case 'add':
      return args.reduce((a, b) => a + b, 0)
    case 'subtract':
      return arg(0) - arg(1)
    case 'multiply':
      return args.reduce((a, b) => a * b, 1)
    case 'divide':
      return arg(0) / arg(1)
    case 'abs':
      return Math.abs(arg(0))
    case 'round': {
      const factor = 10 ** (args[1] ?? 0)
      return Math.round(arg(0) * factor) / factor
    }
    case 'floor':
      return Math.floor(arg(0))
    case 'ceil':
      return Math.ceil(arg(0))
    case 'min':
      return Math.min(...args)
    case 'max':
      return Math.max(...args)
    default:
      throw new Error(`unsupported formula function "${node.name}"`)
  }
}

async function evaluateMetricColumn(
  es: Elastic,
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

function buildQuery(tile: Tile, column: LensColumn): Record<string, unknown> {
  // A reduced time range restricts the metric to the trailing part of the
  // window (Lens anchors it to the window end, which is "now" here).
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
    filter.push(kqlToDsl(tile.query))
  }
  if (column.filter?.query) {
    if (column.filter.language !== 'kuery') {
      throw new Error(`unsupported filter language "${column.filter.language}"`)
    }
    filter.push(kqlToDsl(column.filter.query))
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

/** Returns NaN when the aggregation has no data (mirrors Lens' emptyAsNull). */
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

/**
 * Reproduces the tile's "color by value": colorStops hold the start of each
 * color band; continuity controls whether the first/last band extend beyond
 * the configured range.
 */
export function classify(value: number, palette?: Palette): Status {
  const params = palette?.params
  const stops =
    params?.colorStops ??
    // Fallback: `stops` hold band ends; shift to derive band starts.
    params?.stops?.map((stop, index) => ({
      color: stop.color,
      stop: index === 0 ? null : (params.stops?.[index - 1]?.stop ?? null),
    }))
  const first = stops?.[0]
  if (!stops || !first) {
    return 'none'
  }

  const continuity = params?.continuity ?? 'above'
  const firstStart = first.stop ?? params?.rangeMin ?? null

  if (firstStart !== null && value < firstStart) {
    return continuity === 'all' || continuity === 'below'
      ? colorToStatus(first.color)
      : 'none'
  }

  let color = first.color
  for (const stop of stops) {
    if (stop.stop !== null && value >= stop.stop) {
      color = stop.color
    }
  }

  const rangeMax = params?.rangeMax ?? null
  if (
    rangeMax !== null &&
    value >= rangeMax &&
    continuity !== 'all' &&
    continuity !== 'above'
  ) {
    return 'none'
  }
  return colorToStatus(color)
}

function colorToStatus(color: string): Status {
  const hex = color.toLowerCase()
  if (hex === '#24c292') {
    return 'green'
  }
  if (hex === '#f6726a') {
    return 'red'
  }
  const hue = hexToHue(hex)
  if (hue === undefined) {
    return 'none'
  }
  if (hue >= 70 && hue <= 170) {
    return 'green'
  }
  if (hue >= 20 && hue < 70) {
    return 'amber'
  }
  return 'red'
}

function hexToHue(hex: string): number | undefined {
  const digits = /^#?([0-9a-f]{6})$/.exec(hex)?.[1]
  if (!digits) {
    return undefined
  }
  const r = Number.parseInt(digits.slice(0, 2), 16) / 255
  const g = Number.parseInt(digits.slice(2, 4), 16) / 255
  const b = Number.parseInt(digits.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  if (max === min) {
    return 0
  }
  const delta = max - min
  let hue: number
  if (max === r) {
    hue = ((g - b) / delta) % 6
  } else if (max === g) {
    hue = (b - r) / delta + 2
  } else {
    hue = (r - g) / delta + 4
  }
  return (((hue * 60) % 360) + 360) % 360
}

function formatValue(value: number, column?: LensColumn): string {
  const format = column?.params?.format
  if (format?.id === 'percent') {
    return `${(value * 100).toFixed(1)}%`
  }
  if (format?.id === 'duration') {
    // Kibana's duration formatter defaults the input unit to seconds.
    return formatDuration(value, format.params?.fromUnit ?? 'seconds')
  }
  if (Number.isInteger(value)) {
    return String(value)
  }
  return value.toFixed(2)
}

function formatDuration(value: number, fromUnit: string): string {
  const unitMs: Record<string, number> = {
    milliseconds: 1,
    seconds: 1000,
    minutes: 60_000,
    hours: 3_600_000,
  }
  let ms = value * (unitMs[fromUnit] ?? 1)
  const negative = ms < 0
  ms = Math.abs(ms)
  const parts: string[] = []
  const units: [string, number][] = [
    ['d', 86_400_000],
    ['h', 3_600_000],
    ['m', 60_000],
    ['s', 1000],
  ]
  for (const [suffix, size] of units) {
    if (ms >= size && parts.length < 2) {
      parts.push(`${Math.floor(ms / size)}${suffix}`)
      ms %= size
    }
  }
  if (parts.length === 0) {
    return `${Math.round(ms)}ms`
  }
  return `${negative ? '-' : ''}${parts.join(' ')}`
}
