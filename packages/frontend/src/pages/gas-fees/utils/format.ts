import { formatCurrency, formatNumber } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'

/** "$20.3M" from a dollar up, two significant digits below: "$0.0027", "$0.10" */
export function formatUsd(value: number): string {
  if (value >= 1) return formatCurrency(value, 'usd', { decimals: 1 })
  return `$${formatSignificant(value, 2)}`
}

/** "0.0000047", "0.03", "1.5", "2": two significant digits, no trailing zeros */
export function formatGwei(value: number): string {
  if (value >= 100) return Math.round(value).toLocaleString('en-US')
  // Not through Number: a slow tip of 0.00000001 gwei would come back as "1e-8"
  return formatSignificant(value, 2)
    .replace(/(\.\d*?)0+$/, '$1')
    .replace(/\.$/, '')
}

/** The leading zeros of a small tip, to be dimmed, and the digits after */
export function splitLeadingZeros(text: string): [string, string] {
  const match = /^(0\.0*)(.*)$/.exec(text)
  return match ? [match[1] ?? '', match[2] ?? ''] : ['', text]
}

/** "7.0×" under ten, whole to a thousand, then two significant digits: "553×", "32,000×" */
export function formatRatio(value: number): string {
  if (value < 10) return `${value.toFixed(1)}×`
  const rounded =
    value < 1000 ? Math.round(value) : Number(value.toPrecision(2))
  return `${rounded.toLocaleString('en-US')}×`
}

/** Whole from 10% to 99%, one decimal outside, "<0.1%" and ">99.9%" at the ends */
export function formatShare(share: number): string {
  const percent = share * 100
  if (percent === 0 || percent === 100) return `${percent}%`
  if (percent < 0.1) return '<0.1%'
  if (percent > 99.9) return '>99.9%'
  if (percent >= 10 && percent < 99) return `${Math.round(percent)}%`
  return `${percent.toFixed(1)}%`
}

export function formatSeconds(seconds: number): string {
  return `${Math.round(seconds)}s`
}

/** "6.3B" */
export function formatCount(value: number): string {
  return formatNumber(value, 1)
}

export function formatDate(timestamp: number): string {
  return formatTimestamp(timestamp, { mode: 'date' })
}

/** "27 Nov 2025 to 24 Nov 2026" */
export function formatDays(from: number, to: number): string {
  return `${formatDate(from)} to ${formatDate(to)}`
}

/** "1 day", "8 days" */
export function pluralDays(days: number): string {
  return days === 1 ? '1 day' : `${days} days`
}

function formatSignificant(value: number, digits: number): string {
  if (value === 0) return '0'
  const decimals = Math.max(0, digits - 1 - Math.floor(Math.log10(value)))
  return value.toFixed(Math.min(decimals, 20))
}
