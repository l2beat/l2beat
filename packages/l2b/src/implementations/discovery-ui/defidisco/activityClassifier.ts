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
  /**
   * Deterministic id used as the dedupe key. Format depends on event type:
   * - data-change:      `${updateNotifierId}:${address}:data-change`
   * - role-update:      `${updateNotifierId}:${address}:role:${roleName}`
   * - contract-added:   `${updateNotifierId}:${address}:contract-added`
   * - contract-removed: `${updateNotifierId}:${address}:contract-removed`
   *
   * NOTE: the per-field key is intentionally NOT in the id — events group all
   * field changes for one (contract, type[, role]) bucket per UpdateNotifier
   * row, so the id is one-per-bucket, not one-per-field.
   */
  id: string
  /** ISO 8601 timestamp for compatibility with the existing UpgradeEvent shape. */
  timestamp: string
  updateNotifierId: number
  address: string
  contractName?: string
  isDependency?: boolean
  entity?: string | null
}

/** A single field diff inside a grouped activity event. */
export interface FieldChange {
  /** Original diff key, e.g. "values.totalSupply" or "accessControl.ADMIN.members". */
  field: string
  before: unknown
  after: unknown
}

export interface DataChangeEvent extends BaseActivityFileEvent {
  type: 'data-change'
  /** All non-role fields that changed on this contract during one monitor cycle. Length >= 1. */
  changes: FieldChange[]
}

export interface RoleUpdateEvent extends BaseActivityFileEvent {
  type: 'role-update'
  /** Single role per event — multi-role updates produce multiple events. */
  roleName: string
  /** All sub-fields of this role that changed (e.g. members, adminRole). Length >= 1. */
  changes: FieldChange[]
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
        id: makeContractEventId(notifier.id, address, 'contract-added'),
        type: 'contract-added',
      })
      continue
    }

    if (contractDiff.type === 'deleted') {
      events.push({
        ...base,
        id: makeContractEventId(notifier.id, address, 'contract-removed'),
        type: 'contract-removed',
      })
      continue
    }

    // Bucket field changes by (data | role:<roleName>) so each bucket becomes
    // one grouped event. Insertion order is preserved by the diff walk.
    const dataChanges: FieldChange[] = []
    const roleBuckets = new Map<string, FieldChange[]>()

    for (const field of contractDiff.diff ?? []) {
      const key = field.key
      if (SKIP_FIELDS.has(key)) continue

      const change: FieldChange = {
        field: key,
        before: parseDiffValue(field.before),
        after: parseDiffValue(field.after),
      }

      const role = classifyAsRole(key)
      if (role !== undefined) {
        let bucket = roleBuckets.get(role)
        if (!bucket) {
          bucket = []
          roleBuckets.set(role, bucket)
        }
        bucket.push(change)
        continue
      }

      dataChanges.push(change)
    }

    if (dataChanges.length > 0) {
      events.push({
        ...base,
        id: makeDataChangeId(notifier.id, address),
        type: 'data-change',
        changes: dataChanges,
      })
    }

    for (const [roleName, changes] of roleBuckets) {
      events.push({
        ...base,
        id: makeRoleUpdateId(notifier.id, address, roleName),
        type: 'role-update',
        roleName,
        changes,
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
  // Safe owners: diffs land as either the whole array (`$members` /
  // `values.$members`) when the list length changes, or as per-slot indexed
  // keys (`values.$members.3`) when an individual seat is swapped. Both are
  // role updates, not data changes.
  if (
    key === '$members' ||
    key === 'values.$members' ||
    /^\$members\.\d+$/.test(key) ||
    /^values\.\$members\.\d+$/.test(key)
  ) {
    return 'Safe.owners'
  }
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

function makeDataChangeId(updateNotifierId: number, address: string): string {
  return `${updateNotifierId}:${address}:data-change`
}

function makeRoleUpdateId(
  updateNotifierId: number,
  address: string,
  roleName: string,
): string {
  return `${updateNotifierId}:${address}:role:${roleName}`
}

function makeContractEventId(
  updateNotifierId: number,
  address: string,
  kind: 'contract-added' | 'contract-removed',
): string {
  return `${updateNotifierId}:${address}:${kind}`
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
