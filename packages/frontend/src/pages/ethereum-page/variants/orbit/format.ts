const WHOLE = new Intl.NumberFormat('en-US')

/** Block and slot numbers are read whole, never shortened to "23.9 M" */
export function formatWhole(value: number): string {
  return WHOLE.format(Math.round(value))
}

/** Three significant digits: 0.412 gwei, 12.4 gwei, 182 gwei */
export function formatGwei(value: number): string {
  if (value === 0) return '0'
  if (value >= 100) return formatWhole(value)
  return trimZeros(value.toPrecision(3))
}

/** Blob base fee sits at its 1 wei floor most of the time; past a million wei it reads in gwei */
export function formatWeiFee(wei: number): { value: string; unit: string } {
  if (wei >= 1e6) return { value: formatGwei(wei / 1e9), unit: 'gwei' }
  return { value: formatWhole(wei), unit: 'wei' }
}

/** 120,712,394 ETH whole; 1.24 ETH; 0.0000184 ETH with three significant digits */
export function formatEth(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 10_000) return formatWhole(value)
  if (abs >= 100) return value.toFixed(1)
  if (abs >= 1) return value.toFixed(2)
  if (abs === 0) return '0'
  return trimZeros(value.toPrecision(3))
}

/** $0.0021, $0.43, $12.40, $1.2K, $34.5B */
export function formatUsd(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1e3) return `$${formatCompact(value)}`
  if (abs >= 1) return `$${value.toFixed(2)}`
  if (abs === 0) return '$0'
  if (abs < 0.0001) return '<$0.0001'
  return `$${trimZeros(value.toPrecision(2))}`
}

const COMPACT_UNITS = ['', 'K', 'M', 'B', 'T']

/** 1.24M, 34.5B: three significant digits */
export function formatCompact(value: number): string {
  let v = value
  let unit = 0
  while (Math.abs(v) >= 1000 && unit < COMPACT_UNITS.length - 1) {
    v /= 1000
    unit++
  }
  const digits = Math.abs(v) >= 100 ? 0 : Math.abs(v) >= 10 ? 1 : 2
  return `${v.toFixed(digits)}${COMPACT_UNITS[unit]}`
}

/** 0.0028, 0.34, 21.3, 152 */
export function formatRate(value: number): string {
  if (value === 0) return '0'
  if (value >= 100) return formatWhole(value)
  if (value >= 10) return value.toFixed(1)
  return trimZeros(value.toPrecision(2))
}

export function formatPercentage(fraction: number, digits = 0): string {
  return `${(fraction * 100).toFixed(digits)}%`
}

const BYTE_UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB']

/** 896 KiB, 151 MiB: three significant digits, binary units as blobs are sized */
export function formatBytes(bytes: number): string {
  let v = bytes
  let unit = 0
  while (v >= 1024 && unit < BYTE_UNITS.length - 1) {
    v /= 1024
    unit++
  }
  const digits = v >= 100 || unit === 0 ? 0 : v >= 10 ? 1 : 2
  return `${v.toFixed(digits)} ${BYTE_UNITS[unit]}`
}

/** "7s", "2 min", "15 min" */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.max(0, Math.round(seconds))}s`
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min`
  return `${(seconds / 3600).toFixed(1)} h`
}

export function shortHash(hash: string | undefined): string {
  if (!hash) return '—'
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`
}

function trimZeros(text: string): string {
  if (!text.includes('.') || text.includes('e')) return text
  return text.replace(/\.?0+$/, '')
}
