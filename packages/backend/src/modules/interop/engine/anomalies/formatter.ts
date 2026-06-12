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

  if (signal.kind === 'flatLine') {
    return `${label} was flat (${currentFmt})`
  }

  const action = describeAction(signal)
  const changePart = formatChange(signal.changePercent)
  return `${label} ${action} (${changePart}${baselineFmt} → ${currentFmt})`
}

export function describeSideMismatch(signal: SideMismatchSignal): string {
  const diff = `${signal.diffPercent.toFixed(0)}%`
  const src = formatDollarsCompact(signal.srcValueUsd)
  const dst = formatDollarsCompact(signal.dstValueUsd)
  return `Src/Dst volume mismatch (${diff}, ${src} src vs ${dst} dst)`
}

export function formatAnomalyReasons(evaluation: AnomalyEvaluation): string[] {
  const reasons = describeMetricSignals(evaluation.signals)
  if (evaluation.sideMismatch) {
    reasons.push(describeSideMismatch(evaluation.sideMismatch))
  }
  return reasons
}

function describeMetricSignals(signals: MetricSignal[]): string[] {
  const src = signals.find((s) => s.metric === 'srcVolume')
  const dst = signals.find((s) => s.metric === 'dstVolume')
  const shouldMerge = src && dst && src.kind === dst.kind
  if (!shouldMerge) return signals.map(describeSignal)

  const representative = pickMergedVolumeSignal(src, dst)
  const out: string[] = []
  let mergedEmitted = false
  for (const signal of signals) {
    if (signal.metric === 'srcVolume' || signal.metric === 'dstVolume') {
      if (!mergedEmitted) {
        out.push(describeVolumeMerged(representative))
        mergedEmitted = true
      }
      continue
    }
    out.push(describeSignal(signal))
  }
  return out
}

function pickMergedVolumeSignal(
  src: MetricSignal,
  dst: MetricSignal,
): MetricSignal {
  if (isDropSignal(src) && isDropSignal(dst)) {
    const srcLoss = src.baseline - src.current
    const dstLoss = dst.baseline - dst.current
    if (srcLoss !== dstLoss) {
      return srcLoss >= dstLoss ? src : dst
    }
    return src.baseline >= dst.baseline ? src : dst
  }

  return src.current >= dst.current ? src : dst
}

function describeVolumeMerged(signal: MetricSignal): string {
  const baselineFmt = formatDollarsCompact(signal.baseline)
  const currentFmt = formatDollarsCompact(signal.current)
  const action = describeAction(signal)
  const changePart = formatChange(signal.changePercent)
  return `Volume ${action} (${changePart}${baselineFmt} → ${currentFmt})`
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

function isDropSignal(signal: MetricSignal): boolean {
  if (signal.changePercent !== null) {
    return signal.changePercent < 0
  }
  return signal.kind === 'ratioDrop' || signal.kind === 'zScoreDrop'
}

// Action word follows the sign of the actual change, not the signal kind.
// A robust-Z "spike" can fire on a sharp drop when prior history is tight
// enough for MAD to collapse, and labeling that as "spiked" misleads.
function describeAction(signal: MetricSignal): string {
  if (signal.changePercent !== null) {
    return signal.changePercent >= 0 ? 'spiked' : 'dropped'
  }
  return signal.kind === 'ratioDrop' || signal.kind === 'zScoreDrop'
    ? 'dropped'
    : 'spiked'
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
