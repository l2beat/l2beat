import {
  type ConfigReader,
  type ConfigWriter,
  type DiscoveryDiff,
  type DiscoveryPaths,
} from '@l2beat/discovery'
import { createDatabase, type Database } from '@l2beat/database'
import { applyEdits, modify, parse as parseJsonc } from 'jsonc-parser'
import { readActivityFile, writeActivityFile } from './activity'
import { ReviewCompiler, type CompileResult } from './reviewCompiler'

// ============================================================================
// Types
// ============================================================================

export interface MonitorRowSummary {
  id: number
  projectId: string
  /** ISO 8601 */
  timestamp: string
  contractCount: number
  fieldCount: number
  topContracts: { name: string; address: string; fieldCount: number }[]
}

export interface MonitorRowDetail {
  id: number
  projectId: string
  timestamp: string
  contracts: {
    name?: string
    address: string
    type?: 'created' | 'deleted'
    fields: {
      key: string
      before?: string
      after?: string
    }[]
  }[]
}

export interface StripFieldRequest {
  address: string
  key: string
}

export interface MutationResult {
  rowDeleted: boolean
  rowUpdated: boolean
  /**
   * Number of *individual field changes* dropped from activity.json.
   * `contract-added` / `contract-removed` events count as 1 each.
   */
  activityDropped: number
  configContractsUpdated: number
  ignoreFieldsAdded: number
  recompile: CompileResult | { status: 'error'; error: string } | null
}

// ============================================================================
// DB client
// ============================================================================

export interface MonitorAdminConfig {
  connectionString: string
  ssl?: boolean
}

export function createMonitorAdminClient(config: MonitorAdminConfig): Database {
  return createDatabase({
    connectionString: config.connectionString,
    application_name: 'defidisco-monitor-admin',
    ...(config.ssl ? { ssl: { rejectUnauthorized: false } } : {}),
  })
}

// ============================================================================
// Read API
// ============================================================================

export async function listMonitorRows(
  db: Database,
): Promise<MonitorRowSummary[]> {
  const rows = await db.updateNotifier.getAll()
  return rows
    .map((row) => {
      const contracts = row.diff ?? []
      const fieldCount = contracts.reduce(
        (sum, c) => sum + (c.diff?.length ?? 0),
        0,
      )
      const topContracts = contracts
        .map((c) => ({
          name: c.name ?? String(c.address),
          address: String(c.address),
          fieldCount: c.diff?.length ?? 0,
        }))
        .sort((a, b) => b.fieldCount - a.fieldCount)
        .slice(0, 3)
      return {
        id: row.id,
        projectId: row.projectId,
        timestamp: new Date(Number(row.timestamp) * 1000).toISOString(),
        contractCount: contracts.length,
        fieldCount,
        topContracts,
      }
    })
    .sort((a, b) => {
      // Group by project, then most recent first within project
      if (a.projectId !== b.projectId) {
        return a.projectId.localeCompare(b.projectId)
      }
      return b.id - a.id
    })
}

export async function getMonitorRow(
  db: Database,
  id: number,
): Promise<MonitorRowDetail | null> {
  const row = await db.updateNotifier.getById(id)
  if (!row) return null

  return {
    id: row.id,
    projectId: row.projectId,
    timestamp: new Date(Number(row.timestamp) * 1000).toISOString(),
    contracts: (row.diff ?? []).map((c) => ({
      name: c.name,
      address: String(c.address),
      type: c.type,
      fields: (c.diff ?? []).map((f) => ({
        key: f.key,
        before: f.before,
        after: f.after,
      })),
    })),
  }
}

// ============================================================================
// Mutations
// ============================================================================

export interface DeleteRowOptions {
  addToIgnoreWatchMode: boolean
}

export async function deleteMonitorRow(
  paths: DiscoveryPaths,
  configReader: ConfigReader,
  configWriter: ConfigWriter,
  db: Database,
  id: number,
  opts: DeleteRowOptions,
): Promise<MutationResult> {
  const row = await db.updateNotifier.getById(id)
  if (!row) {
    throw new Error(`UpdateNotifier row ${id} not found`)
  }

  // Collect every (address, key) pair so we can:
  //   1. Drop matching events from activity.json
  //   2. Optionally promote field names into ignoreInWatchMode
  const allFields: StripFieldRequest[] = []
  for (const c of row.diff ?? []) {
    for (const f of c.diff ?? []) {
      allFields.push({ address: String(c.address), key: f.key })
    }
  }

  // 1. Delete the DB row
  await db.updateNotifier.deleteById(id)

  // 2. Cascade into activity.json: drop every event where updateNotifierId === id
  const activityDropped = removeActivityEventsForRow(paths, row.projectId, id)

  // 3. Optionally promote stripped fields into ignoreInWatchMode
  let ignoreUpdate = { contractsUpdated: 0, fieldsAdded: 0 }
  if (opts.addToIgnoreWatchMode && allFields.length > 0) {
    ignoreUpdate = addFieldsToIgnoreWatchMode(
      configReader,
      configWriter,
      row.projectId,
      allFields,
    )
  }

  // 4. Recompile review
  const recompile = safeCompile(paths, row.projectId)

  return {
    rowDeleted: true,
    rowUpdated: false,
    activityDropped,
    configContractsUpdated: ignoreUpdate.contractsUpdated,
    ignoreFieldsAdded: ignoreUpdate.fieldsAdded,
    recompile,
  }
}

