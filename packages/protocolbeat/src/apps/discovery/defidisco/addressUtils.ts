/**
 * Address utility functions for DeFiDisco frontend.
 *
 * All internal addresses use the chain-prefixed format "chain:0xChecksummed".
 * The backend is responsible for checksumming; the frontend uses these helpers
 * for consistent prefix handling and comparisons.
 */

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
 * Get the chain prefix from a chain-specific address.
 * Returns 'eth' as default if no prefix is found.
 */
export function getChainPrefix(address: string): string {
  const colonIdx = address.indexOf(':')
  if (colonIdx !== -1 && !address.startsWith('0x')) {
    return address.slice(0, colonIdx)
  }
  return 'eth'
}

/**
 * Ensure an address has a chain prefix.
 * If it already has one, returns as-is.
 * If it doesn't, prepends 'eth:' by default.
 */
export function ensureChainPrefix(address: string, chain = 'eth'): string {
  const colonIdx = address.indexOf(':')
  if (colonIdx !== -1 && !address.startsWith('0x')) {
    return address
  }
  return `${chain}:${address}`
}

/**
 * Compare two addresses for equality, case-insensitively.
 * Handles addresses with or without chain prefix.
 */
export function addressesEqual(a: string, b: string): boolean {
  return normalizeForLookup(a) === normalizeForLookup(b)
}

/**
 * Normalize an address for use as a lookup key.
 * Lowercases and ensures chain prefix consistency.
 *
 * NOTE: On the backend, addresses should be checksummed at ingestion.
 * This frontend normalizer is for display/comparison only.
 */
export function normalizeForLookup(address: string): string {
  return ensureChainPrefix(address).toLowerCase()
}

/**
 * Check if a string looks like a chain-prefixed address.
 */
export function isChainAddress(value: string): boolean {
  const colonIdx = value.indexOf(':')
  if (colonIdx === -1 || value.startsWith('0x')) return false
  const hex = value.slice(colonIdx + 1)
  return hex.startsWith('0x') && hex.length === 42
}

/**
 * Shorten an address for display: "0x1234...abcd"
 * Handles chain-prefixed addresses by stripping the prefix first.
 */
export function shortenAddress(address: string, chars = 4): string {
  const hex = stripChainPrefix(address)
  if (hex.length <= chars * 2 + 2) return hex
  return `${hex.slice(0, chars + 2)}...${hex.slice(-chars)}`
}

/**
 * Find a value in an array by matching an address field.
 */
export function findByAddress<T>(
  items: T[],
  getAddress: (item: T) => string,
  targetAddress: string,
): T | undefined {
  const normalizedTarget = normalizeForLookup(targetAddress)
  return items.find(
    (item) => normalizeForLookup(getAddress(item)) === normalizedTarget,
  )
}
