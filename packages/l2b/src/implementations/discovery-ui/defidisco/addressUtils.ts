import { EthereumAddress } from '@l2beat/shared-pure'
import type { Mitigation } from './types'

/**
 * Address utility functions for DeFiDisco.
 *
 * All internal addresses use the chain-prefixed format "chain:0xChecksummed".
 * These helpers ensure addresses are always normalized on ingestion and
 * compared without ad-hoc toLowerCase() calls scattered through the codebase.
 */

// ---------------------------------------------------------------------------
// Core: normalize a chain-prefixed address to checksummed form
// ---------------------------------------------------------------------------

/**
 * Normalize a chain-prefixed address (e.g. "eth:0xabc...") so that:
 *  - the chain prefix is preserved as-is (lowercase by convention)
 *  - the hex address part is ERC-55 checksummed
 *
 * If the address has no chain prefix it is returned with "eth:" prepended
 * (legacy compatibility). If the hex part is invalid the input is returned
 * unchanged so callers don't crash on non-address strings.
 */
export function normalizeChainAddress(raw: string): string {
  const colonIdx = raw.indexOf(':')

  let chain: string
  let hex: string

  if (colonIdx !== -1 && !raw.startsWith('0x')) {
    chain = raw.slice(0, colonIdx)
    hex = raw.slice(colonIdx + 1)
  } else {
    // No chain prefix – treat as ethereum
    chain = 'eth'
    hex = raw
  }

  if (!hex.startsWith('0x') || hex.length !== 42) {
    return raw // not an address, return as-is
  }

  try {
    const checksummed = EthereumAddress(hex)
    return `${chain}:${checksummed}`
  } catch {
    return raw
  }
}

// ---------------------------------------------------------------------------
// Comparison helpers
// ---------------------------------------------------------------------------

/**
 * Compare two chain-prefixed addresses for equality.
 * Handles mixed casing and optional chain prefix gracefully.
 */
