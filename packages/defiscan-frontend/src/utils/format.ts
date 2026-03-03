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

export function truncateAddress(address: string): string {
  const raw = address.startsWith('eth:') ? address.slice(4) : address
  if (raw.length <= 10) return raw
  return `${raw.slice(0, 6)}...${raw.slice(-4)}`
}

export function etherscanUrl(address: string): string {
  const raw = address.startsWith('eth:') ? address.slice(4) : address
  return `https://etherscan.io/address/${raw}`
}