export interface StripFieldsOptions {
  addToIgnoreWatchMode: boolean
}

export async function stripMonitorFields(
  paths: DiscoveryPaths,
  configReader: ConfigReader,
  configWriter: ConfigWriter,
  db: Database,
  id: number,
  fields: StripFieldRequest[],
  opts: StripFieldsOptions,
): Promise<MutationResult> {
  if (fields.length === 0) {
    throw new Error('No fields specified to strip')
  }

  const row = await db.updateNotifier.getById(id)
  if (!row) {
    throw new Error(`UpdateNotifier row ${id} not found`)
  }

  // Build a Set of "address|key" tuples for O(1) filtering
  const dropSet = new Set<string>()
  for (const f of fields) {
    dropSet.add(`${normalizeAddress(f.address)}|${f.key}`)
  }

  // Filter the diff blob
  const newDiff: DiscoveryDiff[] = []
  for (const contract of row.diff ?? []) {
    if (contract.type === 'created' || contract.type === 'deleted') {
      // Don't touch created/deleted markers — they have no field-level diffs
      newDiff.push(contract)
      continue
    }
    const addr = normalizeAddress(String(contract.address))
    const keptFields = (contract.diff ?? []).filter(
      (f) => !dropSet.has(`${addr}|${f.key}`),
    )
    if (keptFields.length > 0) {
      newDiff.push({ ...contract, diff: keptFields })
    }
  }

  let rowDeleted = false
  let rowUpdated = false
  if (newDiff.length === 0) {
    // Row is empty after stripping → delete it entirely
    await db.updateNotifier.deleteById(id)
    rowDeleted = true
  } else {
    await db.updateNotifier.updateDiff(id, newDiff)
    rowUpdated = true
  }

  // Cascade into activity.json: drop only the matching event ids
  const activityDropped = removeActivityEventsForFields(
    paths,
    row.projectId,
    id,
    fields,
  )

  // Optionally promote stripped fields into ignoreInWatchMode
  let ignoreUpdate = { contractsUpdated: 0, fieldsAdded: 0 }
  if (opts.addToIgnoreWatchMode) {
    ignoreUpdate = addFieldsToIgnoreWatchMode(
      configReader,
      configWriter,
      row.projectId,
      fields,
    )
  }

  // Recompile review
  const recompile = safeCompile(paths, row.projectId)

  return {
    rowDeleted,
    rowUpdated,
    activityDropped,
    configContractsUpdated: ignoreUpdate.contractsUpdated,
    ignoreFieldsAdded: ignoreUpdate.fieldsAdded,
    recompile,
  }
}

// ============================================================================
// Activity cascade
// ============================================================================

/**
 * Drops every activity event tied to the given UpdateNotifier row.
 *
 * Returns the count of *individual field changes* removed across all dropped
 * events — keeps the unit consistent with `removeActivityEventsForFields` so
 * the UI toast can speak in field-changes uniformly. `contract-added` and
 * `contract-removed` events count as 1 each (no field-level data anyway).
 */
function removeActivityEventsForRow(
  paths: DiscoveryPaths,
  project: string,
  updateNotifierId: number,
): number {
  const file = readActivityFile(paths, project)
  let droppedFieldCount = 0
  const next: typeof file.events = []
  for (const e of file.events) {
    if (e.updateNotifierId !== updateNotifierId) {
      next.push(e)
      continue
    }
    if (e.type === 'data-change' || e.type === 'role-update') {
      droppedFieldCount += e.changes.length
    } else {
      droppedFieldCount += 1
    }
  }
  if (next.length !== file.events.length) {
    file.events = next
    writeActivityFile(paths, project, file)
  }
  return droppedFieldCount
}

/**
 * Strips the requested (address, key) field changes from grouped activity
 * events for a given UpdateNotifier row.
 *
 * Activity events are now grouped per (contract, type[, role]) per row, with
 * a `changes[]` array of FieldChange. To strip individual fields we walk the
 * changes array of any matching event and remove those entries; if an event's
 * changes array becomes empty we drop the event entirely.
 *
 * Returns the count of *individual field changes* dropped (not events).
 */
