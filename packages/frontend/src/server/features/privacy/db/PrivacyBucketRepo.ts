import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs'
import { dirname, resolve } from 'node:path'

export interface PrivacyBucketRow {
  projectId: string
  assetKey: string
  bucketId: string
  timestamp: number
  totalValueAmount: string | null
  priceUsd: number | null
  totalValueUsd: number | null
  depositsTotal: number
  deposits7d: number
  deposits30d: number
}

interface PrivacyBucketSnapshotFile {
  version: 1
  rows: PrivacyBucketRow[]
}

const DEFAULT_STORAGE_PATH = resolve(process.cwd(), 'data/privacy.json')

export function upsertManyPrivacyBucketRows(rows: PrivacyBucketRow[]): void {
  if (rows.length === 0) return

  const snapshot = readSnapshotFile()
  const merged = new Map(
    snapshot.rows.map((row) => [
      rowKey(row.projectId, row.assetKey, row.bucketId),
      row,
    ]),
  )

  for (const row of rows) {
    merged.set(rowKey(row.projectId, row.assetKey, row.bucketId), row)
  }

  writeSnapshotFile({
    version: 1,
    rows: [...merged.values()].sort(compareRows),
  })
}

export function getAllPrivacyBucketRows(): PrivacyBucketRow[] {
  return readSnapshotFile().rows
}

function readSnapshotFile(): PrivacyBucketSnapshotFile {
  const path = getStoragePath()
  if (!existsSync(path)) {
    return { version: 1, rows: [] }
  }

  const parsed = JSON.parse(
    readFileSync(path, 'utf8'),
  ) as Partial<PrivacyBucketSnapshotFile>

  if (parsed.version !== 1 || !Array.isArray(parsed.rows)) {
    throw new Error(`Invalid privacy snapshot file at ${path}`)
  }

  return {
    version: 1,
    rows: parsed.rows,
  }
}

function writeSnapshotFile(snapshot: PrivacyBucketSnapshotFile): void {
  const path = getStoragePath()
  mkdirSync(dirname(path), { recursive: true })

  const tempPath = `${path}.tmp`
  writeFileSync(tempPath, `${JSON.stringify(snapshot, null, 2)}\n`)
  renameSync(tempPath, path)
}

function getStoragePath(): string {
  return process.env.PRIVACY_STORAGE_PATH ?? DEFAULT_STORAGE_PATH
}

function rowKey(projectId: string, assetKey: string, bucketId: string): string {
  return `${projectId}::${assetKey}::${bucketId}`
}

function compareRows(a: PrivacyBucketRow, b: PrivacyBucketRow): number {
  return rowKey(a.projectId, a.assetKey, a.bucketId).localeCompare(
    rowKey(b.projectId, b.assetKey, b.bucketId),
  )
}
