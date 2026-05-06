import { useState } from 'react'
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

interface BadgeContent {
  visibleLabel: string
  header?: string
  body?: string
}

function buildBadgeContent(m: Mitigation): BadgeContent {
  if (m.type === 'delay') {
    const fullLabel =
      m.delaySeconds !== undefined ? formatDelayLabel(m.delaySeconds) : 'Delay'
    return {
      visibleLabel: fullLabel,
      header: fullLabel,
      body: m.description || undefined,
    }
  }
  if (m.type === 'valueRange') {
    const parts: string[] = []
    if (m.valueRange?.min !== undefined)
      parts.push(displayMitigationValue(m.valueRange.min))
    if (m.valueRange?.max !== undefined)
      parts.push(displayMitigationValue(m.valueRange.max))
    const unit = m.valueRange?.unit ? ` ${m.valueRange.unit}` : ''
    const fullLabel = `Range: ${parts.join(' to ')}${unit}`
    return {
      visibleLabel: fullLabel,
      header: fullLabel,
      body:
        m.description && m.description !== fullLabel ? m.description : undefined,
    }
  }
  if (m.type === 'relativeValue') {
    const pct =
      m.relativeValue?.maxChangePercent !== undefined
        ? displayMitigationValue(m.relativeValue.maxChangePercent)
        : '?'
    return {
      visibleLabel: 'Relative',
      header: `Max change: ${pct}%`,
      body: m.description || undefined,
    }
  }
  // 'other'
  if (m.label) {
    return {
      visibleLabel: m.label,
      header: m.label,
      body:
        m.description && m.description !== m.label ? m.description : undefined,
    }
  }
  const visibleLabel =
    m.description.length > 20
      ? m.description.slice(0, 20) + '…'
      : m.description
  return {
    visibleLabel,
    body: m.description,
  }
}

export function MitigationBadge({ mitigation: m }: { mitigation: Mitigation }) {
  const [show, setShow] = useState(false)

  const colorClass =
    m.type === 'delay'
      ? 'bg-cyan-100 text-cyan-700'
      : m.type === 'valueRange'
        ? 'bg-indigo-100 text-indigo-700'
        : m.type === 'relativeValue'
          ? 'bg-amber-100 text-amber-700'
          : 'bg-[rgba(15,23,42,0.05)] text-[#64748b]'

  const { visibleLabel, header, body } = buildBadgeContent(m)

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span
        className={`inline-flex items-center rounded-[2px] px-[8px] py-[2px] text-[9px] font-bold uppercase tracking-[0.225px] ${colorClass}`}
      >
        {visibleLabel}
      </span>
      {show && (
        <span className="-translate-x-1/2 pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-72 rounded-lg bg-bg-dark p-3 text-left text-sm text-white normal-case leading-relaxed tracking-normal shadow-xl">
          {header && (
            <span className="font-semibold text-purple-300">{header}</span>
          )}
          {header && body && <br />}
          {body}
          <span className="-translate-x-1/2 absolute top-full left-1/2 border-4 border-transparent border-t-bg-dark" />
        </span>
      )}
    </span>
  )
}
