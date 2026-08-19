import type { TrackedTxConfigEntryWithoutId } from '@l2beat/shared'
import { ChainSpecificAddress } from '@l2beat/shared-pure'

/** Minimal shape of a discovered.json entry needed for perimeter derivation */
export interface DiscoveredEntryLite {
  type?: string
  address?: string
  name?: string
  unverified?: boolean
  critical?: boolean
  sinceTimestamp?: number
  values?: Record<string, unknown>
  fieldMeta?: Record<string, { severity?: string } | undefined>
  receivedPermissions?: {
    permission?: string
    from?: string
    via?: { address?: string }[]
  }[]
}

const CHAIN_SPECIFIC_ADDRESS_RE = /^[a-z0-9-]+:0x[0-9a-fA-F]{40}$/i

/**
 * LINT/RESEARCH TOOL ONLY — the product perimeter is the set of contracts
 * flagged `critical` in discovery. This closure derives a candidate
 * perimeter from the value graph so classification gaps can be surfaced
 * to researchers and agents; it never decides membership itself.
 *
 * Closure from the fund-holding seeds over two edge kinds:
 * - dependencies: contracts referenced from a perimeter contract's values
 *   (verifiers, hashers, bridges the escrow calls into). Fields curated as
 *   severity LOW are not followed — a low-severity reference (e.g. a reward
 *   recipient) is by definition not a security dependency.
 * - controllers: entries holding any permission over a perimeter contract,
 *   including the via path (proxy admins, multisigs, timelocks)
 * EOAs never join (no code to ossify). Returns null when no seed matches a
 * discovered contract, so callers can fall back to a broader perimeter.
 */
export function deriveOssificationPerimeter(
  entries: DiscoveredEntryLite[],
  seedAddresses: string[],
): Set<string> | null {
  const contractByKey = new Map<string, DiscoveredEntryLite>()
  const entryTypeByKey = new Map<string, string>()
  for (const entry of entries) {
    if (!entry.address) continue
    const key = entry.address.toLowerCase()
    entryTypeByKey.set(key, entry.type ?? '')
    if (entry.type === 'Contract') {
      contractByKey.set(key, entry)
    }
  }

  const controllersByTarget = new Map<
    string,
    { holder: string; via: string[] }[]
  >()
  for (const entry of entries) {
    if (!entry.address) continue
    for (const permission of entry.receivedPermissions ?? []) {
      if (!permission.from) continue
      const target = permission.from.toLowerCase()
      const controllers = controllersByTarget.get(target) ?? []
      controllers.push({
        holder: entry.address.toLowerCase(),
        via: (permission.via ?? [])
          .map((step) => step.address?.toLowerCase())
          .filter((address) => address !== undefined),
      })
      controllersByTarget.set(target, controllers)
    }
  }

  const seeds = seedAddresses
    .map((address) => address.toLowerCase())
    .filter((key) => contractByKey.has(key))
  if (seeds.length === 0) {
    return null
  }

  const perimeter = new Set<string>()
  const queue = [...seeds]
  while (queue.length > 0) {
    const key = queue.pop()
    if (key === undefined || perimeter.has(key)) continue
    if (!contractByKey.has(key)) continue
    perimeter.add(key)

    const entry = contractByKey.get(key)
    for (const referenced of collectReferencedAddresses(entry)) {
      if (!perimeter.has(referenced)) queue.push(referenced)
    }
    for (const controller of controllersByTarget.get(key) ?? []) {
      for (const candidate of [controller.holder, ...controller.via]) {
        if (!perimeter.has(candidate)) queue.push(candidate)
      }
    }
  }

  return perimeter
}

function collectReferencedAddresses(
  entry: DiscoveredEntryLite | undefined,
): Set<string> {
  const into = new Set<string>()
  for (const [field, value] of Object.entries(entry?.values ?? {})) {
    if (entry?.fieldMeta?.[field]?.severity === 'LOW') continue
    collectAddresses(value, into)
  }
  return into
}

function collectAddresses(value: unknown, into = new Set<string>()) {
  if (typeof value === 'string') {
    if (CHAIN_SPECIFIC_ADDRESS_RE.test(value)) {
      into.add(value.toLowerCase())
    }
  } else if (Array.isArray(value)) {
    for (const item of value) collectAddresses(item, into)
  } else if (value !== null && typeof value === 'object') {
    for (const item of Object.values(value)) collectAddresses(item, into)
  }
  return into
}

/** The contracts whose activity we track for liveness are the project's
 *  operational core (inboxes, outboxes, batchers) — closure seeds alongside
 *  the escrows, since e.g. an inbox that writes into a signal service has
 *  no incoming address-level edge. */
export function getTrackedTxSeeds(
  trackedTxsConfig: TrackedTxConfigEntryWithoutId[] | undefined,
): string[] {
  const seeds = new Set<string>()
  for (const config of trackedTxsConfig ?? []) {
    if ('address' in config.params && config.params.address) {
      seeds.add(
        ChainSpecificAddress.fromLong(
          'ethereum',
          config.params.address,
        ).toLowerCase(),
      )
    }
  }
  return [...seeds]
}

/**
 * Extracts escrow addresses (the perimeter seeds) from a project's tvs.json
 * by scanning for `{ escrowAddress, chain }` pairs anywhere in the token
 * amount formulas.
 */
export function collectEscrowSeeds(tvsJson: unknown): string[] {
  const seeds = new Set<string>()
  visit(tvsJson)
  return [...seeds]

  function visit(value: unknown) {
    if (Array.isArray(value)) {
      for (const item of value) visit(item)
      return
    }
    if (value === null || typeof value !== 'object') return
    const record = value as Record<string, unknown>
    if (
      typeof record.escrowAddress === 'string' &&
      typeof record.chain === 'string'
    ) {
      try {
        seeds.add(
          ChainSpecificAddress.fromLong(
            record.chain,
            record.escrowAddress,
          ).toLowerCase(),
        )
      } catch {
        // chains unknown to the short-name registry cannot be matched
        // against discovered.json addresses anyway
      }
    }
    for (const item of Object.values(record)) visit(item)
  }
}
