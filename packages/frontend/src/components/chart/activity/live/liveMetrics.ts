import type { LiveActivityBucketRecord } from '@l2beat/database'
import {
  formatActivityCount,
  formatInteger,
  formatNumber,
} from '@l2beat/shared-pure'
import type { ActivityMetric } from '~/pages/layer2s/activity/components/ActivityMetricContext'

export type LiveMetric = ActivityMetric | 'gas'

export const formatDecimal = (value: number) => formatNumber(value, 1)
const formatCount = (value: number) => formatInteger(Math.round(value))
const formatBucketRate = (value: number) =>
  formatActivityCount(value, { decimals: value < 100 ? 1 : 0 })

interface LiveMetricInfo {
  /** What its rate is called */
  rate: string
  /** What its total is called */
  total: string
  /** What is counted, as a sentence starts */
  counted: string
  /** A bucket's total */
  count: (record: LiveActivityBucketRecord) => number
  axis: { unit: string; format?: (value: number) => string }
  /** A rate over the window */
  formatRate: (value: number) => string
  /** A rate over one bucket, where a low one needs a decimal */
  formatBucketRate: (value: number) => string
  formatTotal: (value: number) => string
  /** Whether the history has it, so the past days to compare with */
  history: boolean
}

export const LIVE_METRICS: Record<LiveMetric, LiveMetricInfo> = {
  uops: {
    rate: 'UOPS',
    total: 'Operations count',
    counted: 'User operations',
    count: (record) => record.uopsCount,
    axis: { unit: ' UOPS' },
    formatRate: formatActivityCount,
    formatBucketRate,
    formatTotal: formatCount,
    history: true,
  },
  tps: {
    rate: 'TPS',
    total: 'Transactions count',
    counted: 'Transactions',
    count: (record) => record.count,
    axis: { unit: ' TPS' },
    formatRate: formatActivityCount,
    formatBucketRate,
    formatTotal: formatCount,
    history: true,
  },
  gas: {
    rate: 'Gas per second',
    total: 'Gas used',
    counted: 'Gas used',
    count: (record) => record.gasUsed,
    axis: { unit: ' gas/s', format: (value) => formatNumber(value, 0) },
    formatRate: formatDecimal,
    formatBucketRate: formatDecimal,
    formatTotal: formatDecimal,
    history: false,
  },
}

export function hasHistory(metric: LiveMetric): metric is ActivityMetric {
  return LIVE_METRICS[metric].history
}