function removeActivityEventsForFields(
  paths: DiscoveryPaths,
  project: string,
  updateNotifierId: number,
  fields: StripFieldRequest[],
): number {
  const file = readActivityFile(paths, project)

  // Group requested field keys by normalized address for O(1) lookup
  const dropByAddress = new Map<string, Set<string>>()
  for (const f of fields) {
    const norm = normalizeAddress(f.address)
    let set = dropByAddress.get(norm)
    if (!set) {
      set = new Set<string>()
      dropByAddress.set(norm, set)
    }
    set.add(f.key)
  }

  let droppedFieldCount = 0
  const eventsBefore = file.events.length
  const next: typeof file.events = []
  for (const event of file.events) {
    if (event.updateNotifierId !== updateNotifierId) {
      next.push(event)
      continue
    }
    if (event.type !== 'data-change' && event.type !== 'role-update') {
      // contract-added / contract-removed don't carry field changes
      next.push(event)
      continue
    }
    const norm = normalizeAddress(event.address)
    const drop = dropByAddress.get(norm)
    if (!drop) {
      next.push(event)
      continue
    }
    const keptChanges = event.changes.filter((c) => {
      if (drop.has(c.field)) {
        droppedFieldCount++
        return false
      }
      return true
    })
    if (keptChanges.length === 0) {
      // All field changes in this event were stripped — drop the event
      continue
    }
    next.push({ ...event, changes: keptChanges })
  }

  if (droppedFieldCount > 0 || next.length !== eventsBefore) {
    file.events = next
    writeActivityFile(paths, project, file)
  }
  return droppedFieldCount
}

// ============================================================================
// ignoreInWatchMode promotion
// ============================================================================

/**
 * Adds the bare field names (extracted from diff keys like `values.totalSupply`
 * → `totalSupply`) to `overrides[address].ignoreInWatchMode` in config.jsonc,
 * preserving comments via jsonc-parser.
 *
 * Skips field keys that don't translate cleanly to a bare field name (e.g.
 * `$implementation`, `accessControl.X.members`) — these aren't meaningful as
 * `ignoreInWatchMode` entries.
 */
export function addFieldsToIgnoreWatchMode(
  configReader: ConfigReader,
  configWriter: ConfigWriter,
  project: string,
  fields: StripFieldRequest[],
): { contractsUpdated: number; fieldsAdded: number } {
  // Group bare field names by address
  const byAddress = new Map<string, Set<string>>()
  for (const f of fields) {
    const bare = bareFieldName(f.key)
    if (!bare) continue
    const set = byAddress.get(f.address) ?? new Set<string>()
    set.add(bare)
    byAddress.set(f.address, set)
  }

  if (byAddress.size === 0) {
    return { contractsUpdated: 0, fieldsAdded: 0 }
  }

  let text: string
  try {
    text = configReader.readRawConfigAsText(project)
  } catch {
    return { contractsUpdated: 0, fieldsAdded: 0 }
  }

  let totalAdded = 0
  let contractsUpdated = 0

  for (const [address, newFields] of byAddress) {
    const parsed = parseJsonc(text) as
      | { overrides?: Record<string, { ignoreInWatchMode?: string[] }> }
      | undefined
    const existing = parsed?.overrides?.[address]?.ignoreInWatchMode ?? []

    // Merge + dedupe + sort
    const merged = new Set<string>(existing)
    let addedHere = 0
    for (const f of newFields) {
      if (!merged.has(f)) {
        merged.add(f)
        addedHere++
      }
    }
    if (addedHere === 0) continue

    const sorted = [...merged].sort()
    const edits = modify(
      text,
      ['overrides', address, 'ignoreInWatchMode'],
      sorted,
      { formattingOptions: { tabSize: 2, insertSpaces: true } },
    )
    if (edits.length > 0) {
      text = applyEdits(text, edits)
      totalAdded += addedHere
      contractsUpdated++
    }
  }

  if (contractsUpdated > 0) {
    configWriter.updateRawConfigFile(project, text)
  }

  return { contractsUpdated, fieldsAdded: totalAdded }
}

/**
 * Maps a diff field key to the bare field name expected by `ignoreInWatchMode`.
 * - `values.totalSupply` → `totalSupply`
 * - `values.balances.0`  → `balances`
 * - `accessControl.X.members` → null (not a plain values field)
 * - `$implementation`    → null (proxy field, never put in ignoreInWatchMode)
 */
function bareFieldName(key: string): string | null {
  if (!key.startsWith('values.')) return null
  const rest = key.slice('values.'.length)
  if (rest.length === 0) return null
  // Skip non-values structural fields under values.* that aren't meant for
  // ignoreInWatchMode — e.g. accessControl.* members, $admin escapes
  if (rest.startsWith('accessControl.')) return null
  if (rest.startsWith('$')) return null
  // Take only the first segment
  const first = rest.split('.')[0]
  if (!first) return null
  return first
}

function normalizeAddress(addr: string): string {
  // The strip request comes from the frontend, which echoes whatever the
  // detail endpoint sent. The detail endpoint stringifies `c.address` from
  // the DB row (already chain-prefixed). We don't ERC-55 here because diffs
  // are matched against the raw DB string — case-insensitive compare keeps
  // it simple.
  return addr.toLowerCase()
}

// ============================================================================
// Recompile
// ============================================================================

function safeCompile(
  paths: DiscoveryPaths,
  project: string,
): CompileResult | { status: 'error'; error: string } {
  try {
    const compiler = new ReviewCompiler(paths)
    return compiler.compile(project)
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
