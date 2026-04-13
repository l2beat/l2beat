export function formatUsdValue(value: number): string {
  if (value === 0) return '$0'
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`
  }
  return `$${value.toFixed(2)}`
}

/**
 * Strip the chain prefix from an address.
 * Works with any chain prefix (eth:, arb1:, base:, etc.).
 */
export function stripChainPrefix(address: string): string {
  const colonIdx = address.indexOf(':')
  if (colonIdx !== -1 && !address.startsWith('0x')) {
    return address.slice(colonIdx + 1)
  }
  return address
}

/**
 * Normalize an address for use as a lookup key (lowercase).
 */
export function normalizeForLookup(address: string): string {
  return address.toLowerCase()
}

export function truncateAddress(address: string): string {
  const raw = stripChainPrefix(address)
  if (raw.length <= 10) return raw
  return `${raw.slice(0, 6)}...${raw.slice(-4)}`
}

export function etherscanUrl(address: string): string {
  const raw = stripChainPrefix(address)
  return `https://etherscan.io/address/${raw}`
}

export function etherscanTxUrl(txHash: string): string {
  const raw = stripChainPrefix(txHash)
  return `https://etherscan.io/tx/${raw}`
}
