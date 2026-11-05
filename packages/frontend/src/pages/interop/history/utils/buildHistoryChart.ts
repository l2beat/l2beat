import { MIN_TIMED_TRANSFERS } from '~/server/features/layer2s/interop/history/historyRules'
import type { InteropHistoryData } from '~/server/features/layer2s/interop/history/types'
import type { MarkedHistory } from './applyHistoryExclusions'

export type HistoryMetric =
  | 'volume'
  | 'flows'
  | 'netFlow'
  | 'transfers'
  | 'duration'

export type HistoryValueFormat = 'usd' | 'count' | 'duration'

export interface HistoryChartSettings {
  metric: HistoryMetric
  splitByProtocol: boolean
  showRaw: boolean
  /** The chain whose inflow and outflow the flows metric shows. */
  focusChain: string | undefined
  /** The chains whose net flow the net flow metric compares. */
  netFlowChains: string[]
  /** Treat snapshots the promotion rules blocked as gaps. */
  excludeBlocked: boolean
}

export interface HistoryChartSeries {
  key: string
  label: string
  color: string
  stack?: boolean
  /** A reference line, like the data before the rules. */
  dashed?: boolean
  fill?: boolean
}

export interface HistoryChartRow {
  timestamp: number
  point: number
  values: Record<string, number | null>
}

export interface HistoryChart {
  rows: HistoryChartRow[]
  series: HistoryChartSeries[]
  format: HistoryValueFormat
  /** Has negative values, like outflows, so a log axis must be symmetric. */
  signed: boolean
}

/** Protocols drawn on their own before the rest is summed as Other. */
export const MAX_PROTOCOL_SERIES = 7

const PROTOCOL_COLORS = [
  'var(--chart-ethereum)',
  'var(--chart-pink)',
  'var(--chart-cyan)',
  'var(--chart-yellow)',
  'var(--chart-emerald)',
  'var(--chart-fuchsia)',
  'var(--chart-orange)',
]
const OTHER_COLOR = 'var(--secondary)'
const RAW_COLOR = 'var(--negative)'

export function getProtocolColor(data: InteropHistoryData, id: string) {
  const index = data.protocols.findIndex((p) => p.id === id)
  return PROTOCOL_COLORS[index] ?? OTHER_COLOR
}

/**
 * Rows and series for a metric. A point is null where there is no snapshot,
 * or where the promotion rules blocked it and blocked snapshots are excluded.
 */
