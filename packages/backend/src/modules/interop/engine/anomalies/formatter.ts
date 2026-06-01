import type {
  AnomalyEvaluation,
  AnomalyMetric,
  MetricSignal,
  SideMismatchSignal,
} from './evaluator'

const dollarsFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

const countFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

export function describeSignal(signal: MetricSignal): string {
  const label = metricLabel(signal.metric)
  const formatValue =
    signal.metric === 'count' ? formatCount : formatDollarsCompact
  const baselineFmt = formatValue(signal.baseline)
  const currentFmt = formatValue(signal.current)
  const moderate = signal.severity === 'moderate' ? 'moderately ' : ''

  if (signal.kind === 'flatLine') {
    return `${label} was flat (${currentFmt})`
  }

  const action =
    signal.kind === 'ratioSpike' || signal.kind === 'zScoreSpike'
      ? 'spiked'
      : 'dropped'
  const changePart = formatChange(signal.changePercent)
  return `${label} ${moderate}${action} (${changePart}${baselineFmt} → ${currentFmt})`
}

export function describeSideMismatch(signal: SideMismatchSignal): string {
  const diff = `${signal.diffPercent.toFixed(0)}%`
  const src = formatDollarsCompact(signal.srcValueUsd)
  const dst = formatDollarsCompact(signal.dstValueUsd)
  return `Src/Dst volume mismatch (${diff}, ${src} src vs ${dst} dst)`
}

export function formatAnomalyReasons(evaluation: AnomalyEvaluation): string[] {
  const reasons = evaluation.signals.map(describeSignal)
  if (evaluation.sideMismatch) {
    reasons.push(describeSideMismatch(evaluation.sideMismatch))
  }
  return reasons
}

function metricLabel(metric: AnomalyMetric): string {
  switch (metric) {
    case 'count':
      return 'Transfer count'
    case 'srcVolume':
      return 'Source volume'
    case 'dstVolume':
      return 'Destination volume'
  }
}

function formatChange(changePercent: number | null): string {
  if (changePercent === null) return ''
  const sign = changePercent >= 0 ? '+' : ''
  return `${sign}${changePercent.toFixed(0)}%, `
}

function formatDollarsCompact(value: number): string {
  return dollarsFormatter.format(value)
}

function formatCount(value: number): string {
  return countFormatter.format(Math.round(value))
}