export function addressesEqual(a: string, b: string): boolean {
  return normalizeChainAddress(a) === normalizeChainAddress(b)
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
 * Get only the chain prefix from a chain-specific address.
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
 * If it already has one, normalizes the checksumming.
 * If it doesn't, prepends 'eth:' by default.
 */
export function ensureChainPrefix(address: string, chain = 'eth'): string {
  const colonIdx = address.indexOf(':')
  if (colonIdx !== -1 && !address.startsWith('0x')) {
    return normalizeChainAddress(address)
  }
  return normalizeChainAddress(`${chain}:${address}`)
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

// ---------------------------------------------------------------------------
// Mitigation scope filtering
// ---------------------------------------------------------------------------

/**
 * Filter mitigations to only those relevant for a specific owner (admin or dependency).
 * Global mitigations (no scopedTo) are always included.
 * Scoped mitigations are included only if they match the given owner address.
 * The scopedTo.type field is informational (for UI display) — filtering matches
 * by address only, because the same address can appear as both admin and dependency.
 */
export function filterMitigationsForOwner(
  mitigations: Mitigation[] | undefined,
  ownerAddress: string,
  _ownerType: 'admin' | 'dependency',
): Mitigation[] | undefined {
  if (!mitigations) return undefined
  const filtered = mitigations.filter((m) => {
    if (!m.scopedTo) return true
    return addressesEqual(m.scopedTo.address, ownerAddress)
  })
  return filtered.length > 0 ? filtered : undefined
}

// ---------------------------------------------------------------------------
// Collection helpers
// ---------------------------------------------------------------------------

/**
 * Build a case-insensitive lookup Set from an array of addresses.
 * All entries are normalized so lookups don't need toLowerCase().
 */
export function buildAddressSet(addresses: string[]): Set<string> {
  return new Set(addresses.map(normalizeChainAddress))
}

/**
 * Check if an address is in a normalized address set.
 */
export function isInAddressSet(address: string, set: Set<string>): boolean {
  return set.has(normalizeChainAddress(address))
}

/**
 * Build a Map keyed by normalized addresses.
 */
export function buildAddressMap<T>(
  entries: Array<[string, T]>,
): Map<string, T> {
  const map = new Map<string, T>()
  for (const [addr, value] of entries) {
    map.set(normalizeChainAddress(addr), value)
  }
  return map
}

/**
 * Look up a value in an address-keyed Map using normalized comparison.
 */
export function getFromAddressMap<T>(
  map: Map<string, T>,
  address: string,
): T | undefined {
  return map.get(normalizeChainAddress(address))
}

/**
 * Look up a value in a plain object keyed by addresses.
 * Tries the normalized form first, then falls back to scanning all keys.
 */
export function getFromAddressRecord<T>(
  record: Record<string, T>,
  address: string,
): T | undefined {
  const normalized = normalizeChainAddress(address)
  if (normalized in record) return record[normalized]
  // Fallback: scan keys (handles legacy data with non-checksummed keys)
  for (const key of Object.keys(record)) {
    if (normalizeChainAddress(key) === normalized) {
      return record[key]
    }
  }
  return undefined
}

// ---------------------------------------------------------------------------
// Proxy / implementation helpers
// ---------------------------------------------------------------------------

/**
 * Build a mapping from implementation addresses to their proxy addresses.
 *
 * @deprecated — loses information when a shared implementation is used by
 * multiple proxies (factory-deployed token patterns like Aave ATokens).
 * Prefer {@link buildImplToProxiesMap}, which preserves the full set, and
 * migrate call sites that care about correctness when N > 1. This single-
 * valued shape is safe only for name propagation (the set members always
 * share a contract name) and for lookups known to be unique-impl.
 *
 * Returns Map<normalizedImplAddress, normalizedProxyAddress>.
 */
export function buildImplementationToProxyMap(
  discovered: any,
): Map<string, string> {
  const map = new Map<string, string>()
  for (const entry of discovered.entries ?? []) {
    if (entry.type !== 'Contract') continue
    const proxyAddr = normalizeChainAddress(entry.address)

    // Check implementationNames (Record<implAddress, name>)
    if (
      entry.implementationNames &&
      typeof entry.implementationNames === 'object'
    ) {
      for (const implAddr of Object.keys(entry.implementationNames)) {
        const normalized = normalizeChainAddress(implAddr)
        // Don't map the proxy address to itself
        if (normalized !== proxyAddr) {
          map.set(normalized, proxyAddr)
        }
      }
    }

    // Also check $implementation in values (string or string[])
    const implValue = entry.values?.$implementation
    if (typeof implValue === 'string') {
      const normalized = normalizeChainAddress(implValue)
      if (normalized !== proxyAddr) {
        map.set(normalized, proxyAddr)
      }
    } else if (Array.isArray(implValue)) {
      for (const v of implValue) {
        if (typeof v === 'string') {
          const normalized = normalizeChainAddress(v)
          if (normalized !== proxyAddr) {
            map.set(normalized, proxyAddr)
          }
        }
      }
    }
  }
  return map
}

/**
 * Build a many-valued mapping from implementation addresses to the set of
 * proxy addresses that use them. Supports shared-implementation patterns
 * (one impl → many proxies, e.g. Aave ATokens, Uniswap v3 positions).
 *
 * Returns Map<normalizedImplAddress, Set<normalizedProxyAddress>>.
 */
export function buildImplToProxiesMap(
  discovered: any,
): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>()
  const add = (impl: string, proxy: string) => {
    const implN = normalizeChainAddress(impl)
    const proxyN = normalizeChainAddress(proxy)
    if (implN === proxyN) return
    let set = map.get(implN)
    if (!set) {
      set = new Set()
      map.set(implN, set)
    }
    set.add(proxyN)
  }
  for (const entry of discovered.entries ?? []) {
    if (entry.type !== 'Contract') continue
    const proxyAddr = entry.address

    if (
      entry.implementationNames &&
      typeof entry.implementationNames === 'object'
    ) {
      for (const implAddr of Object.keys(entry.implementationNames)) {
        add(implAddr, proxyAddr)
      }
    }

    const implValue = entry.values?.$implementation
    if (typeof implValue === 'string') {
      add(implValue, proxyAddr)
    } else if (Array.isArray(implValue)) {
      for (const v of implValue) {
        if (typeof v === 'string') add(v, proxyAddr)
      }
    }
  }
  return map
}

/**
 * Build the inverse mapping: proxy → set of implementation addresses it uses.
 * Useful when iterating by proxy and needing to look up metadata that may
 * be stored at any of its implementation addresses (e.g. shared-impl admin
 * metadata on an Aave AToken).
 *
 * Returns Map<normalizedProxyAddress, Set<normalizedImplAddress>>.
 */
export function buildProxyToImplsMap(
  discovered: any,
): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>()
  for (const entry of discovered.entries ?? []) {
    if (entry.type !== 'Contract') continue
    const proxyN = normalizeChainAddress(entry.address)
    const impls = new Set<string>()

    if (
      entry.implementationNames &&
      typeof entry.implementationNames === 'object'
    ) {
      for (const implAddr of Object.keys(entry.implementationNames)) {
        const implN = normalizeChainAddress(implAddr)
        if (implN !== proxyN) impls.add(implN)
      }
    }

    const implValue = entry.values?.$implementation
    if (typeof implValue === 'string') {
      const implN = normalizeChainAddress(implValue)
      if (implN !== proxyN) impls.add(implN)
    } else if (Array.isArray(implValue)) {
      for (const v of implValue) {
        if (typeof v === 'string') {
          const implN = normalizeChainAddress(v)
          if (implN !== proxyN) impls.add(implN)
        }
      }
    }

    if (impls.size > 0) map.set(proxyN, impls)
  }
  return map
}