export function buildHistoryChart(
  data: InteropHistoryData,
  cleaned: MarkedHistory,
  settings: HistoryChartSettings,
  chainColors: Record<string, string>,
): HistoryChart {
  const isGap = (i: number) => {
    const point = data.points[i]
    return (
      !point ||
      point.snapshot === null ||
      (settings.excludeBlocked && point.isBlocked)
    )
  }
  const showRaw = settings.showRaw
  const ids = data.protocols.map((p) => p.id)
  // Colors follow the protocol's rank over the whole history, so they stay
  // put when the range or the rules change.
  const shown = ids.slice(0, MAX_PROTOCOL_SERIES)
  const rest = ids.slice(MAX_PROTOCOL_SERIES)
  const sum = (byId: Record<string, number[]>, keys: string[], i: number) =>
    keys.reduce((total, id) => total + (byId[id]?.[i] ?? 0), 0)
  const rawVolume = Object.fromEntries(
    Object.entries(data.byProtocol).map(([id, s]) => [id, s.volume]),
  )
  const field = (
    key: 'transferCount' | 'timedTransferCount' | 'durationSum',
  ): Record<string, number[]> =>
    Object.fromEntries(
      Object.entries(data.byProtocol).map(([id, s]) => [id, s[key]]),
    )

  const series: HistoryChartSeries[] = []
  let format: HistoryValueFormat = 'usd'
  let valuesAt: (i: number) => Record<string, number | null>

  const protocolSeries = (stack: boolean) => [
    ...shown.map((id) => ({
      key: id,
      label: data.protocols.find((p) => p.id === id)?.name ?? id,
      color: getProtocolColor(data, id),
      stack,
      fill: stack,
    })),
    ...(rest.length > 0
      ? [
          {
            key: 'other',
            label: 'Other',
            color: OTHER_COLOR,
            stack,
            fill: stack,
          },
        ]
      : []),
  ]

  switch (settings.metric) {
    case 'volume':
    case 'transfers': {
      const values =
        settings.metric === 'volume' ? cleaned.volume : field('transferCount')
      format = settings.metric === 'volume' ? 'usd' : 'count'
      if (settings.splitByProtocol) {
        series.push(...protocolSeries(true))
      } else {
        series.push({
          key: 'total',
          label: settings.metric === 'volume' ? 'Volume' : 'Transfers',
          color: 'var(--chart-ethereum)',
          fill: true,
        })
      }
      const withRaw = showRaw && settings.metric === 'volume'
      if (withRaw) {
        series.push({
          key: 'raw',
          label: 'Before exclusions',
          color: RAW_COLOR,
          dashed: true,
        })
      }
      valuesAt = (i) => ({
        ...(settings.splitByProtocol
          ? {
              ...Object.fromEntries(
                shown.map((id) => [id, values[id]?.[i] ?? 0]),
              ),
              other: sum(values, rest, i),
            }
          : { total: sum(values, ids, i) }),
        ...(withRaw ? { raw: sum(rawVolume, ids, i) } : {}),
      })
      break
    }
    case 'flows': {
      const chain = settings.focusChain
      const clean = chain ? cleaned.byChain[chain] : undefined
      const raw = chain ? data.byChain[chain] : undefined
      series.push(
        {
          key: 'inflow',
          label: 'Inflow',
          color: 'var(--chart-emerald)',
          fill: true,
        },
        {
          key: 'outflow',
          label: 'Outflow',
          color: 'var(--chart-pink)',
          fill: true,
        },
        { key: 'net', label: 'Net flow', color: 'var(--primary)' },
      )
      if (showRaw) {
        series.push({
          key: 'raw',
          label: 'Net flow before exclusions',
          color: RAW_COLOR,
          dashed: true,
        })
      }
      valuesAt = (i) => {
        const inflow = clean?.inflow[i] ?? 0
        const outflow = clean?.outflow[i] ?? 0
        return {
          inflow,
          outflow: -outflow,
          net: inflow - outflow,
          ...(showRaw
            ? { raw: (raw?.inflow[i] ?? 0) - (raw?.outflow[i] ?? 0) }
            : {}),
        }
      }
      break
    }
    case 'netFlow': {
      for (const chain of settings.netFlowChains) {
        series.push({
          key: chain,
          label: chain,
          color: chainColors[chain] ?? OTHER_COLOR,
        })
      }
      valuesAt = (i) =>
        Object.fromEntries(
          settings.netFlowChains.map((chain) => {
            const s = cleaned.byChain[chain]
            return [chain, (s?.inflow[i] ?? 0) - (s?.outflow[i] ?? 0)]
          }),
        )
      break
    }
    case 'duration': {
      format = 'duration'
      const timed = field('timedTransferCount')
      const durations = field('durationSum')
      const average = (keys: string[], i: number) => {
        const count = sum(timed, keys, i)
        return count >= MIN_TIMED_TRANSFERS
          ? sum(durations, keys, i) / count
          : null
      }
      if (settings.splitByProtocol) {
        series.push(...protocolSeries(false).filter((s) => s.key !== 'other'))
        valuesAt = (i) =>
          Object.fromEntries(shown.map((id) => [id, average([id], i)]))
      } else {
        series.push({
          key: 'total',
          label: 'Average of the selection',
          color: 'var(--chart-ethereum)',
        })
        valuesAt = (i) => ({ total: average(ids, i) })
      }
      break
    }
  }

  const rows = data.points.map((point, i) => {
    const values = valuesAt(i)
    if (isGap(i)) {
      for (const key of Object.keys(values)) values[key] = null
    }
    return { timestamp: point.timestamp, point: i, values }
  })
  const signed = settings.metric === 'flows' || settings.metric === 'netFlow'
  return { rows, series, format, signed }
}
