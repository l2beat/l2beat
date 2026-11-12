/** EIP-4844: every blob is 4096 field elements of 32 bytes */
export const BLOB_BYTES = 131_072
export const SLOT_SECONDS = 12

const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

export function formatInteger(value: number) {
  return integer.format(Math.round(value))
}

export function formatFixed(value: number, digits: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

/** Keeps two significant digits below 1, so 0.0042 does not read as 0.00 */
export function formatSmart(value: number) {
  if (value === 0) return '0'
  const abs = Math.abs(value)
  if (abs >= 100) return formatInteger(value)
  const digits =
    abs >= 10 ? 1 : abs >= 1 ? 2 : Math.min(12, 1 - Math.floor(Math.log10(abs)))
  return value.toLocaleString('en-US', { maximumFractionDigits: digits })
}

export function formatCompact(value: number, digits = 2) {
  const abs = Math.abs(value)
  if (abs >= 1e9) return `${formatFixed(value / 1e9, digits)}B`
  if (abs >= 1e6) return `${formatFixed(value / 1e6, digits)}M`
  if (abs >= 1e3) return `${formatFixed(value / 1e3, digits)}K`
  return formatSmart(value)
}

export function formatUsd(value: number) {
  if (value === 0) return '$0'
  if (Math.abs(value) < 0.0001) return '<$0.0001'
  if (Math.abs(value) >= 1e3) return `$${formatCompact(value)}`
  return `$${formatSmart(value)}`
}

export function formatBytesPerSecond(bytes: number) {
  if (bytes >= 1e6) return `${formatSmart(bytes / 1e6)} MB/s`
  if (bytes >= 1e3) return `${formatSmart(bytes / 1e3)} KB/s`
  return `${formatInteger(bytes)} B/s`
}

export function formatGas(gas: number) {
  if (gas >= 1e6) return `${formatSmart(gas / 1e6)}M`
  if (gas >= 1e3) return `${formatFixed(gas / 1e3, 0)}K`
  return formatInteger(gas)
}

export function formatPercent(fraction: number, digits = 0) {
  return `${formatFixed(fraction * 100, digits)}%`
}

export interface Amount {
  value: string
  unit: string
}

/**
 * ETH while it stays readable, down to millionths; below that a blob's few
 * hundred thousand wei would be a string of zeros in ETH
 */
export function toEthAmount(eth: number): Amount {
  if (eth >= 0.000001) return { value: formatSmart(eth), unit: 'ETH' }
  const gwei = eth * 1e9
  if (gwei >= 0.01) return { value: formatSmart(gwei), unit: 'gwei' }
  return { value: formatInteger(eth * 1e18), unit: 'wei' }
}

export function formatWei(wei: number) {
  if (wei >= 1e9) return `${formatSmart(wei / 1e9)} gwei`
  return `${formatCompact(wei, 1)} wei`
}

export function shortHash(hash: string | undefined) {
  if (!hash) return '—'
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`
}

export function formatPrice(usd: number) {
  return `$${formatFixed(usd, 2)}`
}
