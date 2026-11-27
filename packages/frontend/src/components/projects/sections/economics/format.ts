import { formatNumberWithCommas } from '@l2beat/shared-pure'

/** ETH with as many decimals as the size needs: 122,242,182 · 47.3 · 0.031. */
export function formatEth(value: number): string {
  const abs = Math.abs(value)
  const decimals = abs >= 1000 ? 0 : abs >= 10 ? 1 : abs >= 1 ? 2 : 3
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatSignedEth(value: number): string {
  if (value === 0) return '0'
  return `${value > 0 ? '+' : '−'}${formatEth(Math.abs(value))}`
}

/** 122.24M · 44.4K · 812 */
export function formatEthShort(value: number): string {
  const abs = Math.abs(value)
  const sign = value < 0 ? '−' : ''
  if (abs >= 1e6) return `${sign}${trimZeros((abs / 1e6).toFixed(2))}M`
  if (abs >= 1e4) return `${sign}${trimZeros((abs / 1e3).toFixed(1))}K`
  return `${sign}${formatEth(abs)}`
}

function trimZeros(value: string): string {
  return value.includes('.') ? value.replace(/\.?0+$/, '') : value
}

export function formatShare(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

export function formatSignedShare(value: number, decimals = 2): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${(Math.abs(value) * 100).toFixed(decimals)}%`
}

export function formatUsdPrice(value: number): string {
  return `$${formatNumberWithCommas(value, { maximumFractionDigits: 0 })}`
}

export function formatMonthYear(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
