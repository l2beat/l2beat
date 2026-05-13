import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs'
import { dirname, resolve } from 'node:path'

export interface PrivacyHistoryDayRow {
  projectId: string
  assetKey: string
  bucketId: string
  timestamp: number
  depositCount: number
  withdrawalCount: number
  depositAmount: string
  withdrawalAmount: string
}

export interface PrivacyHistoryCursor {
  key: string
  lastSyncedBlock: number
  syncedAt: number
}

interface PrivacyHistoryFile {
  version: 1
  cursors: PrivacyHistoryCursor[]
  rows: PrivacyHistoryDayRow[]
}

const DEFAULT_STORAGE_PATH = resolve(process.cwd(), 'data/privacy-history.json')

export function applyPrivacyHistoryDelta(
  rows: PrivacyHistoryDayRow[],
  cursors: PrivacyHistoryCursor[],
): void {
  if (rows.length === 0 && cursors.length === 0) return

  const snapshot = readHistoryFile()
  const mergedRows = new Map(
    snapshot.rows.map((row) => [
      rowKey(row.projectId, row.assetKey, row.bucketId, row.timestamp),
      row,
    ]),
  )
  const mergedCursors = new Map(
    snapshot.cursors.map((cursor) => [cursor.key, cursor]),
  )

  for (const row of rows) {
    const key = rowKey(row.projectId, row.assetKey, row.bucketId, row.timestamp)
    const existing = mergedRows.get(key)

    if (!existing) {
      mergedRows.set(key, row)
      continue
    }

    mergedRows.set(key, {
      ...existing,
      depositCount: existing.depositCount + row.depositCount,
      withdrawalCount: existing.withdrawalCount + row.withdrawalCount,
      depositAmount: addAmount(existing.depositAmount, row.depositAmount),
      withdrawalAmount: addAmount(
        existing.withdrawalAmount,
        row.withdrawalAmount,
      ),
    })
  }

  for (const cursor of cursors) {
    mergedCursors.set(cursor.key, cursor)
  }

  writeHistoryFile({
    version: 1,
    cursors: [...mergedCursors.values()].sort((a, b) =>
      a.key.localeCompare(b.key),
    ),
    rows: [...mergedRows.values()].sort(compareRows),
  })
}

export function getAllPrivacyHistoryRows(): PrivacyHistoryDayRow[] {
  return readHistoryFile().rows
}

export function getAllPrivacyHistoryCursors(): PrivacyHistoryCursor[] {
  return readHistoryFile().cursors
}

function readHistoryFile(): PrivacyHistoryFile {
  const path = getStoragePath()
  if (!existsSync(path)) {
    return { version: 1, cursors: [], rows: [] }
  }

  const parsed = JSON.parse(
    readFileSync(path, 'utf8'),
  ) as Partial<PrivacyHistoryFile>

  if (
    parsed.version !== 1 ||
    !Array.isArray(parsed.rows) ||
    !Array.isArray(parsed.cursors)
  ) {
    throw new Error(`Invalid privacy history file at ${path}`)
  }

  return {
    version: 1,
    cursors: parsed.cursors.map((cursor) => ({
      key: String((cursor as Partial<PrivacyHistoryCursor>).key ?? ''),
      lastSyncedBlock: Number(
        (cursor as Partial<PrivacyHistoryCursor>).lastSyncedBlock ?? 0,
      ),
      syncedAt: Number((cursor as Partial<PrivacyHistoryCursor>).syncedAt ?? 0),
    })),
    rows: parsed.rows,
  }
}

function writeHistoryFile(snapshot: PrivacyHistoryFile): void {
  const path = getStoragePath()
  mkdirSync(dirname(path), { recursive: true })

  const tempPath = `${path}.tmp`
  writeFileSync(tempPath, `${JSON.stringify(snapshot, null, 2)}\n`)
  renameSync(tempPath, path)
}

function getStoragePath(): string {
  return process.env.PRIVACY_HISTORY_STORAGE_PATH ?? DEFAULT_STORAGE_PATH
}

function rowKey(
  projectId: string,
  assetKey: string,
  bucketId: string,
  timestamp: number,
): string {
  return `${projectId}::${assetKey}::${bucketId}::${timestamp}`
}

function compareRows(a: PrivacyHistoryDayRow, b: PrivacyHistoryDayRow): number {
  return rowKey(a.projectId, a.assetKey, a.bucketId, a.timestamp).localeCompare(
    rowKey(b.projectId, b.assetKey, b.bucketId, b.timestamp),
  )
}

function addAmount(a: string, b: string): string {
  return (BigInt(a) + BigInt(b)).toString()
}
