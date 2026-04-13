import type { DiscoveryDiff, DiscoveryOutput } from '@l2beat/discovery'
import { normalizeChainAddress } from './addressUtils'
import type { ContractTag } from './types'

/**
 * Minimal structural shape of `UpdateNotifierRecord` from `@l2beat/database`.
 * We declare it locally to avoid a cross-package dependency (`@l2beat/l2b`
 * doesn't pull in `@l2beat/database`) — the monitor-side caller casts to this.
 */
export interface ActivityNotifierRow {
  id: number
  projectId: string
  /** Unix seconds. */
  timestamp: number
  diff: DiscoveryDiff[]
}

// ============================================================================
// Activity event types (shared with reviewCompiler + frontend)
// ============================================================================

export interface BaseActivityFileEvent {
  /** Deterministic `${updateNotifierId}:${address}:${key}` — dedupe key. */
  id: string
  /** ISO 8601 timestamp for compatibility with the existing UpgradeEvent shape. */
  timestamp: string
  updateNotifierId: number
  address: string
  contractName?: string
  isDependency?: boolean
  entity?: string | null
}

export interface DataChangeEvent extends BaseActivityFileEvent {
  type: 'data-change'
  field: string
  before: unknown
  after: unknown
}

export interface RoleUpdateEvent extends BaseActivityFileEvent {
  type: 'role-update'
  roleName: string
  field: string
  before: unknown
  after: unknown
}

export interface ContractAddedEvent extends BaseActivityFileEvent {
  type: 'contract-added'
}

export interface ContractRemovedEvent extends BaseActivityFileEvent {
  type: 'contract-removed'
}

export type ActivityFileEvent =
  | DataChangeEvent
  | RoleUpdateEvent
  | ContractAddedEvent
  | ContractRemovedEvent

// ============================================================================
// Classifier
// ============================================================================

/**
 * Fields from the discovery diff that are already modelled elsewhere in the
 * pipeline (via `$pastUpgrades` on the proxy contract) and should not be
 * duplicated into activity events.
 *
 * `$admin` is NOT in this list — it becomes a `role-update` with
 * `roleName: 'ProxyAdmin'`.
 */
const SKIP_FIELDS = new Set([
  '$implementation',
  '$pastUpgrades',
  '$upgradeCount',
])

/**
 * Classifies a single `UpdateNotifier` row into zero or more activity events.
 *
 * Each DB row contains an array of `DiscoveryDiff` (one per affected contract);
 * each contract carries either `type: 'created' | 'deleted'` OR a `diff` array
 * of `FieldDiff` entries.
 *
 * Notes:
 * - `diff.address` is a plain string after DB round-trip (no ChainSpecificAddress).
 * - `FieldDiff.before`/`after` are already JSON-stringified. We try `JSON.parse`
 *   and fall back to the raw string.
 * - Contract name / isDependency / entity are resolved against the **current**
 *   discovered.json + contract-tags snapshot — we don't replay historic state.
 */
export function classifyDiff(
  notifier: ActivityNotifierRow,
  discovery: DiscoveryOutput,
  contractTags: ContractTag[],
): ActivityFileEvent[] {
  const events: ActivityFileEvent[] = []
  const timestamp = toIsoTimestamp(notifier.timestamp)

  const nameByAddress = buildNameMap(discovery)
  const tagByAddress = buildTagMap(contractTags)

  for (const contractDiff of notifier.diff ?? []) {
    const address = String(contractDiff.address)
    const addrNorm = safeNormalize(address)
    const contractName =
      contractDiff.name ?? nameByAddress.get(addrNorm) ?? undefined
    const tag = tagByAddress.get(addrNorm)
    const base = {
      timestamp,
      updateNotifierId: notifier.id,
      address,
      contractName,
      isDependency: tag?.isExternal ?? undefined,
      entity: tag?.entity ?? null,
    }

    if (contractDiff.type === 'created') {
      events.push({
        ...base,
        id: makeId(notifier.id, address, '$created'),
        type: 'contract-added',
      })
      continue
    }

    if (contractDiff.type === 'deleted') {
      events.push({
        ...base,
        id: makeId(notifier.id, address, '$deleted'),
        type: 'contract-removed',
      })
      continue
    }

    for (const field of contractDiff.diff ?? []) {
      const key = field.key
      if (SKIP_FIELDS.has(key)) continue

      const before = parseDiffValue(field.before)
      const after = parseDiffValue(field.after)
      const id = makeId(notifier.id, address, key)

      const role = classifyAsRole(key)
      if (role !== undefined) {
        events.push({
          ...base,
          id,
          type: 'role-update',
          roleName: role,
          field: key,
          before,
          after,
        })
        continue
      }

      events.push({
        ...base,
        id,
        type: 'data-change',
        field: key,
        before,
        after,
      })
    }
  }

  return events
}

// ============================================================================
// Heuristics
// ============================================================================

/**
 * Returns a role name if `key` looks like a permission/role field.
 * Otherwise returns `undefined`, meaning the diff is a plain data change.
 */
function classifyAsRole(key: string): string | undefined {
  if (key === '$admin') return 'ProxyAdmin'
  if (key === 'owner' || key === 'values.owner') return 'owner'
  if (key === 'pendingOwner' || key === 'values.pendingOwner') {
    return 'pendingOwner'
  }
  if (key === '$members' || key === 'values.$members') return 'Safe.owners'
  if (key === '$threshold' || key === 'values.$threshold') {
    return 'Safe.threshold'
  }

  // accessControl.<ROLE>.members / .adminRole
  const ac = key.match(/^accessControl\.([^.]+)\.(members|adminRole)$/)
  if (ac) return ac[1]

  // values.accessControl.<ROLE>.(members|adminRole)
  const vac = key.match(/^values\.accessControl\.([^.]+)\.(members|adminRole)$/)
  if (vac) return vac[1]

  return undefined
}

function parseDiffValue(raw: string | undefined): unknown {
  if (raw === undefined) return undefined
  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

function makeId(
  updateNotifierId: number,
  address: string,
  key: string,
): string {
  return `${updateNotifierId}:${address}:${key}`
}

function safeNormalize(address: string): string {
  try {
    return normalizeChainAddress(address)
  } catch {
    return address.toLowerCase()
  }
}

function toIsoTimestamp(ts: number): string {
  return new Date(ts * 1000).toISOString()
}

function buildNameMap(discovery: DiscoveryOutput): Map<string, string> {
  const map = new Map<string, string>()
  for (const entry of discovery.entries) {
    const addrNorm = safeNormalize(String(entry.address))
    if (entry.name) map.set(addrNorm, entry.name)
  }
  return map
}

function buildTagMap(tags: ContractTag[]): Map<string, ContractTag> {
  const map = new Map<string, ContractTag>()
  for (const tag of tags) {
    const addrNorm = safeNormalize(tag.contractAddress)
    map.set(addrNorm, tag)
  }
  return map
}
