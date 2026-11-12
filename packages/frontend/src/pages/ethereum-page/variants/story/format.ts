/**
 * Number formats for prose. Values sit inside sentences, so they are short
 * and read aloud well: "0.0041 ETH", "18.2", "9×", "a third".
 */

const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

export function formatInteger(value: number) {
  return integer.format(Math.round(value))
}

/** Keeps two significant digits after the leading zeros, so tiny amounts still read */
export function formatEth(value: number) {
  if (value === 0) return '0 ETH'
  if (Math.abs(value) >= 1000) return `${formatInteger(value)} ETH`
  if (Math.abs(value) >= 1) return `${trim(value.toFixed(2))} ETH`
  // a string of zeros reads worse than a smaller unit
  if (Math.abs(value) < 1e-7) return formatGwei(value * 1e9)
  return `${significant(value, 2)} ETH`
}

export function formatEthAmount(value: number) {
  return formatEth(value).replace(' ETH', '')
}

export function formatGwei(value: number) {
  if (value >= 10) return `${trim(value.toFixed(1))} gwei`
  if (value >= 0.01) return `${trim(value.toFixed(3))} gwei`
  return `${significant(value, 2)} gwei`
}

export function formatWei(value: number) {
  if (value >= 1e7) return formatGwei(value / 1e9)
  return `${formatInteger(value)} wei`
}

export function formatUsd(value: number) {
  if (value >= 1e9) return `$${trim((value / 1e9).toFixed(2))}B`
  if (value >= 1e6) return `$${trim((value / 1e6).toFixed(2))}M`
  if (value >= 100) return `$${formatInteger(value)}`
  if (value >= 1) return `$${value.toFixed(2).replace(/\.00$/, '')}`
  if (value >= 0.01) return `$${value.toFixed(2)}`
  if (value === 0) return '$0'
  return value < 0.000001 ? 'under $0.000001' : `$${significant(value, 1)}`
}

export function formatRate(value: number) {
  if (value >= 100) return formatInteger(value)
  return trim(value.toFixed(1))
}

export function formatGas(value: number) {
  if (value >= 1e6) return `${trim((value / 1e6).toFixed(1))}M`
  if (value >= 1e3) return `${formatInteger(value / 1e3)}k`
  return formatInteger(value)
}

export function formatBytesPerSecond(value: number) {
  return `${formatRate(value / 1024)} KiB/s`
}

export function formatMultiple(value: number) {
  return value >= 10 ? `${formatInteger(value)}×` : `${trim(value.toFixed(1))}×`
}

export function formatPercentage(share: number) {
  const percent = share * 100
  if (percent > 0 && percent < 1) return `${trim(percent.toFixed(1))}%`
  return `${formatInteger(percent)}%`
}

const FRACTIONS = [
  { value: 1 / 2, words: 'half' },
  { value: 1 / 3, words: 'a third' },
  { value: 1 / 4, words: 'a quarter' },
  { value: 1 / 5, words: 'a fifth' },
  { value: 2 / 3, words: 'two thirds' },
  { value: 3 / 4, words: 'three quarters' },
]

/** "a third" when a share is near a fraction people say, otherwise "31%" */
export function shareInWords(share: number) {
  const near = FRACTIONS.find((f) => Math.abs(f.value - share) < 0.02)
  return near ? near.words : formatPercentage(share)
}

function significant(value: number, digits: number) {
  const magnitude = Math.floor(Math.log10(Math.abs(value)))
  const decimals = Math.max(0, digits - 1 - magnitude)
  return trim(value.toFixed(Math.min(decimals, 20)))
}

function trim(text: string) {
  return text.includes('.') ? text.replace(/\.?0+$/, '') : text
}
