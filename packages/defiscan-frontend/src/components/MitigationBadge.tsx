import { displayMitigationValue, type Mitigation } from '../types'

function formatDelayLabel(seconds: number): string {
  if (seconds >= 86400) {
    const days = seconds / 86400
    const d = days === Math.floor(days) ? `${days}` : `${days.toFixed(1)}`
    return `${d}-day Delay`
  }
  if (seconds >= 3600) {
    const hours = seconds / 3600
    const h = hours === Math.floor(hours) ? `${hours}` : `${hours.toFixed(1)}`
    return `${h}-hour Delay`
  }
  if (seconds >= 60) {
    const minutes = seconds / 60
    const m =
      minutes === Math.floor(minutes) ? `${minutes}` : `${minutes.toFixed(1)}`
    return `${m}-min Delay`
  }
  return `${seconds}s Delay`
}

export function MitigationBadge({ mitigation: m }: { mitigation: Mitigation }) {
  const colorClass =
    m.type === 'delay'
      ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
      : m.type === 'valueRange'
        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
        : m.type === 'relativeValue'
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-gray-50 text-gray-600 border-gray-200'

  let label: string
  let tooltip: string
  if (m.type === 'delay') {
    label =
      m.delaySeconds !== undefined
        ? formatDelayLabel(m.delaySeconds)
        : 'Delay'
    tooltip = m.description
  } else if (m.type === 'valueRange') {
    const parts: string[] = []
    if (m.valueRange?.min !== undefined)
      parts.push(displayMitigationValue(m.valueRange.min))
    if (m.valueRange?.max !== undefined)
      parts.push(displayMitigationValue(m.valueRange.max))
    const unit = m.valueRange?.unit ? ` ${m.valueRange.unit}` : ''
    label = `Range: ${parts.join(' to ')}${unit}`
    tooltip = m.description || label
  } else if (m.type === 'relativeValue') {
    label = 'Relative'
    tooltip = `Max change: ${m.relativeValue?.maxChangePercent !== undefined ? displayMitigationValue(m.relativeValue.maxChangePercent) : '?'}%`
    if (m.description) tooltip += ` — ${m.description}`
  } else {
    label = m.label
      ? m.label
      : m.description.length > 20
        ? m.description.slice(0, 20) + '\u2026'
        : m.description
    tooltip = m.description
  }

  return (
    <span
      className={`inline-block rounded-full border px-1.5 py-0 text-[10px] font-medium leading-4 ${colorClass}`}
      title={tooltip}
    >
      {label}
    </span>
  )
}
