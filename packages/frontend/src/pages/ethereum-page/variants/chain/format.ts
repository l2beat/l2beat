/**
 * Formatters for the chain variant. Module-level functions, so the rolling
 * numbers that take them as props keep the same reference between renders.
 */

const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

export function formatInteger(value: number) {
  return integer.format(Math.round(value))
}

export function formatBlockNumber(value: number) {
  return `#${integer.format(Math.round(value))}`
}

export function formatGwei(value: number) {
  return `${withPrecision(value)} gwei`
}

/** Blob fees sit at 1 wei for days, then climb by orders of magnitude */
export function formatWei(value: number) {
  if (value >= 1e9) return formatGwei(value / 1e9)
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M wei`
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K wei`
  return `${Math.round(value)} wei`
}

/** Fees too small for ETH to read are given in gwei, a billionth of an ETH */
export function formatEth(value: number) {
  if (value !== 0 && Math.abs(value) < 1e-6) return formatGwei(value * 1e9)
  return `${withPrecision(value)} ETH`
}

export function formatEthCompact(value: number) {
  if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(2)}M ETH`
  if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(1)}K ETH`
  return formatEth(value)
}

export function formatEthPrecise(value: number) {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} ETH`
}

export function formatSignedEth(value: number) {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${withPrecision(Math.abs(value))} ETH`
}

export function formatUsd(value: number) {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  if (value >= 100) return `$${integer.format(value)}`
  if (value >= 0.01) return `$${value.toFixed(2)}`
  if (value === 0) return '$0'
  return '<$0.01'
}

export function formatBytes(value: number) {
  if (value >= 1024 ** 3) return `${(value / 1024 ** 3).toFixed(2)} GiB`
  if (value >= 1024 ** 2) return `${(value / 1024 ** 2).toFixed(2)} MiB`
  if (value >= 1024) return `${(value / 1024).toFixed(1)} KiB`
  return `${Math.round(value)} B`
}

export function formatBytesPerSecond(value: number) {
  return `${formatBytes(value)}/s`
}

export function formatMillions(value: number) {
  return `${(value / 1e6).toFixed(1)}M`
}

export function formatGasPerSecond(value: number) {
  return `${(value / 1e6).toFixed(2)}M gas/s`
}

export function formatPerSecond(value: number) {
  return value.toFixed(1)
}

export function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

export function formatBlobsPerBlock(value: number) {
  return value.toFixed(2)
}

export function shortHash(hash: string | undefined) {
  if (!hash) return '—'
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`
}

/** "12 s", "4.2 min": how far a block is from the head */
export function formatSlotsAgo(slots: number) {
  const seconds = slots * 12
  if (seconds < 60) return `${seconds} s`
  return `${(seconds / 60).toFixed(1)} min`
}

/** Three significant digits, without trailing zeros noise for small fees */
function withPrecision(value: number) {
  const abs = Math.abs(value)
  if (abs === 0) return '0'
  if (abs >= 1000) return integer.format(value)
  if (abs >= 1) return value.toFixed(2)
  if (abs >= 0.001)
    return value.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')
  return value.toPrecision(2)
}

/**
 * "14:03:24 UTC": the site's time-of-day format with seconds, since blocks
 * are 12 seconds apart and minutes alone would give five blocks one time
 */
export function formatBlockTime(timestamp: number) {
  return `${new Date(timestamp * 1000).toISOString().slice(11, 19)} UTC`
}
