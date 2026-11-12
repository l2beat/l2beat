/**
 * Every number on the console goes through these, so a value reads the same
 * in the tape, a tile and a tooltip. Fixed `en-US` grouping: the server and
 * the browser must print the same string, or hydration breaks.
 */

const groupers = new Map<number, Intl.NumberFormat>()

export function fmtNumber(value: number, decimals = 0) {
  let formatter = groupers.get(decimals)
  if (!formatter) {
    formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    groupers.set(decimals, formatter)
  }
  return formatter.format(value)
}

export function fmtGwei(gwei: number) {
  return fmtNumber(gwei, gwei < 10 ? 3 : 1)
}

/** Blob fees sit at 1 wei for days, then climb by orders of magnitude */
export function blobFeeUnit(wei: number): 'wei' | 'gwei' {
  return wei >= 1e6 ? 'gwei' : 'wei'
}

export function fmtBlobFee(wei: number, unit = blobFeeUnit(wei)) {
  return unit === 'gwei' ? fmtNumber(wei / 1e9, 4) : fmtNumber(wei)
}

export function fmtEth(eth: number) {
  const abs = Math.abs(eth)
  if (abs === 0) return '0'
  if (abs < 1e-9) return '<0.000000001'
  // three significant digits, written out: researchers compare these by eye
  if (abs < 0.0001) return fmtNumber(eth, Math.ceil(-Math.log10(abs)) + 2)
  if (abs < 1) return fmtNumber(eth, 4)
  if (abs < 100) return fmtNumber(eth, 2)
  return fmtNumber(eth)
}

export function fmtUsd(usd: number) {
  const abs = Math.abs(usd)
  if (abs >= 1e9) return `$${fmtNumber(usd / 1e9, 2)}B`
  if (abs >= 1e6) return `$${fmtNumber(usd / 1e6, 2)}M`
  if (abs >= 1e4) return `$${fmtNumber(usd)}`
  if (abs >= 1) return `$${fmtNumber(usd, 2)}`
  if (abs >= 0.01) return `$${fmtNumber(usd, 3)}`
  if (abs >= 0.0001) return `$${fmtNumber(usd, 4)}`
  return usd === 0 ? '$0' : '<$0.0001'
}

export function fmtPercent(share: number, decimals = 0) {
  return `${fmtNumber(share * 100, decimals)}%`
}

export function fmtSignedPercent(change: number) {
  const sign = change > 0 ? '+' : change < 0 ? '−' : '±'
  return `${sign}${fmtNumber(Math.abs(change) * 100, 1)}%`
}

/** KiB/MiB, the units blob limits are set in */
export function fmtBytes(bytes: number) {
  if (bytes >= 1024 ** 3) return `${fmtNumber(bytes / 1024 ** 3, 2)} GiB`
  if (bytes >= 1024 ** 2) return `${fmtNumber(bytes / 1024 ** 2, 2)} MiB`
  if (bytes >= 1024) return `${fmtNumber(bytes / 1024, 1)} KiB`
  return `${fmtNumber(bytes)} B`
}

export function fmtCompact(value: number) {
  const abs = Math.abs(value)
  if (abs === 0) return '0'
  if (abs >= 1e9) return `${fmtNumber(value / 1e9, 2)}B`
  if (abs >= 1e6) return `${fmtNumber(value / 1e6, 2)}M`
  if (abs >= 1e4) return `${fmtNumber(value / 1e3, 1)}K`
  if (abs >= 100) return fmtNumber(value)
  if (abs >= 1) return fmtNumber(value, 2)
  return fmtNumber(value, 3)
}

export function fmtDuration(seconds: number) {
  const s = Math.max(0, Math.round(seconds))
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ${String(s % 60).padStart(2, '0')}s`
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`
}

export function shortHash(hash: string | undefined) {
  return hash ? `${hash.slice(0, 6)}…${hash.slice(-4)}` : '—'
}
